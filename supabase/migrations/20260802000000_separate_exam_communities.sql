alter table public.posts
  add column if not exists community_scope text not null default 'real_estate'
  check (community_scope in ('real_estate', 'public_service'));

create index if not exists posts_community_scope_created_at_idx
  on public.posts (community_scope, created_at desc);
