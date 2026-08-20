-- 방문 품질 신호: 봇 판정, 기기, 세션, 실제 상호작용

alter table public.site_visits
  add column if not exists session_id text,
  add column if not exists user_agent text,
  add column if not exists browser_name text,
  add column if not exists device_type text,
  add column if not exists accept_language text,
  add column if not exists client_hints text,
  add column if not exists fetch_site text,
  add column if not exists country_code text,
  add column if not exists ip_hash text,
  add column if not exists bot_class text not null default 'unknown',
  add column if not exists bot_confidence smallint not null default 0,
  add column if not exists classification_reasons text[] not null default '{}',
  add column if not exists verified_bot_name text,
  add column if not exists verified_bot_category text,
  add column if not exists engaged boolean not null default false,
  add column if not exists engagement_ms integer not null default 0,
  add column if not exists interaction_count integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'site_visits_bot_class_check'
  ) then
    alter table public.site_visits
      add constraint site_visits_bot_class_check
      check (bot_class in ('likely_human', 'verified_bot', 'suspected_bot', 'unknown'));
  end if;
end $$;

create index if not exists site_visits_session_id_idx
  on public.site_visits (session_id, created_at desc)
  where session_id is not null;

create index if not exists site_visits_ip_hash_idx
  on public.site_visits (ip_hash, created_at desc)
  where ip_hash is not null;

create index if not exists site_visits_bot_class_created_at_idx
  on public.site_visits (bot_class, created_at desc);

comment on column public.site_visits.client_ip is
  'Legacy only. New visits use a daily rotating ip_hash instead of storing raw IP.';
