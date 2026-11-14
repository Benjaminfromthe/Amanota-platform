-- STEP 3: Row Level Security

alter table public.profiles           enable row level security;
alter table public.lessons            enable row level security;
alter table public.bookings           enable row level security;
alter table public.wallets            enable row level security;
alter table public.wallet_transactions enable row level security;

-- profiles policies
create policy "Own profile select"   on public.profiles for select using (auth.uid() = id);
create policy "Own profile insert"   on public.profiles for insert with check (auth.uid() = id);
create policy "Own profile update"   on public.profiles for update using (auth.uid() = id);
create policy "Auth users see all"   on public.profiles for select using (auth.role() = 'authenticated');

-- lessons policies
create policy "Public lessons select"   on public.lessons for select using (is_published = true);
create policy "Creator insert lesson"   on public.lessons for insert with check (auth.uid() = creator_id);
create policy "Creator update lesson"   on public.lessons for update using (auth.uid() = creator_id);

-- bookings policies
create policy "Student view bookings"  on public.bookings for select using (auth.uid() = student_id);
create policy "Tutor view bookings"    on public.bookings for select using (auth.uid() = tutor_id);
create policy "Student insert booking" on public.bookings for insert with check (auth.uid() = student_id);
create policy "Student update booking" on public.bookings for update using (auth.uid() = student_id);

-- wallets policies
create policy "Own wallet select" on public.wallets for select using (auth.uid() = user_id);
create policy "Own wallet update" on public.wallets for update using (auth.uid() = user_id);

-- wallet_transactions policies
create policy "Party view tx" on public.wallet_transactions for select
  using (auth.uid() = tutor_id or auth.uid() = student_id);
