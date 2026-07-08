-- 관리자 권한 (admin_users — 본인 여부만 조회 가능)

create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "본인 관리자 여부만 조회"
  on public.admin_users for select
  using (user_id = auth.uid());

-- 초기 관리자: newwavewind@gmail.com
insert into public.admin_users (user_id)
select id from auth.users where email = 'newwavewind@gmail.com'
on conflict (user_id) do nothing;
