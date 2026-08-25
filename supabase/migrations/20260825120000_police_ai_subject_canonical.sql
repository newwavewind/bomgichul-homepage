-- 경찰 앱 AI 해설 로그: 슬롯 id → 정식 과목 id
-- registry-law(헌법), realestate-tax(형사법), broker-law(경찰학), heonbeop(헌법)
-- 2026-08-25 운영 DB에 이미 적용함. 재실행해도 영향 없음.

UPDATE public.ai_explanation_log
SET subject_id = 'police:constitution'
WHERE subject_id IN ('police:registry-law', 'police:heonbeop');

UPDATE public.ai_explanation_log
SET subject_id = 'police:criminal-law'
WHERE subject_id = 'police:realestate-tax';

UPDATE public.ai_explanation_log
SET subject_id = 'police:police-science'
WHERE subject_id = 'police:broker-law';
