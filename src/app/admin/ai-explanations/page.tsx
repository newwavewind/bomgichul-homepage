import Link from "next/link";
import {
  getAiExplanationDateSummaries,
  getAiExplanationGroups,
  getAiExplanationOverview,
  getAiExplanationSubjects,
  getAiExplanationVariants,
  type AiExplanationGroupRow,
  type AiLogKind,
} from "@/lib/admin";
import { formatDateTime } from "@/components/admin/AdminUi";
import { AiAnswerBody } from "@/components/admin/AiAnswerBody";
import { AiExplanationDateCalendar } from "@/components/admin/AiExplanationDateCalendar";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";
import { formatKstDateLong } from "@/lib/datetime";
import { parseKstDateKey, toKstDateKey } from "@/lib/site-visits";

type SearchParams = Promise<{
  subject?: string;
  exam?: string;
  item?: string;
  date?: string;
}>;

/**
 * 앱이 보내는 과목 id → 사람이 읽는 이름.
 *
 * 「broker:civillaw」처럼 앱을 앞에 달고 온다. 여섯 앱이 서로를 베껴 세워져
 * 과목 id 가 겹친다 — 경찰 앱도 폴더/슬롯 id 는 공인중개사 것을 그대로 쓰고
 * (registry-law 등) 화면 라벨만 헌법·형사법·경찰학으로 바꾼다. 그래서 표시는
 * 앱별 덮어쓰기가 필요하다.
 */
/** 앱 접두 → 제품명 (필터 묶음·목록 표시 공통) */
const APP_LABELS: Record<string, string> = {
  broker: "공인중개사",
  admin: "공무원",
  police: "경찰공무원",
  housing: "주택관리사",
  social: "사회복지사1급",
  english: "공무원영어",
  history: "한국사능력검정시험",
};

/** 필터·묶음에 쓰는 앱 순서 */
const APP_ORDER = [
  "broker",
  "admin",
  "police",
  "housing",
  "social",
  "english",
  "history",
] as const;

/**
 * 경찰 앱: 슬롯 id → 실제 과목명
 * @see policebomgichul/src/subjects/registry.ts
 */
const POLICE_SLOT_LABELS: Record<string, string> = {
  "registry-law": "헌법",
  "realestate-tax": "형사법",
  "broker-law": "경찰학",
  heonbeop: "헌법",
  constitution: "헌법",
  "criminal-law": "형사법",
  hyeongsabeop: "형사법",
  "police-science": "경찰학",
  gyeongchalhak: "경찰학",
};

/** 앱 접두별 슬롯 라벨 덮어쓰기 (공인중개사 기본 맵보다 우선) */
const APP_SUBJECT_SLUG_OVERRIDES: Record<string, Record<string, string>> = {
  police: POLICE_SLOT_LABELS,
};

/** 콜론 뒤 과목 슬러그 → 한국어 (공인중개사·공통 기본값) */
const SUBJECT_SLUG_LABELS: Record<string, string> = {
  civillaw: "민법",
  "broker-law": "공인중개사법",
  "realestate-public-law": "부동산공법",
  "realestate-tax": "부동산세법",
  "registry-law": "부동산공시법령",
  realestate: "부동산학개론",
  heonbeop: "헌법",
  hyeongsabeop: "형사법",
  gyeongchalhak: "경찰학",
  constitution: "헌법",
  "criminal-law": "형사법",
  "police-science": "경찰학",
  haengjeongbeop: "행정법총론",
  hangjunghak: "행정학개론",
  haengjeonghak: "행정학개론",
  gyoyukhak: "교육학개론",
  nodongbeop: "노동법개론",
  gukjebeop: "국제법개론",
  bokji: "사회복지학개론",
  sahoebokji: "사회복지학개론",
  sebeop: "세법개론",
  hoegyehak: "회계학",
  gwansebeop: "관세법개론",
  hoegyewonri: "회계원리",
  gyojeonghak: "교정학개론",
  hyeongsogaeron: "형사소송법개론",
  hyeongbeop: "형법",
  hyeongso: "형사소송법",
  sobang: "소방학개론",
  sobanghak: "소방학개론",
  sobangbeop: "소방관계법규",
  "human-behavior": "인간행동과 사회환경",
  research: "사회복지조사론",
  practice: "사회복지실천론",
  "practice-skills": "사회복지실천기술론",
  community: "지역사회복지론",
  policy: "사회복지정책론",
  administration: "사회복지행정론",
  law: "사회복지법제론",
  accounting: "회계원리",
  facilities: "공동주택시설개론",
  "civil-law": "민법",
  "housing-law": "주택관리관계법규",
  "housing-admin": "공동주택관리실무",
  history: "한국사 심화",
  simhwa: "한국사 심화",
  english: "영어",
  gong9: "9급 영어",
};

