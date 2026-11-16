import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import civil from '@/components/lectures/textbooks.json';
import fire from '@/components/lectures/firefighter/textbooks.json';
import civilOutline from '@/components/lectures/outline.json';
import fireOutline from '@/components/lectures/firefighter/outline.json';
import civilCatalog from '@/components/lectures/catalog.json';
import fireCatalog from '@/components/lectures/firefighter/catalog.json';
import police from '@/components/lectures/police/textbooks.json';
import policeOutline from '@/components/lectures/police/outline.json';
import policeCatalog from '@/components/lectures/police/catalog.json';

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
  it('강의 첫3강 정책을 유지하고 나머지 교재는 PDF 대신 앱 이용 안내를 제공한다', () => {
    for (const [catalog, outline] of [[civilCatalog, civilOutline], [fireCatalog, fireOutline], [policeCatalog, policeOutline]] as const) {
      for (const group of outline) {
        const ids = group.parts.flatMap(p => p.sections.flatMap(s => s.lessons.map(l => l.id)));
        expect(catalog.find(g => g.subject === group.subject)!.lectures.map(l => l.id)).toEqual(ids.slice(0, 3));
      }
    }
    const source = readFileSync('src/components/lectures/LectureSamples.jsx', 'utf8');
    expect(source).toContain('preview ? <PlayerBoundary>');
    expect(source).toContain('book.url ? <TextbookButton');
    expect(source).toContain('TextbookAppButton title={book.title}');
    expect(source).toContain('이 교재는 앱에서 이용할 수 있어요');
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
