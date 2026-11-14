-- ============================================================
-- STEP 5: 80/20 Commission Engine
-- Run this in Supabase SQL Editor after steps 1–4
-- ============================================================

-- ─── platform_ledger table ───────────────────────────────────
-- Accumulates AMANOTA's 20% cut per booking, tagged by faculty
create table if not exists public.platform_ledger (
  id              uuid        primary key default uuid_generate_v4(),
  booking_id      uuid        references public.bookings(id) on delete set null,
  lesson_id       uuid        references public.lessons(id)  on delete set null,
  student_id      uuid        references public.profiles(id) on delete set null,
  tutor_id        uuid        references public.profiles(id) on delete set null,
  faculty         text        not null default 'Unknown',
  tier_type       text        not null,
  gross_amount    integer     not null,   -- total paid by student
  tutor_payout    integer     not null,   -- 80%
  platform_fee    integer     not null,   -- 20%
  created_at      timestamptz not null default now()
);

alter table public.platform_ledger enable row level security;

-- Only service-role can read (admin only via server-side)
-- Authenticated users cannot read this directly
create policy "No public read on platform_ledger"
  on public.platform_ledger for select
  using (false);

-- Index for fast aggregation queries
create index if not exists idx_pl_faculty    on public.platform_ledger(faculty);
create index if not exists idx_pl_created_at on public.platform_ledger(created_at);
create index if not exists idx_pl_tier       on public.platform_ledger(tier_type);

-- ─── 80/20 commission trigger function ───────────────────────
-- Fires AFTER a booking row is inserted.
-- 1. Calculates 80% tutor payout and 20% platform fee
-- 2. Inserts a wallet_transaction record
-- 3. Credits tutor's wallet (balance + total_earned)
-- 4. Debits student's wallet (total_spent)
-- 5. Writes to platform_ledger

create or replace function public.handle_booking_commission()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_tutor_cut     integer;
  v_platform_cut  integer;
  v_faculty       text;
  v_tutor_id      uuid;
begin
  -- Calculate split
  v_tutor_cut    := round(new.price_rwf * 0.8);
  v_platform_cut := new.price_rwf - v_tutor_cut;   -- avoids rounding drift

  -- Stamp the cuts back onto the booking row
  new.tutor_cut_rwf    := v_tutor_cut;
  new.platform_cut_rwf := v_platform_cut;

  -- Get faculty from lesson
  select l.faculty::text, l.creator_id
    into v_faculty, v_tutor_id
    from public.lessons l
   where l.id = new.lesson_id;

  v_faculty  := coalesce(v_faculty, 'Unknown');
  v_tutor_id := coalesce(new.tutor_id, v_tutor_id);

  -- 1. Insert wallet_transaction
  insert into public.wallet_transactions
    (booking_id, lesson_id, tutor_id, student_id, total_amount, tutor_cut, platform_cut)
  values
    (new.id, new.lesson_id, v_tutor_id, new.student_id,
     new.price_rwf, v_tutor_cut, v_platform_cut);

  -- 2. Credit tutor wallet (upsert-safe)
  insert into public.wallets (user_id, balance_rwf, total_earned_rwf)
  values (v_tutor_id, v_tutor_cut, v_tutor_cut)
  on conflict (user_id) do update
    set balance_rwf      = public.wallets.balance_rwf      + excluded.balance_rwf,
        total_earned_rwf = public.wallets.total_earned_rwf + excluded.total_earned_rwf,
        updated_at       = now();

  -- 3. Debit student wallet total_spent
  insert into public.wallets (user_id, total_spent_rwf)
  values (new.student_id, new.price_rwf)
  on conflict (user_id) do update
    set total_spent_rwf = public.wallets.total_spent_rwf + excluded.total_spent_rwf,
        updated_at      = now();

  -- 4. Write to platform_ledger
  insert into public.platform_ledger
    (booking_id, lesson_id, student_id, tutor_id,
     faculty, tier_type, gross_amount, tutor_payout, platform_fee)
  values
    (new.id, new.lesson_id, new.student_id, v_tutor_id,
     v_faculty, new.tier_type::text,
     new.price_rwf, v_tutor_cut, v_platform_cut);

  return new;
end;
$$;

-- Attach trigger to bookings (BEFORE INSERT so we stamp the cuts on the row)
drop trigger if exists on_booking_created on public.bookings;
create trigger on_booking_created
  before insert on public.bookings
  for each row execute function public.handle_booking_commission();

