-- ============================================================
-- AMANOTA Platform — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- Or via: supabase db push (if using the CLI)
-- ============================================================

-- ─── Enable UUID extension ───────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── ENUM types ──────────────────────────────────────────────
create type campus_type as enum ('masoro', 'gishushu');
create type user_role   as enum ('student', 'tutor');
create type tier_type   as enum ('recorded', 'online', 'campus', 'custom_location');
create type booking_status as enum ('pending', 'upcoming', 'completed', 'cancelled');
create type faculty_type as enum (
  'Software Engineering',
  'Networking',
  'Information Management',
  'Business',
  'Theology',
  'Nursing',
  'Education'
);

-- ─── profiles ────────────────────────────────────────────────
-- One row per auth.users entry.
-- student_id = AUCA Student ID (e.g. "28318")
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text        not null default '',
  student_id    text        not null default '',
  faculty       faculty_type not null default 'Software Engineering',
  campus        campus_type  not null default 'masoro',
  role          user_role    not null default 'student',
  avatar_url    text,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Allow any authenticated user to view other profiles (for tutor discovery)
create policy "Authenticated users can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- ─── lessons ─────────────────────────────────────────────────
create table if not exists public.lessons (
  id            uuid        primary key default uuid_generate_v4(),
  title         text        not null,
  course_code   text        not null,
  faculty       faculty_type not null default 'Software Engineering',
  campus        text        not null default 'both', -- 'masoro' | 'gishushu' | 'both'
  description   text        not null default '',
  video_url     text        not null default '',
  thumbnail_url text,
  duration      text,
  rating        numeric(3,1) not null default 0.0,
  review_count  integer      not null default 0,
  tags          text[]       not null default '{}',
  price_recorded  integer   not null default 1000,
  price_online    integer   not null default 2000,
  price_campus    integer   not null default 3000,
  price_custom    integer   not null default 5000,
  creator_id    uuid        references public.profiles(id) on delete set null,
  is_published  boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.lessons enable row level security;

create policy "Anyone can view published lessons"
  on public.lessons for select
  using (is_published = true);

create policy "Creators can insert their own lessons"
  on public.lessons for insert
  with check (auth.uid() = creator_id);

create policy "Creators can update their own lessons"
  on public.lessons for update
  using (auth.uid() = creator_id);

-- ─── bookings ────────────────────────────────────────────────
create table if not exists public.bookings (
  id              uuid          primary key default uuid_generate_v4(),
  lesson_id       uuid          not null references public.lessons(id) on delete restrict,
  student_id      uuid          not null references public.profiles(id) on delete cascade,
  tutor_id        uuid          references public.profiles(id) on delete set null,
  tier_type       tier_type     not null,
  price_rwf       integer       not null,
  status          booking_status not null default 'upcoming',
  scheduled_at    timestamptz,
  scheduled_time  text,                        -- human-readable slot e.g. "14:00–14:45"
  location        text,                        -- campus room or custom address
  payment_method  text,                        -- 'mtn_momo' | 'airtel_money'
  phone_number    text,
  tutor_cut_rwf   integer       not null default 0,   -- 80%
  platform_cut_rwf integer      not null default 0,   -- 20%
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

alter table public.bookings enable row level security;

create policy "Students can view their own bookings"
  on public.bookings for select
  using (auth.uid() = student_id);

create policy "Tutors can view bookings for their lessons"
  on public.bookings for select
  using (auth.uid() = tutor_id);

create policy "Students can insert bookings"
  on public.bookings for insert
  with check (auth.uid() = student_id);

create policy "Students can update their own bookings"
  on public.bookings for update
  using (auth.uid() = student_id);

-- ─── wallets ─────────────────────────────────────────────────
create table if not exists public.wallets (
  id              uuid    primary key default uuid_generate_v4(),
  user_id         uuid    not null unique references public.profiles(id) on delete cascade,
  balance_rwf     integer not null default 0,    -- current withdrawable balance
  total_earned_rwf integer not null default 0,   -- lifetime earnings (tutors)
  total_spent_rwf  integer not null default 0,   -- lifetime spending (students)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.wallets enable row level security;

create policy "Users can view their own wallet"
  on public.wallets for select
  using (auth.uid() = user_id);

create policy "Users can update their own wallet"
  on public.wallets for update
  using (auth.uid() = user_id);

-- ─── wallet_transactions ─────────────────────────────────────
create table if not exists public.wallet_transactions (
  id              uuid    primary key default uuid_generate_v4(),
  booking_id      uuid    references public.bookings(id) on delete set null,
  lesson_id       uuid    references public.lessons(id) on delete set null,
  tutor_id        uuid    references public.profiles(id) on delete set null,
  student_id      uuid    references public.profiles(id) on delete set null,
  total_amount    integer not null,
  tutor_cut       integer not null,    -- 80%
  platform_cut    integer not null,    -- 20%
  created_at      timestamptz not null default now()
);

alter table public.wallet_transactions enable row level security;

create policy "Users can view transactions they are party to"
  on public.wallet_transactions for select
  using (auth.uid() = tutor_id or auth.uid() = student_id);

-- Admins can view all (use service role key for admin dashboard)

-- ─── Triggers ─────────────────────────────────────────────────

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, student_id, faculty, campus, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'student_id', ''),
    coalesce((new.raw_user_meta_data->>'faculty')::faculty_type, 'Software Engineering'),
    coalesce((new.raw_user_meta_data->>'campus')::campus_type, 'masoro'),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  -- Also create a wallet for the new user
  insert into public.wallets (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamps
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();

create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

create trigger wallets_updated_at before update on public.wallets
  for each row execute function public.set_updated_at();

-- ─── Indexes for common queries ───────────────────────────────
create index if not exists idx_lessons_faculty   on public.lessons(faculty);
create index if not exists idx_lessons_campus    on public.lessons(campus);
create index if not exists idx_lessons_creator   on public.lessons(creator_id);
create index if not exists idx_bookings_student  on public.bookings(student_id);
create index if not exists idx_bookings_tutor    on public.bookings(tutor_id);
create index if not exists idx_bookings_lesson   on public.bookings(lesson_id);
create index if not exists idx_wt_tutor          on public.wallet_transactions(tutor_id);
create index if not exists idx_wt_student        on public.wallet_transactions(student_id);
