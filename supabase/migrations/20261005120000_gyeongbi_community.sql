-- 경비지도사(gyeongbi) 커뮤니티 scope + 채팅 토픽방.
--
-- 앱(~/gyeongbibomgichul)의 오류 신고·피드백이 이 scope 로 들어온다(/api/app-reports,
-- communityScope: 'gyeongbi'). posts 의 check 제약에 없으면 insert 가 막혀 앱은 「전송 실패」만
-- 보여 주고, 홈페이지 /gyeongbi/community 글쓰기·자료실 올리기·수험일기도 저장되지 않는다.
--
-- 앞 마이그레이션(20260929200000)처럼 scope 전체를 다시 세운다 — 원격에 빠진 것이 있어도
-- 이것 하나로 맞는다. 토픽방은 없을 때만 만든다(몇 번 돌려도 같다).

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
    'nomusa',
    'gyeongbi'
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
    'nomusa',
    'gyeongbi'
  ));

do $$
begin
  if not exists (select 1 from public.dm_conversations where topic_key = 'gyeongbi') then
    insert into public.dm_conversations (
      title, is_group, kind, topic_key, topic_label, gate_subject, is_public, invite_code
    ) values (
      '경비지도사 스터디방', true, 'topic', 'gyeongbi', '경비지도사',
      null, true,
      substr(md5('gyeongbi' || '-bomgichul-topic'), 1, 10)
    );
  end if;
end $$;
