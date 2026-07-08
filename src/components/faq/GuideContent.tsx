import { HandCaption, SectionHeading } from "@/components/ui/Typography";
import { FeatureCard, ElevatedCard } from "@/components/ui/Card";
import { PrimaryButton, SecondaryButton, OutlineButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { EXAM_SUBJECTS, PC_APP_URL, APP_LINKS } from "@/lib/constants";

const WHY_POINTS = [
  {
    icon: "🤖",
    title: "AI에게 물어볼 질문까지 대신 준비",
    description:
      "AI는 답을 잘하지만 무엇을 물어야 할지 막막할 때가 있어요. 지문·보기·해설을 바탕으로 GPT·Gemini·Claude에 바로 붙여넣을 질문을 자동으로 만들어 드립니다.",
  },
  {
    icon: "📚",
    title: "10년치 기출, 문항 단위 해설",
    description:
      "2016~2025년 공인중개사 1·2차 전 과목 기출문제를 연도·문항 단위로 정리해, 정답 확인과 동시에 해설을 바로 볼 수 있어요.",
  },
  {
    icon: "🎁",
    title: "일단 무료로 충분히 체험",
    description:
      "로그인 없이 오늘의 기출 O/X를 바로 풀어볼 수 있고, 부동산학개론은 전 연도가 출시 이벤트로 무료 공개 중이에요. 나머지 5과목도 최근 2개년(2024·2025)은 기본 무료입니다.",
  },
  {
    icon: "💬",
    title: "같은 시험을 준비하는 사람들과 함께",
    description:
      "커뮤니티·자료실에서 정보를 나누고, 우측 하단 채팅으로 지금 접속 중인 수험생과 1:1로 바로 이야기할 수 있어요.",
  },
];

const FEATURES = [
  {
    icon: "✏️",
    tag: "학습",
    title: "기출문제 O/X 학습",
    description:
      "연도·과목별 기출문제를 문항 단위로 풀고, 정답 확인 시 해설과 AI 질문 버튼이 함께 열려요.",
    href: "/exam",
    cta: "기출문제 보러가기",
  },
  {
    icon: "⏱️",
    tag: "시험모드",
    title: "시험 모드",
    description:
      "해당 연도 전체 문항을 실전처럼 한 번에 풀고 제출하면 일괄 채점·해설을 확인해요. 최근 2개년은 무료로 풀어볼 수 있고, 점수 기록 저장은 해당 과목 프리미엄 해제 후 가능해요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "🎲",
    tag: "프리미엄",
    title: "랜덤 문제 연습",
    description: "연도·단원 필터와 문항 수를 골라, 전체 기출 중 원하는 범위를 무작위로 연습해요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "❌",
    tag: "프리미엄",
    title: "오답노트 연습",
    description: "틀렸다고 표시한 문제만 모아 반복 연습하고 바로 해설을 확인해요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "🔁",
    tag: "프리미엄",
    title: "오늘의 복습",
    description: "오답·북마크·약점 단원·D-day를 반영해 매일 맞춤 복습 큐를 받아요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "🧠",
    tag: "AI",
    title: "AI 질문 (GPT·Gemini·Claude)",
    description: "지문·보기·해설을 담은 질문을 자동으로 만들어, 버튼 한 번으로 AI에게 물어봐요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "📄",
    tag: "프리미엄",
    title: "PDF 다운로드",
    description: "연도별 전체 문항과 해설이 담긴 PDF를 내려받아 오프라인으로 학습해요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "📒",
    tag: "프리미엄",
    title: "복습 PDF",
    description: "내가 북마크·메모로 남긴 문제만 모아 나만의 복습 PDF로 만들어요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "📊",
    tag: "내 프로필",
    title: "학습 통계",
    description: "해제한 과목별 단원 정답률 그래프와 연도별 정답률 히트맵을 확인해요.",
    href: "/profile",
    cta: "내 프로필 보기",
  },
  {
    icon: "📝",
    tag: "기출",
    title: "문제별 메모",
    description: "각 문항 페이지에 누구나 볼 수 있는 메모를 남기고, 헷갈린 포인트를 함께 정리해요.",
    href: "/exam",
    cta: "과목 선택하기",
  },
  {
    icon: "⭐",
    tag: "학습",
    title: "북마크",
    description: "다시 보고 싶은 문제를 별표로 저장하고, 내 프로필에서 모아 볼 수 있어요.",
    href: "/profile",
    cta: "내 프로필 보기",
  },
  {
    icon: "💬",
    tag: "커뮤니티",
    title: "게시판 & 자료실",
    description: "자유게시판·질문·자료공유·수험정보·합격후기 글을 나누고, 기출·노트·요약 파일을 올리고 받아요.",
    href: "/community",
    cta: "커뮤니티 보기",
  },
  {
    icon: "🗨️",
    tag: "실시간",
    title: "1:1 채팅",
    description: "화면 우측 하단 채팅 버튼으로 지금 접속 중인 수험생에게 실시간 DM을 보낼 수 있어요.",
    href: "/community",
    cta: "커뮤니티 보기",
  },
  {
    icon: "📔",
    tag: "매일",
    title: "수험일기",
    description: "시험일까지 D-day를 기준으로 다른 수험생의 공개 일기를 읽고, 오늘의 내 일기를 남겨요.",
    href: "/diary",
    cta: "수험일기 보기",
  },
];

const STEPS = [
  {
    title: "모바일 앱에서 과목 구매",
    description:
      "iOS·Android 앱스토어에서 「봄기출 공인중개사」를 설치하고, 앱 안에서 원하는 과목의 프리미엄을 구매해요. 프리미엄 코드는 모바일 앱 구매에서만 발급되며, PC앱에서는 구매할 수 없어요. 과목별로 따로 구매합니다.",
  },
  {
    title: "구매 완료 시 발급되는 PC 학습 코드 확인",
    description: "구매가 끝나면 앱에서 「BOM-XXXX-XXXX」 형태의 PC 학습 코드가 발급돼요.",
  },
  {
    title: "이 홈페이지에 로그인",
    description:
      "코드는 등록하는 순간 현재 로그인한 계정에 귀속됩니다. 한 번 등록한 코드는 다른 계정에 다시 등록할 수 없으니, 반드시 사용할 계정으로 로그인한 뒤 등록하세요.",
  },
  {
    title: "과목 페이지 하단 「코드 등록」에 입력",
    description:
      "기출문제 과목 페이지(예: 부동산학개론, 민법)로 이동해 아래로 스크롤하면 코드 등록 칸이 있어요. 코드를 입력하고 등록 버튼을 누르면 끝!",
  },
  {
    title: "그 과목의 전체 기능이 바로 열려요",
    description:
      "전체 연도(2016~2025) 해설, AI 질문, 랜덤 문제, 오답노트, 오늘의 복습, PDF 다운로드, 학습 통계까지 등록한 과목에서 모두 이용할 수 있어요.",
  },
];

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border-[1.5px] border-carbon bg-electric-blue font-display text-body-sm font-bold text-paper">
      {n}
    </span>
  );
}

