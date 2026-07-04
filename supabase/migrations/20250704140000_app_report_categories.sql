-- 앱 오류신고·피드백용 커뮤니티 카테고리
alter table public.posts
  drop constraint if exists posts_category_check;

alter table public.posts
  add constraint posts_category_check
  check (category in ('question', 'resource', 'chat', 'info', 'bug', 'feedback'));
