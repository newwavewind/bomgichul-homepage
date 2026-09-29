-- 소방 채팅 토픽방 시드 + community scope CHECK 보강 재적용.
-- topic_key = 'firefighter' 가 없으면 join_topic_room('firefighter') 가 실패한다.

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
    'english'
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
    'english'
  ));

-- chat topic room
do $$
declare
  conv_id uuid;
begin
  select id into conv_id from public.dm_conversations where topic_key = 'firefighter';
  if conv_id is null then
    insert into public.dm_conversations (
      title, is_group, kind, topic_key, topic_label, gate_subject, is_public, invite_code
    ) values (
      '소방학 스터디방', true, 'topic', 'firefighter', '소방학',
      null, true,
      substr(md5('firefighter-bomgichul-topic'), 1, 10)
    );
  end if;
end $$;
