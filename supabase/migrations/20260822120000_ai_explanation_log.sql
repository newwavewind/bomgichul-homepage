-- 생성된 AI 해설을 모아 둔다 — 사람이 아니라 「해설」에 관한 기록이다.
--
-- 같은 보기에 여러 판본이 쌓이는 것이 이 표의 값어치다. 열 개가 모이면
-- 아홉이 같은 말을 하는데 하나만 다른 자리가 곧 오류다. 그래서 중복을
-- 지우지 않고 전부 남긴다.
--
-- 담지 않는 것: 기기 식별자, 사용자가 적은 꼬리질문.
-- 누가 썼는지는 ai_usage 가 횟수만 세고, 이 표는 무엇이 나왔는지만 센다.
-- 둘은 서로 이어지지 않는다.

CREATE TABLE public.ai_explanation_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  subject_id text NOT NULL,
  exam_id text,            -- 기출 문항 id (예: 민법-2025-Q47)
  item_key text,           -- 문항 안에서 몇 번째 보기인가 (② · ㄱ. 등)
  item_text text NOT NULL, -- 보기 원문. 문항 데이터가 나중에 손질돼도 대조할 수 있게 그대로 둔다
  answer text,             -- O / X

  explanation text NOT NULL,

  -- 판본을 가르는 두 축. 이게 없으면 나중에 열 개를 늘어놓고 비교할 때
  -- 모델이 달라 생긴 차이인지 프롬프트를 고쳐 생긴 차이인지 구분할 수 없다.
  model text NOT NULL,
  prompt_version text NOT NULL,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- 같은 보기끼리 모아 보는 것이 이 표의 주된 쓰임이다
CREATE INDEX ai_explanation_log_item_idx
  ON public.ai_explanation_log (subject_id, exam_id, item_key);

CREATE INDEX ai_explanation_log_created_idx
  ON public.ai_explanation_log (created_at DESC);

ALTER TABLE public.ai_explanation_log ENABLE ROW LEVEL SECURITY;

-- 정책을 하나도 두지 않는다 = 아무도 못 읽고 못 쓴다.
-- 쓰기는 Edge Function(service role), 읽기는 홈페이지 관리자 화면(service role)만
-- RLS 를 지나쳐 닿는다.
REVOKE ALL ON TABLE public.ai_explanation_log FROM PUBLIC;
REVOKE ALL ON TABLE public.ai_explanation_log FROM anon;
REVOKE ALL ON TABLE public.ai_explanation_log FROM authenticated;
