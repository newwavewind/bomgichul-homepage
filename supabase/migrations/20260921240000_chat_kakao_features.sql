-- Kakao-style: schedule_share + reminder kinds, study meta actions, room vault RPC

alter table public.dm_messages drop constraint if exists dm_messages_message_kind_check;
alter table public.dm_messages
  add constraint dm_messages_message_kind_check
  check (message_kind in (
    'text','exam_card','wrong_share','timer','poll','voice','system',
    'mock_invite','checkin','schedule_share','reminder'
  ));

create or replace function public.manage_dm_group(
  p_conversation_id uuid,
  p_action text,
  p_target_user_id uuid default null,
  p_value text default null
)
returns void language plpgsql security definer set search_path = public as $$
declare my_role text;
begin
  select role into my_role from public.dm_conversation_members
  where conversation_id = p_conversation_id and user_id = auth.uid();
  if my_role is null then raise exception '참여자가 아닙니다'; end if;

  if p_action in ('rename','slow_mode','remove','promote','transfer','pin') then
    if my_role not in ('owner','admin') then raise exception '관리 권한이 없습니다'; end if;
  end if;

  if p_action = 'rename' then
    update public.dm_conversations set title = left(trim(p_value), 40) where id = p_conversation_id and is_group;
  elsif p_action = 'slow_mode' then
    update public.dm_conversations set slow_mode_seconds = greatest(0, least(3600, p_value::integer)) where id = p_conversation_id;
  elsif p_action = 'remove' then
    delete from public.dm_conversation_members where conversation_id = p_conversation_id and user_id = p_target_user_id and role <> 'owner';
  elsif p_action = 'promote' and my_role = 'owner' then
    update public.dm_conversation_members set role = 'admin' where conversation_id = p_conversation_id and user_id = p_target_user_id;
  elsif p_action = 'transfer' and my_role = 'owner' then
    update public.dm_conversation_members set role = 'member' where conversation_id = p_conversation_id and user_id = auth.uid();
    update public.dm_conversation_members set role = 'owner' where conversation_id = p_conversation_id and user_id = p_target_user_id;
  elsif p_action = 'pin' then
    update public.dm_conversations set pinned_message_id = nullif(p_value, '')::uuid where id = p_conversation_id;
  elsif p_action = 'set_dday' then
    update public.dm_conversations
      set study_dday = case when p_value is null or trim(p_value) = '' then null else p_value::date end
    where id = p_conversation_id;
  elsif p_action = 'set_goal' then
    update public.dm_conversations
      set study_goal = nullif(left(trim(coalesce(p_value, '')), 120), '')
    where id = p_conversation_id;
  else
    raise exception '알 수 없는 작업입니다';
  end if;
end; $$;

revoke all on function public.manage_dm_group(uuid,text,uuid,text) from public;
grant execute on function public.manage_dm_group(uuid,text,uuid,text) to authenticated;

create or replace function public.list_dm_room_vault(
  p_conversation_id uuid,
  p_tab text default 'all',
  p_limit integer default 80
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 80), 120));
  v_tab text := coalesce(nullif(trim(p_tab), ''), 'all');
  v_rows jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception 'not a member';
  end if;

  if v_tab in ('all', 'media', 'file') then
    select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
    into v_rows
    from (
      select
        a.id,
        a.message_id,
        a.kind,
        a.file_name,
        a.file_path,
        a.mime_type,
        a.created_at,
        'attachment'::text as vault_kind,
        null::text as content,
        null::text as message_kind,
        null::jsonb as payload
      from public.dm_message_attachments a
      join public.dm_messages m on m.id = a.message_id
      where a.conversation_id = p_conversation_id
        and m.deleted_at is null
        and (
          v_tab = 'all'
          or (v_tab = 'media' and a.kind in ('image','video','audio'))
          or (v_tab = 'file' and a.kind = 'file')
        )
      order by a.created_at desc
      limit v_limit
    ) x;
  end if;

  if v_tab in ('all', 'exam', 'link') then
    v_rows := v_rows || coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select
          m.id,
          m.id as message_id,
          null::text as kind,
          null::text as file_name,
          null::text as file_path,
          null::text as mime_type,
          m.created_at,
          case
            when m.message_kind in ('exam_card','wrong_share','mock_invite') then 'exam'
            else 'link'
          end as vault_kind,
          m.content,
          m.message_kind,
          m.payload
        from public.dm_messages m
        where m.conversation_id = p_conversation_id
          and m.deleted_at is null
          and (
            (v_tab = 'exam' and m.message_kind in ('exam_card','wrong_share','mock_invite','schedule_share'))
            or (v_tab = 'link' and m.content ~* 'https?://')
            or (
              v_tab = 'all'
              and (
                m.message_kind in ('exam_card','wrong_share','mock_invite','schedule_share')
                or m.content ~* 'https?://'
              )
            )
          )
        order by m.created_at desc
        limit v_limit
      ) x
    ), '[]'::jsonb);
  end if;

  if v_tab = 'bookmark' then
    select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
    into v_rows
    from (
      select
        m.id,
        m.id as message_id,
        null::text as kind,
        null::text as file_name,
        null::text as file_path,
        null::text as mime_type,
        b.created_at,
        'bookmark'::text as vault_kind,
        m.content,
        m.message_kind,
        m.payload
      from public.dm_message_bookmarks b
      join public.dm_messages m on m.id = b.message_id
      where b.user_id = auth.uid()
        and m.conversation_id = p_conversation_id
        and m.deleted_at is null
      order by b.created_at desc
      limit v_limit
    ) x;
  end if;

  return v_rows;
end;
$$;

revoke all on function public.list_dm_room_vault(uuid,text,integer) from public;
grant execute on function public.list_dm_room_vault(uuid,text,integer) to authenticated;
