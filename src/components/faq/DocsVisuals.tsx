/** FAQ docs용 화면 미리보기 일러스트 — 실제 UI 톤을 단순화한 SVG/마크업 */

import type { CommunityScope } from "@/types/database";

type VisualScope = CommunityScope;

const HUB_COPY: Record<
  VisualScope,
  { allInOne: string[]; exam: string[] }
> = {
  real_estate: {
    allInOne: ["민법", "부동산학개론", "공인중개사법", "부동산공법"],
    exam: ["민법", "부동산세법"],
  },
  public_service: {
    allInOne: ["행정학개론", "행정법총론", "형법", "세법개론"],
    exam: ["행정학개론", "행정법총론"],
  },
  police: {
    allInOne: ["헌법", "형사법", "경찰학"],
    exam: ["헌법", "형사법"],
  },
  housing: {
    allInOne: ["회계원리", "민법", "주택관리관계법규", "공동주택관리실무"],
    exam: ["회계원리", "민법"],
  },
  social_worker: {
    allInOne: ["인간행동과 사회환경", "사회복지조사론", "사회복지실천론", "사회복지정책론"],
    exam: ["인간행동과 사회환경", "사회복지조사론"],
  },
};

const CONCEPT_COPY: Record<
  VisualScope,
  { crumb: string; title: string }
> = {
  real_estate: { crumb: "민법 · 권리의 변동", title: "권리취득의 유형" },
  public_service: { crumb: "행정학개론 · 조직론", title: "관료제의 특징" },
  police: { crumb: "경찰 · 헌법 · 기본권", title: "기본권의 제한" },
  housing: { crumb: "회계원리 · 재무제표", title: "대차대조표의 구조" },
  social_worker: { crumb: "인간행동 · 발달", title: "인간발달의 원리" },
};

const EXAM_COPY: Record<
  VisualScope,
  { subject: string; stem: string }
> = {
  real_estate: {
    subject: "민법",
    stem: "다음 중 권리의 변동에 관한 설명으로 옳은 것은?",
  },
  public_service: {
    subject: "행정학개론",
    stem: "다음 중 관료제에 관한 설명으로 옳은 것은?",
  },
  police: {
    subject: "헌법",
    stem: "다음 중 기본권의 제한에 관한 설명으로 옳은 것은?",
  },
  housing: {
    subject: "회계원리",
    stem: "다음 중 대차대조표에 관한 설명으로 옳은 것은?",
  },
  social_worker: {
    subject: "인간행동과 사회환경",
    stem: "다음 중 인간발달에 관한 설명으로 옳은 것은?",
  },
};

const COMMUNITY_COPY: Record<
  VisualScope,
  { cats: string[]; posts: { title: string; meta: string }[] }
> = {
  real_estate: {
    cats: ["전체", "질문", "자료공유", "법령정보"],
    posts: [
      { title: "취득시효 자주점유 추정이 헷갈려요", meta: "질문 · 댓글 8" },
      { title: "2025 민법 오답 정리 공유합니다", meta: "자료공유 · 다운 42" },
    ],
  },
  public_service: {
    cats: ["전체", "질문", "수험정보", "자유"],
    posts: [
      { title: "행정법 하자 있는 행정행위가 헷갈려요", meta: "질문 · 댓글 5" },
      { title: "2025 행정학 요약 노트 올립니다", meta: "수험정보 · 댓글 12" },
    ],
  },
  police: {
    cats: ["전체", "질문", "수험정보", "자유"],
    posts: [
      { title: "형소법 영장주의 예외가 헷갈려요", meta: "질문 · 댓글 6" },
      { title: "경찰학 조직 파트 정리 공유", meta: "수험정보 · 댓글 9" },
    ],
  },
  housing: {
    cats: ["전체", "질문", "수험정보", "자유"],
    posts: [
      { title: "공동주택관리법 관리주체 구분이 헷갈려요", meta: "질문 · 댓글 4" },
      { title: "시설개론 설비 체크리스트 공유", meta: "수험정보 · 댓글 7" },
    ],
  },
  social_worker: {
    cats: ["전체", "질문", "수험정보", "자유"],
    posts: [
      { title: "발달이론 단계 구분이 헷갈려요", meta: "질문 · 댓글 5" },
      { title: "사회복지법제 핵심 요약 공유", meta: "수험정보 · 댓글 8" },
    ],
  },
};

