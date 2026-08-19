-- 공무원 영어 커뮤니티 scope 를 연다.
--
-- posts 와 study_diaries 는 community_scope 를 check 제약으로 묶어 두었다.
-- 목록에 없는 값은 insert 자체가 막히므로, 트랙을 늘릴 때마다 여기를 함께
-- 늘려야 한다. 늘리지 않으면 글쓰기에서만 조용히 실패한다.

alter table public.posts
  drop constraint if exists posts_community_scope_check;

alter table public.posts
  add constraint posts_community_scope_check
  check (community_scope in ('real_estate', 'public_service', 'police', 'housing', 'social_worker', 'history', 'english'));

alter table public.study_diaries
  drop constraint if exists study_diaries_community_scope_check;

alter table public.study_diaries
  add constraint study_diaries_community_scope_check
  check (community_scope in ('real_estate', 'public_service', 'police', 'housing', 'social_worker', 'history', 'english'));
