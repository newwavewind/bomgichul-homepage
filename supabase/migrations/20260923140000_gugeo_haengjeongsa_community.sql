-- 공무원 국어·행정사 커뮤니티 scope + 채팅 토픽방 시드.
-- topic_key = 'gugeo' / 'haengjeongsa' 가 없으면 join_topic_room 이 실패한다.

-- posts / study_diaries scope (idempotent)
alter table public.posts
  drop constraint if exists posts_community_scope_check;

alter table public.posts
  add constraint posts_community_scope_check
  check (community_scope in (
    'real_estate',
    'public_service',
    'police',
    'firefighter',
    'housing',
    'social_worker',
    'history',
    'english',
    'gugeo',
    'haengjeongsa'
  ));

alter table public.study_diaries
  drop constraint if exists study_diaries_community_scope_check;

alter table public.study_diaries
  add constraint study_diaries_community_scope_check
  check (community_scope in (
    'real_estate',
    'public_service',
    'police',
    'firefighter',
    'housing',
    'social_worker',
    'history',
    'english',
    'gugeo',
    'haengjeongsa'
  ));

-- chat topic rooms
do $$
declare
  conv_id uuid;
begin
  select id into conv_id from public.dm_conversations where topic_key = 'gugeo';
  if conv_id is null then
    insert into public.dm_conversations (
      title, is_group, kind, topic_key, topic_label, gate_subject, is_public, invite_code
    ) values (
      '공무원 국어 스터디방', true, 'topic', 'gugeo', '국어',
      null, true,
      substr(md5('gugeo-bomgichul-topic'), 1, 10)
    );
  end if;

  select id into conv_id from public.dm_conversations where topic_key = 'haengjeongsa';
  if conv_id is null then
    insert into public.dm_conversations (
      title, is_group, kind, topic_key, topic_label, gate_subject, is_public, invite_code
    ) values (
      '행정사 스터디방', true, 'topic', 'haengjeongsa', '행정사',
      null, true,
      substr(md5('haengjeongsa-bomgichul-topic'), 1, 10)
    );
  end if;
end $$;
