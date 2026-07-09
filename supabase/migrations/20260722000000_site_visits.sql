-- 사이트 방문 기록 (로그인·비로그인 모두)

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  user_id uuid references public.profiles(id) on delete set null,
  path text not null,
  referrer text,
  is_local boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists site_visits_created_at_idx
  on public.site_visits (created_at desc);

create index if not exists site_visits_visitor_id_idx
  on public.site_visits (visitor_id, created_at desc);

create index if not exists site_visits_user_id_idx
  on public.site_visits (user_id, created_at desc)
  where user_id is not null;

alter table public.site_visits enable row level security;

-- 클라이언트 직접 접근 없음 — API(service role)로만 기록·조회
