import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isPcSubject, PC_SUBJECTS, pcSite } from '@/lib/pc-access/catalog';
import { getPcViewer } from '@/lib/pc-access/session';
import { hasPcPro } from '@/lib/pc-access/pro';
import { getPcStudyCounts, readPcStudy } from '@/lib/pc-access/study';
import { PC_STUDY_FEATURES } from '@/lib/pc-access/study-features';
import { lecturePagePath } from '@/lib/lecture-sites';
import PcStudyRoom from '@/components/pc-pro/PcStudyRoom';

type Props = { params: Promise<{ scope: string }> };
export const metadata = { title: 'PC Pro 학습', robots: { index: false, follow: false } };

export default async function PcStudyPage({ params }: Props) {
  const { scope } = await params;
  if (!isPcSubject(scope)) notFound();
  const counts = getPcStudyCounts(scope);
  if (!counts) notFound();
  const offer = PC_SUBJECTS[scope];
  const site = pcSite(scope);
  const plan = site && offer.lectureSubject ? lecturePagePath(site, offer.lectureSubject)
    : '/pc-pro/' + offer.site + '?subject=' + scope;
  const viewer = await getPcViewer().catch(() => null);
  const pro = viewer ? await hasPcPro(viewer.id, scope, viewer.beta).catch(() => false) : false;
  const data = pro ? await readPcStudy(scope) : null;
  return <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
    <Link className="text-sm font-medium text-carbon" href={plan + '#' + offer.site + '-pc-plan'}>← {offer.exam} 과목 이용 플랜</Link>
    <div>
      <p className="text-sm font-medium text-carbon">{offer.exam} · PC Pro</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{offer.title}</h1>
    </div>
    {data ? <PcStudyRoom data={data}/> : <section className="space-y-4 rounded-3xl border border-mist bg-paper p-6" aria-labelledby="pro-study-lock">
      <h2 id="pro-study-lock" className="text-lg font-semibold text-ink">이 과목의 PC Pro 기능</h2>
      <ul className="flex flex-wrap gap-2">{PC_STUDY_FEATURES.filter(item => counts[item.id]).map(item =>
        <li className="rounded-full bg-snow px-3 py-1.5 text-sm text-smoke" key={item.id}>{item.title}</li>,
      )}</ul>
      <p className="text-sm text-smoke">앱에서 구매한 학습권을 홈페이지 계정에 연결해 주세요.</p>
      <Link className="inline-flex rounded-full bg-carbon px-5 py-2 text-sm font-semibold text-paper"
        href={viewer ? plan + '#' + offer.site + '-pc-plan' : '/login?next=' + encodeURIComponent('/pc-pro/study/' + scope)}>
        {viewer ? '앱 구매 연동' : '로그인하기'}
      </Link>
    </section>}
  </section>;
}
