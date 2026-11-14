-- STEP 2: Tables

-- profiles
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text         not null default '',
  student_id    text         not null default '',
  faculty       faculty_type not null default 'Software Engineering',
  campus        campus_type  not null default 'masoro',
  role          user_role    not null default 'student',
  avatar_url    text,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now()
);

-- lessons
create table if not exists public.lessons (
  id              uuid         primary key default uuid_generate_v4(),
  title           text         not null,
  course_code     text         not null,
  faculty         faculty_type not null default 'Software Engineering',
  campus          text         not null default 'both',
  description     text         not null default '',
  video_url       text         not null default '',
  thumbnail_url   text,
  duration        text,
  rating          numeric(3,1) not null default 0.0,
  review_count    integer      not null default 0,
  tags            text[]       not null default '{}',
  price_recorded  integer      not null default 1000,
  price_online    integer      not null default 2000,
  price_campus    integer      not null default 3000,
  price_custom    integer      not null default 5000,
  creator_id      uuid         references public.profiles(id) on delete set null,
  is_published    boolean      not null default true,
  created_at      timestamptz  not null default now(),
  updated_at      timestamptz  not null default now()
);

-- bookings
create table if not exists public.bookings (
  id               uuid           primary key default uuid_generate_v4(),
  lesson_id        uuid           not null references public.lessons(id) on delete restrict,
  student_id       uuid           not null references public.profiles(id) on delete cascade,
  tutor_id         uuid           references public.profiles(id) on delete set null,
  tier_type        tier_type      not null,
  price_rwf        integer        not null,
  status           booking_status not null default 'upcoming',
  scheduled_at     timestamptz,
  scheduled_time   text,
  location         text,
  payment_method   text,
  phone_number     text,
  tutor_cut_rwf    integer        not null default 0,
  platform_cut_rwf integer        not null default 0,
  created_at       timestamptz    not null default now(),
  updated_at       timestamptz    not null default now()
);

-- wallets
create table if not exists public.wallets (
  id               uuid        primary key default uuid_generate_v4(),
  user_id          uuid        not null unique references public.profiles(id) on delete cascade,
  balance_rwf      integer     not null default 0,
  total_earned_rwf integer     not null default 0,
  total_spent_rwf  integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- wallet_transactions
create table if not exists public.wallet_transactions (
  id           uuid        primary key default uuid_generate_v4(),
  booking_id   uuid        references public.bookings(id) on delete set null,
  lesson_id    uuid        references public.lessons(id) on delete set null,
  tutor_id     uuid        references public.profiles(id) on delete set null,
  student_id   uuid        references public.profiles(id) on delete set null,
  total_amount integer     not null,
  tutor_cut    integer     not null,
  platform_cut integer     not null,
  created_at   timestamptz not null default now()
);
