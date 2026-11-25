import { pcStudyReturnPath } from "@/lib/pc-access/study-context";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PcLecturePlan from '@/components/lectures/police/PcLecturePlan';
import { getPcStudyCounts } from '@/lib/pc-access/study';
import { PC_APPS } from '@/lib/pc-access/catalog';
import { hasPcPro } from '@/lib/pc-access/pro';
import { getPcViewer } from '@/lib/pc-access/session';
import { storeVerificationConfigured } from '@/lib/pc-access/store';

type Props = { params: Promise<{ site: string }>; searchParams: Promise<{ subject?: string }> };
export const metadata = { title: '과목별 PC Pro 앱 구매 연동' };

export default async function PcProExam({ params, searchParams }: Props) {
  const { site } = await params;
  const { subject } = await searchParams;
  const app = PC_APPS.find(entry => entry.site === site);
  if (!app) notFound();
  const offer = app.subjects.find(entry => entry.id === subject) ?? app.subjects[0];
  const lecture = site === 'firefighter';
  const viewer = !lecture ? await getPcViewer().catch(() => null) : null;
  const pro = viewer ? await hasPcPro(viewer.id, offer.id, viewer.beta).catch(() => false) : false;
  return <main className="mx-auto max-w-4xl space-y-5 px-4 py-10">
    <Link className="text-sm font-medium text-carbon" href="/pc-pro">← PC Pro 시험 선택</Link>
    <h1 className="text-3xl font-semibold text-ink">{app.title} PC Pro</h1>
    {app.subjects.some(entry => "legacy" in entry && entry.legacy) && (
      <p className="text-sm leading-relaxed text-smoke">
        앱에서 결제한 상품을 골라 QR로 연결해 주세요. 국가직이나 지방직을 따로 구매한 경우에도 기존 구매 내역으로 연결할 수 있어요.
      </p>
    )}
    <nav aria-label="구매한 과목" className="flex flex-wrap gap-2">
      {app.subjects.map(entry => <Link
        key={entry.id}
        href={lecture ? '/firefighter/lectures/' + entry.subjectId + '#firefighter-pc-plan' : '/pc-pro/' + site + '?subject=' + entry.id + '#' + site + '-pc-plan'}
        aria-current={!lecture && entry.id === offer.id ? 'page' : undefined}
        className="rounded-full border border-mist px-4 py-2 text-sm font-medium text-carbon aria-[current=page]:bg-carbon aria-[current=page]:text-white"
      >{entry.title}</Link>)}
    </nav>
    {!lecture && <PcLecturePlan studyHref={getPcStudyCounts(offer.id) ? pcStudyReturnPath(offer.id) : undefined} key={offer.id} subject={offer.id} loggedIn={Boolean(viewer)} account={viewer?.label ?? null} pro={pro}
      linkingAvailable={storeVerificationConfigured()}/>}
  </main>;
}
