import { isPublicExamVisible } from "@/lib/public-exam-visibility";

export type DailyExamMeta = {
  slug: string;
  label: string;
  home: string;
  trackId: string | null;
};

export const DAILY_EXAMS: DailyExamMeta[] = [
  { slug: "public-service", label: "공무원", home: "/public-service", trackId: null },
  { slug: "real-estate", label: "공인중개사", home: "/real-estate", trackId: null },
  { slug: "police", label: "경찰공무원", home: "/police", trackId: "police" },
  { slug: "firefighter", label: "소방공무원", home: "/firefighter", trackId: "firefighter" },
  { slug: "housing", label: "주택관리사", home: "/housing", trackId: "housing" },
  { slug: "social-worker", label: "사회복지사 1급", home: "/social-worker", trackId: "social_worker" },
  { slug: "history", label: "한국사능력검정", home: "/history", trackId: "history" },
  { slug: "english", label: "공무원 영어", home: "/english", trackId: "english" },
  { slug: "gugeo", label: "공무원 국어", home: "/gugeo", trackId: "gugeo" },
  { slug: "haengjeongsa", label: "행정사", home: "/haengjeongsa", trackId: "haengjeongsa" },
  { slug: "semusa", label: "세무사", home: "/semusa", trackId: "semusa" },
  { slug: "sanan", label: "산업안전지도사", home: "/sanan", trackId: "sanan" },
  { slug: "sonhae", label: "손해평가사", home: "/sonhae", trackId: "sonhae" },
  { slug: "nomusa", label: "공인노무사", home: "/nomusa", trackId: "nomusa" },
  { slug: "gyeongbi", label: "경비지도사", home: "/gyeongbi", trackId: "gyeongbi" },
  { slug: "gamjeong", label: "감정평가사", home: "/gamjeong", trackId: "gamjeong" },
  { slug: "mullyu", label: "물류관리사", home: "/mullyu", trackId: "mullyu" },
].filter((exam) => isPublicExamVisible(exam.slug));

export function getDailyExam(slug: string): DailyExamMeta | null {
  return DAILY_EXAMS.find((exam) => exam.slug === slug) ?? null;
}

export const ANONYMOUS_NICKNAME = "이름 없는 수험생";

export function cleanNickname(raw: string | null | undefined): string {
  const text = String(raw ?? "")
    .replace(/[\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 16);
  if (!text) return ANONYMOUS_NICKNAME;
  if (text.includes("@")) return ANONYMOUS_NICKNAME;
  if (text.replace(/\D/g, "").length >= 8) return ANONYMOUS_NICKNAME;
  return text;
}