const ARCHIVE_COPY: Record<
  VisualScope,
  { type: string; name: string; size: string }[]
> = {
  real_estate: [
    { type: "PDF", name: "민법 연도별 기출 모아보기", size: "2.4MB" },
    { type: "노트", name: "공법 용도지역 한눈에", size: "780KB" },
    { type: "요약", name: "세법 취득세 체크리스트", size: "410KB" },
  ],
  public_service: [
    { type: "PDF", name: "행정학 연도별 기출 모아보기", size: "2.1MB" },
    { type: "노트", name: "행정법 총론 요약", size: "640KB" },
    { type: "요약", name: "형법 구성요건 체크", size: "390KB" },
  ],
  police: [
    { type: "PDF", name: "헌법 연도별 기출 모아보기", size: "1.9MB" },
    { type: "노트", name: "형사법 수사 절차 한눈에", size: "720KB" },
    { type: "요약", name: "경찰학 조직·인사 요약", size: "450KB" },
  ],
  housing: [
    { type: "PDF", name: "회계원리 기출 모아보기", size: "2.0MB" },
    { type: "노트", name: "주택관리관계법규 요약", size: "680KB" },
    { type: "요약", name: "시설개론 설비 체크", size: "430KB" },
  ],
  social_worker: [
    { type: "PDF", name: "사회복지사 1급 기출 모아보기", size: "2.3MB" },
    { type: "노트", name: "인간행동 발달이론 요약", size: "690KB" },
    { type: "요약", name: "사회복지법제 체크", size: "440KB" },
  ],
};

const DIARY_COPY: Record<VisualScope, string> = {
  real_estate: "민법 계약해제 정리",
  public_service: "행정법 하자·무효 정리",
  police: "헌법 기본권 제한 정리",
  housing: "회계 분개 연습 정리",
  social_worker: "인간발달 이론 비교 정리",
};

function PhoneFrame({
  children,
  caption,
  tint = "ice",
}: {
  children: React.ReactNode;
  caption: string;
  tint?: "ice" | "lavender" | "snow" | "paper";
}) {
  const bg = {
    ice: "bg-ice",
    lavender: "bg-lavender",
    snow: "bg-snow",
    paper: "bg-paper",
  }[tint];

  return (
    <figure className="mx-auto w-full max-w-sm">
      <div
        className={`overflow-hidden rounded-[1.35rem] border-[1.5px] border-carbon shadow-[var(--shadow-card)] ${bg}`}
      >
        <div className="flex items-center gap-1.5 border-b border-carbon/20 bg-paper/70 px-3 py-2">
          <span className="size-2 rounded-full bg-carbon/25" />
          <span className="size-2 rounded-full bg-carbon/25" />
          <span className="size-2 rounded-full bg-carbon/25" />
          <span className="ml-2 truncate font-display text-[11px] text-smoke">{caption}</span>
        </div>
        <div className="p-3 md:p-4">{children}</div>
      </div>
    </figure>
  );
}

