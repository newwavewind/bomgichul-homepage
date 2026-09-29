import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "개인정보처리방침",
  description:
    "봄기출 개인정보처리방침. 수집 항목, 이용 목적, 보유 기간, 제3자 제공, 이용자 권리 및 보호책임자를 안내합니다.",
  path: "/privacy",
});

const SECTIONS: { title: string; body: string[]; bullets?: string[] }[] = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: [],
    bullets: [
      "회원 가입·로그인(홈페이지 회원, 앱의 「기기 간 기록 동기화」): Apple·Google·카카오 로그인 때 제공자가 넘겨주는 이메일 주소와 이름(제공하는 경우), 인증 제공자 식별값, 공개 아이디(닉네임), 프로필 정보",
      "학습 서비스: 북마크, 오답·응시 기록, 메모, 학습 분석 및 등록한 학습권 정보",
      "앱의 기기 간 기록 동기화(로그인한 경우에만): 기출 풀이·복습 기록, 학습 일정, 메모",
      "앱의 오류 신고·의견 보내기: 이용자가 적은 내용과 해당 문항 정보(문항 번호·발문·선지)",
      "커뮤니티: 이용자가 작성한 게시글·댓글·채팅과 업로드 파일",
      "앱 구매 및 인증 관련: 기기 식별자, 구매 내역",
      "서비스 이용 과정에서 자동으로 생성되는 정보: 접속 로그, 이용 기록",
    ],
  },
  {
    title: "2. 개인정보의 수집 및 이용 목적",
    body: [],
    bullets: [
      "회원 식별, 로그인 및 프로필 관리",
      "학습 기록 저장, 오답·복습 및 학습 분석 제공",
      "여러 기기에서 같은 학습 기록을 이어서 쓰도록 동기화",
      "문항 오류 제보와 서비스 의견의 접수·답변",
      "커뮤니티와 회원 간 소통 기능 제공",
      "앱 내 유료 콘텐츠 구매 및 이용 권한 확인",
      "PC 학습 서비스 접근 코드 발급 및 인증",
      "서비스 개선 및 문의 응대",
    ],
  },
  {
    title: "3. 개인정보의 보유 및 이용기간",
    body: [
      "회사는 이용자의 개인정보를 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 관계법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.",
      "앱의 동기화 기록은 이용자가 앱에서 「동기화 계정 삭제」를 누르거나 회원 탈퇴를 할 때까지 보관하며, 그때 지체 없이 삭제합니다. 로그인하지 않고 앱을 쓰면 학습 기록은 이용자의 기기 안에만 저장되고 서버로 보내지 않습니다.",
    ],
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: [
      "회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 법령에 의거하거나 수사기관의 요청이 있는 경우는 예외로 합니다.",
      "Apple·Google·카카오 로그인은 각 회사의 인증을 거치며, 회사는 로그인 결과로 받은 위 1번의 정보만 이용합니다.",
    ],
  },
  {
    title: "5. 앱의 오류 신고와 의견",
    body: [
      "앱에서 보낸 문항 오류 신고와 의견은 봄기출 홈페이지의 해당 시험 커뮤니티(오류 신고·피드백 게시판)에 글로 등록되어 누구나 볼 수 있습니다. 작성자는 「봄기출앱」으로만 표시되고, 로그인 정보나 기기 식별자는 함께 보내지 않습니다.",
      "보내는 글에 이름·연락처 같은 개인정보를 적지 않도록 주의해 주세요. 등록된 글의 삭제는 아래 개인정보 보호책임자 이메일로 요청할 수 있습니다.",
    ],
  },
  {
    title: "6. AI 해설 기능",
    body: [
      "앱의 AI 해설을 이용하면, 답변을 만들기 위해 해당 문항과 보기, 봄기출이 만든 해설, 그리고 이용자가 추가로 입력한 질문이 외부 AI 서비스(Google, OpenAI)로 전달됩니다.",
      "만들어진 해설은 해설 품질을 다듬기 위해 보관됩니다. 이때 기기 식별자와 이용자가 입력한 질문은 함께 저장하지 않으므로, 보관된 해설은 특정 이용자와 연결되지 않습니다.",
      "「다른 AI로 물어보기」를 누르면 문항 글이 이용자가 고른 외부 서비스(ChatGPT·Gemini·Claude·Perplexity 등)의 앱이나 웹으로 넘어가며, 그 뒤의 처리는 해당 서비스의 방침을 따릅니다.",
    ],
  },
  {
    title: "7. 이용자의 권리",
    body: [
      "이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회·수정할 수 있습니다. 로그인 후 프로필의 '회원 탈퇴'에서 계정과 관련 개인정보를 직접 삭제할 수 있으며, 직접 처리가 어려운 경우 개인정보 보호책임자 이메일로 삭제를 요청할 수 있습니다.",
      "앱에서는 복습 화면의 「동기화 계정 삭제」로 그 앱이 서버에 올린 학습 기록을 바로 지울 수 있습니다.",
    ],
  },
  {
    title: "8. 개인정보 보호책임자",
    body: [],
    bullets: ["담당자: 김상현", "이메일: rotkdgus5@naver.com"],
  },
  {
    title: "9. 시행일자",
    body: [
      "이 개인정보처리방침은 2026년 7월 14일부터 시행되었으며, AI 해설 기능에 관한 내용을 더해 2026년 8월 22일, Apple·카카오 로그인과 앱의 기록 동기화·오류 신고에 관한 내용을 더해 2026년 9월 29일 개정되었습니다.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mx-auto max-w-2xl">
          <EyebrowLabel className="mb-2">LEGAL</EyebrowLabel>
          <SectionHeading as="h1">개인정보처리방침</SectionHeading>
          <p className="mt-4 font-display text-body leading-relaxed text-smoke">
            봄기출(사업자등록번호: 381-03-03800, 이하 &apos;회사&apos;)은 이용자의 개인정보를
            중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
          </p>

          <div className="mt-10 space-y-8">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-display text-body-sm leading-relaxed text-smoke"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 font-display text-body-sm leading-relaxed text-smoke">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
