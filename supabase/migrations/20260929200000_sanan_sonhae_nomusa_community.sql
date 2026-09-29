-- 산업안전지도사(sanan)·손해평가사(sonhae)·공인노무사(nomusa) 커뮤니티 scope + 채팅 토픽방.
--
-- 앱의 오류 신고·피드백이 이 scope 로 들어온다(/api/app-reports). check 제약에 없으면
-- insert 가 막혀 앱은 「전송 실패」만 보여 준다.
--
-- 소방·국어·행정사·세무사 마이그레이션(20260923*·20260925160000)이 원격 기록에 없다.
-- 이 파일이 scope 전체를 다시 세우므로, 앞의 것이 빠졌더라도 이것 하나로 맞는다.
-- 토픽방도 없는 것만 만든다(세무사 포함).

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
    'haengjeongsa',
    'semusa',
    'sanan',
    'sonhae',
    'nomusa'
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
    'haengjeongsa',
    'semusa',
    'sanan',
    'sonhae',
    'nomusa'
  ));

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('semusa', '세무사 스터디방', '세무사'),
      ('sanan', '산업안전지도사 스터디방', '산업안전지도사'),
      ('sonhae', '손해평가사 스터디방', '손해평가사'),
      ('nomusa', '공인노무사 스터디방', '공인노무사')
    ) as t(topic_key, title, label)
  loop
    if not exists (select 1 from public.dm_conversations where topic_key = r.topic_key) then
      insert into public.dm_conversations (
        title, is_group, kind, topic_key, topic_label, gate_subject, is_public, invite_code
      ) values (
        r.title, true, 'topic', r.topic_key, r.label,
        null, true,
        substr(md5(r.topic_key || '-bomgichul-topic'), 1, 10)
      );
    end if;
  end loop;
end $$;
