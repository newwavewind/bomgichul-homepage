-- 오늘의 10문제. 로그인 없이 기기 열쇠로도 한 줄이 생긴다.
-- 공개 읽기는 서버(service role)만 한다. 브라우저에 기기 열쇠를 내려주지 않는다.

create table if not exists public.daily_challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  exam_slug text not null,
  quiz_date date not null,
  mode text not null check (mode in ('ranked', 'practice')),
  identity_key text not null,
  user_id uuid references public.profiles(id) on delete set null,
  nickname text not null,
  correct int not null check (correct >= 0),
  total int not null check (total > 0),
  elapsed_ms int not null check (elapsed_ms >= 0),
  question_ids text[] not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists daily_challenge_ranked_once
  on public.daily_challenge_attempts (exam_slug, quiz_date, identity_key)
  where mode = 'ranked';

create index if not exists daily_challenge_today_idx
  on public.daily_challenge_attempts (exam_slug, quiz_date, mode, correct desc, elapsed_ms);

alter table public.daily_challenge_attempts enable row level security;
