/** 보기·해설을 묶어 외부 AI 채팅으로 보낼 프롬프트·URL */

const MAX_URL_PROMPT_LEN = 1800;
const CHOICE_MARKERS = ["①", "②", "③", "④", "⑤"];

export type AiServiceId = "chatgpt" | "gemini" | "claude";

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

export interface ExamItemPromptInput {
  subjectLabel: string;
  year: number;
  round: number;
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
    `제${round}회`,
    `${questionNo}번`,
    category,
    item.label,
  ]
    .filter(Boolean)
    .join(" · ");

  const choiceNo = parseInt(item.key, 10);
  const lines = [
    `[공인중개사 기출] 아래 내용을 바탕으로 관련 조문·판례·헷갈리는 포인트를 자세히 설명해 주세요.`,
    "",
    `【출처】 ${meta}`,
    `【지문】\n${stem}`,
    `【보기 ${item.label}】\n${item.text}`,
    `【기출 정답】 ${choiceMarker(correctChoice)}`,
  ];

  if (!Number.isNaN(choiceNo) && correctChoice === item.key) {
    lines.push("【참고】 이 보기가 기출 정답입니다.");
  }

  lines.push(`【이 보기 O/X】 ${item.answer}`);

  if (includeExplanation && item.explanation) {
    lines.push(`【해설】\n${item.explanation}`);
  }

  return lines.filter(Boolean).join("\n\n").slice(0, 6000);
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
): Promise<{ copied: boolean; serviceId: AiServiceId }> {
  const service = AI_SERVICES.find((s) => s.id === serviceId);
  if (!service) return { copied: false, serviceId };

  const useUrl =
    service.mode === "url" &&
    service.buildUrl &&
    prompt.length <= MAX_URL_PROMPT_LEN &&
    service.buildUrl(prompt).length <= 8000;

  let copied = false;

  if (!useUrl) {
    copied = await copyText(prompt);
    window.open(service.baseUrl, "_blank", "noopener,noreferrer");
  } else {
    window.open(service.buildUrl(prompt), "_blank", "noopener,noreferrer");
  }

  return { copied, serviceId };
}
