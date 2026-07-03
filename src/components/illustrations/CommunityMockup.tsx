interface MockPostCardProps {
  postNo: string;
  from: { name: string; detail: string; color: "iris" | "leaf" | "magenta" };
  to: { name: string; detail: string; color: "iris" | "leaf" | "magenta" };
  items: { label: string; value: string }[];
  className?: string;
  style?: React.CSSProperties;
}

function MockPostCard({
  postNo,
  from,
  to,
  items,
  className = "",
  style,
}: MockPostCardProps) {
  const dotColors = {
    iris: "bg-iris",
    leaf: "bg-leaf",
    magenta: "bg-magenta",
  };

  return (
    <div
      className={`rounded-[var(--radius-cards)] bg-paper p-5 shadow-[var(--shadow-subtle)] ${className}`}
      style={style}
    >
      <p className="mb-4 font-display text-eyebrow font-semibold uppercase text-smoke">
        게시글 no {postNo}
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 font-system text-eyebrow font-semibold uppercase text-smoke">작성자</p>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-[var(--radius-icons)] ${dotColors[from.color]}`} />
            <p className="font-display text-body font-semibold text-ink">{from.name}</p>
          </div>
          <p className="mt-1 font-display text-body-sm text-smoke">{from.detail}</p>
        </div>
        <div>
          <p className="mb-2 font-system text-eyebrow font-semibold uppercase text-smoke">카테고리</p>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-[var(--radius-icons)] ${dotColors[to.color]}`} />
            <p className="font-display text-body font-semibold text-ink">{to.name}</p>
          </div>
          <p className="mt-1 font-display text-body-sm text-smoke">{to.detail}</p>
        </div>
      </div>
      <div className="space-y-2 border-t border-mist/60 pt-3">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between gap-4">
            <span className="font-display text-body-sm text-smoke">{item.label}</span>
            <span className="font-display text-body-sm font-medium text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommunityMockupStack() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md">
      <MockPostCard
        postNo="001"
        from={{ name: "수험생A", detail: "수학 질문", color: "iris" }}
        to={{ name: "질문", detail: "기출 15번", color: "leaf" }}
        items={[
          { label: "조회수", value: "128" },
          { label: "댓글", value: "12" },
        ]}
        className="absolute left-0 top-6 z-10 w-[88%]"
        style={{ transform: "rotate(-5deg)" }}
      />
      <MockPostCard
        postNo="002"
        from={{ name: "공부왕", detail: "자료공유", color: "magenta" }}
        to={{ name: "자료공유", detail: "영어 PDF", color: "iris" }}
        items={[
          { label: "조회수", value: "256" },
          { label: "댓글", value: "34" },
        ]}
        className="absolute right-0 top-28 z-20 w-[90%]"
        style={{ transform: "rotate(4deg)" }}
      />
      <MockPostCard
        postNo="003"
        from={{ name: "봄기출", detail: "수험정보", color: "leaf" }}
        to={{ name: "수험정보", detail: "2026 D-day", color: "magenta" }}
        items={[
          { label: "조회수", value: "512" },
          { label: "댓글", value: "48" },
        ]}
        className="absolute bottom-0 left-1/2 z-30 w-[92%]"
        style={{ transform: "translateX(-50%) rotate(-1deg)" }}
      />
    </div>
  );
}

export function ProductShowcase() {
  return (
    <div className="grid items-end gap-12 md:grid-cols-2">
      <div className="text-center">
        <p className="mb-4 font-display text-body font-medium text-electric-blue">기출 풀이</p>
        <MockPostCard
          postNo="101"
          from={{ name: "봄기출 앱", detail: "과목별 기출", color: "iris" }}
          to={{ name: "수학", detail: "2024 9월", color: "leaf" }}
          items={[
            { label: "문항 수", value: "30" },
            { label: "정답률", value: "72%" },
          ]}
          className="mx-auto max-w-sm"
          style={{ transform: "rotate(-3deg)" }}
        />
      </div>
      <div className="text-center">
        <p className="mb-4 font-display text-body font-medium text-electric-blue">커뮤니티</p>
        <MockPostCard
          postNo="102"
          from={{ name: "수험생B", detail: "자료공유", color: "magenta" }}
          to={{ name: "수다", detail: "오늘의 공부", color: "iris" }}
          items={[
            { label: "좋아요", value: "45" },
            { label: "댓글", value: "18" },
          ]}
          className="mx-auto max-w-sm"
          style={{ transform: "rotate(3deg)" }}
        />
      </div>
    </div>
  );
}
