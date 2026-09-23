/** 채팅 공유 타입·헬퍼 (chat-16 + next-15) */

export type ChatMessageKind =
  | "text"
  | "exam_card"
  | "wrong_share"
  | "timer"
  | "poll"
  | "voice"
  | "system"
  | "mock_invite"
  | "checkin"
  | "schedule_share"
  | "reminder"
  | "mock_result"
  | "note_card"
  | "live_session";

export type ExamCardPayload = {
  examId: string;
  /** route slug e.g. civillaw */
  subject?: string;
  subjectLabel?: string;
  year?: number | string;
  questionNo?: number | string;
  stem: string;
  label?: string;
  href?: string;
  /** Quote (#2): commentary + nested source card */
  quoted?: boolean;
  quoteOfId?: string;
  quoteComment?: string;
  quotedExam?: ExamCardPayload;
};

export type WrongSharePayload = {
  examId: string;
  subject?: string;
  subjectLabel?: string;
  year?: number | string;
  questionNo?: number | string;
  stem: string;
  myPick?: string;
  correctLabel?: string;
  href?: string;
  items?: Array<{
    examId: string;
    subject?: string;
    year?: number | string;
    questionNo?: number | string;
    stem: string;
    href?: string;
  }>;
};

export type TimerPayload = {
  minutes: number;
  label?: string;
  endsAt: string;
  ended?: boolean;
};

export type PollPayload = {
  question: string;
  options: Array<{ key: string; label: string }>;
  eventId?: string;
  dueAt?: string;
  closed?: boolean;
  tallies?: Record<string, number>;
  myVote?: string;
  /** Quiz mode: correct option key, revealed when closed (or on vote if revealMode=on_vote) */
  correctKey?: string;
  revealMode?: "on_close" | "on_vote";
  isQuiz?: boolean;
};

export type MockInvitePayload = {
  subject: string;
  subjectLabel?: string;
  year: number | string;
  href: string;
  label?: string;
};

export type MockResultPayload = {
  subject: string;
  subjectLabel?: string;
  year: number | string;
  total: number;
  correct: number;
  elapsedSec?: number;
  href?: string;
};

export type CheckinPayload = {
  streak?: number;
  day?: string;
};

export type ScheduleSharePayload = {
  title: string;
  dueAt: string;
  place?: string;
  note?: string;
  eventId?: string;
};

export type ReminderPayload = {
  kind: "dday" | "weekly" | "goal";
  title: string;
  body?: string;
  dday?: string | null;
  reminderKey?: string;
  eventId?: string;
};

export type NoteCardPayload = {
  title: string;
  body: string;
  subject?: string;
  subjectLabel?: string;
  sourceHref?: string;
  collapsedByDefault?: boolean;
};

export type LiveSessionPayload = {
  title: string;
  subject?: string;
  subjectLabel?: string;
  endsAt: string;
  hostId?: string;
  hostNickname?: string;
  status?: "live" | "ended";
  minutes?: number;
};

/** Chat community homes → topic_key clusters (UI grouping) */
export const COMMUNITY_HOME_GROUPS = [
  {
    scope: "real_estate" as const,
    label: "공인중개사",
    blurb: "민법·중개사법·부동산",
    topicKeys: [
      "civil-law",
      "broker-law",
      "channel-civil-law",
      "channel-realestate",
      "official",
    ],
  },
  {
    scope: "public_service" as const,
    label: "공무원",
    blurb: "행정법 스터디",
    topicKeys: ["admin-law", "channel-admin-law"],
  },
  {
    scope: "police" as const,
    label: "경찰",
    blurb: "경찰학 1·2차",
    topicKeys: ["police"],
  },
  {
    scope: "firefighter" as const,
    label: "소방",
    blurb: "소방학·관계법규·행정법",
    topicKeys: ["firefighter"],
  },
  {
    scope: "english" as const,
    label: "영어",
    blurb: "문법·독해",
    topicKeys: ["english"],
  },
  {
    scope: "history" as const,
    label: "한국사",
    blurb: "시대별 정리",
    topicKeys: ["history"],
  },
] as const;

