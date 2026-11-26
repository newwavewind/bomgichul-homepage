import { readFileSync } from 'node:fs';
import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import LectureSamples from '@/components/lectures/LectureSamples';
import { TextbookButton } from '@/components/lectures/TextbookAccess';
import civil from '@/components/lectures/textbooks.json';
import fire from '@/components/lectures/firefighter/textbooks.json';
import civilOutline from '@/components/lectures/outline.json';
import fireOutline from '@/components/lectures/firefighter/outline.json';
import civilCatalog from '@/components/lectures/catalog.json';
import fireCatalog from '@/components/lectures/firefighter/catalog.json';
import police from '@/components/lectures/police/textbooks.json';
import policeOutline from '@/components/lectures/police/outline.json';
import policeCatalog from '@/components/lectures/police/catalog.json';

vi.mock('@/components/lectures/players', async importOriginal => {
  const { players } = await importOriginal<typeof import('@/components/lectures/players')>();
  const PreviewPlayer = ({ renderTrigger }: { renderTrigger: (play: () => void) => ReactNode }) => renderTrigger(() => {});
  return { players: Object.fromEntries(Object.keys(players).map(id => [id, PreviewPlayer])) };
});

vi.mock('@/components/lectures/TextbookAccess', async importOriginal => {
  const actual = await importOriginal<typeof import('@/components/lectures/TextbookAccess')>();
  return { ...actual, TextbookButton: vi.fn(actual.TextbookButton) };
});

describe('웹 강의·교재 과목별 첫3강 공개와 앱 이용 안내', () => {
  it('현재758강 메타데이터를 보존하고 첫3 READY 교재에만 원격 URL을 제공한다', () => {
    for (const [product, manifest, outline, count, pages, release] of [
      ['civil', civil, civilOutline, 311, 12723, '2026-11-04'],
      ['fire', fire, fireOutline, 215, 5913, '2026-11-04'],
      ['police', police, policeOutline, 232, 8236, '2026-11-11'],
    ] as const) {
      const books: Record<string, {id:string;pages:number;sha256:string;url?:string;remotePath?:string;requiresPurchase:boolean}> = manifest.books;
      const ids = outline.flatMap(g => g.parts.flatMap(p => p.sections.flatMap(s => s.lessons.map(l => l.id))));
      expect(ids).toHaveLength(count);
      expect(Object.keys(books).sort()).toEqual(ids.sort());
      expect(Object.values(books).reduce((n, b) => n + b.pages, 0)).toBe(pages);
      expect(manifest.access.freeTextbooksPerSubject).toBe(3);
      expect(Object.keys(manifest.compilations)).toHaveLength(0);
      for (const group of outline) {
        const lessons=group.parts.flatMap(p => p.sections.flatMap(s => s.lessons));
        for (const [index, lesson] of lessons.entries()) {
          const book=books[lesson.id];
          expect(book.sha256).toMatch(/^[a-f0-9]{64}$/);
          if(index < 3) {
            expect(book.requiresPurchase).toBe(false);
            expect(book.url).toBe(`https://pub-018addf460ef45fcad17018a675217b0.r2.dev/textbooks/${product}/${release}/${book.sha256}/${book.id}.pdf`);
          } else {
            expect(book.requiresPurchase).toBe(true);
            expect(book.url).toBeUndefined();
            expect(book.remotePath).toBeUndefined();
          }
        }
      }
    }
  });
  it('과목별 첫 3강을 공개하고 이후 교재는 Pro 권한에 따라 열기 또는 앱 안내를 제공한다', () => {
    for (const [site, catalog, outline, manifest] of [
      ['real-estate', civilCatalog, civilOutline, civil],
      ['firefighter', fireCatalog, fireOutline, fire],
      ['police', policeCatalog, policeOutline, police],
    ] as const) {
      for (const group of outline) {
        const ids = group.parts.flatMap(p => p.sections.flatMap(s => s.lessons.map(l => l.id)));
        expect(catalog.find(g => g.subject === group.subject)!.lectures.map(l => l.id)).toEqual(ids.slice(0, 3));
      }

      const { subject, lectures } = catalog[0];
      const { parts } = outline.find(group => group.subject === subject)!;
      const lessons = parts.flatMap(part => part.sections.flatMap(section => section.lessons));
      const paidLesson = lessons[3];
      const books: Record<string, { id: string; title: string }> = manifest.books;
      const paidBook = books[paidLesson.id];
      const bookButton = vi.mocked(TextbookButton);
      const render = (pcPro: boolean) => {
        bookButton.mockClear();
        return renderToStaticMarkup(createElement(LectureSamples, {
          site, subject, subjectLabel: subject, lectures, parts, initialLectureId: undefined, pcPro,
        }));
      };

      const publicPage = render(false);
      for (const lesson of lessons.slice(0, 3)) {
        expect(publicPage).toContain(`aria-label="${lesson.number}강 ${lesson.title} 재생"`);
        expect(publicPage).toContain(`aria-label="${books[lesson.id].title} 샘플 교재 열기"`);
      }
      expect(bookButton.mock.calls.map(([{ book }]) => book)).toEqual(lessons.slice(0, 3).map(lesson => books[lesson.id]));
      expect(publicPage).toContain(`aria-label="${paidLesson.number}강 ${paidLesson.title} Pro 수강권"`);
      expect(publicPage).toContain(`aria-label="${paidBook.title} 교재 앱에서 보기"`);

      const proPage = render(true);
      expect(proPage).toContain(`aria-label="${paidLesson.number}강 ${paidLesson.title} 재생"`);
      expect(proPage).toContain(`aria-label="${paidBook.title} Pro 교재 열기"`);
      expect(proPage).not.toContain(`aria-label="${paidBook.title} 교재 앱에서 보기"`);
      expect(bookButton.mock.calls.find(([{ book }]) => book.id === paidBook.id)?.[0]).toMatchObject({
        book: { url: `/api/pc-access/textbook/${paidLesson.id}` },
        pro: true,
      });
    }

    const viewer = readFileSync('src/components/lectures/TextbookAccess.tsx', 'utf8');
    expect(viewer).toContain('if (!book.url) return null');
    expect(viewer).toContain('key={book.sha256}');
    expect(viewer).toContain('link.download = book.fileName');
    for(const site of ['real-estate','firefighter','police']) {
      const page=readFileSync(`src/app/${site}/textbooks/page.tsx`,'utf8');
      expect(page).toContain(`redirect('/${site}/lectures/`);
      expect(page).not.toContain('CompilationCard');
    }
  });
});
