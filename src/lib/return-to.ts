const CONCEPT_RETURN_PATTERN =
  /^\/(?:(?:public-service|police|housing|social-worker)\/)?concepts\/([^/]+)\/([^/?#]+)$/;

/** 개념 상세 등 내부 페이지로의 복귀 경로인지 검증한다. */
export function isValidReturnTo(path: string | undefined | null): path is string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return false;
  return CONCEPT_RETURN_PATTERN.test(path);
}

export function parseConceptReturnTo(path: string): { subject: string; slug: string } | null {
  if (!isValidReturnTo(path)) return null;
  const match = path.match(CONCEPT_RETURN_PATTERN);
  if (!match) return null;
  return { subject: match[1], slug: match[2] };
}

export function appendReturnTo(href: string, returnTo?: string): string {
  if (!returnTo || !isValidReturnTo(returnTo)) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}from=${encodeURIComponent(returnTo)}`;
}
