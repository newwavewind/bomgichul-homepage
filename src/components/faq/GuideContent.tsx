import Link from "next/link";
import { HandCaption, SectionHeading, ElectricHighlight } from "@/components/ui/Typography";
import { FeatureCard, ElevatedCard } from "@/components/ui/Card";
import { PrimaryButton, SecondaryButton, OutlineButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import {
  appStoreLinksForScope,
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  PC_APP_URL,
} from "@/lib/constants";
import {
  archiveBaseHref,
  communityBaseHref,
  communityScopeLabel,
  trackHubHref,
} from "@/lib/exam-track/community";
import type { CommunityScope } from "@/types/database";
import {
  StudyHubVisual,
  ConceptsVisual,
  ExamVisual,
  CommunityVisual,
  ArchiveVisual,
  NewsVisual,
  PremiumVisual,
} from "@/components/faq/DocsVisuals";

function tocForScope(scope: CommunityScope) {
  const base = [
    { href: "#home", label: "1. 학습 홈" },
    { href: "#concepts", label: "2. 기출 올인원" },
    { href: "#exam", label: "3. 기출문제" },
    { href: "#community", label: "4. 커뮤니티" },
    { href: "#archive", label: "5. 자료실" },
  ];
  if (scope === "real_estate") {
    return [
      ...base,
      { href: "#news", label: "6. 뉴스" },
      { href: "#account", label: "7. 로그인·프로필" },
      { href: "#premium", label: "8. 무료·프리미엄" },
      { href: "#apps", label: "9. 앱·PC앱" },
    ];
  }
  return [
    ...base,
    { href: "#account", label: "6. 로그인·프로필" },
    { href: "#apps", label: "7. 앱" },
  ];
}

function DocsSection({
  id,
  step,
  eyebrow,
  title,
  children,
  visual,
  reverse = false,
}: {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-mist pt-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 font-display text-[12px] font-semibold tracking-[0.08em] text-electric-blue">
            {step} · {eyebrow}
          </p>
          <SectionHeading as="h2">{title}</SectionHeading>
        </div>
      </div>
      <div
        className={`grid items-start gap-8 lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="space-y-4 font-display text-body text-smoke">{children}</div>
        <div className="lg:sticky lg:top-28">{visual}</div>
      </div>
    </section>
  );
}

function StepList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-carbon bg-paper font-display text-[11px] font-bold text-ink">
            {index + 1}
          </span>
          <span className="font-display text-body-sm leading-relaxed text-ink">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function GuideContent({
  scope = "real_estate",
}: {
  scope?: CommunityScope;
}) {
  const isRE = scope === "real_estate";
  const label = communityScopeLabel(scope);
  const hub = trackHubHref(scope);
  const community = communityBaseHref(scope);
  const archive = archiveBaseHref(scope);
  const toc = tocForScope(scope);
  const storeLinks = appStoreLinksForScope(scope);

  return (
    <div className="space-y-4">
      <section className="mb-10 rounded-[var(--radius-largecards)] border border-carbon bg-snow px-5 py-6 shadow-[var(--shadow-card)] md:px-8 md:py-8">
        <HandCaption className="mb-2">이용 안내서</HandCaption>
        <SectionHeading as="h2" className="mb-3">
          {label} 기능을 한눈에
        </SectionHeading>
        <p className="max-w-2xl font-display text-body text-smoke">
          이 페이지는 <ElectricHighlight>봄기출 {label}</ElectricHighlight>에 있는 기능을
          하나씩 설명하는 가이드예요. 마케팅 문구가 아니라, 지금 실제로 눌러볼 수 있는
          화면 기준으로 적어 두었습니다.
        </p>
        <nav aria-label="목차" className="mt-6">
          <div className="flex flex-wrap gap-2">
            {toc.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-carbon/40 bg-paper px-3 py-1.5 font-display text-[12px] font-medium text-ink transition-colors hover:border-carbon hover:bg-snow"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </section>

      <DocsSection
        id="home"
        step="01"
        eyebrow="시작"
        title="학습 홈에서 과목을 고릅니다"
        visual={<StudyHubVisual scope={scope} />}
      >
        <p>
          {isRE ? (
            <>
              사이트에 들어오면 바로 <strong className="text-ink">학습 홈</strong>이 보여요.
              주소는 <code className="rounded bg-mist/60 px-1.5 py-0.5 text-[13px]">/</code> 또는{" "}
              <code className="rounded bg-mist/60 px-1.5 py-0.5 text-[13px]">/study</code> 입니다.
            </>
          ) : (
            <>
              <strong className="text-ink">{label} 학습 홈</strong> 주소는{" "}
              <code className="rounded bg-mist/60 px-1.5 py-0.5 text-[13px]">{hub}</code> 입니다.
            </>
          )}
        </p>
        <p>화면은 크게 두 덩어리예요.</p>
        <ul className="list-disc space-y-1.5 pl-5 font-display text-body-sm text-ink">
          <li>
            <strong>기출 올인원</strong> — 주제별 개념과 기출 지문을 이어서 공부
          </li>
          <li>
            <strong>기출문제</strong> — 연도·문항 단위로 O/X 풀기
          </li>
        </ul>
        <p className="font-display text-body-sm">
          아래에는 앱 설치 안내가 있어요. 로그인 없이도 과목을 눌러 들어갈 수 있습니다.
        </p>
        <OutlineButton href={hub} className="!px-4 !py-2">
          학습 홈 열기
        </OutlineButton>
      </DocsSection>

      <DocsSection
        id="concepts"
        step="02"
        eyebrow="개념"
        title="기출 올인원으로 주제를 따라갑니다"
        visual={<ConceptsVisual key={`concepts-${scope}`} scope={scope} />}
        reverse
      >
        <p>
          {isRE
            ? "과목을 고르면 PART · CHAPTER 같은 목차로 개념이 정리되어 있어요."
            : `${label} 과목을 고르면 PART · CHAPTER 같은 목차로 개념이 정리되어 있어요.`}{" "}
          한 개념을 열면 이런 순서로 읽으면 됩니다.
        </p>
        <StepList
          items={[
            "개념 정리 — 한 줄 정의",
            "이해하기 — 직관적으로 받아들이는 설명",
            "핵심 포인트 · 함정 포인트 — 시험에서 자주 틀리는 지점",
            "한눈에 학습맵 / 시각 가이드 — 도표로 구조 잡기",
            "기출 지문 · 관련 기출 — 실제 문제로 바로 이어가기",
          ]}
        />
        <p className="font-display text-body-sm">
          「수정」 표시가 있는 지문은 원문과 표현이 조금 다듬어진 버전이에요. 개념
          공부용으로 읽기 쉽게 정리한 것입니다.
        </p>
        <div className="flex flex-wrap gap-2">
          {isRE &&
            EXAM_SUBJECTS.slice(0, 3).map((s) => (
              <Link
                key={s.value}
                href={`/concepts/${s.value}`}
                className="rounded-full border border-carbon/40 bg-lavender/60 px-3 py-1.5 font-display text-[12px] font-medium text-ink hover:border-carbon"
              >
                {ARCHIVE_SUBJECT_MAP[s.value]}
              </Link>
            ))}
          <OutlineButton
            href={isRE ? "/#concepts" : hub}
            className="!px-3 !py-1.5 !text-[12px]"
          >
            전체 과목
          </OutlineButton>
        </div>
      </DocsSection>

      <DocsSection
        id="exam"
        step="03"
        eyebrow="문제 풀이"
        title="기출문제는 연도 → 문항으로 풉니다"
        visual={<ExamVisual scope={scope} />}
      >
        <p>
          과목을 고르면 연도 목록이 나와요. 연도를 누르면 문항 목록, 문항을 누르면 O/X로
          풀어볼 수 있습니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "정답 · 해설",
              body: "O/X를 고르면 바로 해설이 열려요.",
            },
            {
              title: "AI에게 묻기",
              body: "GPT · Gemini · Claude에 붙여넣을 질문을 만들어 줍니다.",
            },
            {
              title: "시험 모드",
              body: "그해 문항을 한 번에 풀고 제출하면 일괄 채점됩니다.",
            },
            {
              title: "랜덤 · 오답 · 복습",
              body: "로그인·프리미엄이 필요한 연습 메뉴도 과목 페이지에 모여 있어요.",
            },
          ].map((card) => (
            <FeatureCard key={card.title} tint="snow" className="!p-3.5">
              <p className="font-display text-[13px] font-semibold text-ink">{card.title}</p>
              <p className="mt-1 font-display text-[12px] leading-relaxed text-smoke">
                {card.body}
              </p>
            </FeatureCard>
          ))}
        </div>
        <p className="font-display text-body-sm">
          과목별 기출 목록은 학습 홈의 <strong className="text-ink">기출문제</strong> 카드에서
          들어가면 됩니다.
        </p>
        <OutlineButton href={isRE ? "/#exam" : hub} className="!px-4 !py-2">
          기출문제 과목 보기
        </OutlineButton>
      </DocsSection>

      <DocsSection
        id="community"
        step="04"
        eyebrow="함께 공부"
        title={`${label} 커뮤니티에서 질문하고 정보를 나눠요`}
        visual={<CommunityVisual scope={scope} />}
        reverse
      >
        <p>
          {isRE
            ? "자유 · 질문 · 자료공유 · 수험정보 · 법령정보 · 합격후기 카테고리가 있어요."
            : "질문 · 수험정보 등 카테고리가 있어요."}{" "}
          글은 누구나 읽을 수 있고,{" "}
          <strong className="text-ink">글쓰기·댓글은 로그인</strong> 후 이용합니다.{" "}
          {label} 커뮤니티는 다른 시험 글과 섞이지 않습니다.
        </p>
        <StepList
          items={[
            `${label} 학습 홈·커뮤니티로 들어갑니다`,
            "카테고리·검색으로 글을 찾습니다",
            "질문이 있으면 「질문」에 남겨 보세요",
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <PrimaryButton href={community} className="!px-4 !py-2">
            {label} 커뮤니티 열기
          </PrimaryButton>
        </div>
      </DocsSection>

      <DocsSection
        id="archive"
        step="05"
        eyebrow="파일"
        title="자료실에서 파일을 받고 올려요"
        visual={<ArchiveVisual scope={scope} />}
      >
        <p>
          {label} 기출 · 노트 · 요약 등 파일을 과목별로 모아 둔 공간이에요. 다운로드는
          로그인 없이 가능하고,{" "}
          <strong className="text-ink">자료 올리기는 로그인</strong>이 필요합니다.
        </p>
        <p className="font-display text-body-sm">
          PDF · 문서 · 이미지 · CSV · MP4를 올릴 수 있어요. (일반 파일은 대체로 20MB, 영상은
          더 큰 용량까지)
        </p>
        <OutlineButton href={archive} className="!px-4 !py-2">
          자료실 열기
        </OutlineButton>
      </DocsSection>

      {isRE && (
        <DocsSection
          id="news"
          step="06"
          eyebrow="소식"
          title="뉴스로 날짜별 이슈를 훑어요"
          visual={<NewsVisual />}
        >
          <p>
            공인중개사와 관련한 소식을 날짜 줄로 넘겨 가며 읽을 수 있어요. 따로 로그인할
            필요는 없습니다. 뉴스는 공인중개사 전용입니다.
          </p>
          <OutlineButton href="/news" className="!px-4 !py-2">
            뉴스 보기
          </OutlineButton>
        </DocsSection>
      )}

      <DocsSection
        id="account"
        step={isRE ? "07" : "06"}
        eyebrow="계정"
        title="로그인은 구글로, 프로필에서 내 공부를 봐요"
        visual={
          <FeatureCard tint="snow" className="mx-auto max-w-sm !p-5">
            <Tag className="mb-3 !text-[11px]">계정</Tag>
            <p className="font-display text-subheading font-semibold text-ink">Google 로그인</p>
            <p className="mt-2 font-display text-body-sm text-smoke">
              로그인 → 아이디(닉네임) 설정 → 프로필에서 북마크·오답·내 글 확인
            </p>
            <div className="mt-4 space-y-2">
              {["로그인", "아이디 설정", "프로필 · 알림"].map((row) => (
                <div
                  key={row}
                  className="rounded-lg border border-mist bg-paper px-3 py-2 font-display text-[12px] text-ink"
                >
                  {row}
                </div>
              ))}
            </div>
          </FeatureCard>
        }
      >
        <StepList
          items={[
            "상단 「로그인」에서 Google로 접속합니다",
            "처음이면 닉네임을 정하는 온보딩이 나와요",
            "프로필에서 북마크·오답·내가 쓴 글을 봅니다",
            "알림은 댓글 등 소식용이에요",
          ]}
        />
        <p className="font-display text-body-sm">
          우측 하단 채팅은 닉네임이 있는 계정에서, 접속 중인 수험생과 짧게 대화할 때
          씁니다.
        </p>
        <OutlineButton href="/login" className="!px-4 !py-2">
          로그인
        </OutlineButton>
      </DocsSection>

      {isRE && (
        <DocsSection
          id="premium"
          step="08"
          eyebrow="이용 범위"
          title="무료로 되는 것과 프리미엄"
          visual={<PremiumVisual />}
          reverse
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <ElevatedCard className="!p-4">
              <Tag className="mb-2 !bg-electric-blue/10 !text-[11px]">무료</Tag>
              <ul className="space-y-1.5 font-display text-[13px] text-ink">
                <li>· 기출 올인원 개념</li>
                <li>· 부동산학개론 기출 전 연도</li>
                <li>· 다른 5과목 최근 2개년(2024–2025)</li>
                <li>· 커뮤니티·자료실·뉴스 읽기</li>
              </ul>
            </ElevatedCard>
            <ElevatedCard className="!border-carbon !bg-carbon !p-4 text-paper">
              <Tag className="mb-2 !border-paper/30 !bg-paper/10 !text-[11px] !text-paper">
                프리미엄
              </Tag>
              <ul className="space-y-1.5 font-display text-[13px] text-paper/95">
                <li>· 과거 연도 전체 해설·AI</li>
                <li>· 랜덤 · 오답 · 복습 연습</li>
                <li>· 연도/복습 PDF</li>
                <li>· PC앱에서도 같은 권한</li>
              </ul>
            </ElevatedCard>
          </div>
          <p className="font-display text-body-sm">
            프리미엄은 <strong className="text-ink">모바일 앱에서 과목별로 구매</strong>하고,
            받은 코드를 홈페이지 해당 과목 기출 페이지 하단「코드 등록」에 넣으면 됩니다.
            등록한 Google 계정으로 홈페이지와 PC앱이 함께 풀려요.
          </p>
          <OutlineButton href="/exam/civillaw#unlock" className="!px-4 !py-2">
            민법에서 코드 등록 위치 보기
          </OutlineButton>
        </DocsSection>
      )}

      <section id="apps" className="scroll-mt-28 border-t border-mist pt-14">
        <p className="mb-2 font-display text-[12px] font-semibold tracking-[0.08em] text-electric-blue">
          {isRE ? "09" : "07"} · 앱
        </p>
        <SectionHeading as="h2" className="mb-4">
          {isRE ? "모바일 앱과 PC앱" : "모바일 앱"}
        </SectionHeading>
        <div className={`grid gap-4 ${isRE ? "md:grid-cols-2" : ""}`}>
          <FeatureCard tint="ice">
            <Tag className="mb-3 !text-[11px]">모바일</Tag>
            <p className="font-display text-subheading font-semibold text-ink">
              봄기출 {label}
            </p>
            <p className="mt-2 font-display text-body-sm text-smoke">
              앱스토어·플레이스토어에서 설치해요. 앱 전용으로 더 많은 학습 모드가 있어요.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {storeLinks.ios ? (
                <a
                  href={storeLinks.ios}
                  className="rounded-full border border-carbon bg-paper px-3 py-1.5 font-display text-[12px] font-medium text-ink"
                  target="_blank"
                  rel="noreferrer"
                >
                  App Store
                </a>
              ) : null}
              <a
                href={storeLinks.android}
                className="rounded-full border border-carbon bg-paper px-3 py-1.5 font-display text-[12px] font-medium text-ink"
                target="_blank"
                rel="noreferrer"
              >
                Google Play
              </a>
            </div>
          </FeatureCard>
          {isRE && (
            <FeatureCard tint="lavender">
              <Tag className="mb-3 !text-[11px]">PC</Tag>
              <p className="font-display text-subheading font-semibold text-ink">PC앱</p>
              <p className="mt-2 font-display text-body-sm text-smoke">
                큰 화면에서 학습할 때는 PC앱을 쓰세요. 홈페이지에서 등록한 프리미엄이 그대로
                이어집니다.
              </p>
              <a
                href={PC_APP_URL}
                className="mt-4 inline-flex rounded-full border border-carbon bg-paper px-3 py-1.5 font-display text-[12px] font-medium text-ink"
                target="_blank"
                rel="noreferrer"
              >
                app.bomgichul.com
              </a>
            </FeatureCard>
          )}
        </div>
      </section>

      <ElevatedCard className="mt-12 p-6 text-center md:p-8">
        <SectionHeading as="h2" className="mb-3">
          바로 시작해 볼까요?
        </SectionHeading>
        <p className="mx-auto max-w-md font-display text-body-sm text-smoke">
          먼저 {label} 학습 홈에서 기출 올인원 한 과목만 열어봐도 충분해요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PrimaryButton href={hub}>{label} 학습 홈</PrimaryButton>
          <SecondaryButton href={community}>{label} 커뮤니티</SecondaryButton>
        </div>
      </ElevatedCard>
    </div>
  );
}
