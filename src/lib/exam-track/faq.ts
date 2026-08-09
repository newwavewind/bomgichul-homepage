import type { CommunityScope } from "@/types/database";
import { FAQ_ITEMS } from "@/lib/constants";
import {
  communityBaseHref,
  communityScopeLabel,
  trackHubHref,
} from "./community";

export type FaqItem = { question: string; answer: string };

const SHARED_TAIL: FaqItem[] = [
  {
    question: "로그인하면 뭐가 달라지나요?",
    answer:
      "커뮤니티·자료실 글쓰기, 북마크·풀이 기록·오답 저장, 알림을 쓸 수 있어요. Google 계정만 있으면 됩니다.",
  },
  {
    question: "커뮤니티와 자료실의 차이는요?",
    answer:
      "커뮤니티는 글·댓글로 질문과 정보를 나누는 게시판이고, 자료실은 PDF·노트·요약 같은 파일을 올리거나 받는 공간입니다. 둘 다 읽기는 열려 있고, 작성·업로드는 로그인이 필요합니다.",
  },
];

function trackFaq(scope: Exclude<CommunityScope, "real_estate">): FaqItem[] {
  const label = communityScopeLabel(scope);
  const hub = trackHubHref(scope);
  const community = communityBaseHref(scope);

  return [
    {
      question: "홈페이지에서 가장 먼저 뭘 하면 되나요?",
      answer: `${label} 학습 홈(${hub})에서 「기출 all-in-one」이나 「기출문제」 중 한 과목을 고르면 됩니다. 로그인 없이도 공개 범위까지 바로 볼 수 있어요.`,
    },
    {
      question: "기출 all-in-one과 기출문제는 어떻게 다른가요?",
      answer:
        "기출 all-in-one은 주제(개념) 단위로 정리·학습맵·기출 지문을 보는 곳이고, 기출문제는 연도·문항 단위로 O/X를 푸는 곳입니다. 같은 과목을 두 방식으로 이어 공부할 수 있어요.",
    },
    {
      question: "무엇을 무료로 쓸 수 있나요?",
      answer: `${label} 기출 all-in-one 개념과 공개 기출, 커뮤니티·자료실 읽기는 로그인 없이 가능합니다. 앱 전용 기능·전체 해설 범위는 앱 안내를 확인해 주세요.`,
    },
    ...SHARED_TAIL,
    {
      question: `${label} 커뮤니티는 어디에 있나요?`,
      answer: `${community} 에서 ${label} 수험생끼리 질문·수험정보를 나눕니다. 다른 시험 커뮤니티 글과는 섞이지 않습니다.`,
    },
  ];
}

export function faqItemsForScope(scope: CommunityScope): FaqItem[] {
  if (scope === "real_estate") return [...FAQ_ITEMS];
  return trackFaq(scope);
}

export function faqDescription(scope: CommunityScope): string {
  const label = communityScopeLabel(scope);
  if (scope === "real_estate") {
    return "봄기출 공인중개사 홈페이지 이용 안내. 학습 홈, 기출 all-in-one, 기출문제, 커뮤니티, 자료실, 무료·프리미엄을 쉽게 설명합니다.";
  }
  return `봄기출 ${label} 이용 안내. 학습 홈, 기출 all-in-one, 기출문제, 커뮤니티, 자료실을 쉽게 설명합니다.`;
}
