-- 방문자 접속 주소(IP·호스트) — 비로그인·로컬 구분용

alter table public.site_visits
  add column if not exists client_host text,
  add column if not exists client_ip text;

create index if not exists site_visits_client_host_idx
  on public.site_visits (client_host)
  where client_host is not null;
