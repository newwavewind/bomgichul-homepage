import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import manifest from '@/components/lectures/textbooks.json';
import outline from '@/components/lectures/outline.json';
import catalog from '@/components/lectures/catalog.json';

const books: Record<string, { id: string; url: string; pages: number; sha256: string }> = manifest.books;
describe('공인중개사 무료 교재와 강의 공개 범위', () => {
  it('기존 311강 목차에 빠짐없이 개별 교재와 6과목 통합 기본서를 연결한다', () => {
    const ids = outline.flatMap(group => group.parts.flatMap(part => part.sections.flatMap(section => section.lessons.map(lesson => lesson.id))));
    expect(ids).toHaveLength(311);
    expect(Object.keys(books).sort()).toEqual(ids.sort());
    expect(Object.keys(manifest.compilations).sort()).toEqual(outline.map(group => group.subject).sort());
    for (const book of [...Object.values(books), ...Object.values(manifest.compilations)]) {
      expect(book.url).toBe(`https://pub-018addf460ef45fcad17018a675217b0.r2.dev/textbooks/civil/2026-11-04/${book.sha256}/${book.id}.pdf`);
      expect(book.pages).toBeGreaterThan(0);
      expect(book.sha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });
  it('과목별 첫 3강만 기존 웹 플레이어에 공개하고 나머지 교재를 독립 제공한다', () => {
    expect(catalog).toHaveLength(6);
    for (const group of outline) {
      const ids = group.parts.flatMap(part => part.sections.flatMap(section => section.lessons.map(lesson => lesson.id)));
      expect(catalog.find(item => item.subject === group.subject)!.lectures.map(item => item.id)).toEqual(ids.slice(0,3));
    }
    const source = readFileSync('src/components/lectures/LectureSamples.jsx', 'utf8');
    expect(source).toContain("site === 'real-estate' ? textbooks.books : {}");
    expect(source).toContain('preview ? <PlayerBoundary>');
    expect(source).toContain('lecture-app-button');
    expect(source).toContain('{subjectBooks[lesson.id] && <TextbookButton');
    const viewer = readFileSync('src/components/lectures/TextbookAccess.tsx', 'utf8');
    expect(viewer).not.toMatch(/supabase|useAuth|isPaid|hasAccess/);
    expect(viewer).toContain('link.download = book.fileName');
  });
});
