import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import catalog from '@/components/lectures/police/catalog.json';
import outline from '@/components/lectures/police/outline.json';
import lectureManifest from '@/components/lectures/police/source-manifest.json';
import LectureSamples from '@/components/lectures/LectureSamples';
import { AppStoreButtons } from '@/components/ui/AppStoreButtons';
import { lectureSiteConfig, lecturePagePath } from '@/lib/lecture-sites';
import { buildPageMetadata } from '@/lib/seo';

type Props = { params: Promise<{subject: string}>; searchParams: Promise<{lecture?: string}> };
const site = lectureSiteConfig('police');

export function generateStaticParams() {
  return catalog.map(({subject}) => ({subject}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {subject} = await params;
  const group = catalog.find(item => item.subject === subject);
  if (!group) return {};
  return buildPageMetadata({
    title: `경찰공무원 ${group.label} 칠판 강의 미리보기`,
    description: `봄기출 경찰공무원 앱의 ${group.label} 칠판 강의 전체 목록을 확인하고 첫 3강을 미리 들어 보세요. 음성, 판서, 자막과 요약 노트를 함께 제공합니다.`,
    path: lecturePagePath('police', subject),
  });
}

export default async function PoliceLectureSubjectPage({params, searchParams}: Props) {
  const {subject} = await params;
  const group = catalog.find(item => item.subject === subject);
  const curriculum = outline.find(item => item.subject === subject);
  if (!group || !curriculum) notFound();
  const {lecture} = await searchParams;
  const initialLectureId = group.lectures.some(item => item.id === lecture) ? lecture : undefined;
  return <div className="mx-auto max-w-[1160px] space-y-8 px-4 py-8 sm:px-6 md:py-12">
    <Link href="/police" className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-[#d8e3ef] bg-white py-1.5 pl-1.5 pr-5 text-sm font-semibold text-[#45617f] shadow-[0_2px_8px_#203a5608] transition-colors hover:border-[#9dbbe0] hover:bg-[#f5f8ff]"><span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[#edf3ff] text-carbon">←</span>경찰공무원 학습 홈</Link>
    <header className="space-y-4">
      <p className="text-sm font-semibold text-[#176859]">봄기출 경찰공무원 앱 · 칠판 강의 미리보기</p>
      <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-ink md:text-[38px]">{group.label} 칠판 강의</h1>
      <p className="max-w-2xl text-sm leading-7 text-smoke md:text-base">설명을 들으며 한 줄씩 써지는 판서를 따라가 보세요.<br className="hidden sm:block"/> 자막으로 놓친 말을 확인하고, 마지막 요약 노트로 배운 내용을 정리할 수 있어요.</p>
    </header>
    <nav aria-label="맛보기 강의 과목" className="flex flex-wrap gap-2 border-b border-[#d8e3ef] pb-6">
      {catalog.map(item => <Link key={item.subject} href={lecturePagePath('police', item.subject)} aria-current={item.subject === subject ? 'page' : undefined} className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors ${item.subject === subject ? 'border-carbon bg-carbon text-white' : 'border-[#d8e3ef] bg-white text-smoke hover:bg-snow'}`}>{item.label}</Link>)}
    </nav>
    <p className="rounded-xl bg-[#f3f7fc] px-5 py-4 text-sm leading-6 text-smoke">각 과목의 첫 3강은 여기서 미리 볼 수 있어요. 이후 강의는 봄기출 경찰공무원 앱에서 이어서 공부하세요.</p>
    <LectureSamples key={`${subject}:${initialLectureId || 'list'}`} site="police" subject={subject} initialLectureId={initialLectureId} lectures={group.lectures} parts={curriculum.parts} subjectLabel={group.label}/>
    <section id="lecture-app" className="scroll-mt-24 rounded-[24px] border border-[#d8e3ef] bg-[#f3f7fc] px-6 py-9 md:flex md:items-center md:justify-between md:gap-10 md:px-9">
      <div className="max-w-xl space-y-3">
        <p className="text-xs font-semibold tracking-wide text-carbon">{site.appName}</p>
        <h2 className="text-2xl font-semibold leading-snug text-ink">다음 강의도 이어서 들어 보세요</h2>
        <p className="text-sm leading-7 text-smoke">헌법·형사법 칠판 강의 {lectureManifest.registeredLectures}강. 홈페이지에서는 각 과목의 첫 3강을 미리 보고, 앱에서 이어서 공부할 수 있어요.</p>
      </div>
      <AppStoreButtons className="mt-6 shrink-0 md:mt-0 md:max-w-[180px]" links={site.appLinks}/>
    </section>
  </div>;
}