const SUBJECT_FULL_LABELS: Record<string, string> = {
  "history:history": "한국사 심화",
  "english:english": "영어",
};

function parseSubjectId(id: string) {
  const parts = id.split(":");
  if (parts.length > 1) {
    return { app: parts[0], slug: parts.slice(1).join(":") };
  }
  return { app: "", slug: parts[0] };
}

/** 과목만 (앱 이름 없이) — 앱별 묶음 안 칩용 */
function subjectNameOnly(id: string) {
  if (SUBJECT_FULL_LABELS[id]) return SUBJECT_FULL_LABELS[id];
  const { app, slug } = parseSubjectId(id);
  const override = app ? APP_SUBJECT_SLUG_OVERRIDES[app]?.[slug] : undefined;
  if (override) return override;
  return SUBJECT_SLUG_LABELS[slug] ?? SUBJECT_SLUG_LABELS[id] ?? slug;
}

function subjectLabel(id: string) {
  const { app } = parseSubjectId(id);
  const subjectName = subjectNameOnly(id);
  const appName = app ? APP_LABELS[app] : undefined;
  if (appName) return `${appName} · ${subjectName}`;
  return subjectName || id;
}

function groupSubjectsByApp(subjects: { id: string; count: number }[]) {
  const buckets = new Map<string, { id: string; count: number }[]>();
  for (const row of subjects) {
    const { app } = parseSubjectId(row.id);
    const key = app && APP_LABELS[app] ? app : "_other";
    const list = buckets.get(key);
    if (list) list.push(row);
    else buckets.set(key, [row]);
  }

  const ordered: { appKey: string; label: string; subjects: { id: string; count: number }[] }[] =
    [];
  for (const key of APP_ORDER) {
    const list = buckets.get(key);
    if (!list?.length) continue;
    ordered.push({
      appKey: key,
      label: APP_LABELS[key],
      subjects: list.sort((a, b) => b.count - a.count),
    });
    buckets.delete(key);
  }
  for (const [key, list] of buckets) {
    ordered.push({
      appKey: key,
      label: APP_LABELS[key] ?? "기타",
      subjects: list.sort((a, b) => b.count - a.count),
    });
  }
  return ordered;
}

const MODEL_LABELS: Record<string, string> = {
  balanced: "Gemini",
  fast: "gpt-5-nano",
};

/**
 * 링크가 어느 화면으로 돌아갈지. 해설과 개념이 같은 컴포넌트를 쓰므로,
 * 렌더가 시작될 때 그 화면의 경로를 여기 적어 두고 buildHref 가 읽는다.
 * 서버 컴포넌트라 한 요청이 한 번 그리고 끝나므로 값이 섞일 일은 없다.
 */
let 화면경로 = "/admin/ai-explanations";

function buildHref(params: {
  subject?: string;
  exam?: string;
  item?: string;
  date?: string | null;
}) {
  const qs = new URLSearchParams();
  if (params.date) qs.set("date", params.date);
  if (params.subject) qs.set("subject", params.subject);
  if (params.exam) qs.set("exam", params.exam);
  if (params.item) qs.set("item", params.item);
  const s = qs.toString();
  return s ? `${화면경로}?${s}` : 화면경로;
}

