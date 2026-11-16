import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import catalog from '@/components/lectures/firefighter/catalog.json';
import outline from '@/components/lectures/firefighter/outline.json';
import manifest from '@/components/lectures/firefighter/source-manifest.json';
import realtorCatalog from '@/components/lectures/catalog.json';
import { lecturePagePath, lectureSiteConfig } from './lecture-sites';

const dataRoot = path.join(process.cwd(), 'src/components/lectures/firefighter/data');
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

describe('소방공무원 앱 강의의 홈페이지 이식', () => {
  it('완성된 215강의 순서와 과목별 첫 3강만 웹 플레이어에 공개한다', () => {
    expect(outline.map(group => group.parts.flatMap(part => part.sections.flatMap(section => section.lessons)).length)).toEqual([72, 90, 53]);
    expect(manifest.registeredLectures).toBe(215);
    expect(catalog.flatMap(group => group.lectures)).toHaveLength(9);
    const previews = catalog.flatMap(group => group.lectures);
    expect(new Set(previews.map(lecture => lecture.id)).size).toBe(9);
    expect(previews.every(lecture => lecture.id.startsWith('fire-'))).toBe(true);
    expect(previews.some(lecture => realtorCatalog.some(group => group.lectures.some(item => item.id === lecture.id)))).toBe(false);
    expect(readdirSync(dataRoot).sort()).toEqual(previews.map(item => `${item.sourceId}.json`).sort());
    for (const group of outline) {
      const lessons = group.parts.flatMap(part => part.sections.flatMap(section => section.lessons));
      expect(lessons.map(item => item.number)).toEqual(lessons.map((_, index) => index + 1));
      expect(catalog.find(item => item.subject === group.subject)!.lectures.map(item => item.id)).toEqual(lessons.slice(0, 3).map(item => item.id));
    }
  });

  it('9강의 원본 대본·판서·큐와 공개 음원 주소를 변경하지 않는다', () => {
    for (const group of catalog) for (const lecture of group.lectures) {
      const definition = JSON.parse(readFileSync(path.join(dataRoot, `${lecture.sourceId}.json`), 'utf8'));
      const original = manifest.hashes[lecture.sourceId as keyof typeof manifest.hashes];
      expect(hash(definition.scenes)).toBe(original.scenes);
      expect(hash(definition.cues)).toBe(original.cues);
      expect(definition.audioBase).toBe(original.audioBase);
      expect(definition.figureBase).toBe(manifest.figureBase);
      const image = readFileSync(path.join(process.cwd(), 'public/lecture-boards', `${lecture.id}-board-v1.jpg`));
      expect(image.subarray(0, 3).toString('hex')).toBe('ffd8ff');
      for (const scene of definition.scenes) {
        const cue = definition.cues[scene.id];
        expect(cue.starts).toHaveLength(scene.steps.length);
        expect(cue.duration).toBeGreaterThan(0);
        expect(cue.starts.every((time: number, index: number) => Number.isFinite(time) && time >= 0 && time < cue.duration && (index === 0 || time >= cue.starts[index - 1]))).toBe(true);
      }
      for (const exam of definition.examLinks) {
        expect(exam.href).toMatch(new RegExp(`^/firefighter/exam/${group.subject}/\\d{4}/`));
      }
    }
  });

  it('공유 링크와 앱 안내를 해당 시험으로 연결하고 공인중개사 기본값을 유지한다', () => {
    expect(lecturePagePath('firefighter', 'sobang', 'fire-sbU101_1')).toBe('/firefighter/lectures/sobang?lecture=fire-sbU101_1');
    expect(lecturePagePath('real-estate', 'civil')).toBe('/real-estate/lectures/civil');
    const fire = lectureSiteConfig('firefighter');
    expect(fire.appName).toBe('봄기출 소방공무원 앱');
    expect(Object.values(fire.appLinks)).toContain('https://apps.apple.com/kr/app/id6814271261');
    expect(Object.values(fire.appLinks)).toContain('https://play.google.com/store/apps/details?id=com.sanghyun.firefighter');
    expect(lectureSiteConfig().examLabel).toBe('공인중개사');
    expect(fire.appLinks).not.toEqual(lectureSiteConfig().appLinks);
  });
});
