import type { Metadata } from "next";
import Link from "next/link";
import { PC_APPS } from "@/lib/pc-access/catalog";
import { PC_STUDY_FEATURES } from "@/lib/pc-access/study-features";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appServiceFeatures } from "@/lib/app-service-features";
import { appStoreLinksForScope } from "@/lib/constants";
import { communityScopeLabel } from "@/lib/exam-track/community";
import { EXAM_TRACKS } from "@/lib/exam-track/config";
import { buildPageMetadata } from "@/lib/seo";
import type { CommunityScope } from "@/types/database";

export const metadata: Metadata = buildPageMetadata({
  title: "PC Pro",
  description: "봄기출 앱에서 구매한 과목을 PC Pro로 연결하세요. 웹에서 이용할 수 있는 학습 기능과 시험별 앱을 확인할 수 있어요.",
  path: "/pc-pro",
});

const scopes: CommunityScope[] = ["real_estate", "public_service", ...EXAM_TRACKS.map((track) => track.communityScope)];
const apps = scopes.flatMap((scope) => {
  const links = appStoreLinksForScope(scope);
  return links.ios || links.android ? [{ scope, label: communityScopeLabel(scope), links }] : [];
});

const connections = [
  { site: "real-estate", title: "공인중개사", href: "/real-estate/lectures/realestate#real-estate-pc-plan" },
  { site: "police", title: "경찰공무원", href: "/police/lectures/constitution#police-pc-plan" },
  ...PC_APPS.map(({ site, title }) => ({ site, title, href: `/pc-pro/${site}` })),
];

export default function PcProPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
      <header className="mb-10 overflow-hidden rounded-3xl border border-ios-blue/20 bg-snow p-6 sm:p-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-heading font-bold tracking-tight text-ink">PC Pro</h1>
          <p className="mt-4 font-display text-subheading font-semibold text-ink">앱에서 구매한 과목을 웹에서도 공부하세요</p>
          <p className="mt-3 max-w-xl text-body-sm leading-relaxed text-smoke">
            봄기출 앱의 구매 내역을 홈페이지 계정에 연결하면 해당 과목의 Pro 기능이 열려요. 예전에 구매한 과목도 앱에서 구매를 복원해 연결할 수 있어요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a href="#pc-pro-connect" className="inline-flex min-h-11 items-center rounded-full bg-carbon px-5 py-2 font-display text-body-sm font-semibold text-paper">구매한 과목 연결</a>
            <a href="#app-downloads" className="inline-flex min-h-11 items-center rounded-full border border-mist bg-paper px-5 py-2 font-display text-body-sm font-semibold text-ink hover:border-ios-blue/50">앱 다운로드</a>
          </div>
        </div>
      </header>

      <section id="pc-pro-connect" aria-labelledby="pc-pro-connect-heading" className="mb-10 scroll-mt-24">
        <h2 id="pc-pro-connect-heading" className="font-display text-subheading font-semibold text-ink">앱 구매 연결</h2>
        <p className="mt-2 text-body-sm text-smoke">객관식 과목의 앱 구매 내역을 QR로 연결할 수 있어요.</p>
        <ol className="mt-4 grid gap-3 text-body-sm text-ink sm:grid-cols-3">
          {[
            "웹에 로그인하고 구매한 과목의 QR을 열어요.",
            "앱에서 QR을 찍고 연결할 계정을 확인해요.",
            "웹에서 연결을 완료하고 Pro를 이용해요.",
          ].map((step, index) => (
            <li key={step} className="flex items-start gap-3 rounded-2xl bg-snow p-4">
              <span aria-hidden className="inline-grid size-7 shrink-0 place-items-center rounded-full bg-ios-blue/15 font-semibold text-carbon">{index + 1}</span>
              <span className="pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <h3 className="mb-3 mt-6 font-display text-body font-semibold text-ink">구매한 시험 선택</h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {connections.map(({ site, title, href }) => (
            <li key={site} className="min-w-0">
              <Link href={href} className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-mist bg-paper px-3 py-2 text-body-sm font-semibold text-ink hover:border-ios-blue/50 hover:text-carbon sm:px-4">
                {title}<span aria-hidden className="shrink-0 text-carbon">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pc-pro-features" className="mb-10 rounded-3xl border border-mist bg-snow p-5 sm:p-7">
        <div>
          <h2 id="pc-pro-features" className="font-display text-subheading font-semibold text-ink">웹 Pro에서 할 수 있는 공부</h2>
          <p className="mt-2 text-body-sm leading-relaxed text-smoke">
            앱에 새로 추가되는 핵심 학습 기능도 웹에서 이용할 수 있도록 PC Pro에 순차적으로 반영해 나갈 예정이에요.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li className="rounded-xl border border-mist bg-paper p-3">
              <p className="font-semibold text-ink">칠판 강의·교재</p>
              <p className="mt-1 text-body-sm leading-relaxed text-smoke">
                웹 칠판 강의와 교재는 현재 <strong className="font-semibold text-ink">공인중개사·경찰공무원·소방공무원</strong>의 지원 과목에서 제공해요.
                과목별 강의 목록에서 수강할 수 있는 강의와 교재를 확인해 주세요.
              </p>
            </li>
            {[...PC_STUDY_FEATURES.filter(feature => feature.id !== "choices"), {
              id: "glossary", title: "용어 사전", description: "선지 해설의 용어를 눌러 뜻과 시험 포인트를 확인해요.",
            }, {
              id: "notebook", title: "필기노트", description: "문항 해설 아래에서 핵심 정리와 비교 노트를 읽어요.",
            }].map(feature => <li key={feature.id} className="rounded-xl border border-mist bg-paper p-3">
              <p className="font-semibold text-ink">{feature.title}</p>
              <p className="mt-1 text-body-sm text-smoke">{feature.description}</p>
            </li>)}
          </ul>
          <p className="mt-4 text-body-sm text-smoke">연동을 마치면 과목 카드, 복습 도구, 문항 해설에서 해당 기능을 열 수 있어요. 이용할 수 있는 기능과 자료는 시험·과목·문항에 따라 달라요.</p>
        </div>
      </section>

      <section id="app-downloads" aria-labelledby="app-download-heading" className="mb-10 scroll-mt-24">
        <h2 id="app-download-heading" className="mb-4 font-display text-subheading font-semibold text-ink">시험별 앱 받기</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {apps.map(({ scope, label, links }) => (
            <li key={scope} className="rounded-2xl border border-mist bg-paper p-4">
              <h3 className="font-display text-body font-semibold text-ink">{label}</h3>
              <AppStoreButtons links={links} size="sm" className="mt-3" />
              {scope === "mullyu" && !links.ios && <p className="mt-2 text-reading-note text-smoke">iOS 출시 준비 중</p>}
            </li>
          ))}
        </ul>
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


    </div>
  );
}