function groupByDate(groups: AiExplanationGroupRow[]) {
  const map = new Map<string, AiExplanationGroupRow[]>();
  for (const group of groups) {
    const key = toKstDateKey(new Date(group.lastAt));
    const bucket = map.get(key);
    if (bucket) bucket.push(group);
    else map.set(key, [group]);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function subjectCountsFromGroups(groups: AiExplanationGroupRow[]) {
  const tally = new Map<string, number>();
  for (const group of groups) {
    tally.set(group.subjectId, (tally.get(group.subjectId) ?? 0) + group.variantCount);
  }
  return [...tally.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}

function chipClass(active: boolean) {
  return `rounded-[var(--radius-tags)] px-3 py-1.5 font-display text-[13px] transition-colors ${
    active ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow"
  }`;
}

/**
 * 열쇠(`item_key`)를 그대로 보이면 영문이 나와 읽히지 않는다. 우리말로 옮겨 적는다.
 *
 * 개념 화면에는 자리가 둘이지만 여기 쌓이는 것은 **버튼으로 만든 정리 하나뿐**이다.
 * 둘째 자리(`my-concept-ask`)는 사용자가 무엇을 물을지 알 수 없어 견줄 거리가 되지
 * 못하므로 앱이 아예 보내지 않는다 — 그래서 그 이름은 여기 두지 않는다. 두면 언젠가
 * 쌓이는 것으로 읽힌다.
 */
const CONCEPT_ITEM_LABEL: Record<string, string> = {
  "my-concept": "만든 정리",
};

function GroupList({
  groups,
  date,
  kind = "explanation",
}: {
  groups: AiExplanationGroupRow[];
  date?: string | null;
  kind?: AiLogKind;
}) {
  if (groups.length === 0) {
    return (
      <ElevatedCard>
        <p className="px-6 py-12 text-center font-display text-body-sm text-fog">
          조건에 맞는 {kind === "concept" ? "개념" : "해설"}이 없습니다
        </p>
      </ElevatedCard>
    );
  }

  const sections = date
    ? ([[date, groups]] as [string, AiExplanationGroupRow[]][])
    : groupByDate(groups);

  return (
    <div className="space-y-5">
      {sections.map(([dateKey, rows]) => (
        <section key={dateKey}>
          {!date ? (
            <div className="mb-2 flex items-end justify-between gap-2">
              <h3 className="font-display text-body font-semibold text-ink">
                {formatKstDateLong(`${dateKey}T12:00:00+09:00`)}
              </h3>
              <Link
                href={buildHref({ date: dateKey })}
                className="font-display text-[12px] text-electric-blue hover:underline"
              >
                이 날짜만 →
              </Link>
            </div>
          ) : null}
          <ElevatedCard className="overflow-hidden">
            <ul className="divide-y divide-mist">
              {rows.map((group) => (
                <li key={`${group.subjectId}:${group.examId}:${group.itemKey}`}>
                  <Link
                    href={buildHref({
                      date,
                      subject: group.subjectId,
                      exam: group.examId ?? undefined,
                      item: group.itemKey ?? undefined,
                    })}
                    className="flex gap-3 px-4 py-3 transition-colors hover:bg-snow"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-snow font-display text-[13px] font-bold text-ink">
                      {group.variantCount}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5 font-display text-[12px] text-fog">
                        <span>{subjectLabel(group.subjectId)}</span>
                        {group.examId && <span>· {group.examId}</span>}
                        {group.itemKey && (
                          <span>· {CONCEPT_ITEM_LABEL[group.itemKey] ?? group.itemKey}</span>
                        )}
                        {group.answer && (
                          <span className="rounded-[var(--radius-tags)] bg-snow px-1.5 font-bold text-smoke">
                            {group.answer}
                          </span>
                        )}
                        {group.modelCount > 1 && <span>· 모델 {group.modelCount}종</span>}
                        {group.promptVersionCount > 1 && (
                          <span>· 프롬프트 {group.promptVersionCount}판</span>
                        )}
                      </span>
                      <span className="mt-1 line-clamp-2 block font-display text-[13px] leading-relaxed text-ink">
                        {group.itemText}
                      </span>
                    </span>
                    <span className="shrink-0 self-center font-display text-[12px] text-fog">
                      {formatDateTime(group.lastAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ElevatedCard>
        </section>
      ))}
    </div>
  );
}

/** 한 판본 — 앱에서 보이는 그대로 그린다. 캡처해 쓸 자리라 모양이 같아야 한다. */
function VariantCard({
  index,
  variant,
}: {
  index: number;
  variant: { id: number; explanation: string; model: string; promptVersion: string; createdAt: string };
}) {
  return (
    <ElevatedCard className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-mist px-4 py-2.5">
        <span className="font-display text-[13px] font-bold text-ink">판본 {index}</span>
        <span className="rounded-[var(--radius-tags)] bg-snow px-2 py-0.5 font-display text-[12px] text-smoke">
          {MODEL_LABELS[variant.model] ?? variant.model}
        </span>
        <span className="font-mono text-[11px] text-fog">{variant.promptVersion}</span>
        <span className="ml-auto font-display text-[12px] text-fog">
          {formatDateTime(variant.createdAt)}
        </span>
      </div>
      <div className="max-w-[38rem] px-4 py-3">
        <AiAnswerBody text={variant.explanation} />
      </div>
    </ElevatedCard>
  );
}

/**
 * 해설과 개념이 한 표에 쌓이므로 화면도 이 컴포넌트 하나로 짓고 `kind` 로 가른다.
 * 둘로 베껴 두면 한쪽만 고쳐지는 날이 온다.
 */
export default async function AdminAiExplanationsPage({
  searchParams,
  kind = "explanation",
  basePath = "/admin/ai-explanations",
}: {
  searchParams: SearchParams;
  kind?: AiLogKind;
  basePath?: string;
}) {
  화면경로 = basePath;
  const { subject, exam, item, date: dateParam } = await searchParams;
  const date = dateParam ? parseKstDateKey(dateParam) : null;
  const today = toKstDateKey();

  if (subject && (exam || item)) {
    const variants = await getAiExplanationVariants({
      subjectId: subject,
      examId: exam ?? null,
      itemKey: item ?? null,
    });

    return (
      <div className="space-y-6">
        <div>
          <Link
            href={buildHref({ date, subject })}
            className="font-display text-[13px] text-electric-blue hover:underline"
          >
            ← 목록으로
          </Link>
          <SectionHeading as="h2" className="mb-2 mt-2 text-subheading">
            {subjectLabel(subject)} · {exam ?? "문항 미상"} {item ?? ""}
          </SectionHeading>
          <p className="font-display text-body-sm text-smoke">
            같은 보기에 {variants.length}개의 판본이 쌓였습니다. 오래된 것부터 보입니다 — 여럿이 같은
            말을 하는데 하나만 다르면 그 하나를 의심하면 됩니다.
          </p>
        </div>

        {variants.length === 0 ? (
          <ElevatedCard>
            <p className="px-6 py-12 text-center font-display text-body-sm text-fog">판본 없음</p>
          </ElevatedCard>
        ) : (
          <div className="space-y-4">
            {variants.map((variant, i) => (
              <VariantCard key={variant.id} index={i + 1} variant={variant} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const needDateWideGroups = Boolean(date && subject);
  const [overview, allSubjects, dateSummaries, groups, dateWideGroups] = await Promise.all([
    getAiExplanationOverview(kind),
    getAiExplanationSubjects(kind),
    getAiExplanationDateSummaries(120, kind),
    getAiExplanationGroups({
      subjectId: subject,
      dateKey: date ?? undefined,
      kind,
    }),
    needDateWideGroups
      ? getAiExplanationGroups({ dateKey: date!, kind })
      : Promise.resolve(null),
  ]);

  const subjectsForChips = date
    ? subjectCountsFromGroups(dateWideGroups ?? groups)
    : allSubjects;

  const dateCounts = Object.fromEntries(
    dateSummaries.map((row) => [row.dateKey, row.count])
  );

  const dateLabel = date ? formatKstDateLong(`${date}T12:00:00+09:00`) : null;

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          {kind === "concept" ? "AI 개념 모음" : "AI 해설 모음"}
        </SectionHeading>
        <p className="font-display text-body-sm leading-relaxed text-smoke">
          {kind === "concept" ? (
            <>
              앱의 기출 올인원에서 <b>「개념 만들기」로 만든 글</b>이 여기에 쌓입니다. 한 선지에
              붙는 해설과 달리 <b>목차의 한 자리</b>에 붙는 글이라 따로 모읍니다. 사람이 아니라
              글에 관한 기록이라 기기 식별자도, 사용자가 적은 꼬리질문도 담기지 않습니다 —
              개념 화면에서 <b>직접 물어본 것</b>도 같은 까닭으로 빠집니다. 날짜·과목으로 나눠
              볼 수 있습니다.
            </>
          ) : (
            <>
              앱에서 「바로바로 AI 해설」이 만들어질 때마다 여기에 쌓입니다. 사람이 아니라 해설에
              관한 기록이라 기기 식별자도, 사용자가 적은 꼬리질문도 담기지 않습니다. 날짜·과목으로
              나눠 볼 수 있습니다.
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "쌓인 해설", value: overview.total },
          { label: "보기 수", value: overview.itemCount },
          { label: "오늘", value: overview.today },
        ].map((stat) => (
          <ElevatedCard key={stat.label} className="px-4 py-3">
            <p className="font-display text-[12px] text-fog">{stat.label}</p>
            <p className="font-display text-heading-sm font-bold text-ink">
              {stat.value.toLocaleString()}
            </p>
          </ElevatedCard>
        ))}
      </div>

      <section className="space-y-2">
        <p className="font-display text-[12px] font-semibold text-fog">날짜</p>
        <AiExplanationDateCalendar
            basePath={basePath}
          selectedDate={date}
          subject={subject}
          today={today}
          counts={dateCounts}
        />
      </section>

      {subjectsForChips.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-[12px] font-semibold text-fog">과목</p>
            <Link href={buildHref({ date })} className={chipClass(!subject)}>
              전체
            </Link>
          </div>
          <div className="space-y-3" aria-label="과목 필터">
            {groupSubjectsByApp(subjectsForChips).map((app) => {
              const appTotal = app.subjects.reduce((n, s) => n + s.count, 0);
              const appActive = Boolean(
                subject && parseSubjectId(subject).app === app.appKey
              );
              return (
                <div
                  key={app.appKey}
                  className={`rounded-[var(--radius-cards)] border px-3 py-2.5 sm:px-4 ${
                    appActive ? "border-ios-blue/40 bg-ios-blue/[0.04]" : "border-mist bg-paper"
                  }`}
                >
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <p className="font-display text-[13px] font-semibold text-ink">
                      {app.label}
                    </p>
                    <span className="font-display text-[11px] text-fog">{appTotal}건</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {app.subjects.map((s) => (
                      <Link
                        key={s.id}
                        href={buildHref({ date, subject: s.id })}
                        className={chipClass(subject === s.id)}
                      >
                        {subjectNameOnly(s.id)} {s.count}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-display text-[13px] text-smoke">
          {dateLabel ? (
            <>
              <strong className="text-ink">{dateLabel}</strong>
              {subject ? (
                <>
                  {" "}
                  · <strong className="text-ink">{subjectLabel(subject)}</strong>
                </>
              ) : null}
              <span className="text-fog"> · {groups.length}건</span>
            </>
          ) : subject ? (
            <>
              <strong className="text-ink">{subjectLabel(subject)}</strong>
              <span className="text-fog"> · 날짜별 {groups.length}건</span>
            </>
          ) : (
            <span className="text-fog">최근 활동 기준 · 날짜별로 묶어 표시 · {groups.length}건</span>
          )}
        </p>
        {(date || subject) && (
          <Link
            href={buildHref({})}
            className="font-display text-[12px] text-electric-blue hover:underline"
          >
            필터 초기화
          </Link>
        )}
      </div>

      <GroupList groups={groups} date={date} kind={kind} />
    </div>
  );
}
