import type { CommunityScope } from "@/types/database";
import { EXAM_SUBJECTS, PC_APP_URL } from "@/lib/constants";
import {
  archiveBaseHref,
  communityBaseHref,
  communityScopeLabel,
  faqBaseHref,
  trackHubHref,
} from "./community";

export function isCommunitySectionPath(
  pathname: string,
  scope: CommunityScope,
): boolean {
  const community = communityBaseHref(scope);
  const archive = archiveBaseHref(scope);
  const faq = faqBaseHref(scope);
  return (
    pathname === community ||
    pathname.startsWith(`${community}/`) ||
    pathname === archive ||
    pathname.startsWith(`${archive}/`) ||
    pathname === faq ||
    pathname.startsWith(`${faq}/`) ||
    (scope === "real_estate" &&
      (pathname === "/news" || pathname.startsWith("/news/")))
  );
}

export type NavSubject = {
  id: string;
  label: string;
  conceptsHref: string;
  examHref: string;
};

export type NavTool = {
  href: string;
  label: string;
  /** 외부 사이트(PC앱 등) — 새 탭으로 연다 */
  external?: boolean;
};

export type TrackNavContext = {
  mode: "track";
  scope: CommunityScope;
  label: string;
  shortLabel: string;
  hubHref: string;
  subjects: NavSubject[];
  tools: NavTool[];
};

export type HomeNavContext = {
  mode: "home";
};

export type NavContext = TrackNavContext | HomeNavContext;

const POLICE_SUBJECTS: { id: string; label: string }[] = [
  { id: "constitution", label: "헌법" },
  { id: "criminal-law", label: "형사법" },
  { id: "police-science", label: "경찰학" },
];

const HOUSING_SUBJECTS: { id: string; label: string }[] = [
  { id: "accounting", label: "회계원리" },
  { id: "facilities", label: "시설개론" },
  { id: "civil-law", label: "민법" },
  { id: "housing-law", label: "관계법규" },
  { id: "housing-admin", label: "관리실무" },
];

const SOCIAL_WORKER_SUBJECTS: { id: string; label: string }[] = [
  { id: "human-behavior", label: "인간행동" },
  { id: "research", label: "조사론" },
  { id: "practice", label: "실천론" },
  { id: "practice-skills", label: "실천기술론" },
  { id: "community", label: "지역사회" },
  { id: "policy", label: "정책론" },
  { id: "administration", label: "행정론" },
  { id: "law", label: "법제론" },
];

/** 한국사능력검정은 급수가 곧 과목 — 지금은 심화 하나뿐이다. */
const HISTORY_SUBJECTS: { id: string; label: string }[] = [
  { id: "simhwa", label: "심화" },
];

/** 헤더에 바로 보이는 공무원 주요 과목 (나머지는 학습 홈에서) */
const PUBLIC_SERVICE_SUBJECTS: { id: string; label: string }[] = [
  { id: "hangjunghak", label: "행정학" },
  { id: "haengjeongbeop", label: "행정법" },
  { id: "hyeongbeop", label: "형법" },
  { id: "hyeongso", label: "형소법" },
  { id: "sebeop", label: "세법" },
  { id: "bokji", label: "사회복지" },
  { id: "sobang", label: "소방학" },
];

function subjectsForScope(scope: CommunityScope): NavSubject[] {
  const hub = trackHubHref(scope);
  if (scope === "real_estate") {
    const short: Record<string, string> = {
      realestate: "학개론",
      civillaw: "민법",
      "broker-law": "중개사법",
      "registry-law": "공시법",
      "realestate-tax": "세법",
      "realestate-public-law": "공법",
    };
    return EXAM_SUBJECTS.map((s) => ({
      id: s.value,
      label: short[s.value] ?? s.label,
      conceptsHref: `/concepts/${s.value}`,
      examHref: `/exam/${s.value}`,
    }));
  }
  const list =
    scope === "police"
      ? POLICE_SUBJECTS
      : scope === "housing"
        ? HOUSING_SUBJECTS
        : scope === "social_worker"
          ? SOCIAL_WORKER_SUBJECTS
          : scope === "history"
            ? HISTORY_SUBJECTS
            : PUBLIC_SERVICE_SUBJECTS;
  return list.map((s) => ({
    id: s.id,
    label: s.label,
    conceptsHref: `${hub}/concepts/${s.id}`,
    examHref: `${hub}/exam/${s.id}`,
  }));
}

