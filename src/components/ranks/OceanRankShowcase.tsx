import Image from "next/image";
import Link from "next/link";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import { OCEAN_RANKS, type OceanRank } from "@/lib/ocean-ranks";

const RANK_GROUPS = [
  { label: "첫 물결", range: "Lv.1–5", ranks: OCEAN_RANKS.slice(0, 5) },
  { label: "푸른 바다", range: "Lv.6–10", ranks: OCEAN_RANKS.slice(5, 10) },
  { label: "깊은 바다", range: "Lv.11–15", ranks: OCEAN_RANKS.slice(10, 15) },
  { label: "전설의 바다", range: "Lv.16–20", ranks: OCEAN_RANKS.slice(15, 20) },
] as const;

const SCORE_RULES = [
  {
    icon: "☀️",
    label: "매일 출석",
    score: "+1점",
    detail: "한국 시간 기준 하루 첫 방문 1회",
  },
  {
    icon: "✍️",
    label: "게시글 작성",
    score: "+2점",
    detail: "커뮤니티와 자료실에 직접 작성한 글",
  },
  {
    icon: "📘",
    label: "모두의 개념 작성",
    score: "+3점",
    detail: "개념 페이지에 학습 내용을 정리한 글",
  },
  {
    icon: "💬",
    label: "댓글 작성",
    score: "+1점",
    detail: "게시글과 학습 콘텐츠에 남긴 댓글",
  },
  {
    icon: "♥",
    label: "받은 좋아요",
    score: "+2점",
    detail: "다른 이용자가 내 글·댓글에 보낸 좋아요",
  },
] as const;

