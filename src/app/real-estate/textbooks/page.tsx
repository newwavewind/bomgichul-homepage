import Link from 'next/link';
import textbooks from '@/components/lectures/textbooks.json';
import outline from '@/components/lectures/outline.json';
import { CompilationCard, TextbookButton, type Textbook } from '@/components/lectures/TextbookAccess';
import { ARCHIVE_SUBJECT_MAP } from '@/lib/constants';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({ title: '공인중개사 무료 강의 교재 · 6과목 통합 기본서', description: '공인중개사 311강 개별 교재와 6과목 통합 기본서를 무료로 열고 PDF로 저장하세요. 로그인이나 구매 없이 이용할 수 있습니다.', path: '/real-estate/textbooks' });
const books: Record<string, Textbook> = textbooks.books;
const compilations: Record<string, Textbook> = textbooks.compilations;
const label = (subject: string) => ARCHIVE_SUBJECT_MAP[subject as keyof typeof ARCHIVE_SUBJECT_MAP];

export default function TextbooksPage() {
  return <main className="mx-auto max-w-[1160px] space-y-10 px-4 py-8 sm:px-6 md:py-12">
    <Link href="/real-estate" className="inline-flex min-h-11 items-center text-sm font-semibold text-carbon">← 공인중개사 학습 홈</Link>
    <header className="space-y-4"><p className="text-sm font-semibold text-carbon">봄기출 무료 교재</p><h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">강의 한 권부터, 과목 한 권까지</h1><p className="max-w-2xl text-sm leading-7 text-smoke md:text-base">311강 개별 교재와 6과목 통합 기본서를 모두 무료로 제공합니다.<br/>로그인·구매 없이 바로 읽고, PDF를 저장해 인쇄할 수 있어요.</p><p className="text-xs leading-6 text-smoke">강의 영상은 홈페이지에서 과목별 첫 3강을 미리 볼 수 있어요. 교재는 모든 강의가 무료입니다.</p></header>
    <nav className="flex flex-wrap gap-2" aria-label="교재 과목">{outline.map(group => <a key={group.subject} href={`#${group.subject}`} className="rounded-full border border-[#d8e3ef] px-4 py-2.5 text-sm font-semibold text-carbon hover:bg-snow">{label(group.subject)}</a>)}</nav>
    {outline.map(group => <section key={group.subject} id={group.subject} className="scroll-mt-24 space-y-5" aria-label={`${label(group.subject)} 무료 교재`}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold text-ink">{label(group.subject)}</h2><Link href={`/real-estate/lectures/${group.subject}`} className="text-sm font-semibold text-carbon">강의 목록 보기 →</Link></div>
      {compilations[group.subject] && <CompilationCard book={compilations[group.subject]}/>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{group.parts.flatMap(part => part.sections.flatMap(section => section.lessons.map(lesson => books[lesson.id] && <article key={lesson.id} className="flex flex-col items-start rounded-2xl border border-[#d8e3ef] bg-white p-5"><p className="text-xs text-smoke">{lesson.number}강 · {books[lesson.id].pages}쪽</p><h3 className="mb-5 mt-2 flex-1 text-base font-semibold leading-7 text-ink">{lesson.title}</h3><TextbookButton book={books[lesson.id]}/></article>)))}</div>
    </section>)}
  </main>;
}
