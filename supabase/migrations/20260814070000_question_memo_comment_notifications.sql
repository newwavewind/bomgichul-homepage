-- 공개 문항 메모에 댓글이 달리면 메모 작성자에게 알림을 보낸다.

alter table public.notifications
  alter column post_id drop not null;

alter table public.notifications
  add column if not exists memo_id uuid references public.question_public_memos(id) on delete cascade,
  add column if not exists memo_comment_id uuid references public.question_public_memo_comments(id) on delete cascade;

alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type in ('comment', 'memo_comment'));

create unique index if not exists notifications_memo_comment_unique_idx
  on public.notifications (memo_comment_id)
  where memo_comment_id is not null;

create or replace function public.notify_question_memo_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  memo_author_id uuid;
begin
  select user_id
    into memo_author_id
    from public.question_public_memos
   where id = new.memo_id;

  if memo_author_id is not null and memo_author_id <> new.user_id then
    insert into public.notifications (
      recipient_id,
      actor_id,
      post_id,
      comment_id,
      memo_id,
      memo_comment_id,
      type
    ) values (
      memo_author_id,
      new.user_id,
      null,
      null,
      new.memo_id,
      new.id,
      'memo_comment'
    )
    on conflict (memo_comment_id) where memo_comment_id is not null do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists question_memo_comment_notification_trigger
  on public.question_public_memo_comments;

create trigger question_memo_comment_notification_trigger
after insert on public.question_public_memo_comments
for each row execute function public.notify_question_memo_comment();
