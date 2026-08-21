-- 같은 보기에 몇 판본이 쌓였는지 — 관리자 화면의 첫 목록이 이걸 본다.
--
-- 판본이 많이 모인 보기가 위로 오게 해 둔다. 열 개쯤 모인 자리가
-- 서로 견주어 볼 만한 자리이기 때문이다.

CREATE VIEW public.ai_explanation_log_groups AS
SELECT
  subject_id,
  exam_id,
  item_key,
  count(*)::int                                  AS variant_count,
  count(DISTINCT model)::int                     AS model_count,
  count(DISTINCT prompt_version)::int            AS prompt_version_count,
  min(created_at)                                AS first_at,
  max(created_at)                                AS last_at,
  (array_agg(item_text ORDER BY id DESC))[1]     AS item_text,
  (array_agg(answer    ORDER BY id DESC))[1]     AS answer
FROM public.ai_explanation_log
GROUP BY subject_id, exam_id, item_key;

-- 기반 표와 같은 문을 건다. 읽는 쪽은 홈페이지 관리자 화면(service role)뿐이다.
REVOKE ALL ON public.ai_explanation_log_groups FROM PUBLIC;
REVOKE ALL ON public.ai_explanation_log_groups FROM anon;
REVOKE ALL ON public.ai_explanation_log_groups FROM authenticated;
