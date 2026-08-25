/**
 * 메인 시험달력용 일정.
 * 수치는 각 시험 intro의 공식 공고 대조분과 맞춘다. 추측·미확인 일정은 넣지 않는다.
 */

export type ExamCalendarKind = "exam" | "registration" | "result" | "other";

export type ExamCalendarEvent = {
  id: string;
  /** 시작일 YYYY-MM-DD */
  date: string;
  /** 종료일(포함). 없으면 당일만 */
  endDate?: string;
  examKey:
    | "public-service"
    | "real-estate"
    | "police"
    | "housing"
    | "social-worker"
    | "history"
    | "english";
  examLabel: string;
  kind: ExamCalendarKind;
  title: string;
  detail: string;
  href: string;
};

const KIND_LABEL: Record<ExamCalendarKind, string> = {
  exam: "시험",
  registration: "원서 접수",
  result: "발표",
  other: "일정",
};

export function examCalendarKindLabel(kind: ExamCalendarKind): string {
  return KIND_LABEL[kind];
}

/** 시험별 점 색 (카드 accent와 맞춤) */
export const EXAM_CALENDAR_COLORS: Record<ExamCalendarEvent["examKey"], string> = {
  "public-service": "#2563eb",
  "real-estate": "#087f6d",
  police: "#4f46e5",
  housing: "#c2410c",
  "social-worker": "#db2777",
  history: "#65a30d",
  english: "#7c3aed",
};

/** 범례·표시용 정식 이름 (달과 무관하게 항상 전부 노출) */
export const EXAM_CALENDAR_LABELS: Record<ExamCalendarEvent["examKey"], string> = {
  "public-service": "공무원",
  "real-estate": "공인중개사",
  police: "경찰공무원",
  housing: "주택관리사보",
  "social-worker": "사회복지사1급",
  english: "공무원 영어",
  history: "한국사능력검정시험",
};

export const EXAM_CALENDAR_ORDER: ExamCalendarEvent["examKey"][] = [
  "public-service",
  "real-estate",
  "police",
  "housing",
  "social-worker",
  "english",
  "history",
];

/**
 * 2026년 공식 공고 기준 일정 (홈페이지 시험달력).
 * 기간형은 start~end 포함.
 */