export function GuideContent() {
  return (
    <>
      <section className="mb-16">
        <div className="mb-8 max-w-xl">
          <HandCaption className="mb-2">왜 봄기출인가요</HandCaption>
          <SectionHeading as="h2">공부는 당신이, 질문은 봄기출이</SectionHeading>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY_POINTS.map((point, i) => (
            <FeatureCard key={point.title} tint={(["ice", "lavender", "snow", "none"] as const)[i % 4]}>
              <div className="mb-3 text-2xl">{point.icon}</div>
              <h3 className="mb-2 font-display text-subheading font-semibold text-ink">{point.title}</h3>
              <p className="font-display text-body-sm leading-relaxed text-smoke">{point.description}</p>
            </FeatureCard>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-8 max-w-xl">
          <HandCaption className="mb-2">무료 vs 프리미엄</HandCaption>
          <SectionHeading as="h2">어디까지 무료로 되나요?</SectionHeading>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ElevatedCard className="p-6">
            <Tag className="mb-4">무료로 되는 것</Tag>
            <ul className="space-y-2.5 font-display text-body-sm leading-relaxed text-ink">
              <li>· 로그인 없이 「오늘의 기출 O/X」 바로 체험</li>
              <li>· 부동산학개론 2016~2025년 전 연도 기출·해설·랜덤·AI 질문 (출시 이벤트)</li>
              <li>
                · 나머지 5과목(민법·공인중개사법·부동산공시법·부동산세법·부동산공법)의 2024·2025년 기출
                해설 + 시험 모드
              </li>
            </ul>
          </ElevatedCard>
          <ElevatedCard className="p-6">
            <Tag className="mb-4">과목별 프리미엄 구매 시</Tag>
            <ul className="space-y-2.5 font-display text-body-sm leading-relaxed text-ink">
              <li>· 해당 과목 2016~2025년 전체 연도 문항 해설</li>
              <li>· 랜덤 문제, 오답노트 연습, 오늘의 복습</li>
              <li>· 과목별 학습 통계와 정답률 확인</li>
              <li>· 연도별 PDF 다운로드, 북마크·메모 모음 복습 PDF</li>
            </ul>
          </ElevatedCard>
        </div>
        <p className="mt-4 font-display text-body-sm text-fog">
          프리미엄은 과목 단위로 구매해요. 예를 들어 민법만 구매하면 민법만 전체 이용할 수 있고, 다른
          과목은 그대로 무료 범위만 적용됩니다. 모바일 앱의 무료·프리미엄 범위는 스토어 앱 기준이며, 이
          홈페이지와 다를 수 있어요.
        </p>
      </section>

      <section id="code" className="mb-16 scroll-mt-24">
        <div className="mb-8 max-w-xl">
          <HandCaption className="mb-2">가장 많이 물어보는 것</HandCaption>
          <SectionHeading as="h2">프리미엄 코드, 어떻게 받고 등록하나요?</SectionHeading>
          <p className="mt-3 font-display text-body-sm text-smoke">
            결제는 모바일 앱에서, 코드 등록은 이 홈페이지에서 — 한 번만 등록해두면 이후로는 그냥
            로그인해서 쓰면 됩니다.
          </p>
        </div>
        <ElevatedCard className="p-6 md:p-8">
          <ol className="space-y-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <StepNumber n={i + 1} />
                <div>
                  <p className="font-display text-body font-semibold text-ink">{step.title}</p>
                  <p className="mt-1 font-display text-body-sm leading-relaxed text-smoke">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </ElevatedCard>
        <div className="mt-5 flex flex-wrap gap-3">
          <PrimaryButton href={APP_LINKS.android}>Google Play에서 구매하기</PrimaryButton>
          <SecondaryButton href={APP_LINKS.ios}>App Store에서 구매하기</SecondaryButton>
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-8 max-w-xl">
          <HandCaption className="mb-2">기능 하나씩</HandCaption>
          <SectionHeading as="h2">봄기출 홈페이지 기능 전체 보기</SectionHeading>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} tint={(["none", "ice", "lavender", "snow"] as const)[i % 4]}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-2xl">{feature.icon}</span>
                <Tag className="!px-2.5 !py-0.5 !text-[12px]">{feature.tag}</Tag>
              </div>
              <h3 className="mb-2 font-display text-subheading font-semibold text-ink">{feature.title}</h3>
              <p className="mb-4 font-display text-body-sm leading-relaxed text-smoke">{feature.description}</p>
              <OutlineButton href={feature.href} className="!px-0 !text-electric-blue hover:!bg-transparent">
                {feature.cta} →
              </OutlineButton>
            </FeatureCard>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-8 max-w-xl">
          <HandCaption className="mb-2">과목 바로가기</HandCaption>
          <SectionHeading as="h2">공부할 과목을 선택하세요</SectionHeading>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAM_SUBJECTS.map((s) => (
            <Tag key={s.value}>
              <a href={`/exam/${s.value}`}>{s.label}</a>
            </Tag>
          ))}
        </div>
        <p className="mt-6 font-display text-body-sm text-smoke">
          개념카드·빈칸 채우기·용어집·출제 통계 히트맵은 모바일 앱과{" "}
          <a href={PC_APP_URL} className="text-electric-blue underline">
            PC앱
          </a>{" "}
          전용 기능이에요. 이 홈페이지에서 코드를 등록한 계정으로 PC앱에 로그인하면 그대로 이용할 수
          있습니다.
        </p>
      </section>
    </>
  );
}
