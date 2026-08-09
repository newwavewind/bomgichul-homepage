-- 경찰·주택관리사 커뮤니티 스코프 추가
alter table public.posts
  drop constraint if exists posts_community_scope_check;

alter table public.posts
  add constraint posts_community_scope_check
  check (community_scope in ('real_estate', 'public_service', 'police', 'housing'));
