alter table public.question_public_memos
  add column visibility text not null default 'public'
    check (visibility in ('public', 'private'));

drop policy "공개 메모 누구나 조회" on public.question_public_memos;
create policy "공개 글 또는 본인 비공개 글 조회"
  on public.question_public_memos for select to anon, authenticated
  using (visibility = 'public' or user_id = (select auth.uid()));

create policy "공개 글의 하트만 접근"
  on public.question_public_memo_likes as restrictive for all to anon, authenticated
  using (exists (
    select 1 from public.question_public_memos m
    where m.id = memo_id and m.visibility = 'public'
  ))
  with check (exists (
    select 1 from public.question_public_memos m
    where m.id = memo_id and m.visibility = 'public'
  ));

create policy "공개 글의 답글만 접근"
  on public.question_public_memo_comments as restrictive for all to anon, authenticated
  using (exists (
    select 1 from public.question_public_memos m
    where m.id = memo_id and m.visibility = 'public'
  ))
  with check (exists (
    select 1 from public.question_public_memos m
    where m.id = memo_id and m.visibility = 'public'
  ));

create function public.publish_private_question_note(note_id uuid, note_updated_at timestamptz)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  saved_note public.question_notes%rowtype;
  published_id uuid;
begin
  if actor_id is null then
    raise exception 'Sign-in required' using errcode = '42501';
  end if;

  delete from public.question_notes
  where id = note_id and user_id = actor_id and updated_at = note_updated_at
  returning * into saved_note;

  if not found then
    raise exception 'Note not found or changed' using errcode = 'P0002';
  end if;

  insert into public.question_public_memos (user_id, subject, year, question_no, content)
  values (actor_id, saved_note.subject, saved_note.year, saved_note.question_no, saved_note.content)
  returning id into published_id;

  return published_id;
end;
$$;

revoke execute on function public.publish_private_question_note(uuid, timestamptz) from public, anon;
grant execute on function public.publish_private_question_note(uuid, timestamptz) to authenticated;