export const EXAM_CALENDAR_EVENTS: ExamCalendarEvent[] = [
  // —— 공무원·영어 (국가직 9급 2026) ——
  {
    id: "ps-reg-2026",
    date: "2026-02-02",
    endDate: "2026-02-06",
    examKey: "public-service",
    examLabel: "공무원",
    kind: "registration",
    title: "국가직 9급 원서 접수",
    detail: "09:00～21:00 · 국가공무원채용시스템(gongmuwon.gosi.kr)",
    href: "/public-service/intro",
  },
  {
    id: "ps-exam-2026",
    date: "2026-04-04",
    examKey: "public-service",
    examLabel: "공무원",
    kind: "exam",
    title: "국가직 9급 필기시험",
    detail: "10:00～11:50 (110분) · 영어 과목 포함",
    href: "/public-service/intro",
  },
  {
    id: "en-exam-2026",
    date: "2026-04-04",
    examKey: "english",
    examLabel: "공무원 영어",
    kind: "exam",
    title: "국가직 9급 필기 (영어 포함)",
    detail: "영어만 따로 보지 않음 · 9급 필기 일정과 동일",
    href: "/english/intro",
  },
  {
    id: "ps-result-2026",
    date: "2026-05-08",
    examKey: "public-service",
    examLabel: "공무원",
    kind: "result",
    title: "국가직 9급 필기 합격 발표",
    detail: "인사혁신처 공고 기준",
    href: "/public-service/intro",
  },
  {
    id: "ps-interview-2026",
    date: "2026-05-28",
    endDate: "2026-06-02",
    examKey: "public-service",
    examLabel: "공무원",
    kind: "other",
    title: "국가직 9급 면접시험",
    detail: "면접 합격 발표 2026년 6월 19일",
    href: "/public-service/intro",
  },
  {
    id: "ps-final-2026",
    date: "2026-06-19",
    examKey: "public-service",
    examLabel: "공무원",
    kind: "result",
    title: "국가직 9급 면접 합격 발표",
    detail: "최종 전형 결과",
    href: "/public-service/intro",
  },

  // —— 공인중개사 제37회 ——
  {
    id: "re-reg-37",
    date: "2026-08-03",
    endDate: "2026-08-07",
    examKey: "real-estate",
    examLabel: "공인중개사",
    kind: "registration",
    title: "제37회 정기 원서 접수",
    detail: "09:00～18:00 · Q-Net 공인중개사",
    href: "/real-estate/intro",
  },
  {
    id: "re-empty-37",
    date: "2026-10-01",
    endDate: "2026-10-02",
    examKey: "real-estate",
    examLabel: "공인중개사",
    kind: "registration",
    title: "제37회 빈자리 원서 접수",
    detail: "09:00～18:00 · 선착순·조기마감 가능",
    href: "/real-estate/intro",
  },
  {
    id: "re-exam-37",
    date: "2026-10-31",
    examKey: "real-estate",
    examLabel: "공인중개사",
    kind: "exam",
    title: "제37회 1·2차 시험",
    detail: "1차 09:30～11:10 · 2차 13:00～14:40 · 15:30～16:20",
    href: "/real-estate/intro",
  },
  {
    id: "re-result-37",
    date: "2026-12-02",
    examKey: "real-estate",
    examLabel: "공인중개사",
    kind: "result",
    title: "제37회 합격자 발표",
    detail: "Q-Net · 카카오 알림톡(신청자)",
    href: "/real-estate/intro",
  },

  // —— 경찰 제2차 순경 ——
  {
    id: "po-reg-2",
    date: "2026-07-10",
    endDate: "2026-07-20",
    examKey: "police",
    examLabel: "경찰공무원",
    kind: "registration",
    title: "제2차 순경 공채 원서 접수",
    detail: "～18:00 · 경찰청 인터넷 원서접수",
    href: "/police/intro",
  },
  {
    id: "po-exam-2",
    date: "2026-08-22",
    examKey: "police",
    examLabel: "경찰공무원",
    kind: "exam",
    title: "제2차 순경 필기시험",
    detail: "10:00～11:40 · 헌법·형사법·경찰학",
    href: "/police/intro",
  },
  {
    id: "po-result-2",
    date: "2026-08-28",
    examKey: "police",
    examLabel: "경찰공무원",
    kind: "result",
    title: "제2차 필기 합격 발표",
    detail: "17:00",
    href: "/police/intro",
  },
  {
    id: "po-physical-2",
    date: "2026-09-07",
    endDate: "2026-10-23",
    examKey: "police",
    examLabel: "경찰공무원",
    kind: "other",
    title: "신체·체력검사",
    detail: "시·도경찰청별 진행 · 중앙경찰학교 공고 제2026-11호",
    href: "/police/intro",
  },
  {
    id: "po-aptitude-2",
    date: "2026-10-24",
    examKey: "police",
    examLabel: "경찰공무원",
    kind: "other",
    title: "종합적성검사",
    detail: "인성 250문항 · 적성 30문항",
    href: "/police/intro",
  },
  {
    id: "po-interview-2",
    date: "2026-11-09",
    endDate: "2026-12-08",
    examKey: "police",
    examLabel: "경찰공무원",
    kind: "other",
    title: "면접시험",
    detail: "11.9.～12.8.",
    href: "/police/intro",
  },
  {
    id: "po-final-2",
    date: "2026-12-11",
    examKey: "police",
    examLabel: "경찰공무원",
    kind: "result",
    title: "제2차 최종합격 발표",
    detail: "17:00",
    href: "/police/intro",
  },

  // —— 주택관리사보 제29회 ——
  {
    id: "ho-reg1-29",
    date: "2026-05-11",
    endDate: "2026-05-15",
    examKey: "housing",
    examLabel: "주택관리사보",
    kind: "registration",
    title: "제29회 1차 정기 원서",
    detail: "09:00～18:00 · Q-Net 주택관리사보",
    href: "/housing/intro",
  },
  {
    id: "ho-exam1-29",
    date: "2026-06-27",
    examKey: "housing",
    examLabel: "주택관리사보",
    kind: "exam",
    title: "제29회 1차 시험",
    detail: "회계원리·시설개론·민법",
    href: "/housing/intro",
  },
  {
    id: "ho-result1-29",
    date: "2026-07-29",
    examKey: "housing",
    examLabel: "주택관리사보",
    kind: "result",
    title: "제29회 1차 합격 발표",
    detail: "09:00 · Q-Net",
    href: "/housing/intro",
  },
  {
    id: "ho-reg2-29",
    date: "2026-08-10",
    endDate: "2026-08-14",
    examKey: "housing",
    examLabel: "주택관리사보",
    kind: "registration",
    title: "제29회 2차 정기 원서",
    detail: "09:00～18:00 · Q-Net",
    href: "/housing/intro",
  },
  {
    id: "ho-empty2-29",
    date: "2026-09-10",
    endDate: "2026-09-11",
    examKey: "housing",
    examLabel: "주택관리사보",
    kind: "registration",
    title: "제29회 2차 빈자리 접수",
    detail: "09:00～18:00",
    href: "/housing/intro",
  },
  {
    id: "ho-exam2-29",
    date: "2026-09-19",
    examKey: "housing",
    examLabel: "주택관리사보",
    kind: "exam",
    title: "제29회 2차 시험",
    detail: "주택관리관계법규·공동주택관리실무",
    href: "/housing/intro",
  },
  {
    id: "ho-result2-29",
    date: "2026-12-02",
    examKey: "housing",
    examLabel: "주택관리사보",
    kind: "result",
    title: "제29회 2차 합격 발표",
    detail: "09:00 · Q-Net",
    href: "/housing/intro",
  },

  // —— 사회복지사 제24회 ——
  {
    id: "sw-reg-24",
    date: "2025-12-08",
    endDate: "2025-12-12",
    examKey: "social-worker",
    examLabel: "사회복지사1급",
    kind: "registration",
    title: "제24회 정기 원서 접수",
    detail: "09:00～18:00 · Q-Net",
    href: "/social-worker/intro",
  },
  {
    id: "sw-exam-24",
    date: "2026-01-17",
    examKey: "social-worker",
    examLabel: "사회복지사1급",
    kind: "exam",
    title: "제24회 필기시험",
    detail: "3교시 · 8영역 · 200문항",
    href: "/social-worker/intro",
  },
  {
    id: "sw-result-24",
    date: "2026-02-19",
    examKey: "social-worker",
    examLabel: "사회복지사1급",
    kind: "result",
    title: "제24회 합격예정자 발표",
    detail: "이후 협회 서류심사 · 최종합격 3월 25일",
    href: "/social-worker/intro",
  },
  {
    id: "sw-final-24",
    date: "2026-03-25",
    examKey: "social-worker",
    examLabel: "사회복지사1급",
    kind: "result",
    title: "제24회 최종합격 발표",
    detail: "응시자격 서류심사 후",
    href: "/social-worker/intro",
  },

  // —— 한국사능력검정 2026 ——
  {
    id: "hi-reg-77",
    date: "2026-01-06",
    endDate: "2026-01-13",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "registration",
    title: "제77회 정기 원서",
    detail: "10:00～17:00 · historyexam.go.kr",
    href: "/history/intro",
  },
  {
    id: "hi-exam-77",
    date: "2026-02-07",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "exam",
    title: "제77회 시험",
    detail: "기본·심화",
    href: "/history/intro",
  },
  {
    id: "hi-result-77",
    date: "2026-02-20",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "result",
    title: "제77회 결과 발표",
    detail: "10:00",
    href: "/history/intro",
  },
  {
    id: "hi-reg-78",
    date: "2026-04-21",
    endDate: "2026-04-28",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "registration",
    title: "제78회 정기 원서",
    detail: "10:00～17:00 · 심화만 시행",
    href: "/history/intro",
  },
  {
    id: "hi-exam-78",
    date: "2026-05-23",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "exam",
    title: "제78회 시험 (심화)",
    detail: "심화만",
    href: "/history/intro",
  },
  {
    id: "hi-result-78",
    date: "2026-06-05",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "result",
    title: "제78회 결과 발표",
    detail: "10:00",
    href: "/history/intro",
  },
  {
    id: "hi-reg-79",
    date: "2026-07-07",
    endDate: "2026-07-14",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "registration",
    title: "제79회 정기 원서",
    detail: "10:00～17:00",
    href: "/history/intro",
  },
  {
    id: "hi-exam-79",
    date: "2026-08-09",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "exam",
    title: "제79회 시험",
    detail: "일요일 시행 · 기본·심화",
    href: "/history/intro",
  },
  {
    id: "hi-result-79",
    date: "2026-08-21",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "result",
    title: "제79회 결과 발표",
    detail: "10:00",
    href: "/history/intro",
  },
  {
    id: "hi-reg-80",
    date: "2026-09-15",
    endDate: "2026-09-22",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "registration",
    title: "제80회 정기 원서",
    detail: "10:00～17:00 · 심화만",
    href: "/history/intro",
  },
  {
    id: "hi-exam-80",
    date: "2026-10-17",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "exam",
    title: "제80회 시험 (심화)",
    detail: "심화만 · 10:00",
    href: "/history/intro",
  },
  {
    id: "hi-result-80",
    date: "2026-10-30",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "result",
    title: "제80회 결과 발표",
    detail: "10:00",
    href: "/history/intro",
  },
  {
    id: "hi-reg-81",
    date: "2026-11-03",
    endDate: "2026-11-10",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "registration",
    title: "제81회 정기 원서",
    detail: "10:00～17:00 · 심화만",
    href: "/history/intro",
  },
  {
    id: "hi-exam-81",
    date: "2026-11-28",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "exam",
    title: "제81회 시험 (심화)",
    detail: "심화만",
    href: "/history/intro",
  },
  {
    id: "hi-result-81",
    date: "2026-12-11",
    examKey: "history",
    examLabel: "한국사능력검정시험",
    kind: "result",
    title: "제81회 결과 발표",
    detail: "10:00",
    href: "/history/intro",
  },
];

function parseIso(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function eventCoversDate(event: ExamCalendarEvent, isoDate: string): boolean {
  const day = parseIso(isoDate);
  const start = parseIso(event.date);
  const end = parseIso(event.endDate ?? event.date);
  return day >= start && day <= end;
}

export function eventsOnDate(isoDate: string): ExamCalendarEvent[] {
  return EXAM_CALENDAR_EVENTS.filter((event) => eventCoversDate(event, isoDate));
}

export function eventsInMonth(year: number, monthIndex0: number): ExamCalendarEvent[] {
  const prefix = `${year}-${String(monthIndex0 + 1).padStart(2, "0")}`;
  return EXAM_CALENDAR_EVENTS.filter((event) => {
    const start = event.date;
    const end = event.endDate ?? event.date;
    // overlaps month: start <= monthEnd && end >= monthStart
    const monthStart = `${prefix}-01`;
    const lastDay = new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
    const monthEnd = `${prefix}-${String(lastDay).padStart(2, "0")}`;
    return start <= monthEnd && end >= monthStart;
  });
}

export function toIsoDate(year: number, monthIndex0: number, day: number): string {
  return `${year}-${String(monthIndex0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getKstTodayIso(date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}
