import { examRenderKind } from "./exam-render";

/**
 * 시험 허브에 싣는 「기출 한눈에」 숫자 — 모두 실제 기출 데이터에서 센다(2026-10-20).
 *
 * 애드센스가 허브를 「콘텐츠 부족」으로 봤다(/sanan 본문 약 690자, 대부분 단추). 허브마다 손으로
 * 쓴 글을 붙이면 사실과 어긋날 위험이 있어, 그 시험의 기출을 직접 세어 고유한 본문을 만든다:
 * 수록 범위, 과목별 자주 나오는 단원, 최근 회차 바로가기.
 *
 * 데이터 모듈은 시험마다 따로라 필요한 시험 것만 불러온다(다른 시험 기출을 함께 싣지 않게).
 * 키는 시험 트랙 id, 그리고 트랙 밖의 두 허브 「public_service」·「real_estate」.
 */
type HubExam = { year: number; sourceCode: string; category?: string };
type HubSubjectSource = { id: string; label: string; exams: HubExam[] };
type RenderableExam = NonNullable<Parameters<typeof examRenderKind>[0]> & HubExam;
type Loader = () => Promise<HubSubjectSource[]>;

/** 시험 트랙 모양(과목 id 목록 + 과목 조회) — 그릴 수 있는 문항만 센다 */
function fromTrack(
  ids: string[],
  get: (id: string) => { subject: { label: string }; exams: RenderableExam[] } | null,
): HubSubjectSource[] {
  return ids.flatMap((id) => {
    const data = get(id);
    if (!data) return [];
    return [{ id, label: data.subject.label, exams: data.exams.filter((exam) => examRenderKind(exam)) }];
  });
}

const LOADERS: Record<string, Loader> = {
  police: async () => { const m = await import("@/lib/police-content"); return fromTrack(m.POLICE_SUBJECT_IDS, m.getPoliceSubject); },
  firefighter: async () => { const m = await import("@/lib/firefighter-content"); return fromTrack(m.FIREFIGHTER_SUBJECT_IDS, m.getFirefighterSubject); },
  housing: async () => { const m = await import("@/lib/housing-content"); return fromTrack(m.HOUSING_SUBJECT_IDS, m.getHousingSubject); },
  social_worker: async () => { const m = await import("@/lib/social-worker-content"); return fromTrack(m.SOCIAL_WORKER_SUBJECT_IDS, m.getSocialWorkerSubject); },
  history: async () => { const m = await import("@/lib/history-content"); return fromTrack(m.HISTORY_SUBJECT_IDS, m.getHistorySubject); },
  english: async () => { const m = await import("@/lib/english-content"); return fromTrack(m.ENGLISH_SUBJECT_IDS, m.getEnglishSubject); },
  gugeo: async () => { const m = await import("@/lib/gugeo-content"); return fromTrack(m.GUGEO_SUBJECT_IDS, m.getGugeoSubject); },
  haengjeongsa: async () => { const m = await import("@/lib/haengjeongsa-content"); return fromTrack(m.HAENGJEONGSA_SUBJECT_IDS, m.getHaengjeongsaSubject); },
  semusa: async () => { const m = await import("@/lib/semusa-content"); return fromTrack(m.SEMUSA_SUBJECT_IDS, m.getSemusaSubject); },
  sanan: async () => { const m = await import("@/lib/sanan-content"); return fromTrack(m.SANAN_SUBJECT_IDS, m.getSananSubject); },
  sonhae: async () => { const m = await import("@/lib/sonhae-content"); return fromTrack(m.SONHAE_SUBJECT_IDS, m.getSonhaeSubject); },
  nomusa: async () => { const m = await import("@/lib/nomusa-content"); return fromTrack(m.NOMUSA_SUBJECT_IDS, m.getNomusaSubject); },
  gyeongbi: async () => { const m = await import("@/lib/gyeongbi-content"); return fromTrack(m.GYEONGBI_SUBJECT_IDS, m.getGyeongbiSubject); },
  gamjeong: async () => { const m = await import("@/lib/gamjeong-content"); return fromTrack(m.GAMJEONG_SUBJECT_IDS, m.getGamjeongSubject); },
  mullyu: async () => { const m = await import("@/lib/mullyu-content"); return fromTrack(m.MULLYU_SUBJECT_IDS, m.getMullyuSubject); },
  // 청소년상담사는 과목 이름에 급수가 없어(1·2·3급에 「집단상담」 등이 겹친다) id 의 g1_·g2_·g3_ 에서 붙인다.
  youth: async () => {
    const m = await import("@/lib/youth-content");
    return fromTrack(m.YOUTH_SUBJECT_IDS, m.getYouthSubject).map((subject) => {
      const grade = /^g(\d)_/.exec(subject.id)?.[1];
      return grade ? { ...subject, label: `${grade}급 ${subject.label}` } : subject;
    });
  },
  public_service: async () => { const m = await import("@/lib/public-service-content"); return fromTrack(m.PUBLIC_SERVICE_SUBJECT_IDS, m.getPublicServiceSubject); },
  // 공인중개사는 트랙 이전의 옛 구조 — 회차가 「연도」 하나라 sourceCode 자리에 회차 번호를 둔다.
  real_estate: async () => {
    const [{ getExamQuestionsForSubject }, { EXAM_SUBJECTS }] = await Promise.all([
      import("@/lib/exam-questions"),
      import("@/lib/constants"),
    ]);
    return EXAM_SUBJECTS.map((subject) => ({
      id: subject.value,
      label: subject.label,
      exams: getExamQuestionsForSubject(subject.value).map((q) => ({
        year: q.year,
        sourceCode: `제${q.round}회`,
        category: q.category,
      })),
    }));
  },
};

