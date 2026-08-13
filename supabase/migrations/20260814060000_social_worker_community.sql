alter table public.posts
  drop constraint if exists posts_community_scope_check;

alter table public.posts
  add constraint posts_community_scope_check
  check (community_scope in ('real_estate', 'public_service', 'police', 'housing', 'social_worker'));

alter table public.study_diaries
  drop constraint if exists study_diaries_community_scope_check;

alter table public.study_diaries
  add constraint study_diaries_community_scope_check
  check (community_scope in ('real_estate', 'public_service', 'police', 'housing', 'social_worker'));