function RankCard({ rank }: { rank: OceanRank }) {
  const legendary = rank.level >= 16;
  const finalRank = rank.level === 20;

  return (
    <article
      className={`group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-[18px] border bg-paper p-2.5 transition-transform duration-200 hover:-translate-y-0.5 md:gap-4 md:p-3 ${
        finalRank
          ? "border-[#c99a3d] shadow-[0_5px_22px_rgba(180,125,20,0.16)]"
          : legendary
            ? "border-[#9fc7d5] shadow-[0_4px_16px_rgba(15,118,110,0.10)]"
            : "border-mist shadow-[var(--shadow-subtle-3)]"
      }`}
    >
      <div
        className={`relative aspect-square w-[88px] shrink-0 overflow-hidden rounded-[14px] border md:w-[108px] ${
          finalRank ? "border-[#d8b668]" : "border-mist/70"
        }`}
      >
        <Image
          src={rank.image}
          alt={`${rank.name} 바다 레벨 캐릭터`}
          fill
          sizes="(max-width: 640px) 88px, 108px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
        />
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 font-display text-[11px] font-semibold leading-none ${
              finalRank
                ? "bg-[#fff3ce] text-[#81580d]"
                : legendary
                  ? "bg-[#e8f7fa] text-[#155e75]"
                  : "bg-snow text-fog"
            }`}
          >
            Lv.{rank.level}
          </span>
          {finalRank && (
            <span className="font-display text-[10px] font-semibold text-[#a66b00]">
              FINAL
            </span>
          )}
        </div>
        <h3
          className={`truncate font-display text-[18px] font-semibold leading-tight md:text-[20px] ${
            finalRank ? "text-[#6f4b0b]" : "text-ink"
          }`}
        >
          {rank.name}
        </h3>
        <p className="mt-1 font-display text-[12px] font-medium text-fog md:text-[13px]">
          {rank.minScore.toLocaleString("ko-KR")}점부터
        </p>
      </div>
    </article>
  );
}

export function OceanRankShowcase() {
  const previewRank = OCEAN_RANKS[11];

  return (
    <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-8 md:py-12">
      <section className="relative overflow-hidden rounded-[28px] border-[1.5px] border-carbon bg-[#edf9fb] px-5 py-8 shadow-[var(--shadow-card)] md:px-10 md:py-11">
        <div
          className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full border-[32px] border-white/45"
          aria-hidden
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 font-display text-[12px] font-semibold tracking-[0.14em] text-electric-blue">
              OCEAN LEVEL
            </p>
            <h1 className="max-w-2xl font-display text-[38px] font-semibold leading-[1.12] text-ink md:text-[54px]">
              공부할수록 더 깊고,
              <br />더 대단한 바다로
            </h1>
            <p className="mt-5 max-w-xl font-display text-body-sm leading-relaxed text-smoke md:text-body">
              플랑크톤에서 흰수염고래까지, 활동 점수와 함께 성장하는 봄기출의 20단계 바다 레벨이에요.
            </p>
          </div>

          <div className="rounded-[22px] border border-[#b8dce4] bg-paper/95 p-5 shadow-[0_8px_30px_rgba(15,118,110,0.10)] md:p-6">
            <p className="font-display text-[12px] font-semibold text-fog">아이디 옆에는 이렇게 보여요</p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="font-display text-body font-semibold text-ink">봄기출러</span>
              <OceanRankBadge rank={previewRank} size="md" />
            </div>
            <div className="mt-5 border-t border-mist pt-4">
              <div className="flex items-center justify-between gap-3 font-display text-[12px]">
                <span className="text-fog">현재 활동 점수</span>
                <span className="font-semibold text-ink">3,240점</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
                <div className="h-full w-[24%] rounded-full bg-electric-blue" />
              </div>
              <p className="mt-2 text-right font-display text-[11px] text-fog">
                만타가오리까지 760점
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 md:mt-16">
        <header>
          <p className="font-display text-[11px] font-semibold tracking-[0.13em] text-electric-blue">
            20 OCEAN LEVELS
          </p>
          <h2 className="mt-2 font-display text-heading-sm font-semibold text-ink">
            누적 점수별 바다 레벨
          </h2>
          <p className="mt-2 font-display text-body-sm text-smoke">
            각 카드에 적힌 점수에 도달하면 해당 캐릭터가 아이디 옆에 표시돼요.
          </p>
        </header>
        <div className="mt-8 space-y-12 md:mt-10 md:space-y-16">
          {RANK_GROUPS.map((group, groupIndex) => (
            <section key={group.label} aria-labelledby={`rank-group-${groupIndex}`}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-mist pb-3">
                <div>
                  <p className="font-display text-[11px] font-semibold tracking-[0.12em] text-electric-blue">
                    {group.range}
                  </p>
                  <h3
                    id={`rank-group-${groupIndex}`}
                    className="mt-1 font-display text-heading-sm font-semibold text-ink"
                  >
                    {group.label}
                  </h3>
                </div>
                <span className="font-display text-[12px] text-fog">아래에서 위로 성장해요</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {group.ranks.map((rank) => (
                  <RankCard key={rank.level} rank={rank} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <details className="group mt-14 overflow-hidden rounded-[20px] border border-mist bg-paper shadow-[var(--shadow-subtle-3)] md:mt-18">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none md:px-6 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="font-display text-[10px] font-semibold tracking-[0.12em] text-electric-blue">
              LEVEL GUIDE
            </p>
            <h2 className="mt-1 font-display text-body font-semibold text-ink">
              바다 레벨은 어떻게 올라가나요?
            </h2>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-mist bg-surface text-lg text-smoke transition-transform group-open:rotate-180" aria-hidden>
            ↓
          </span>
        </summary>

        <div className="border-t border-mist">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-carbon px-6 py-7 text-paper md:px-8 md:py-9">
              <p className="font-display text-[11px] font-semibold tracking-[0.13em] text-[#8ad3dd]">
                HOW TO LEVEL UP
              </p>
              <h3 className="mt-2 font-display text-heading-sm font-semibold">
                활동할수록 레벨이 올라가요
              </h3>
              <p className="mt-3 font-display text-body-sm leading-relaxed text-mist">
                봄기출에서 쌓은 활동 점수를 모두 더한 누적 점수가 각 단계의 기준을 넘으면
                자동으로 다음 바다 레벨이 아이디 옆에 표시돼요.
              </p>
              <div className="mt-6 rounded-[18px] border border-white/20 bg-white/10 px-4 py-4">
                <p className="font-display text-[11px] font-semibold text-[#8ad3dd]">점수 계산식</p>
                <p className="mt-2 font-display text-[13px] font-semibold leading-relaxed text-paper">
                  출석일 × 1 + 게시글 × 2 + 모두의 개념 × 3 + 댓글 × 1 + 받은 좋아요 × 2
                </p>
              </div>
              <Link href="/profile" className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-paper px-5 font-display text-body-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">
                내 점수와 레벨 확인하기 →
              </Link>
            </div>

            <div className="px-5 py-6 md:px-8 md:py-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {SCORE_RULES.map((rule) => (
                  <article key={rule.label} className="flex items-start gap-3 rounded-[18px] border border-mist bg-surface px-4 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-[19px] shadow-[var(--shadow-subtle-3)]" aria-hidden>{rule.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-body-sm font-semibold text-ink">{rule.label}</h3>
                        <span className="shrink-0 font-display text-body-sm font-bold text-electric-blue">{rule.score}</span>
                      </div>
                      <p className="mt-1 font-display text-[12px] leading-relaxed text-fog">{rule.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded-[18px] border border-[#b8dce4] bg-[#f0fbfd] px-4 py-4">
                <p className="font-display text-[12px] font-semibold text-[#155e75]">예시</p>
                <p className="mt-1.5 font-display text-[12px] leading-relaxed text-smoke">
                  20일 출석 + 게시글 3개 + 모두의 개념 1개 + 댓글 5개 + 받은 좋아요 2개 = 38점,
                  <strong className="ml-1 font-semibold text-ink">Lv.2 멸치</strong>예요.
                  12점만 더 모으면 Lv.3 새우가 됩니다.
                </p>
              </div>
              <ul className="mt-5 space-y-2 font-display text-[12px] leading-relaxed text-fog">
                <li>• 출석은 로그인 횟수가 아니라 하루 첫 활동만 1회 집계돼요.</li>
                <li>• 좋아요는 누른 사람이 아니라 받은 사람에게 쌓이며, 내 글에는 누를 수 없어요.</li>
                <li>• 삭제한 글·댓글과 취소된 좋아요는 누적 점수에서 빠져요.</li>
                <li>• 기출 풀이·회독·수험일기 점수는 공정한 검증 기준을 마련한 뒤 추가할 예정이에요.</li>
              </ul>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
