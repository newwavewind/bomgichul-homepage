-- Fix: dm_conversation_members SELECT 정책이 자기 자신을 조회해
-- "infinite recursion detected in policy for relation dm_conversation_members" 발생.
-- SECURITY DEFINER 헬퍼로 멤버십 검사 시 RLS를 우회한다.

create or replace function public.is_dm_conversation_member(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.dm_conversation_members
    where conversation_id = p_conversation_id
      and user_id = auth.uid()
  );
$$;

revoke all on function public.is_dm_conversation_member(uuid) from public;
grant execute on function public.is_dm_conversation_member(uuid) to authenticated;

drop policy if exists "대화 참여자만 조회" on public.dm_conversation_members;
create policy "대화 참여자만 조회"
  on public.dm_conversation_members for select
  using (public.is_dm_conversation_member(conversation_id));

-- 대화방/메시지 정책도 동일 헬퍼를 쓰도록 정리 (재귀·중복 서브쿼리 방지)
drop policy if exists "대화방은 참여자만 조회" on public.dm_conversations;
create policy "대화방은 참여자만 조회"
  on public.dm_conversations for select
  using (public.is_dm_conversation_member(id));

drop policy if exists "메시지는 참여자만 조회" on public.dm_messages;
create policy "메시지는 참여자만 조회"
  on public.dm_messages for select
  using (public.is_dm_conversation_member(conversation_id));

drop policy if exists "참여자만 메시지 전송" on public.dm_messages;
create policy "참여자만 메시지 전송"
  on public.dm_messages for insert
  with check (
    sender_id = auth.uid()
    and public.is_dm_conversation_member(conversation_id)
  );
