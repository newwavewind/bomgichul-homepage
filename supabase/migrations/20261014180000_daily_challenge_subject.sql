-- 매일 10문제는 시험 안에서도 과목마다 다른 10문제와 다른 순위다.

alter table public.daily_challenge_attempts
  add column if not exists subject_id text not null default '';

drop index if exists public.daily_challenge_ranked_once;
create unique index if not exists daily_challenge_ranked_once
  on public.daily_challenge_attempts (exam_slug, quiz_date, subject_id, identity_key)
  where mode = 'ranked';

drop index if exists public.daily_challenge_today_idx;
create index if not exists daily_challenge_today_idx
  on public.daily_challenge_attempts (exam_slug, subject_id, quiz_date, mode, correct desc, elapsed_ms);
