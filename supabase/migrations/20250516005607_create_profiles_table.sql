create table if not exists public.profiles (
  id   uuid    primary key references auth.users(id),
  email text,
  phone text,
  created_at timestamp with time zone default now()
);

-- RLS policies
alter table public.profiles enable row level security;

create policy insert_own_profile on public.profiles
  for insert with check ( auth.uid() = id );

create policy select_own_profile on public.profiles
  for select using ( auth.uid() = id );