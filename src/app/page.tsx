import type { Metadata } from "next";
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
import { FloatingStickers } from "@/components/illustrations/Stickers";
import { DDayStrip } from "@/components/home/DDayStrip";
import { HomeCommunityPreview } from "@/components/home/HomeCommunityPreview";
import { HomeArchivePreview } from "@/components/home/HomeArchivePreview";
import {
  APP_FEATURES,
  HIGHLIGHTS,
  SITE_TAGLINE,
  STUDY_MODES,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "공인중개사 기출문제 해설",
  description:
    "공인중개사 기출 O/X와 문항별 해설, AI 질문, 수험생 커뮤니티. 부동산학개론·민법·공인중개사법 등 전 과목 기출을 연도·문항 단위로 확인하세요.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* D-day strip */}
      <div className="flex justify-center px-4 pt-3">
        <DDayStrip />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-8 md:pt-12">
        <div className="relative mx-auto max-w-[var(--page-max-width)]">
          <div className="space-y-6">
            <BrandLockup variant="hero" />
            <p className="max-w-md font-display text-body-lg text-smoke">
              공인중개사 기출을 풀다 막히는 순간, AI에게 물을 질문까지 만들어
              드립니다. <ElectricHighlight underline>봄기출</ElectricHighlight>은
              공인중개사 수험생을 위한 학습 앱과 커뮤니티입니다.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton
                href="/study"
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
              href="/study"
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
                앱으로 공부하고, 여기서 정보를 나눠요
              </h2>
              <p className="mx-auto mt-4 font-display text-body-lg text-smoke">
                공인중개사 기출 풀다가 막히는 문제, 자료 공유, 시험 정보 —
                같은 길을 걷는 수험생들과 나눠보세요.{" "}
                <ElectricHighlight underline>{SITE_TAGLINE}</ElectricHighlight>
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["자유게시판", "질문", "자료공유", "수험정보", "합격후기"].map((tag) => (
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

      {/* Final CTA */}
      <section className="section-gap px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <TintedAccentCard className="relative overflow-hidden text-center">
            <FloatingStickers className="absolute inset-0 opacity-80" />
            <div className="relative">
              <p className="mx-auto mt-4 max-w-md font-display text-body text-smoke">
                앱을 설치해 기출을 풀고, 홈페이지 커뮤니티에 가입해 수험 정보를
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
