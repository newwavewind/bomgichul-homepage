import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import catalog from '@/components/lectures/police/catalog.json';
import outline from '@/components/lectures/police/outline.json';
import manifest from '@/components/lectures/police/source-manifest.json';
import firefighterCatalog from '@/components/lectures/firefighter/catalog.json';
import realtorCatalog from '@/components/lectures/catalog.json';
import { lecturePagePath, lectureSiteConfig } from './lecture-sites';

const dataRoot = path.join(process.cwd(), 'src/components/lectures/police/data');
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

describe('경찰공무원 앱 강의의 홈페이지 이식', () => {
  it('완성된 강의 순서와 과목별 첫 3강만 웹 플레이어에 공개한다', () => {
    expect(outline.map(group => group.parts.flatMap(part => part.sections.flatMap(section => section.lessons)).length)).toEqual([45, 92]);
    expect(manifest.registeredLectures).toBe(137);
    expect(catalog.map(group => group.subject)).toEqual(['constitution', 'criminal-law']);
    expect(catalog.flatMap(group => group.lectures)).toHaveLength(6);
    const previews = catalog.flatMap(group => group.lectures);
    expect(new Set(previews.map(lecture => lecture.id)).size).toBe(6);
    expect(previews.every(lecture => lecture.id.startsWith('police-'))).toBe(true);
    expect(previews.some(lecture => realtorCatalog.some(group => group.lectures.some(item => item.id === lecture.id)))).toBe(false);
    expect(previews.some(lecture => firefighterCatalog.some(group => group.lectures.some(item => item.id === lecture.id)))).toBe(false);
    expect(readdirSync(dataRoot).sort()).toEqual(previews.map(item => `${item.sourceId}.json`).sort());
    for (const group of outline) {
      const lessons = group.parts.flatMap(part => part.sections.flatMap(section => section.lessons));
      expect(lessons.map(item => item.number)).toEqual(lessons.map((_, index) => index + 1));
      expect(catalog.find(item => item.subject === group.subject)!.lectures.map(item => item.id)).toEqual(lessons.slice(0, 3).map(item => item.id));
    }
  });

  it('6강의 원본 대본·판서·큐와 공개 음원 주소를 변경하지 않는다', () => {
    for (const group of catalog) for (const lecture of group.lectures) {
      const definition = JSON.parse(readFileSync(path.join(dataRoot, `${lecture.sourceId}.json`), 'utf8'));
      const original = manifest.hashes[lecture.sourceId as keyof typeof manifest.hashes];
      expect(hash(definition.scenes)).toBe(original.scenes);
      expect(hash(definition.cues)).toBe(original.cues);
      expect(definition.audioBase).toBe(original.audioBase);
      if (manifest.figureBase) expect(definition.figureBase).toBe(manifest.figureBase);
      expect(definition.audioBase.startsWith('https://')).toBe(true);
      const image = readFileSync(path.join(process.cwd(), 'public/lecture-boards', `${lecture.id}-board-v1.jpg`));
      expect(image.subarray(0, 3).toString('hex')).toBe('ffd8ff');
      for (const exam of definition.examLinks ?? []) {
        expect(exam.href).toMatch(new RegExp(`^/police/exam/${group.subject}/\\d{4}/`));
      }
    }
  });

  it('사이트 경로와 앱 링크를 경찰공무원으로 둔다', () => {
    expect(lecturePagePath('police', 'constitution', 'police-hnU101_1')).toBe('/police/lectures/constitution?lecture=police-hnU101_1');
    expect(lecturePagePath('firefighter', 'sobang')).toBe('/firefighter/lectures/sobang');
    const police = lectureSiteConfig('police');
    expect(police.examLabel).toBe('경찰공무원');
    expect(police.basePath).toBe('/police/lectures');
    expect(Object.values(police.appLinks)).toContain('https://play.google.com/store/apps/details?id=com.sanghyun.police');
  });
});
