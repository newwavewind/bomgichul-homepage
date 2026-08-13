create or replace function public.set_dm_conversation_pin(p_conversation_id uuid, p_pinned boolean)
returns void language plpgsql security definer set search_path=public as $$
begin
  update public.dm_conversation_members
  set pinned_at=case when p_pinned then now() else null end
  where conversation_id=p_conversation_id and user_id=auth.uid();
  if not found then raise exception '참여 중인 채팅방이 아닙니다'; end if;
end; $$;
revoke all on function public.set_dm_conversation_pin(uuid,boolean) from public;
grant execute on function public.set_dm_conversation_pin(uuid,boolean) to authenticated;
