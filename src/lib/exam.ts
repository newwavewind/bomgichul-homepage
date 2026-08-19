import { BROKER_EXAM_SCHEDULE } from "@/lib/constants";
import type { CommunityScope } from "@/types/database";

const KST = "Asia/Seoul";

/** 트랙별 다음 시험일 (D-day 기준). 공고가 바뀌면 여기만 갱신. */
const TRACK_EXAM_SCHEDULE: Record<
  Exclude<CommunityScope, "real_estate">,
  {
    label: string;
    examDate: string;
    registrationStart: string;
    note: string;
    examName: string;
  }
> = {
  public_service: {
    label: "2026년 국가직 9급",
    examDate: "2026-04-04",
    registrationStart: "2026-02-01",
    note: "필기 일정은 인사혁신처·사이버국가고시센터 공고를 확인하세요",
    examName: "공무원 공개경쟁채용시험",
  },
  police: {
    label: "2026년 순경 공채",
    examDate: "2026-09-05",
    registrationStart: "2026-07-01",
    note: "필기 일정은 경찰청·나라일터 공고를 확인하세요",
    examName: "경찰공무원 순경 공개채용",
  },
  housing: {
    label: "2026년 주택관리사보",
    examDate: "2026-07-11",
    registrationStart: "2026-05-01",
    note: "1·2차 일정은 Q-Net 공고를 확인하세요",
    examName: "주택관리사보 자격시험",
  },
  social_worker: {
    label: "2026년 제24회 사회복지사 1급",
    examDate: "2026-01-17",
    registrationStart: "2025-12-01",
    note: "다음 회차 일정은 한국산업인력공단 Q-Net 공고를 확인하세요",
    examName: "사회복지사 1급 국가시험",
  },
  // 국사편찬위원회 공고(historyexam.go.kr) 기준. 한국사는 한 해에 여러 번 치르므로
  // 회차가 지나면 다음 회차 날짜로 직접 갱신해야 한다 — 연 단위로 미는 자동 보정과는 맞지 않는다.
  history: {
    label: "2026년 제80회 한국사능력검정",
    examDate: "2026-10-17",
    registrationStart: "2026-09-15",
    note: "다음 회차 일정은 국사편찬위원회 공고를 확인하세요",
    examName: "한국사능력검정시험",
  },
  // 영어는 9급 공채의 한 과목이라 일정이 public_service 와 같다. 그래도 값을
  // 따로 적어 둔다 — 참조로 묶어 두면 한쪽 일정만 바뀔 때 조용히 어긋난다.
  english: {
    label: "2026년 국가직 9급",
    examDate: "2026-04-04",
    registrationStart: "2026-02-01",
    note: "필기 일정은 인사혁신처·사이버국가고시센터 공고를 확인하세요",
    examName: "공무원 공개경쟁채용시험",
  },
};

/** KST 기준 YYYY-MM-DD */
export function getKSTDateString(date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: KST });
}

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addYearsToIsoDate(iso: string, years: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y + years}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** 지난 시험일이면 같은 월·일로 다음 회차(연도)까지 밀어 올린다 */
export function bumpExamDateToUpcoming(
  examDate: string,
  fromDate = getKSTDateString(),
): string {
  let next = examDate;
  // 안전장치: 최대 10년
  for (let i = 0; i < 10 && next < fromDate; i += 1) {
    next = addYearsToIsoDate(next, 1);
  }
  return next;
}

/** 시험일까지 남은 일수 (시험 당일 = 0, 이후 = 음수) */
export function getDaysUntilExam(examDate: string, fromDate = getKSTDateString()): number {
  const exam = parseDateOnly(examDate);
  const today = parseDateOnly(fromDate);
  const diffMs = exam.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDDay(days: number): string {
  if (days > 0) return `D-${days}`;
  if (days === 0) return "D-Day";
  return `D+${Math.abs(days)}`;
}

/** 남은 일수용 라벨 — 카운트다운 UI에서는 항상 D- / D-Day만 쓴다 */
export function formatCountdownLabel(days: number): string {
  if (days > 0) return `D-${days}`;
  return "D-Day";
}

export function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[new Date(y, m - 1, d).getDay()];
  return `${y}년 ${m}월 ${d}일 (${weekday})`;
}

export function getNextBrokerExam(fromDate = getKSTDateString()) {
  const upcoming = BROKER_EXAM_SCHEDULE.filter((exam) => exam.examDate >= fromDate);
  if (upcoming.length > 0) return upcoming[0];

  const last = BROKER_EXAM_SCHEDULE[BROKER_EXAM_SCHEDULE.length - 1];
  const examDate = bumpExamDateToUpcoming(last.examDate, fromDate);
  const year = Number(examDate.slice(0, 4));
  const yearsAhead = year - last.year;
  return {
    ...last,
    year,
    round: last.round + yearsAhead,
    label: `${year}년 제${last.round + yearsAhead}회`,
    examDate,
    registrationStart: bumpExamDateToUpcoming(last.registrationStart, fromDate),
    registrationEnd: bumpExamDateToUpcoming(last.registrationEnd, fromDate),
    resultDate: bumpExamDateToUpcoming(last.resultDate, fromDate),
  };
}

export function getExamCountdown(fromDate = getKSTDateString()) {
  const exam = getNextBrokerExam(fromDate);
  const days = Math.max(0, getDaysUntilExam(exam.examDate, fromDate));
  return {
    exam,
    days,
    label: formatCountdownLabel(days),
    formattedDate: formatKoreanDate(exam.examDate),
    examName: "공인중개사 자격시험",
  };
}

export function getExamCountdownForScope(
  scope: CommunityScope = "real_estate",
  fromDate = getKSTDateString(),
) {
  if (scope === "real_estate") {
    return getExamCountdown(fromDate);
  }
  const base = TRACK_EXAM_SCHEDULE[scope];
  const examDate = bumpExamDateToUpcoming(base.examDate, fromDate);
  const year = Number(examDate.slice(0, 4));
  const registrationStart = bumpExamDateToUpcoming(base.registrationStart, fromDate);
  const days = Math.max(0, getDaysUntilExam(examDate, fromDate));
  return {
    exam: {
      ...base,
      label: base.label.replace(/^\d{4}년/, `${year}년`),
      examDate,
      registrationStart,
      year,
      round: 0,
      registrationEnd: registrationStart,
      resultDate: examDate,
    },
    days,
    label: formatCountdownLabel(days),
    formattedDate: formatKoreanDate(examDate),
    examName: base.examName,
  };
}

/** diary_date + days_until_exam → 시험 연도 */
export function getExamYearFromDiary(
  diaryDate: string,
  daysUntilExam: number
): number {
  const [y, m, d] = diaryDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + daysUntilExam);
  return date.getFullYear();
}

/** D-day 탐색 범위 (시험 전 1년 ~ 시험 후 30일) */
export const DDAY_MIN = -30;
export const DDAY_MAX = 365;

export function clampDDay(days: number): number {
  return Math.min(DDAY_MAX, Math.max(DDAY_MIN, days));
}
