-- 정리: 홈페이지 세션에서 임시로 만들었던 프리미엄 코드 시스템 제거.
-- 실제로는 ox-quiz-app(모바일)의 pc_access_codes / user_entitlements /
-- register_pc_access_code() 가 이 기능을 이미 구현·운영 중이며, 홈페이지
-- 애플리케이션 코드도 그쪽을 사용하도록 전환했다. 아래 3개는 전혀 사용되지
-- 않는 상태(premium_codes는 항상 비어있었음)라 안전하게 제거한다.

drop function if exists public.redeem_premium_code(text);
drop table if exists public.premium_codes;
drop table if exists public.subject_unlocks;
