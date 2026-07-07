-- 댓글 알림 (내 글에 댓글이 달리면 알림 생성)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  type text not null default 'comment' check (type in ('comment')),
  read_at timestamptz,
  created_at timestamptz default now() not null
);

create index if not exists notifications_recipient_idx
  on public.notifications(recipient_id, created_at desc);

alter table public.notifications enable row level security;

create policy "본인 알림만 조회"
  on public.notifications for select using (auth.uid() = recipient_id);

create policy "본인이 행위자인 알림만 생성"
  on public.notifications for insert
  with check (auth.uid() = actor_id and actor_id <> recipient_id);

create policy "본인 알림만 읽음 처리"
  on public.notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);
