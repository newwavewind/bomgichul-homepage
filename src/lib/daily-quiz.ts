export interface DailyOxQuestion {
  subject: string;
  year: number;
  statement: string;
  answer: "O" | "X";
  explanation: string;
}

/** 홈페이지 미리보기용 샘플 기출 O/X (연도별·목차별 기출 O/X 학습의 맛보기) */
export const DAILY_OX_QUESTIONS: DailyOxQuestion[] = [
  {
    subject: "민법",
    year: 2016,
    statement:
      "상대방이 정당한 사유 없이 통지의 수령을 거절한 경우, 그가 통지의 내용을 알 수 있는 객관적 상태에 놓인 때에 의사표시의 효력이 생긴다.",
    answer: "O",
    explanation:
      "수령거절 시에도 상대방이 내용을 알 수 있는 객관적 상태에 놓이면 도달로 인정된다는 판례 법리입니다.",
  },
  {
    subject: "민법",
    year: 2016,
    statement:
      "통정허위표시로 무효인 법률행위라도 그 사정을 모르는 선의의 제3자에게는 무효를 주장할 수 없다.",
    answer: "O",
    explanation: "민법 제108조 제2항, 선의의 제3자 보호 규정입니다.",
  },
  {
    subject: "민법",
    year: 2017,
    statement: "미성년자가 법정대리인의 동의 없이 한 법률행위는 취소할 수 있다.",
    answer: "O",
    explanation: "미성년자의 법률행위는 원칙적으로 법정대리인의 동의가 필요하며, 동의 없이 한 행위는 취소할 수 있습니다(민법 제5조).",
  },
  {
    subject: "부동산학개론",
    year: 2018,
    statement: "부동산의 개별성으로 인해 부동산시장에서는 완전한 대체가 불가능하다.",
    answer: "O",
    explanation: "개별성(비동질성)은 부동산 상품 간 완전 대체를 불가능하게 하는 자연적 특성입니다.",
  },
  {
    subject: "부동산학개론",
    year: 2019,
    statement: "부동성(비이동성)으로 인해 부동산시장은 국지적·지역적 시장의 성격을 갖는다.",
    answer: "O",
    explanation: "부동성은 부동산이 이동할 수 없다는 특성으로, 이로 인해 부동산시장은 전국 단일시장이 아닌 지역시장으로 형성됩니다.",
  },
  {
    subject: "공인중개사법령",
    year: 2019,
    statement: "중개보조원은 중개대상물에 대한 확인·설명의무를 진다.",
    answer: "X",
    explanation: "확인·설명의무는 개업공인중개사에게 있으며, 중개보조원은 이를 부담하지 않습니다.",
  },
  {
    subject: "공인중개사법령",
    year: 2021,
    statement: "개업공인중개사가 아닌 자는 공인중개사 또는 이와 유사한 명칭을 사용할 수 없다.",
    answer: "O",
    explanation: "공인중개사법 제7조는 무자격자의 유사명칭 사용을 금지하고 있습니다.",
  },
  {
    subject: "부동산공시법",
    year: 2020,
    statement: "등기는 물권변동의 효력발생요건이지 존속요건은 아니다.",
    answer: "O",
    explanation: "판례상 등기는 효력발생요건일 뿐 존속요건이 아니어서, 등기가 말소되어도 실체적 권리는 소멸하지 않습니다.",
  },
  {
    subject: "부동산세법",
    year: 2022,
    statement: "취득세는 지방세이다.",
    answer: "O",
    explanation: "취득세는 부동산 소재지 관할 지방자치단체가 부과하는 지방세(도세)입니다.",
  },
  {
    subject: "부동산공법",
    year: 2023,
    statement: "국토의 계획 및 이용에 관한 법률상 도시지역은 주거지역·상업지역·공업지역·녹지지역으로 구분된다.",
    answer: "O",
    explanation: "국토계획법상 용도지역 중 도시지역은 주거·상업·공업·녹지지역 4가지로 세분됩니다.",
  },
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** 날짜 시드 기반 결정론적 셔플 (같은 날엔 모두 같은 순서를 봄) */
export function getDailyOxSet(dateKey: string): DailyOxQuestion[] {
  const items = [...DAILY_OX_QUESTIONS];
  let seed = hashString(dateKey) || 1;

  for (let i = items.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/**
 * 막힌 문항을 AI에게 바로 물어볼 수 있는 질문 초안.
 * 출처·지문·보기(O/X)·내가 고른 답·해설을 모두 담아, AI가 바로 깊이 있는 답을
 * 줄 수 있도록 만든다 — "공부는 당신이, 질문은 봄기출이" 아이덴티티의 핵심 기능.
 */
export function buildAiQuestionPrompt(
  question: DailyOxQuestion,
  picked: "O" | "X"
): string {
  const isCorrect = picked === question.answer;

  return [
    "공인중개사 기출 O/X 문제를 풀다가 막혀서 질문 드립니다. 아래 내용을 바탕으로 답변해주세요.",
    "",
    `[출처] ${question.subject} ${question.year}년 기출`,
    `[지문] ${question.statement}`,
    "[보기] O(맞다) / X(틀리다)",
    `[정답] ${question.answer}`,
    `[내가 고른 답] ${picked} (${isCorrect ? "정답" : "오답"})`,
    `[해설] ${question.explanation}`,
    "",
    "위 지문·정답·제가 고른 답·해설을 바탕으로 다음을 자세히 설명해주세요.",
    "1. 이 지문이 왜 이 정답이 되는지, 근거가 되는 조문·판례",
    isCorrect
      ? "2. 비슷하게 자주 출제되는 헷갈리는 포인트나 함정"
      : "2. 제가 왜 틀렸는지, 헷갈렸을 만한 포인트",
    "3. 관련해서 같이 알아두면 좋은 조문·판례가 있다면 추가로",
  ].join("\n");
}
