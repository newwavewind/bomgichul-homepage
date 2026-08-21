import Link from "next/link";
import {
  getAiExplanationGroups,
  getAiExplanationOverview,
  getAiExplanationSubjects,
  getAiExplanationVariants,
} from "@/lib/admin";
import { formatDateTime } from "@/components/admin/AdminUi";
import { AiAnswerBody } from "@/components/admin/AiAnswerBody";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";

type SearchParams = Promise<{
  subject?: string;
  exam?: string;
  item?: string;
}>;

/** 앱이 보내는 과목 id → 사람이 읽는 이름. 모르는 id 는 그대로 보인다. */
const SUBJECT_LABELS: Record<string, string> = {
  civillaw: "민법",
  "broker-law": "공인중개사법",
  "realestate-public-law": "부동산공법",
  "realestate-tax": "부동산세법",
  "registry-law": "부동산공시법령",
  realestate: "부동산학개론",
};

function subjectLabel(id: string) {
  return SUBJECT_LABELS[id] ?? id;
}

const MODEL_LABELS: Record<string, string> = {
  balanced: "Gemini",
  fast: "gpt-5-nano",
};

function buildHref(params: { subject?: string; exam?: string; item?: string }) {
  const qs = new URLSearchParams();
  if (params.subject) qs.set("subject", params.subject);
  if (params.exam) qs.set("exam", params.exam);
  if (params.item) qs.set("item", params.item);
  const s = qs.toString();
  return s ? `/admin/ai-explanations?${s}` : "/admin/ai-explanations";
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
      {/* 앱 화면과 비슷한 폭으로 묶는다 — 넓게 퍼지면 표와 줄바꿈이 앱과 달라 보인다 */}
      <div className="max-w-[38rem] px-4 py-3">
        <AiAnswerBody text={variant.explanation} />
      </div>
    </ElevatedCard>
  );
}

export default async function AdminAiExplanationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { subject, exam, item } = await searchParams;

  // 보기 하나를 골랐으면 그 판본들을 늘어놓는다
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
            href={buildHref({ subject })}
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

  const [overview, subjects, groups] = await Promise.all([
    getAiExplanationOverview(),
    getAiExplanationSubjects(),
    getAiExplanationGroups({ subjectId: subject }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          AI 해설 모음
        </SectionHeading>
        <p className="font-display text-body-sm leading-relaxed text-smoke">
          앱에서 「바로바로 AI 해설」이 만들어질 때마다 여기에 쌓입니다. 사람이 아니라 해설에 관한
          기록이라 기기 식별자도, 사용자가 적은 꼬리질문도 담기지 않습니다.
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

      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildHref({})}
            className={`rounded-[var(--radius-tags)] px-3 py-1.5 font-display text-[13px] transition-colors ${
              !subject ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow"
            }`}
          >
            전체
          </Link>
          {subjects.map((s) => (
            <Link
              key={s.id}
              href={buildHref({ subject: s.id })}
              className={`rounded-[var(--radius-tags)] px-3 py-1.5 font-display text-[13px] transition-colors ${
                subject === s.id ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow"
              }`}
            >
              {subjectLabel(s.id)} {s.count}
            </Link>
          ))}
        </div>
      )}

      <ElevatedCard className="overflow-hidden">
        {groups.length === 0 ? (
          <p className="px-6 py-12 text-center font-display text-body-sm text-fog">
            아직 쌓인 해설이 없습니다
          </p>
        ) : (
          <ul className="divide-y divide-mist">
            {groups.map((group) => (
              <li key={`${group.subjectId}:${group.examId}:${group.itemKey}`}>
                <Link
                  href={buildHref({
                    subject: group.subjectId,
                    exam: group.examId ?? undefined,
                    item: group.itemKey ?? undefined,
                  })}
                  className="flex gap-3 px-4 py-3 transition-colors hover:bg-snow"
                >
                  {/* 판본 수가 이 화면의 알맹이다 — 왼쪽에 크게 세운다 */}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-snow font-display text-[13px] font-bold text-ink">
                    {group.variantCount}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5 font-display text-[12px] text-fog">
                      <span>{subjectLabel(group.subjectId)}</span>
                      {group.examId && <span>· {group.examId}</span>}
                      {group.itemKey && <span>· {group.itemKey}</span>}
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
        )}
      </ElevatedCard>
    </div>
  );
}
