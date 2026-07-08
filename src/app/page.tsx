import {
  EyebrowLabel,
  SectionHeading,
  ElectricHighlight,
  HandCaption,
} from "@/components/ui/Typography";
import { BrandLockup } from "@/components/ui/BrandLockup";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { PrimaryButton, SecondaryButton, OutlineButton } from "@/components/ui/Button";
import { FeatureCard, LargePanel, TintedAccentCard } from "@/components/ui/Card";
import { Tag, CheckBadge } from "@/components/ui/Tag";
import { FAQAccordion } from "@/components/ui/FAQ";
import { AppPhonePreview } from "@/components/illustrations/AppPhonePreview";
import { BrandLogo } from "@/components/illustrations/BrandLogo";
import { FloatingStickers } from "@/components/illustrations/Stickers";
import { DDayStrip } from "@/components/home/DDayStrip";
import { HomeCommunityPreview } from "@/components/home/HomeCommunityPreview";
import { HomeArchivePreview } from "@/components/home/HomeArchivePreview";
import { DailyOxCard } from "@/components/home/DailyOxCard";
import { getDailyOxSet } from "@/lib/daily-quiz";
import { getKSTDateString } from "@/lib/exam";
import { getUser } from "@/lib/auth";
import { getUserQuizStreak, hasCompletedTodayQuiz } from "@/lib/daily-quiz-results";
import {
  APP_FEATURES,
  FAQ_ITEMS,
  HIGHLIGHTS,
  SITE_TAGLINE,
  STATS,
  STUDY_MODES,
} from "@/lib/constants";

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default async function HomePage() {
  const dateKey = getKSTDateString();
  const dailyQuestions = getDailyOxSet(dateKey);
  const user = await getUser();
  const quizStreak = user ? await getUserQuizStreak(user.id) : 0;
  const alreadyPlayedToday = user ? await hasCompletedTodayQuiz(user.id, dateKey) : false;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* D-day strip */}
      <div className="px-4 pt-4">
        <DDayStrip />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-8 md:pt-12">
        <div className="relative mx-auto grid max-w-[var(--page-max-width)] items-center gap-14 lg:grid-cols-2">
          <div className="space-y-6">
            <BrandLockup variant="hero" />
            <p className="max-w-md font-display text-body-lg text-smoke">
              공인중개사 기출을 풀다 막히는 순간, AI에게 물을 질문까지 만들어
              드립니다. <ElectricHighlight underline>봄기출</ElectricHighlight>은
              공인중개사 수험생을 위한 학습 앱과 커뮤니티입니다.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton
                href="/#try"
                event="cta_click"
                eventParams={{ location: "hero", label: "try_now" }}
              >
                지금 무료로 풀어보기
              </PrimaryButton>
              <SecondaryButton
                href="/community"
                event="cta_click"
                eventParams={{ location: "hero", label: "community" }}
              >
                공인중개사 커뮤니티
              </SecondaryButton>
              <OutlineButton
                href="/#features"
                event="cta_click"
                eventParams={{ location: "hero", label: "features" }}
              >
                앱 기능 보기
              </OutlineButton>
            </div>
            <p className="font-display text-body-sm text-smoke">
              공인중개사 공부는 당신이, 질문은 봄기출이.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
              {HIGHLIGHTS.map((h) => (
                <CheckBadge key={h.label} label={h.label} value={h.value} />
              ))}
            </div>
          </div>
          <div className="relative flex justify-center">
            <AppPhonePreview />
          </div>
        </div>
      </section>

      {/* Daily OX try-it */}
      <section id="try" className="section-gap bg-paper px-4">
        <div className="mx-auto max-w-[var(--page-max-width)] text-center">
          <HandCaption className="mb-2">로그인 없이 바로 체험</HandCaption>
          <SectionHeading>오늘의 기출 O/X</SectionHeading>
          <p className="mx-auto mt-4 max-w-md font-display text-body text-smoke">
            실제 기출 지문 10문제, 지금 바로 풀어보세요. 막히면 AI에게 바로
            질문할 수 있어요.
          </p>
          <div className="mt-8">
            <DailyOxCard
              questions={dailyQuestions}
              userId={user?.id ?? null}
              dateKey={dateKey}
              initialStreak={quizStreak}
              alreadyPlayedToday={alreadyPlayedToday}
            />
          </div>
        </div>
      </section>

      {/* Brand banner */}
      <section className="border-y-[1.5px] border-carbon bg-snow px-4 py-5">
        <div className="mx-auto flex max-w-[var(--page-max-width)] justify-center">
          <BrandLockup variant="banner" align="center" />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b-[1.5px] border-carbon bg-paper px-4 py-12">
        <div className="mx-auto flex max-w-[var(--page-max-width)] flex-wrap justify-center gap-12 md:gap-24">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-heading-sm font-semibold text-ink">
                {stat.value}
              </p>
              <p className="mt-1 font-handwritten text-[1.15rem] text-electric-blue">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Study modes */}
      <section className="section-gap bg-snow px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <div className="mb-10 max-w-xl">
            <HandCaption className="mb-2">공부 루트</HandCaption>
            <SectionHeading>나에게 맞는 공부법</SectionHeading>
            <p className="mt-4 font-display text-body text-smoke">
              기출을 풀고, 막히면 AI 질문으로 이해까지 —{" "}
              <ElectricHighlight underline>{SITE_TAGLINE}</ElectricHighlight>
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STUDY_MODES.map((mode, i) => (
              <FeatureCard
                key={mode.label}
                tint={(["ice", "lavender", "paper", "snow"] as const)[i % 4]}
                className={i % 2 === 1 ? "md:translate-y-2" : ""}
              >
                <h3 className="mb-1 font-display text-subheading font-semibold text-ink">
                  {mode.label}
                </h3>
                <p className="font-display text-body-sm text-smoke">{mode.description}</p>
              </FeatureCard>
            ))}
          </div>
          <div className="mt-6">
            <OutlineButton
              href="/exam"
              event="cta_click"
              eventParams={{ location: "study_modes", label: "exam_hub" }}
            >
              기출문제 해설 전체 보기 →
            </OutlineButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-gap bg-paper px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <div className="mb-12 max-w-xl">
            <BrandLockup variant="section" className="mb-3" />
            <SectionHeading>봄기출 앱에 담긴 기능</SectionHeading>
            <p className="mt-4 font-display text-body text-smoke">
              학습 · 개념카드 · 시험 · 암기노트 · 용어집 — 수험 준비에 필요한
              도구와 AI 질문 작성을 한 앱에 담았습니다
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {APP_FEATURES.map((feature, i) => {
              const tints = ["none", "ice", "lavender", "snow"] as const;
              return (
                <FeatureCard key={feature.title} tint={tints[i % 4]}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <Tag className="!px-2.5 !py-0.5 !text-[12px]">{feature.tag}</Tag>
                  </div>
                  <h3 className="mb-2 font-display text-subheading font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="font-display text-body-sm leading-relaxed text-smoke">
                    {feature.description}
                  </p>
                </FeatureCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community panel */}
      <section className="section-gap px-4">
        <div className="relative mx-auto max-w-[var(--page-max-width)]">
          <FloatingStickers className="absolute -top-4 right-4 z-10 hidden md:block" />
          <LargePanel>
            <div className="mx-auto max-w-2xl text-center">
              <HandCaption className="mb-3">공인중개사 커뮤니티</HandCaption>
              <h2 className="font-display text-heading font-semibold text-ink">
                앱으로 공부하고, 여기서 수다 떨어요
              </h2>
              <p className="mx-auto mt-4 font-display text-body-lg text-smoke">
                공인중개사 기출 풀다가 막히는 문제, 자료 공유, 시험 정보 —
                같은 길을 걷는 수험생들과 나눠보세요.{" "}
                <ElectricHighlight underline>{SITE_TAGLINE}</ElectricHighlight>
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["자유게시판", "질문", "자료공유", "수험정보"].map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              <HomeCommunityPreview />

              <div className="mt-10 text-left">
                <HandCaption className="mb-3 text-center">자료실 인기 자료</HandCaption>
                <HomeArchivePreview />
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <PrimaryButton
                  href="/community"
                  event="cta_click"
                  eventParams={{ location: "community_panel", label: "community" }}
                >
                  공인중개사 커뮤니티
                </PrimaryButton>
                <SecondaryButton
                  href="/archive"
                  event="cta_click"
                  eventParams={{ location: "community_panel", label: "archive" }}
                >
                  자료실 보기
                </SecondaryButton>
              </div>
            </div>
          </LargePanel>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-gap bg-snow px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-left">
            <EyebrowLabel className="mb-3">자주 묻는 질문</EyebrowLabel>
            <SectionHeading>FAQ</SectionHeading>
          </div>
          <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-5 shadow-[var(--shadow-card)] md:px-8">
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-gap px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <TintedAccentCard className="relative overflow-hidden text-center">
            <FloatingStickers className="absolute inset-0 opacity-80" />
            <div className="relative">
              <div className="mb-4 flex justify-center">
                <BrandLogo size="md" />
              </div>
              <BrandLockup variant="section" align="center" />
              <p className="mx-auto mt-4 max-w-md font-display text-body text-smoke">
                앱을 설치해 기출을 풀고, 웹 커뮤니티에 가입해 수험 정보를
                나눠보세요. 공부는 당신이, 질문은 봄기출이.
              </p>
              <AppStoreButtons className="mt-6 justify-center" />
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <PrimaryButton
                  href="/login"
                  event="cta_click"
                  eventParams={{ location: "final_cta", label: "signup" }}
                >
                  커뮤니티 가입
                </PrimaryButton>
                <SecondaryButton
                  href="/community"
                  event="cta_click"
                  eventParams={{ location: "final_cta", label: "community" }}
                >
                  게시판 둘러보기
                </SecondaryButton>
              </div>
            </div>
          </TintedAccentCard>
        </div>
      </section>
    </>
  );
}
