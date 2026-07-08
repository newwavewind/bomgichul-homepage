-- DM 메시지 도배 방지: 발신자 기준 짧은 시간 내 메시지 수를 제한한다.
-- 기존 RLS는 "본인 명의로만 보낼 수 있다"만 보장할 뿐, 자기 자신의 대화방에
-- 메시지를 무제한으로 쏟아붓는 것은 막지 못했다.

create index if not exists dm_messages_sender_created_idx
  on public.dm_messages (sender_id, created_at desc);

create or replace function public.enforce_dm_message_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.dm_messages
  where sender_id = new.sender_id
    and created_at > now() - interval '10 seconds';

  if recent_count >= 15 then
    raise exception '메시지를 너무 빠르게 보내고 있어요. 잠시 후 다시 시도해주세요.';
  end if;

  return new;
end;
$$;

drop trigger if exists dm_messages_rate_limit on public.dm_messages;
create trigger dm_messages_rate_limit
  before insert on public.dm_messages
  for each row execute function public.enforce_dm_message_rate_limit();
