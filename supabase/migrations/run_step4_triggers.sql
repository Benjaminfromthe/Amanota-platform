-- STEP 4: Triggers + Indexes

-- Auto-create profile + wallet when a new user signs up
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
  insert into public.wallets (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
create trigger wallets_updated_at before update on public.wallets
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_lessons_faculty  on public.lessons(faculty);
create index if not exists idx_lessons_campus   on public.lessons(campus);
create index if not exists idx_lessons_creator  on public.lessons(creator_id);
create index if not exists idx_bookings_student on public.bookings(student_id);
create index if not exists idx_bookings_tutor   on public.bookings(tutor_id);
create index if not exists idx_bookings_lesson  on public.bookings(lesson_id);
create index if not exists idx_wt_tutor         on public.wallet_transactions(tutor_id);
create index if not exists idx_wt_student       on public.wallet_transactions(student_id);
