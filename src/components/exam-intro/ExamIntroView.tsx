import Link from "next/link";
import type { ExamIntro } from "@/data/exam-intros/types";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";

type AppStoreScope = Parameters<typeof appStoreLinksForScope>[0];

const INTRO_STORE_SCOPE: Record<string, AppStoreScope> = {
  "public-service": "public_service",
  "real-estate": "real_estate",
  police: "police",
  housing: "housing",
  "social-worker": "social_worker",
  history: "history",
  english: "english",
};
/** YYYY-MM-DD → 2026년 4월 4일 */
function formatKoDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-display text-body-sm font-semibold text-electric-blue underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="border-b border-mist pb-3 font-display text-[24px] font-semibold text-ink md:text-[28px]">
        {title}
      </h2>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function LinkList({ links }: { links: ExamIntro["officialLinks"] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
      {links.map((link) =>
        link.external ? (
          <ExternalLink key={`${link.href}-${link.label}`} href={link.href}>
            {link.label} ↗
          </ExternalLink>
        ) : (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className="font-display text-body-sm font-semibold text-electric-blue underline-offset-2 hover:underline"
          >
            {link.label}
          </Link>
        ),
      )}
    </div>
  );
}

export function ExamIntroView({ intro }: { intro: ExamIntro }) {
  const navItems = [
    { href: "#administrator", label: "시행처" },
    ...(intro.tracks ? [{ href: "#tracks", label: intro.tracks.title }] : []),
    { href: "#subjects", label: "과목" },
    { href: "#format", label: "시험 형식" },
    ...(intro.timetable ? [{ href: "#timetable", label: "시간표" }] : []),
    ...(intro.passingCriteria ? [{ href: "#passing", label: "합격 기준" }] : []),
    ...(intro.fees ? [{ href: "#fees", label: "수수료" }] : []),
    ...(intro.eligibility ? [{ href: "#eligibility", label: "응시자격" }] : []),
    { href: "#schedule", label: "일정" },
    { href: "#application", label: "원서 접수" },
    { href: "#sources", label: "근거·출처" },
  ];

  return (
    <div className="relative overflow-hidden bg-white px-4 py-10 md:py-14">
      <div className="relative mx-auto max-w-3xl space-y-14">
        <header>
          <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-[#087f6d]">
            {intro.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-ink md:text-[44px]">
            {intro.title}
          </h1>
          <p className="mt-4 font-display text-body text-smoke">{intro.summary}</p>
          <p className="mt-3 font-display text-[13px] text-fog">
            공고 대조일 {formatKoDate(intro.lastVerified)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={intro.hubHref}
              className="inline-flex min-h-11 items-center rounded-full bg-carbon px-6 font-display text-body-sm font-semibold text-paper hover:opacity-90"
            >
              {intro.hubCta}
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full border border-carbon/30 bg-paper px-6 font-display text-body-sm font-semibold text-ink hover:border-carbon"
            >
              다른 시험 선택
            </Link>
          </div>
        </header>

        <nav
          aria-label="시험 안내 목차"
          className="flex flex-wrap gap-2 rounded-[20px] border border-mist bg-snow/60 p-3"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-mist bg-paper px-3.5 py-1.5 font-display text-[13px] font-semibold text-smoke hover:border-carbon hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Section id="administrator" title="시험 시행처">
          <p className="font-display text-[20px] font-semibold text-ink">{intro.administrator.name}</p>
          <p className="font-display text-body text-smoke">{intro.administrator.description}</p>
        </Section>

        {intro.tracks ? (
          <Section id="tracks" title={intro.tracks.title}>
            {intro.tracks.description ? (
              <p className="font-display text-body text-smoke">{intro.tracks.description}</p>
            ) : null}
            <div className="space-y-8">
              {intro.tracks.groups.map((group) => (
                <div key={group.name}>
                  <h3 className="mb-3 font-display text-[18px] font-semibold text-ink">{group.name}</h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <li
                        key={item.label}
                        className="rounded-2xl border border-mist bg-paper px-4 py-3.5 shadow-[var(--shadow-button)]"
                      >
                        <p className="font-display text-body-sm font-semibold text-ink">{item.label}</p>
                        {item.blurb ? (
                          <p className="mt-1 font-display text-[13px] text-fog">{item.blurb}</p>
                        ) : null}
                        {item.subjects?.length ? (
                          <p className="mt-2 font-display text-[13px] text-smoke">
                            전문과목: {item.subjects.join(" · ")}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <Section id="subjects" title={intro.subjects.title}>
          {intro.subjects.description ? (
            <p className="font-display text-body text-smoke">{intro.subjects.description}</p>
          ) : null}
          <div className="space-y-6">
            {intro.subjects.groups.map((group) => (
              <div key={group.name}>
                <h3 className="mb-3 font-display text-[18px] font-semibold text-ink">{group.name}</h3>
                <ul className="divide-y divide-mist rounded-2xl border border-mist bg-paper">
                  {group.items.map((subject) => (
                    <li
                      key={`${group.name}-${subject.name}`}
                      className="px-4 py-3"
                    >
                      <span className="font-display text-body-sm font-semibold text-ink">
                        {subject.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="format" title={intro.format.title}>
          {intro.format.paragraphs.map((paragraph, index) => (
            <p key={`format-p-${index}`} className="font-display text-body text-smoke">
              {paragraph}
            </p>
          ))}
          {intro.format.bullets?.length ? (
            <ul className="list-disc space-y-2 pl-5 font-display text-body text-smoke">
              {intro.format.bullets.map((bullet, index) => (
                <li key={`format-b-${index}`}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </Section>

        {intro.timetable ? (
          <Section id="timetable" title={intro.timetable.title}>
            <ul className="divide-y divide-mist rounded-2xl border border-mist bg-paper">
              {intro.timetable.rows.map((row) => (
                <li
                  key={`${row.label}-${row.detail}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3"
                >
                  <span className="font-display text-body-sm font-semibold text-ink">{row.label}</span>
                  <span className="font-display text-[13px] text-smoke">{row.detail}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {intro.passingCriteria ? (
          <Section id="passing" title={intro.passingCriteria.title}>
            <ul className="list-disc space-y-2 pl-5 font-display text-body text-smoke">
              {intro.passingCriteria.bullets.map((bullet, index) => (
                <li key={`pass-${index}`}>{bullet}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        {intro.fees ? (
          <Section id="fees" title={intro.fees.title}>
            <ul className="divide-y divide-mist rounded-2xl border border-mist bg-paper">
              {intro.fees.items.map((item) => (
                <li
                  key={`${item.label}-${item.amount}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3"
                >
                  <span className="font-display text-body-sm font-semibold text-ink">{item.label}</span>
                  <span className="font-display text-body-sm text-smoke">{item.amount}</span>
                </li>
              ))}
            </ul>
            {intro.fees.note ? (
              <p className="font-display text-[13px] text-fog">{intro.fees.note}</p>
            ) : null}
          </Section>
        ) : null}

        {intro.eligibility ? (
          <Section id="eligibility" title={intro.eligibility.title}>
            {intro.eligibility.paragraphs?.map((paragraph, index) => (
              <p key={`elig-p-${index}`} className="font-display text-body text-smoke">
                {paragraph}
              </p>
            ))}
            {intro.eligibility.bullets?.length ? (
              <ul className="list-disc space-y-2 pl-5 font-display text-body text-smoke">
                {intro.eligibility.bullets.map((bullet, index) => (
                  <li key={`elig-b-${index}`}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </Section>
        ) : null}

        <Section id="schedule" title={intro.schedule.title}>
          <ul className="space-y-3">
            {intro.schedule.items.map((item) => (
              <li
                key={`${item.label}-${item.date ?? item.detail}`}
                className="rounded-2xl border border-mist bg-paper px-4 py-3.5"
              >
                <p className="font-display text-body-sm font-semibold text-ink">{item.label}</p>
                {item.date ? (
                  <p className="mt-1 font-display text-body text-ink">{formatKoDate(item.date)}</p>
                ) : null}
                {item.detail ? (
                  <p className="mt-1 font-display text-[13px] text-smoke">{item.detail}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="rounded-2xl bg-snow px-4 py-3 font-display text-[13px] text-fog">
            {intro.schedule.note}
          </p>
        </Section>

        <Section id="application" title={intro.application.title}>
          <p className="font-display text-[18px] font-semibold text-ink">{intro.application.where}</p>
          <ul className="list-disc space-y-2 pl-5 font-display text-body text-smoke">
            {intro.application.how.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <LinkList links={intro.application.links} />
        </Section>

        <Section id="sources" title="근거·출처">
          <ul className="space-y-3">
            {intro.sources.map((source) => {
              const isExternal = Boolean(source.href?.startsWith("http"));
              return (
                <li
                  key={`${source.label}-${source.href ?? source.note}`}
                  className="rounded-2xl border border-mist bg-paper px-4 py-3.5"
                >
                  {source.href && isExternal ? (
                    <ExternalLink href={source.href}>{source.label} ↗</ExternalLink>
                  ) : source.href ? (
                    <Link
                      href={source.href}
                      className="font-display text-body-sm font-semibold text-electric-blue underline-offset-2 hover:underline"
                    >
                      {source.label}
                    </Link>
                  ) : (
                    <p className="font-display text-body-sm font-semibold text-ink">{source.label}</p>
                  )}
                  {source.note ? (
                    <p className="mt-1 font-display text-[13px] text-smoke">{source.note}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <p className="rounded-2xl bg-snow px-4 py-3 font-display text-[13px] text-fog">
            {intro.disclaimer}
          </p>
        </Section>

        <section className="rounded-[24px] border-[1.5px] border-carbon bg-gradient-to-br from-[#e8f5ff] to-[#f4f8ff] p-6 md:p-8">
          <p className="font-display text-[13px] font-semibold tracking-[0.04em] text-fog">공식 안내</p>
          <ul className="mt-3 space-y-2">
            {intro.officialLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                {link.external ? (
                  <ExternalLink href={link.href}>{link.label} ↗</ExternalLink>
                ) : (
                  <Link
                    href={link.href}
                    className="font-display text-body-sm font-semibold text-electric-blue underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {intro.relatedLinks?.length ? (
            <>
              <p className="mt-6 font-display text-[13px] font-semibold tracking-[0.04em] text-fog">
                봄기출에서 이어서
              </p>
              <div className="mt-3">
                <LinkList links={intro.relatedLinks} />
              </div>
            </>
          ) : null}
          {INTRO_STORE_SCOPE[intro.id] ? (
            <>
              <p className="mt-6 font-display text-[13px] font-semibold tracking-[0.04em] text-fog">
                모바일 앱
              </p>
              <p className="mt-1 font-display text-[13px] text-smoke">
                App Store와 Google Play를 구분해 두었습니다. 아직 없는 스토어는 출시준비중입니다.
              </p>
              <AppStoreButtons
                className="mt-3"
                size="sm"
                links={appStoreLinksForScope(INTRO_STORE_SCOPE[intro.id])}
              />
            </>
          ) : null}
          <div className="mt-8">
            <Link
              href={intro.hubHref}
              className="inline-flex min-h-11 items-center rounded-full bg-carbon px-6 font-display text-body-sm font-semibold text-paper hover:opacity-90"
            >
              {intro.hubCta}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
