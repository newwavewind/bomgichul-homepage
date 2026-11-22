/** 보기·해설을 묶어 외부 AI 채팅으로 보낼 프롬프트·URL */

const MAX_URL_PROMPT_LEN = 1800;
const CHOICE_MARKERS = ["①", "②", "③", "④", "⑤"];

export type AiServiceId = "chatgpt" | "gemini" | "claude" | "perplexity";

export const AI_SERVICES: {
  id: AiServiceId;
  label: string;
  mode: "url" | "clipboard";
  baseUrl: string;
  buildUrl?: (prompt: string) => string;
}[] = [
  {
    id: "chatgpt",
    label: "GPT",
    mode: "url",
    baseUrl: "https://chatgpt.com/",
    buildUrl: (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "gemini",
    label: "Gemini",
    mode: "clipboard",
    baseUrl: "https://gemini.google.com/app",
  },
  {
    id: "claude",
    label: "Claude",
    mode: "clipboard",
    baseUrl: "https://claude.ai/new",
  },
];

export const QUESTION_AI_SERVICES: typeof AI_SERVICES = [
  ...AI_SERVICES,
  {
    id: "perplexity",
    label: "Perplexity",
    mode: "url",
    baseUrl: "https://www.perplexity.ai/",
    buildUrl: (prompt) => `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
  },
];

export interface ExamItemPromptInput {
  examLabel?: string;
  sessionLabel?: string;
  subjectLabel: string;
  year: number;
  round?: number;
  questionNo: number;
  category: string;
  stem: string;
  correctChoice: string;
  item: {
    key: string;
    label: string;
    text: string;
    answer: string;
    explanation?: string;
  };
  includeExplanation?: boolean;
}

function choiceMarker(key: string): string {
  const n = parseInt(key, 10);
  if (!Number.isNaN(n) && n >= 1 && n <= 5) return CHOICE_MARKERS[n - 1];
  return key;
}

export function buildExamItemAiPrompt({
  examLabel = "공인중개사",
  sessionLabel,
  subjectLabel,
  year,
  round,
  questionNo,
  category,
  stem,
  correctChoice,
  item,
  includeExplanation = true,
}: ExamItemPromptInput): string {
  const meta = [
    subjectLabel,
    `${year}년`,
    sessionLabel || (round != null ? `제${round}회` : ""),
    `${questionNo}번`,
    category,
    item.label,
  ]
    .filter(Boolean)
    .join(" · ");

  const choiceNo = parseInt(item.key, 10);
  const lines = [
    `[${examLabel} 기출] 아래 문항과 보기의 핵심 개념과 헷갈리기 쉬운 이유를 설명해 주세요. 관련 조문이나 판례가 있는 경우에만 근거를 함께 알려 주세요.`,
    "",
    `【출처】 ${meta}`,
    `【지문】\n${stem}`,
    `【보기 ${item.label}】\n${item.text}`,
    correctChoice ? `【기출 정답】 ${correctChoice.split("·").map(choiceMarker).join("·")}` : "",
  ];

  if (!Number.isNaN(choiceNo) && correctChoice === item.key) {
    lines.push("【참고】 이 보기가 기출 정답입니다.");
  }

  if (item.answer) lines.push(`【이 보기 O/X】 ${item.answer}`);

  if (includeExplanation && item.explanation) {
    lines.push(`【해설】\n${item.explanation}`);
  }

  return lines.filter(Boolean).join("\n\n").slice(0, 6000);
}

export interface ConceptDetailPromptInput {
  subjectLabel: string;
  titleKo: string;
  chapterKo?: string | null;
  sectionKo?: string | null;
  category?: string | null;
  definition?: string | null;
  intuition?: string | null;
  keyPoints?: string[] | null;
  pitfalls?: string | null;
}

export function buildConceptDetailAiPrompt({
  subjectLabel,
  titleKo,
  chapterKo,
  sectionKo,
  category,
  definition,
  intuition,
  keyPoints,
  pitfalls,
}: ConceptDetailPromptInput): string {
  const unit = [chapterKo, sectionKo, category].filter(Boolean).join(" · ");
  const points = (keyPoints || []).map((p) => `· ${p}`).join("\n");
  const lines = [
    `공인중개사 ${subjectLabel || ""} 시험 범위의 개념 「${titleKo || ""}」을(를) 더 깊이 설명해 주세요.`,
    "",
    "다음을 포함해 주세요: 핵심 정의 보강, 관련 조문·판례(해당 시), 기출에서 자주 나오는 O/X 포인트, 헷갈리기 쉬운 유사 개념과의 차이.",
    unit ? `【단원】 ${unit}` : "",
    definition ? `【개념 정리】\n${definition}` : "",
    intuition ? `【이해하기】\n${intuition}` : "",
    points ? `【핵심 포인트】\n${points}` : "",
    pitfalls ? `【함정 포인트】\n${pitfalls}` : "",
  ].filter(Boolean);

  return lines.join("\n\n").slice(0, 6000);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

export async function openAiService(
  serviceId: AiServiceId,
  prompt: string
): Promise<{ copied: boolean; prefilled: boolean; serviceId: AiServiceId }> {
  const service = QUESTION_AI_SERVICES.find((s) => s.id === serviceId);
  if (!service) return { copied: false, prefilled: false, serviceId };

  const useUrl =
    service.mode === "url" &&
    service.buildUrl &&
    prompt.length <= MAX_URL_PROMPT_LEN &&
    service.buildUrl(prompt).length <= 8000;

  if (useUrl && service.buildUrl) {
    window.open(service.buildUrl(prompt), "_blank", "noopener,noreferrer");
    return { copied: false, prefilled: true, serviceId };
  }

  const copying = copyText(prompt).catch(() => false);
  window.open(service.baseUrl, "_blank", "noopener,noreferrer");
  return { copied: await copying, prefilled: false, serviceId };
}
