alter table public.dm_conversations add column if not exists is_self boolean not null default false;
alter table public.dm_conversation_members add column if not exists pinned_at timestamptz;

create or replace function public.get_or_create_self_conversation()
returns uuid language plpgsql security definer set search_path=public as $$
declare conv_id uuid; me uuid:=auth.uid();
begin
  if me is null then raise exception '로그인이 필요합니다'; end if;
  select c.id into conv_id from public.dm_conversations c
  join public.dm_conversation_members m on m.conversation_id=c.id
  where c.is_self=true and m.user_id=me limit 1;
  if conv_id is not null then return conv_id; end if;
  insert into public.dm_conversations(title,is_self) values('나와의 채팅',true) returning id into conv_id;
  insert into public.dm_conversation_members(conversation_id,user_id,role) values(conv_id,me,'owner');
  return conv_id;
end; $$;
revoke all on function public.get_or_create_self_conversation() from public;
grant execute on function public.get_or_create_self_conversation() to authenticated;