function toolsForScope(scope: CommunityScope): NavTool[] {
  const hub = trackHubHref(scope);
  const tools: NavTool[] = [
    { href: hub, label: "학습 홈" },
    { href: communityBaseHref(scope), label: "커뮤니티" },
  ];
  // PC앱은 공인중개사만 있다. 다른 시험 화면이나 시험 선택 홈에서는 띄우지 않는다.
  if (scope === "real_estate") {
    tools.push({ href: PC_APP_URL, label: "PC앱", external: true });
  }
  return tools;
}

/** RE 전용 경로인지 (다른 시험 접두 없음) */
function isRealEstatePath(pathname: string): boolean {
  if (pathname.startsWith("/police")) return false;
  if (pathname.startsWith("/housing")) return false;
  if (pathname.startsWith("/social-worker")) return false;
  if (pathname.startsWith("/history")) return false;
  if (pathname.startsWith("/public-service")) return false;
  if (pathname === "/") return false;
  return (
    pathname.startsWith("/real-estate") ||
    pathname.startsWith("/concepts") ||
    pathname.startsWith("/exam") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/archive") ||
    pathname.startsWith("/news") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/subjects") ||
    pathname.startsWith("/ranks") ||
    pathname.startsWith("/study")
  );
}

export function resolveNavContext(pathname: string | null | undefined): NavContext {
  const path = pathname ?? "/";
  if (path.startsWith("/police")) {
    return {
      mode: "track",
      scope: "police",
      label: communityScopeLabel("police"),
      shortLabel: "경찰",
      hubHref: trackHubHref("police"),
      subjects: subjectsForScope("police"),
      tools: toolsForScope("police"),
    };
  }
  if (path.startsWith("/housing")) {
    return {
      mode: "track",
      scope: "housing",
      label: communityScopeLabel("housing"),
      shortLabel: "주택",
      hubHref: trackHubHref("housing"),
      subjects: subjectsForScope("housing"),
      tools: toolsForScope("housing"),
    };
  }
  if (path.startsWith("/social-worker")) {
    return {
      mode: "track",
      scope: "social_worker",
      label: communityScopeLabel("social_worker"),
      shortLabel: "복지사",
      hubHref: trackHubHref("social_worker"),
      subjects: subjectsForScope("social_worker"),
      tools: toolsForScope("social_worker"),
    };
  }
  if (path.startsWith("/history")) {
    return {
      mode: "track",
      scope: "history",
      label: communityScopeLabel("history"),
      shortLabel: "한국사",
      hubHref: trackHubHref("history"),
      subjects: subjectsForScope("history"),
      tools: toolsForScope("history"),
    };
  }
  if (path.startsWith("/public-service")) {
    return {
      mode: "track",
      scope: "public_service",
      label: communityScopeLabel("public_service"),
      shortLabel: "공무원",
      hubHref: trackHubHref("public_service"),
      subjects: subjectsForScope("public_service"),
      tools: toolsForScope("public_service"),
    };
  }
  if (isRealEstatePath(path)) {
    return {
      mode: "track",
      scope: "real_estate",
      label: communityScopeLabel("real_estate"),
      shortLabel: "중개사",
      hubHref: trackHubHref("real_estate"),
      subjects: subjectsForScope("real_estate"),
      tools: toolsForScope("real_estate"),
    };
  }
  return { mode: "home" };
}

export function activeSubjectId(
  pathname: string,
  subjects: NavSubject[],
): string | null {
  for (const s of subjects) {
    if (
      pathname.includes(`/concepts/${s.id}`) ||
      pathname.includes(`/exam/${s.id}`) ||
      pathname.includes(`/subjects/${s.id}`)
    ) {
      return s.id;
    }
  }
  return null;
}
