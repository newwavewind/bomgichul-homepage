-- 자유게시판 카테고리 추가
alter table public.posts
  drop constraint if exists posts_category_check;

alter table public.posts
  add constraint posts_category_check
  check (
    category in (
      'question',
      'resource',
      'chat',
      'free',
      'info',
      'bug',
      'feedback',
      'review'
    )
  );
