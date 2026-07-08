import { createAdminClient } from "@/lib/supabase/admin";
import { subjectFromProductType } from "@/lib/premium-subjects";
import type { ExamSubject } from "@/lib/exam-questions";

const FIRST_ROUND_SUBJECTS: ExamSubject[] = ["realestate", "civillaw"];
const SECOND_ROUND_SUBJECTS: ExamSubject[] = [
  "broker-law",
  "registry-law",
  "realestate-tax",
  "realestate-public-law",
];

function computeBadgeLabel(subjects: Set<ExamSubject>): string | null {
  if (subjects.size === 0) return null;

  const hasAllFirst = FIRST_ROUND_SUBJECTS.every((s) => subjects.has(s));
  const hasAllSecond = SECOND_ROUND_SUBJECTS.every((s) => subjects.has(s));

  if (hasAllFirst && hasAllSecond) return "전과목 인증";
  if (hasAllFirst) return "1차 전과목 인증";
  if (hasAllSecond) return "2차 전과목 인증";
  return `${subjects.size}과목 인증`;
}

/**
 * 여러 사용자의 프리미엄 배지를 한 번에 조회한다 (커뮤니티 목록/상세용).
 * user_entitlements는 본인 것만 SELECT 가능한 RLS라, 다른 사용자의 배지를
 * 보여주려면 서비스 롤(admin client)로 조회해야 한다. 서비스 롤 키가 없으면
 * (로컬 개발 등) 조용히 빈 배지 목록을 반환한다 — 배지가 안 보일 뿐 페이지는
 * 정상 동작해야 한다.
 */
export async function getPremiumBadgesForUsers(
  userIds: string[]
): Promise<Record<string, string>> {
  const uniqueIds = [...new Set(userIds)].filter(Boolean);
  if (uniqueIds.length === 0) return {};

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {};
  }

  const { data, error } = await admin
    .from("user_entitlements")
    .select("user_id, product_type, expires_at")
    .in("user_id", uniqueIds)
    .eq("status", "active");

  if (error || !data) return {};

  const now = Date.now();
  const subjectsByUser = new Map<string, Set<ExamSubject>>();
  for (const row of data) {
    if (row.expires_at && new Date(row.expires_at).getTime() <= now) continue;
    const subject = subjectFromProductType(row.product_type);
    if (!subject) continue;
    const set = subjectsByUser.get(row.user_id) ?? new Set<ExamSubject>();
    set.add(subject);
    subjectsByUser.set(row.user_id, set);
  }

  const labels: Record<string, string> = {};
  for (const [userId, subjects] of subjectsByUser) {
    const label = computeBadgeLabel(subjects);
    if (label) labels[userId] = label;
  }
  return labels;
}

export async function getPremiumBadgeForUser(userId: string): Promise<string | null> {
  const labels = await getPremiumBadgesForUsers([userId]);
  return labels[userId] ?? null;
}