export function StudyHubVisual({ scope = "real_estate" }: { scope?: VisualScope }) {
  const copy = HUB_COPY[scope];
  // 경찰은 과목 3개 — 네 칸이면 헌법이 중복되므로 앞 3개 + 안내 칸
  const allInOne =
    scope === "police"
      ? ["헌법", "형사법", "경찰학"]
      : copy.allInOne;

  return (
    <PhoneFrame caption="학습 홈" tint="snow">
      <div className="space-y-3">
        <div>
          <p className="mb-2 font-display text-[12px] font-semibold text-ink">기출 올인원</p>
          <div className="grid grid-cols-2 gap-2">
            {allInOne.map((label) => (
              <div
                key={label}
                className="rounded-xl border border-carbon/40 bg-lavender px-2.5 py-2.5"
              >
                <span className="inline-block rounded-full border border-carbon/30 bg-paper px-1.5 py-0.5 font-display text-[9px] text-smoke">
                  과목
                </span>
                <p className="mt-1.5 font-display text-[12px] font-semibold text-ink">{label}</p>
              </div>
            ))}
            {scope === "police" && (
              <div className="rounded-xl border border-dashed border-carbon/30 bg-paper px-2.5 py-2.5">
                <p className="font-display text-[11px] font-medium text-smoke">순경 공채 3과목</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 font-display text-[12px] font-semibold text-ink">기출문제</p>
          <div className="grid grid-cols-2 gap-2">
            {copy.exam.map((label) => (
              <div key={label} className="rounded-xl border border-carbon/40 bg-ice px-2.5 py-2.5">
                <p className="font-display text-[12px] font-semibold text-ink">{label}</p>
                <p className="mt-1 font-display text-[10px] text-smoke">연도별 · O/X</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ConceptsVisual({ scope = "real_estate" }: { scope?: VisualScope }) {
  const copy = CONCEPT_COPY[scope];
  return (
    <PhoneFrame caption="기출 올인원 · 개념 상세" tint="lavender">
      <div className="space-y-2.5 rounded-xl border border-carbon/30 bg-paper p-3">
        <p className="font-display text-[11px] text-smoke">{copy.crumb}</p>
        <p className="font-display text-[15px] font-semibold leading-snug text-ink">
          {copy.title}
        </p>
        <div className="space-y-2">
          {["개념 정리", "이해하기", "핵심 포인트", "한눈에 학습맵"].map((label, i) => (
            <div
              key={label}
              className="flex items-start gap-2 rounded-lg border border-mist bg-snow px-2.5 py-2"
            >
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-electric-blue/15 font-display text-[10px] font-bold text-electric-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-[12px] font-semibold text-ink">{label}</p>
                <div className="mt-1 h-1.5 w-24 rounded-full bg-mist" />
                <div className="mt-1 h-1.5 w-16 rounded-full bg-mist/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ExamVisual({ scope = "real_estate" }: { scope?: VisualScope }) {
  const copy = EXAM_COPY[scope];
  return (
    <PhoneFrame caption="기출문제 · 문항" tint="ice">
      <div className="space-y-3 rounded-xl border border-carbon/30 bg-paper p-3">
        <div className="flex items-center justify-between">
          <p className="font-display text-[12px] font-semibold text-ink">2025년 · 12번</p>
          <span className="rounded-full border border-carbon/30 bg-snow px-2 py-0.5 font-display text-[10px] text-smoke">
            {copy.subject}
          </span>
        </div>
        <p className="font-display text-[12px] leading-relaxed text-ink">{copy.stem}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-xl border-2 border-electric-blue bg-electric-blue/10 py-3 font-display text-[16px] font-bold text-electric-blue"
          >
            O
          </button>
          <button
            type="button"
            className="rounded-xl border border-carbon/40 bg-snow py-3 font-display text-[16px] font-bold text-smoke"
          >
            X
          </button>
        </div>
        <div className="rounded-lg border border-mist bg-snow px-2.5 py-2">
          <p className="font-display text-[10px] font-semibold text-electric-blue">해설</p>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-mist" />
          <div className="mt-1 h-1.5 w-3/4 rounded-full bg-mist" />
        </div>
        <div className="flex gap-1.5">
          {["GPT", "Gemini", "Claude"].map((ai) => (
            <span
              key={ai}
              className="rounded-full border border-carbon/30 bg-paper px-2 py-1 font-display text-[10px] text-ink"
            >
              {ai}에 묻기
            </span>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

export function CommunityVisual({ scope = "real_estate" }: { scope?: VisualScope }) {
  const copy = COMMUNITY_COPY[scope];
  return (
    <PhoneFrame caption="커뮤니티" tint="snow">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {copy.cats.map((cat, i) => (
            <span
              key={cat}
              className={`rounded-full border px-2 py-0.5 font-display text-[10px] ${
                i === 1
                  ? "border-carbon bg-carbon text-paper"
                  : "border-carbon/30 bg-paper text-smoke"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
        {copy.posts.map((post) => (
          <div key={post.title} className="rounded-xl border border-carbon/30 bg-paper px-3 py-2.5">
            <p className="font-display text-[12px] font-semibold text-ink">{post.title}</p>
            <p className="mt-1 font-display text-[10px] text-smoke">{post.meta}</p>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

export function ArchiveVisual({ scope = "real_estate" }: { scope?: VisualScope }) {
  const files = ARCHIVE_COPY[scope];
  return (
    <PhoneFrame caption="자료실" tint="paper">
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex items-center gap-2.5 rounded-xl border border-carbon/30 bg-snow px-2.5 py-2.5"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-carbon/40 bg-ice font-display text-[10px] font-bold text-electric-blue">
              {file.type}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[12px] font-semibold text-ink">{file.name}</p>
              <p className="font-display text-[10px] text-smoke">{file.size}</p>
            </div>
            <span className="rounded-md border border-carbon/40 bg-paper px-2 py-1 font-display text-[10px] text-ink">
              받기
            </span>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

export function DiaryVisual({ scope = "real_estate" }: { scope?: VisualScope }) {
  return (
    <PhoneFrame caption="수험일기" tint="lavender">
      <div className="space-y-3">
        <div className="rounded-xl border border-carbon/30 bg-paper px-3 py-2.5 text-center">
          <p className="font-display text-[11px] text-smoke">시험까지</p>
          <p className="font-display text-[22px] font-bold text-ink">D-109</p>
        </div>
        <div className="rounded-xl border border-carbon/30 bg-paper px-3 py-2.5">
          <p className="font-display text-[11px] text-smoke">오늘의 기록</p>
          <p className="mt-1 font-display text-[13px] font-semibold text-ink">
            {DIARY_COPY[scope]}
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-mist" />
          <div className="mt-1 h-1.5 w-2/3 rounded-full bg-mist" />
        </div>
      </div>
    </PhoneFrame>
  );
}

export function NewsVisual() {
  return (
    <PhoneFrame caption="뉴스" tint="ice">
      <div className="space-y-2">
        <div className="flex gap-1.5 overflow-hidden">
          {["7/12", "7/13", "7/14"].map((d, i) => (
            <span
              key={d}
              className={`rounded-lg border px-2.5 py-1.5 font-display text-[11px] ${
                i === 2
                  ? "border-carbon bg-carbon text-paper"
                  : "border-carbon/30 bg-paper text-smoke"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
        {["용도지역 관련 보도", "세법 개정 이슈 요약", "시험일정 안내"].map((title) => (
          <div key={title} className="rounded-xl border border-carbon/30 bg-paper px-3 py-2.5">
            <p className="font-display text-[12px] font-semibold text-ink">{title}</p>
            <div className="mt-1.5 h-1.5 w-[80%] rounded-full bg-mist" />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

export function PremiumVisual() {
  return (
    <PhoneFrame caption="이용 범위" tint="snow">
      <div className="space-y-3">
        <div className="rounded-xl border border-carbon/40 bg-paper p-3">
          <p className="font-display text-[11px] font-semibold text-smoke">홈페이지 — 전부 무료</p>
          <ul className="mt-2 space-y-1.5 font-display text-[11px] text-ink">
            <li>· 6과목 기출 전 연도 해설</li>
            <li>· 기출 올인원 개념</li>
            <li>· 랜덤 · 오답 · 복습 · 시험 모드</li>
            <li>· 북마크 · 복습 PDF</li>
          </ul>
        </div>
        <div className="rounded-xl border border-carbon bg-carbon p-3 text-paper">
          <p className="font-display text-[11px] font-semibold opacity-80">유료</p>
          <p className="mt-2 rounded-lg border border-paper/20 bg-paper/10 px-2 py-2 text-center font-display text-[12px]">
            PC앱 · 모바일 앱
          </p>
          <p className="mt-2 font-display text-[10px] opacity-80">
            과목별로 구매해서 이용
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
