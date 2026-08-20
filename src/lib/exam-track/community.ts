import type { CommunityScope } from "@/types/database";
import { ENGLISH_TRACK, HISTORY_TRACK, HOUSING_TRACK, POLICE_TRACK, SOCIAL_WORKER_TRACK } from "./config";

export type { CommunityScope };

export function communityScopeLabel(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "공무원";
    case "police":
      return "경찰공무원";
    case "housing":
      return "주택관리사";
    case "social_worker":
      return "사회복지사 1급";
    case "history":
      return "한국사능력검정";
    case "english":
      return "공무원 영어";
    default:
      return "공인중개사";
  }
}

export function trackHubHref(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "/public-service";
    case "police":
      return POLICE_TRACK.basePath;
    case "housing":
      return HOUSING_TRACK.basePath;
    case "social_worker":
      return SOCIAL_WORKER_TRACK.basePath;
    case "history":
      return HISTORY_TRACK.basePath;
    case "english":
      return ENGLISH_TRACK.basePath;
    default:
      return "/real-estate";
  }
}

export function communityBaseHref(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "/public-service/community";
    case "police":
      return `${POLICE_TRACK.basePath}/community`;
    case "housing":
      return `${HOUSING_TRACK.basePath}/community`;
    case "social_worker":
      return `${SOCIAL_WORKER_TRACK.basePath}/community`;
    case "history":
      return `${HISTORY_TRACK.basePath}/community`;
    case "english":
      return `${ENGLISH_TRACK.basePath}/community`;
    default:
      return "/community";
  }
}

export function archiveBaseHref(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "/public-service/archive";
    case "police":
      return `${POLICE_TRACK.basePath}/archive`;
    case "housing":
      return `${HOUSING_TRACK.basePath}/archive`;
    case "social_worker":
      return `${SOCIAL_WORKER_TRACK.basePath}/archive`;
    case "history":
      return `${HISTORY_TRACK.basePath}/archive`;
    case "english":
      return `${ENGLISH_TRACK.basePath}/archive`;
    default:
      return "/archive";
  }
}

export function diaryBaseHref(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "/public-service/diary";
    case "police":
      return `${POLICE_TRACK.basePath}/diary`;
    case "housing":
      return `${HOUSING_TRACK.basePath}/diary`;
    case "social_worker":
      return `${SOCIAL_WORKER_TRACK.basePath}/diary`;
    case "history":
      return `${HISTORY_TRACK.basePath}/diary`;
    case "english":
      return `${ENGLISH_TRACK.basePath}/diary`;
    default:
      return "/diary";
  }
}

export function faqBaseHref(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "/public-service/faq";
    case "police":
      return `${POLICE_TRACK.basePath}/faq`;
    case "housing":
      return `${HOUSING_TRACK.basePath}/faq`;
    case "social_worker":
      return `${SOCIAL_WORKER_TRACK.basePath}/faq`;
    case "history":
      return `${HISTORY_TRACK.basePath}/faq`;
    case "english":
      return `${ENGLISH_TRACK.basePath}/faq`;
    default:
      return "/faq";
  }
}

export function communityTitle(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "공무원 수험생 커뮤니티";
    case "police":
      return POLICE_TRACK.communityTitle;
    case "housing":
      return HOUSING_TRACK.communityTitle;
    case "social_worker":
      return SOCIAL_WORKER_TRACK.communityTitle;
    case "history":
      return HISTORY_TRACK.communityTitle;
    case "english":
      return ENGLISH_TRACK.communityTitle;
    default:
      return "공인중개사 수험생 커뮤니티";
  }
}

export function archiveTitle(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "공무원 자료실";
    case "police":
      return "경찰공무원 자료실";
    case "housing":
      return "주택관리사 자료실";
    case "social_worker":
      return "사회복지사 1급 자료실";
    case "history":
      return "한국사능력검정 자료실";
    case "english":
      return "공무원 영어 자료실";
    default:
      return "공인중개사 자료실";
  }
}

export function archiveEyebrow(scope: CommunityScope): string {
  switch (scope) {
    case "public_service":
      return "공무원 수험 자료 공유";
    case "police":
      return "경찰공무원 수험 자료 공유";
    case "housing":
      return "주택관리사 수험 자료 공유";
    case "social_worker":
      return "사회복지사 1급 수험 자료 공유";
    case "history":
      return "한국사능력검정 수험 자료 공유";
    case "english":
      return "공무원 영어 수험 자료 공유";
    default:
      return "공인중개사 수험 자료 공유";
  }
}

export function diaryTitle(scope: CommunityScope): string {
  return `${communityScopeLabel(scope)} 수험일기`;
}

export function diaryEyebrow(scope: CommunityScope): string {
  return `${communityScopeLabel(scope)} 공개 수험 기록`;
}

export function faqTitle(scope: CommunityScope): string {
  return `${communityScopeLabel(scope)} 이용 안내`;
}

export function isValidCommunityScope(value: string | null | undefined): value is CommunityScope {
  return (
    value === "real_estate" ||
    value === "public_service" ||
    value === "police" ||
    value === "housing" ||
    value === "social_worker" ||
    value === "history" ||
    // 영어 게시판을 여기 빠뜨리면 DB 는 받는데 API 가 400 으로 막는다.
    // 앱은 「전송 실패」만 보여 주고 어디가 막혔는지 알 길이 없다.
    value === "english"
  );
}

export function scopeFromPathname(pathname: string | null | undefined): CommunityScope {
  if (!pathname) return "real_estate";
  if (pathname.startsWith("/police")) return "police";
  if (pathname.startsWith("/housing")) return "housing";
  if (pathname.startsWith("/social-worker")) return "social_worker";
  if (pathname.startsWith("/history")) return "history";
  if (pathname.startsWith("/public-service")) return "public_service";
  return "real_estate";
}
