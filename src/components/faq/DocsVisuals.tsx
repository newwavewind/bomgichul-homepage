/** FAQ docs용 화면 미리보기 일러스트 — 실제 UI 톤을 단순화한 SVG/마크업 */

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

export function StudyHubVisual() {
  return (
    <PhoneFrame caption="학습 홈" tint="snow">
      <div className="space-y-3">
        <div>
          <p className="mb-2 font-display text-[12px] font-semibold text-ink">기출 all-in-one</p>
          <div className="grid grid-cols-2 gap-2">
            {["민법", "부동산학개론", "공인중개사법", "부동산공법"].map((label) => (
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
          </div>
        </div>
        <div>
          <p className="mb-2 font-display text-[12px] font-semibold text-ink">기출문제</p>
          <div className="grid grid-cols-2 gap-2">
            {["민법", "부동산세법"].map((label) => (
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

export function ConceptsVisual() {
  return (
    <PhoneFrame caption="기출 all-in-one · 개념 상세" tint="lavender">
      <div className="space-y-2.5 rounded-xl border border-carbon/30 bg-paper p-3">
        <p className="font-display text-[11px] text-smoke">민법 · 권리의 변동</p>
        <p className="font-display text-[15px] font-semibold leading-snug text-ink">
          권리취득의 유형
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

export function ExamVisual() {
  return (
    <PhoneFrame caption="기출문제 · 문항" tint="ice">
      <div className="space-y-3 rounded-xl border border-carbon/30 bg-paper p-3">
        <div className="flex items-center justify-between">
          <p className="font-display text-[12px] font-semibold text-ink">2025년 · 12번</p>
          <span className="rounded-full border border-carbon/30 bg-snow px-2 py-0.5 font-display text-[10px] text-smoke">
            민법
          </span>
        </div>
        <p className="font-display text-[12px] leading-relaxed text-ink">
          다음 중 권리의 변동에 관한 설명으로 옳은 것은?
        </p>
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

export function CommunityVisual() {
  return (
    <PhoneFrame caption="커뮤니티" tint="snow">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {["전체", "질문", "자료공유", "법령정보"].map((cat, i) => (
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
        {[
          { title: "취득시효 자주점유 추정이 헷갈려요", meta: "질문 · 댓글 8" },
          { title: "2025 민법 오답 정리 공유합니다", meta: "자료공유 · 다운 42" },
        ].map((post) => (
          <div key={post.title} className="rounded-xl border border-carbon/30 bg-paper px-3 py-2.5">
            <p className="font-display text-[12px] font-semibold text-ink">{post.title}</p>
            <p className="mt-1 font-display text-[10px] text-smoke">{post.meta}</p>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

export function ArchiveVisual() {
  return (
    <PhoneFrame caption="자료실" tint="paper">
      <div className="space-y-2">
        {[
          { type: "PDF", name: "민법 연도별 기출 모아보기", size: "2.4MB" },
          { type: "노트", name: "공법 용도지역 한눈에", size: "780KB" },
          { type: "요약", name: "세법 취득세 체크리스트", size: "410KB" },
        ].map((file) => (
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

export function DiaryVisual() {
  return (
    <PhoneFrame caption="수험일기" tint="lavender">
      <div className="space-y-3">
        <div className="rounded-xl border border-carbon/30 bg-paper px-3 py-2.5 text-center">
          <p className="font-display text-[11px] text-smoke">시험까지</p>
          <p className="font-display text-[22px] font-bold text-ink">D-109</p>
        </div>
        <div className="rounded-xl border border-carbon/30 bg-paper px-3 py-2.5">
          <p className="font-display text-[11px] text-smoke">오늘의 기록</p>
          <p className="mt-1 font-display text-[13px] font-semibold text-ink">민법 계약해제 정리</p>
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
    <PhoneFrame caption="코드 등록 · 프리미엄" tint="snow">
      <div className="space-y-3">
        <div className="rounded-xl border border-carbon/40 bg-paper p-3">
          <p className="font-display text-[11px] font-semibold text-smoke">무료로 바로</p>
          <ul className="mt-2 space-y-1.5 font-display text-[11px] text-ink">
            <li>· 부동산학개론 전 연도</li>
            <li>· 나머지 과목 2024–2025년</li>
            <li>· 기출 all-in-one 개념</li>
          </ul>
        </div>
        <div className="rounded-xl border border-carbon bg-carbon p-3 text-paper">
          <p className="font-display text-[11px] font-semibold opacity-80">프리미엄 코드</p>
          <p className="mt-2 rounded-lg border border-paper/20 bg-paper/10 px-2 py-2 text-center font-display text-[13px] tracking-wider">
            BOM-····-····
          </p>
          <p className="mt-2 font-display text-[10px] opacity-80">
            앱에서 구매 → 과목 페이지에서 등록
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
