import {
  EyebrowLabel,
  DisplayHeadline,
  SectionHeading,
  ElectricHighlight,
} from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { FeatureCard, LargePanel, TintedAccentCard } from "@/components/ui/Card";
import { Tag, CheckBadge } from "@/components/ui/Tag";
import { FAQAccordion, TestimonialCard } from "@/components/ui/FAQ";
import { CommunityMockupStack } from "@/components/illustrations/CommunityMockup";
import {
  APP_FEATURES,
  FAQ_ITEMS,
  HIGHLIGHTS,
  STATS,
  STUDY_MODES,
  SUBJECTS,
  TESTIMONIALS,
} from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-4 pb-24 pt-8 md:pt-12">
        <div className="mx-auto grid max-w-[var(--page-max-width)] items-center gap-16 lg:grid-cols-2">
          <div className="space-y-6">
            <EyebrowLabel>공인중개사 · 자격시험 기출 O/X 앱</EyebrowLabel>
            <DisplayHeadline>
              기출을 풀고,
              <br />
              합격에 가까워지세요
            </DisplayHeadline>
            <p className="max-w-md font-display text-body-lg text-smoke">
              <ElectricHighlight>봄기출</ElectricHighlight>은 연도별·목차별 O/X 학습,
              개념카드, 시험 모드, 출제 통계를 한 앱에 담았습니다.
              커뮤니티에서 수험생들과 정보를 나눠보세요.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton href="/community">커뮤니티 가기</PrimaryButton>
              <SecondaryButton href="/#features">앱 기능 보기</SecondaryButton>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              {HIGHLIGHTS.map((h) => (
                <CheckBadge key={h.label} label={h.label} value={h.value} />
              ))}
            </div>
          </div>
          <CommunityMockupStack />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-mist/60 bg-surface px-4 py-12">
        <div className="mx-auto flex max-w-[var(--page-max-width)] flex-wrap justify-center gap-12 md:gap-24">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-heading-sm font-semibold text-ink">
                {stat.value}
              </p>
              <p className="mt-1 font-display text-body-sm text-smoke">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Study modes */}
      <section className="section-gap bg-snow px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <div className="mb-10 text-center">
            <EyebrowLabel className="mb-3">학습 방식</EyebrowLabel>
            <SectionHeading>나에게 맞는 공부법</SectionHeading>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STUDY_MODES.map((mode) => (
              <FeatureCard key={mode.label} tint="ice">
                <h3 className="mb-1 font-display text-subheading font-semibold text-ink">
                  {mode.label}
                </h3>
                <p className="font-display text-body-sm text-smoke">{mode.description}</p>
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-gap bg-paper px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <div className="mb-12 text-center">
            <EyebrowLabel className="mb-3">앱 주요 기능</EyebrowLabel>
            <SectionHeading>봄기출 앱에 담긴 기능</SectionHeading>
            <p className="mx-auto mt-4 max-w-lg font-display text-body text-smoke">
              학습 · 개념카드 · 시험 · 암기노트 · 용어집 — 수험 준비에 필요한 도구를 모두 제공합니다
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {APP_FEATURES.map((feature, i) => {
              const tints = ["none", "ice", "lavender", "blush"] as const;
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

      {/* Subjects */}
      <section id="subjects" className="section-gap bg-snow px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <div className="mb-10 text-center">
            <EyebrowLabel className="mb-3">지원 과목</EyebrowLabel>
            <SectionHeading>1·2차 과목별 기출</SectionHeading>
            <p className="mx-auto mt-4 max-w-lg font-display text-body text-smoke">
              과목을 선택하면 해당 커리큘럼과 기출 데이터로 학습합니다
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((subject) => (
              <FeatureCard key={subject.name} tint="paper" className="!py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-body font-semibold text-ink">
                      {subject.name}
                    </p>
                    <p className="mt-0.5 font-display text-body-sm text-smoke">
                      {subject.round}
                    </p>
                  </div>
                  <Tag active={subject.status === "available"}>
                    {subject.status === "available" ? "학습 가능" : "준비 중"}
                  </Tag>
                </div>
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* Community panel */}
      <section className="section-gap px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <LargePanel>
            <div className="mx-auto max-w-2xl text-center">
              <EyebrowLabel className="mb-3">수험생 커뮤니티</EyebrowLabel>
              <h2 className="font-display text-heading font-semibold text-ink">
                앱으로 공부하고, 여기서 수다 떨어요
              </h2>
              <p className="mx-auto mt-4 font-display text-body-lg text-smoke">
                기출 풀다가 막히는 문제, 자료 공유, 시험 정보 — 같은 길을 걷는
                수험생들과 나눠보세요.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["질문", "자료공유", "수다", "수험정보"].map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <PrimaryButton href="/community">커뮤니티 둘러보기</PrimaryButton>
                <SecondaryButton href="/archive">자료실 보기</SecondaryButton>
              </div>
            </div>
          </LargePanel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap bg-paper px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <div className="mb-12 text-center">
            <EyebrowLabel className="mb-3">수험생 후기</EyebrowLabel>
            <SectionHeading>봄기출과 함께 공부하는 이유</SectionHeading>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard
                key={t.author}
                quote={t.quote}
                author={t.author}
                rating={t.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-gap bg-snow px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <EyebrowLabel className="mb-3">자주 묻는 질문</EyebrowLabel>
            <SectionHeading>FAQ</SectionHeading>
          </div>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-gap px-4">
        <div className="mx-auto max-w-[var(--page-max-width)]">
          <TintedAccentCard className="text-center">
            <h2 className="font-display text-heading-sm font-semibold text-ink">
              앱으로 공부하고, 커뮤니티에서 연결하세요
            </h2>
            <p className="mx-auto mt-3 max-w-md font-display text-body text-smoke">
              앱스토어에서 「봄기출」을 검색해 설치하거나, 웹 커뮤니티에
              가입해 수험 정보를 나눠보세요.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <PrimaryButton href="/login">커뮤니티 가입</PrimaryButton>
              <SecondaryButton href="/community">게시판 둘러보기</SecondaryButton>
            </div>
          </TintedAccentCard>
        </div>
      </section>
    </>
  );
}