/** 학습 스티커 (인스타형 리액션 팩) */
export const STUDY_STICKERS = [
  { emoji: "⭕", label: "맞음" },
  { emoji: "❌", label: "틀림" },
  { emoji: "⚠️", label: "함정" },
  { emoji: "📌", label: "암기" },
  { emoji: "💡", label: "이해" },
  { emoji: "🔄", label: "복습" },
] as const;

export const SOCIAL_REACTIONS = ["👍", "❤️", "😂", "🔥", "👏", "😮"] as const;

export const ALL_CHAT_REACTIONS = [
  ...STUDY_STICKERS.map((s) => s.emoji),
  ...SOCIAL_REACTIONS,
] as const;

export function stickerLabel(emoji: string): string | null {
  return STUDY_STICKERS.find((s) => s.emoji === emoji)?.label ?? null;
}

export const TOPIC_TEASERS = [
  { key: "official", label: "공식 공지", blurb: "운영 공지·업데이트" },
  { key: "civil-law", label: "민법", blurb: "조문·판례 질문 바로" },
  { key: "broker-law", label: "공인중개사법", blurb: "중개실무 같이 풀기" },
  { key: "admin-law", label: "행정법", blurb: "국가직·지방직" },
  { key: "police", label: "경찰학", blurb: "1차·2차 스터디" },
  { key: "firefighter", label: "소방학", blurb: "소방학·관계법규·행정법" },
  { key: "english", label: "영어", blurb: "문법·독해" },
  { key: "history", label: "한국사", blurb: "시대별 정리" },
] as const;

export function examHref(
  subject?: string,
  year?: number | string,
  questionNo?: number | string,
): string | null {
  if (!subject || year == null || questionNo == null) return null;
  // Korean labels are not valid routes
  if (/[가-힣]/.test(subject)) return null;
  return `/exam/${subject}/${year}/${questionNo}`;
}

export function parseMentions(text: string): string[] {
  const found = text.match(/@([^\s@]{1,24})/g) ?? [];
  return [...new Set(found.map((m) => m.slice(1)))];
}

export function extractMentionUserIds(
  text: string,
  members: Array<{ id: string; nickname: string }>,
): string[] {
  const names = new Set(parseMentions(text).map((n) => n.toLowerCase()));
  return members
    .filter((m) => names.has(m.nickname.toLowerCase()))
    .map((m) => m.id);
}

export function messageMatchesKeywords(
  content: string,
  keywords: string[],
): boolean {
  if (!keywords.length) return false;
  const lower = content.toLowerCase();
  return keywords.some((k) => k && lower.includes(k.toLowerCase()));
}

export function formatGoalBadge(done: number, goal: number): string {
  const g = Math.max(0, goal || 40);
  const d = Math.max(0, done || 0);
  return `오늘 ${d}/${g}`;
}

export function formatStreakBadge(streak: number): string {
  return streak > 0 ? `${streak}일 연속` : "인증 시작";
}

/** Tokenize message text for @mentions, #hashtags, and ||spoilers|| */
export type ChatTextPart =
  | { type: "text"; value: string }
  | { type: "mention"; value: string }
  | { type: "hashtag"; value: string }
  | { type: "spoiler"; value: string };

export function tokenizeChatText(content: string): ChatTextPart[] {
  const parts: ChatTextPart[] = [];
  const re =
    /(\|\|[\s\S]+?\|\||@[^\s@]{1,24}|#[\w가-힣]{1,40})/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content))) {
    if (match.index > last) {
      parts.push({ type: "text", value: content.slice(last, match.index) });
    }
    const token = match[0];
    if (token.startsWith("||") && token.endsWith("||") && token.length > 4) {
      parts.push({ type: "spoiler", value: token.slice(2, -2) });
    } else if (token.startsWith("@")) {
      parts.push({ type: "mention", value: token });
    } else if (token.startsWith("#")) {
      parts.push({ type: "hashtag", value: token });
    } else {
      parts.push({ type: "text", value: token });
    }
    last = match.index + token.length;
  }
  if (last < content.length) {
    parts.push({ type: "text", value: content.slice(last) });
  }
  return parts.length ? parts : [{ type: "text", value: content }];
}

export function parseGichulInlineQuery(draft: string): string | null {
  const m = draft.match(/^@기출(?:\s+|$)(.*)$/u);
  if (!m) return null;
  return (m[1] ?? "").trim();
}
