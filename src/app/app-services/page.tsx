import type { Metadata } from "next";
import Link from "next/link";
import { PC_STUDY_FEATURES } from "@/lib/pc-access/study-features";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appServiceFeatures } from "@/lib/app-service-features";
import { appStoreLinksForScope } from "@/lib/constants";
import { communityScopeLabel } from "@/lib/exam-track/community";
import { EXAM_TRACKS } from "@/lib/exam-track/config";
import { buildPageMetadata } from "@/lib/seo";
import type { CommunityScope } from "@/types/database";

export const metadata: Metadata = buildPageMetadata({
  title: "앱서비스",
  description: "기출 시험지 손필기, 자동 복습 계획, 포켓 오디오 등 봄기출 앱과 웹에서 제공하는 기능을 비교하세요.",
  path: "/app-services",
});

const scopes: CommunityScope[] = ["real_estate", "public_service", ...EXAM_TRACKS.map((track) => track.communityScope)];
const apps = scopes.flatMap((scope) => {
  const links = appStoreLinksForScope(scope);
  return links.ios || links.android ? [{ scope, label: communityScopeLabel(scope), links }] : [];
});

export default function AppServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-heading font-bold tracking-tight text-ink">봄기출 앱서비스</h1>
          <p className="mt-2 max-w-xl font-system text-body-sm leading-relaxed text-smoke">
            준비하는 시험에 어떤 학습 기능이 있는지 확인해 보세요.
          </p>
        </div>
        <a href="#app-downloads" className="rounded-full bg-carbon px-5 py-2.5 font-display text-body-sm font-semibold text-paper">
          내 시험 앱 찾기 ↓
        </a>
      </header>

      <section aria-labelledby="pc-pro-features" className="mb-10 space-y-6 rounded-3xl border border-ios-blue/20 bg-snow p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="pc-pro-features" className="font-display text-subheading font-semibold text-ink">앱에서 구매한 과목을 웹에서도</h2>
            <p className="mt-2 max-w-xl text-body-sm leading-relaxed text-smoke">
              봄기출 앱의 구매 내역을 홈페이지 계정에 연결하면 해당 과목의 PC Pro 기능이 열려요. 기존 구매자는 구매 복원으로 연결할 수 있어요.
            </p>
          </div>
          <Link href="/pc-pro" className="inline-flex min-h-11 items-center rounded-full bg-carbon px-5 py-2 font-display text-body-sm font-semibold text-paper">
            PC Pro 과목 선택
          </Link>
        </div>
        <ol className="grid gap-3 text-body-sm font-medium text-ink sm:grid-cols-3">
          <li><strong className="mr-2 text-carbon">1</strong> 웹에 로그인하고 구매 과목의 QR 열기</li>
          <li><strong className="mr-2 text-carbon">2</strong> 앱에서 QR을 찍고 구매 확인</li>
          <li><strong className="mr-2 text-carbon">3</strong> 웹에서 연결 완료</li>
        </ol>
        <div className="border-t border-mist pt-5">
          <h3 className="font-display text-body font-semibold text-ink">웹 Pro에서 할 수 있는 공부</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            <li className="rounded-xl border border-mist bg-paper p-3">
              <p className="font-semibold text-ink">칠판 강의·교재</p>
              <p className="mt-1 text-body-sm text-smoke">경찰공무원·공인중개사·소방공무원의 연동한 과목에서 전체 강의와 교재를 엽니다.</p>
            </li>
            {[...PC_STUDY_FEATURES, {
              id: "glossary", title: "용어 사전", description: "선지 해설에서 용어를 눌러 뜻을 확인합니다.",
            }, {
              id: "notebook", title: "필기노트", description: "문항 해설 아래에서 핵심 포인트와 비교 노트를 엽니다.",
            }].map(feature => <li key={feature.id} className="rounded-xl border border-mist bg-paper p-3">
              <p className="font-semibold text-ink">{feature.title}</p>
              <p className="mt-1 text-body-sm text-smoke">{feature.description}</p>
            </li>)}
          </ul>
          <p className="mt-4 text-body-sm text-smoke">연동을 마치면 과목 카드, 복습 도구, 문항 해설에서 해당 기능을 열 수 있어요. 자료는 과목과 문항에 따라 달라요.</p>
        </div>
      </section>

      <section aria-labelledby="app-highlights" className="mb-10">
        <h2 id="app-highlights" className="mb-3 font-display text-subheading font-semibold text-ink">앱에서 더 할 수 있는 공부</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {appServiceFeatures.flatMap(({ id, highlight }) => highlight ? (
            <li key={id} className="min-w-0">
              <a
                href={`#${id}`}
                className="group flex h-full flex-col gap-2 rounded-2xl border border-ios-blue/20 bg-ios-blue/[0.07] p-4 transition-colors hover:border-ios-blue/60 hover:bg-ios-blue/[0.12] sm:p-5"
              >
                <h3 className="flex items-start justify-between gap-2 font-display text-body font-semibold text-ink">
                  {highlight.title}
                  <span aria-hidden className="shrink-0 text-[color:light-dark(#0066d6,#a5ceff)] transition-transform group-hover:translate-x-0.5">→</span>
                </h3>
                <p className="font-system text-body-sm leading-relaxed text-smoke">{highlight.description}</p>
              </a>
            </li>
          ) : [])}
        </ul>
      </section>

      <section aria-labelledby="feature-comparison">
        <h2 id="feature-comparison" className="font-display text-subheading font-semibold text-ink">앱과 웹 기능 비교</h2>
        <p className="mb-4 mt-2 font-system text-body-sm leading-relaxed text-smoke">
          <strong className="font-semibold text-ink">앱 전용</strong> 표시는 앱에서 이용하는 기능이에요. 제공 범위는 시험과 과목에 따라 달라요.
        </p>
        <div className="overflow-hidden rounded-2xl border border-mist bg-paper">
          <table className="w-full table-fixed border-collapse text-left font-system text-body-sm leading-relaxed">
            <caption className="sr-only">학습 기능별 봄기출 앱과 웹 제공 범위</caption>
            <colgroup>
              <col className="w-[30%] sm:w-1/4" />
              <col className="w-[36%] sm:w-[40%]" />
              <col />
            </colgroup>
            <thead>
              <tr className="font-display font-semibold text-ink">
                <th scope="col" className="bg-snow px-2.5 py-3 sm:px-5">기능</th>
                <th scope="col" className="border-x border-mist bg-ios-blue/15 px-2.5 py-3 text-[color:light-dark(#06488f,#bcdbff)] sm:px-5">봄기출 앱</th>
                <th scope="col" className="bg-snow px-2.5 py-3 sm:px-5">봄기출 웹</th>
              </tr>
            </thead>
            {appServiceFeatures.map(({ id, name, rows }) => (
              <tbody key={id}>
                <tr id={id} className="scroll-mt-24 border-y border-mist bg-snow target:bg-ios-blue/15">
                  <th scope="rowgroup" colSpan={3} className="px-2.5 py-2.5 font-display font-semibold text-ink sm:px-5">{name}</th>
                </tr>
                {rows.map(([label, app, web, availability, pro]) => {
                  const appOnly = Boolean(app && !web && !pro);
                  return (
                    <tr key={label} className="border-b border-mist align-top last:border-b-0">
                      <th scope="row" className="break-keep px-2.5 py-2.5 font-display font-medium text-ink [overflow-wrap:anywhere] sm:px-5">
                        <span>{label}</span>
                        {appOnly ? (
                          <span className="mt-1 inline-flex w-fit whitespace-nowrap rounded-full bg-ios-blue/10 px-2 py-0.5 text-reading-note font-semibold text-[color:light-dark(#06488f,#bcdbff)] sm:ml-2 sm:mt-0">
                            앱 전용
                          </span>
                        ) : null}
                      </th>
                      <td className={`break-keep border-x border-mist px-2.5 py-2.5 font-medium text-ink [overflow-wrap:anywhere] sm:px-5 ${appOnly ? "bg-ios-blue/[0.085]" : "bg-ios-blue/[0.045]"}`}>
                        {app ?? <span aria-label="앱에서 제공하지 않음" className="text-fog">—</span>}
                        {availability ? <p className="mt-1 text-reading-note font-normal text-smoke">{availability}</p> : null}
                      </td>
                      <td className="break-keep px-2.5 py-2.5 text-smoke [overflow-wrap:anywhere] sm:px-5">
                        {web ?? (!pro && <span aria-label="웹에서 제공하지 않음" className="text-fog">—</span>)}
                        {pro && <span className="mt-1 block"><strong className="mr-1 text-carbon">Pro</strong>{pro}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section id="app-downloads" aria-labelledby="app-download-heading" className="mt-10 scroll-mt-24">
        <h2 id="app-download-heading" className="mb-4 font-display text-subheading font-semibold text-ink">시험별 앱 받기</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {apps.map(({ scope, label, links }) => (
            <li key={scope} className="rounded-2xl border border-mist bg-paper p-4">
              <h3 className="font-display text-body font-semibold text-ink">{label}</h3>
              <AppStoreButtons links={links} size="sm" className="mt-3" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
