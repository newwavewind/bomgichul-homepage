import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import catalog from '@/components/lectures/catalog.json';
import outline from '@/components/lectures/outline.json';
import LectureSamples from '@/components/lectures/LectureSamples';
import { AppStoreButtons } from '@/components/ui/AppStoreButtons';
import { ARCHIVE_SUBJECT_MAP } from '@/lib/constants';
import { buildPageMetadata } from '@/lib/seo';

type Props = { params: Promise<{subject: string}>; searchParams: Promise<{lecture?: string}> };
const subjectLabel = (subject: string) => ARCHIVE_SUBJECT_MAP[subject as keyof typeof ARCHIVE_SUBJECT_MAP];

export function generateStaticParams() {
  return catalog.map(({subject}) => ({subject}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {subject} = await params;
  if (!catalog.some(group => group.subject === subject)) return {};
  return buildPageMetadata({title:`${subjectLabel(subject)} 칠판 강의 미리보기`,description:`봄기출 공인중개사 앱의 ${subjectLabel(subject)} 칠판 강의 전체 목록을 확인하고 첫 3강을 미리 들어 보세요. 음성, 판서, 자막과 요약 노트를 함께 제공합니다.`,path:`/real-estate/lectures/${subject}`});
}

export default async function LectureSubjectPage({params, searchParams}: Props) {
  const {subject} = await params;
  const group = catalog.find(item => item.subject === subject);
  if (!group) notFound();
  const {lecture} = await searchParams;
  const initialLectureId = group.lectures.some(item => item.id === lecture) ? lecture : undefined;
  return <div className="mx-auto max-w-[1160px] space-y-8 px-4 py-8 sm:px-6 md:py-12">
    <Link href="/real-estate" className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-[#d8e3ef] bg-white py-1.5 pl-1.5 pr-5 text-sm font-semibold text-[#45617f] shadow-[0_2px_8px_#203a5608] transition-colors hover:border-[#9dbbe0] hover:bg-[#f5f8ff]"><span className="grid size-8 place-items-center rounded-full bg-[#edf3ff] text-carbon"><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6"/><path d="M8 12h12"/></svg></span>공인중개사 학습 홈</Link>
    <header className="space-y-4">
      <p className="text-sm font-semibold text-[#176859]">봄기출 공인중개사 앱 · 칠판 강의 미리보기</p>
      <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-ink md:text-[38px]">{subjectLabel(subject)} 칠판 강의</h1>
      <p className="max-w-2xl text-sm leading-7 text-smoke md:text-base">설명을 들으며 한 줄씩 써지는 판서를 따라가 보세요.<br className="hidden sm:block"/> 자막으로 놓친 말을 확인하고, 마지막 요약 노트로 배운 내용을 정리할 수 있어요.</p>
    </header>
    <nav aria-label="맛보기 강의 과목" className="flex flex-wrap gap-2 border-b border-[#d8e3ef] pb-6">
      {catalog.map(item => <Link key={item.subject} href={`/real-estate/lectures/${item.subject}`} aria-current={item.subject === subject ? 'page' : undefined} className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors ${item.subject === subject ? 'border-carbon bg-carbon text-white' : 'border-[#d8e3ef] bg-white text-smoke hover:bg-snow'}`}>{subjectLabel(item.subject)}</Link>)}
    </nav>
    <p className="rounded-xl bg-[#f3f7fc] px-5 py-4 text-sm leading-6 text-smoke">첫 3강은 여기서 미리 볼 수 있어요. 앱에서 이어서 공부할 수 있어요.</p>
    <LectureSamples key={`${subject}:${initialLectureId || "list"}`} subject={subject} initialLectureId={initialLectureId} lectures={group.lectures} parts={outline.find(item => item.subject === subject)!.parts} subjectLabel={subjectLabel(subject)}/>
    <section id="lecture-app" className="scroll-mt-24 rounded-[24px] border border-[#d8e3ef] bg-[#f3f7fc] px-6 py-9 md:flex md:items-center md:justify-between md:gap-10 md:px-9">
      <div className="max-w-xl space-y-3">
        <p className="text-xs font-semibold tracking-wide text-carbon">봄기출 공인중개사 앱</p>
        <h2 className="text-2xl font-semibold leading-snug text-ink">다음 강의도 이어서 들어 보세요</h2>
        <p className="text-sm leading-7 text-smoke">홈페이지에서는 각 과목의 첫 3강을 미리 볼 수 있어요. 봄기출 공인중개사 앱에서 이어서 공부할 수 있어요.</p>
      </div>
      <AppStoreButtons className="mt-6 shrink-0 md:mt-0 md:max-w-[180px]"/>
    </section>
  </div>;
}
