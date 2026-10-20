-- 방문 기록(site_visits) 다이어트 — Supabase 「Disk IO 예산 소진」 경고(2026-10-21) 대응.
--
-- 진단(pg_stat_statements): DB 522MB 중 site_visits 가 417MB(80%), 색인 8개 187MB.
-- 페이지 열 때마다 한 줄 넣고 색인 8개를 함께 고쳐 DB 쓰기의 대부분을 차지했다.
-- 앱 코드가 걸러 읽는 칸은 created_at(기간)과 id(체류시간 갱신)뿐이라 나머지 색인 여섯은 쓰이지 않는다.
--
-- 1) 안 쓰는 색인 여섯 제거  2) 30일 넘은 기록 삭제  3) 매일 새벽 4시(KST)에 30일 넘은 기록 자동 삭제.
-- 봇 방문은 앱(/api/analytics/visit)에서 아예 기록하지 않게 했다.

drop index if exists public.site_visits_visitor_id_idx;
drop index if exists public.site_visits_user_id_idx;
drop index if exists public.site_visits_client_host_idx;
drop index if exists public.site_visits_session_id_idx;
drop index if exists public.site_visits_ip_hash_idx;
drop index if exists public.site_visits_bot_class_created_at_idx;

delete from public.site_visits where created_at < now() - interval '30 days';

create extension if not exists pg_cron with schema pg_catalog;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'site_visits_retention_30d') then
    perform cron.unschedule('site_visits_retention_30d');
  end if;
  perform cron.schedule(
    'site_visits_retention_30d',
    '0 19 * * *', -- UTC 19시 = KST 새벽 4시
    $job$delete from public.site_visits where created_at < now() - interval '30 days'$job$
  );
end $$;
