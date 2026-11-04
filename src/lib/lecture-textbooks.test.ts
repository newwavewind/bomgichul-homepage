import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import civil from '@/components/lectures/textbooks.json';
import fire from '@/components/lectures/firefighter/textbooks.json';
import civilOutline from '@/components/lectures/outline.json';
import fireOutline from '@/components/lectures/firefighter/outline.json';
import civilCatalog from '@/components/lectures/catalog.json';
import fireCatalog from '@/components/lectures/firefighter/catalog.json';

describe('현재 공인중개사·소방 무료 교재와 기존 강의 공개 범위', () => {
  it('532개의 현재 SHA 고정 PDF를 강의 목차와 빠짐없이 연결한다', () => {
    for (const [product, manifest, outline, count, pages] of [
      ['civil', civil, civilOutline, 311, 12723],
      ['fire', fire, fireOutline, 215, 5913],
    ] as const) {
      const ids = outline.flatMap(g => g.parts.flatMap(p => p.sections.flatMap(s => s.lessons.map(l => l.id))));
      expect(ids).toHaveLength(count);
      expect(Object.keys(manifest.books).sort()).toEqual(ids.sort());
      expect(Object.values(manifest.books).reduce((n, b) => n + b.pages, 0)).toBe(pages);
      for (const book of [...Object.values(manifest.books), ...Object.values(manifest.compilations)]) {
        expect(book.url).toBe(`https://pub-018addf460ef45fcad17018a675217b0.r2.dev/textbooks/${product}/2026-11-04/${book.sha256}/${book.id}.pdf`);
        expect(book.pages).toBeGreaterThan(0);
        expect(book.sha256).toMatch(/^[a-f0-9]{64}$/);
      }
    }
    expect(Object.keys(civil.compilations).sort()).toEqual(civilOutline.map(g => g.subject).sort());
    expect(Object.values(civil.compilations).reduce((n, b) => n + b.pages, 0)).toBe(12744);
    expect(Object.keys(fire.compilations)).toHaveLength(0);
  });
  it('강의 플레이어는 각 과목 첫3강만 공개하고 교재 단추는 별도로 무료 제공한다', () => {
    for (const [catalog, outline] of [[civilCatalog, civilOutline], [fireCatalog, fireOutline]] as const) {
      for (const group of outline) {
        const ids = group.parts.flatMap(p => p.sections.flatMap(s => s.lessons.map(l => l.id)));
        expect(catalog.find(g => g.subject === group.subject)!.lectures.map(l => l.id)).toEqual(ids.slice(0, 3));
      }
    }
    const source = readFileSync('src/components/lectures/LectureSamples.jsx', 'utf8');
    expect(source).toContain("site === 'firefighter' ? fireTextbooks.books : {}");
    expect(source).toContain('preview ? <PlayerBoundary>');
    expect(source).toContain('lecture-app-button');
    expect(source).toContain('{book && <TextbookButton book={book}/>}');
    expect(source).not.toContain('TextbookAppButton');
    const viewer = readFileSync('src/components/lectures/TextbookAccess.tsx', 'utf8');
    expect(viewer).not.toMatch(/supabase|useAuth|isPaid|hasAccess/);
    expect(viewer).toContain("label = '교재 무료'");
    expect(viewer).toContain('key={book.sha256}');
    expect(viewer).toContain('link.download = book.fileName');
  });
});