export type HubSubjectStats = {
  id: string;
  label: string;
  questionCount: number;
  topUnits: { label: string; count: number; share: number }[];
  latest: { year: number; sourceCode: string; count: number } | null;
};

export type HubStats = {
  questionCount: number;
  sessionCount: number;
  firstYear: number;
  lastYear: number;
  subjects: HubSubjectStats[];
};

export async function buildHubStats(id: string): Promise<HubStats | null> {
  const load = LOADERS[id];
  if (!load) return null;
  const sources = await load();
  const subjects: HubSubjectStats[] = [];
  const years: number[] = [];
  const sessions = new Set<string>();
  let questionCount = 0;
  for (const { id: subjectId, label, exams } of sources) {
    if (!exams.length) continue;
    questionCount += exams.length;
    const units = new Map<string, number>();
    const bySession = new Map<string, { year: number; sourceCode: string; count: number }>();
    for (const exam of exams) {
      years.push(exam.year);
      sessions.add(`${subjectId}:${exam.year}:${exam.sourceCode}`);
      const unit = exam.category?.trim();
      if (unit) units.set(unit, (units.get(unit) ?? 0) + 1);
      const key = `${exam.year}:${exam.sourceCode}`;
      const s = bySession.get(key) ?? { year: exam.year, sourceCode: exam.sourceCode, count: 0 };
      s.count += 1;
      bySession.set(key, s);
    }
    const labelled = [...units.values()].reduce((a, b) => a + b, 0);
    const latest = [...bySession.values()].sort((a, b) => b.year - a.year || a.sourceCode.localeCompare(b.sourceCode, "ko"))[0] ?? null;
    subjects.push({
      id: subjectId,
      label,
      questionCount: exams.length,
      topUnits: [...units.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([unitLabel, count]) => ({ label: unitLabel, count, share: labelled ? Math.round((count / labelled) * 100) : 0 })),
      latest,
    });
  }
  if (!subjects.length) return null;
  return {
    questionCount,
    sessionCount: sessions.size,
    firstYear: Math.min(...years),
    lastYear: Math.max(...years),
    subjects,
  };
}
