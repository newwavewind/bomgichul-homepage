-- 수험일기를 시험(커뮤니티) 스코프로 분리
alter table public.study_diaries
  add column if not exists community_scope text not null default 'real_estate';

alter table public.study_diaries
  drop constraint if exists study_diaries_community_scope_check;

alter table public.study_diaries
  add constraint study_diaries_community_scope_check
  check (community_scope in ('real_estate', 'public_service', 'police', 'housing'));

alter table public.study_diaries
  drop constraint if exists study_diaries_author_id_diary_date_key;

alter table public.study_diaries
  drop constraint if exists study_diaries_author_date_scope_key;

alter table public.study_diaries
  add constraint study_diaries_author_date_scope_key
  unique (author_id, diary_date, community_scope);

create index if not exists study_diaries_scope_dday_idx
  on public.study_diaries (community_scope, days_until_exam, diary_date desc);
