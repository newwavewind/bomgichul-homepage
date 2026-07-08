-- 법령정보 카테고리 추가 (부동산 관련 법령 개정 소식)
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
      'review',
      'law_update'
    )
  );