-- ─── RPC: process_purchase ───────────────────────────────────
-- Called from the Next.js API route.
-- Wraps booking insert in a single transaction so the trigger
-- and all wallet updates are atomic.

create or replace function public.process_purchase(
  p_lesson_id      uuid,
  p_student_id     uuid,
  p_tutor_id       uuid,
  p_tier_type      text,
  p_price_rwf      integer,
  p_scheduled_at   timestamptz default null,
  p_scheduled_time text        default null,
  p_location       text        default null,
  p_payment_method text        default null,
  p_phone_number   text        default null
)
returns json language plpgsql security definer set search_path = public
as $$
declare
  v_booking  public.bookings;
  v_tutor_cut    integer;
  v_platform_cut integer;
begin
  v_tutor_cut    := round(p_price_rwf * 0.8);
  v_platform_cut := p_price_rwf - v_tutor_cut;

  insert into public.bookings (
    lesson_id, student_id, tutor_id, tier_type,
    price_rwf, status,
    scheduled_at, scheduled_time, location,
    payment_method, phone_number,
    tutor_cut_rwf, platform_cut_rwf
  ) values (
    p_lesson_id, p_student_id, p_tutor_id, p_tier_type::tier_type,
    p_price_rwf, 'upcoming',
    p_scheduled_at, p_scheduled_time, p_location,
    p_payment_method, p_phone_number,
    v_tutor_cut, v_platform_cut
  )
  returning * into v_booking;

  return json_build_object(
    'booking_id',    v_booking.id,
    'tutor_cut',     v_tutor_cut,
    'platform_cut',  v_platform_cut,
    'status',        'ok'
  );
exception when others then
  return json_build_object('status', 'error', 'message', sqlerrm);
end;
$$;

-- ─── RPC: get_ledger_summary ─────────────────────────────────
-- Returns aggregated revenue stats for /admin/ledger

create or replace function public.get_ledger_summary()
returns json language plpgsql security definer set search_path = public
as $$
declare
  v_total_gross     integer;
  v_total_tutor     integer;
  v_total_platform  integer;
  v_by_faculty      json;
  v_by_tier         json;
  v_recent          json;
begin
  select
    coalesce(sum(gross_amount), 0),
    coalesce(sum(tutor_payout), 0),
    coalesce(sum(platform_fee), 0)
  into v_total_gross, v_total_tutor, v_total_platform
  from public.platform_ledger;

  select json_agg(row_to_json(f)) into v_by_faculty from (
    select
      faculty,
      count(*)::int            as transaction_count,
      sum(gross_amount)::int   as gross_rwf,
      sum(tutor_payout)::int   as tutor_rwf,
      sum(platform_fee)::int   as platform_rwf
    from public.platform_ledger
    group by faculty
    order by gross_rwf desc
  ) f;

  select json_agg(row_to_json(t)) into v_by_tier from (
    select
      tier_type,
      count(*)::int            as transaction_count,
      sum(gross_amount)::int   as gross_rwf,
      sum(tutor_payout)::int   as tutor_rwf,
      sum(platform_fee)::int   as platform_rwf
    from public.platform_ledger
    group by tier_type
    order by gross_rwf desc
  ) t;

  select json_agg(row_to_json(r)) into v_recent from (
    select
      pl.id,
      pl.faculty,
      pl.tier_type,
      pl.gross_amount,
      pl.tutor_payout,
      pl.platform_fee,
      pl.created_at,
      p_student.full_name as student_name,
      p_tutor.full_name   as tutor_name,
      l.title             as lesson_title,
      l.course_code
    from public.platform_ledger pl
    left join public.profiles p_student on p_student.id = pl.student_id
    left join public.profiles p_tutor   on p_tutor.id   = pl.tutor_id
    left join public.lessons  l         on l.id          = pl.lesson_id
    order by pl.created_at desc
    limit 50
  ) r;

  return json_build_object(
    'total_gross',    v_total_gross,
    'total_tutor',    v_total_tutor,
    'total_platform', v_total_platform,
    'net_margin_pct', case when v_total_gross > 0
                          then round((v_total_platform::numeric / v_total_gross) * 100, 1)
                          else 0 end,
    'by_faculty', coalesce(v_by_faculty, '[]'::json),
    'by_tier',    coalesce(v_by_tier,    '[]'::json),
    'recent',     coalesce(v_recent,     '[]'::json)
  );
end;
$$;
