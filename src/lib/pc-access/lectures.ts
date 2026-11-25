import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import policeOutline from '@/components/lectures/police/outline.json';
import realEstateOutline from '@/components/lectures/outline.json';
import firefighterOutline from '@/components/lectures/firefighter/outline.json';
import { lecturePcSubject, pcSite, PC_SUBJECTS, type PcSubject } from './catalog';

const audioOrigin = 'https://pub-018addf460ef45fcad17018a675217b0.r2.dev';
type Lecture = {
  audioBase: string;
  scenes: { id: string }[];
  [key: string]: unknown;
};
const definitions = new Map<PcSubject, Promise<Record<string, Lecture>>>();

export function paidLectureSubject(lectureId: string): PcSubject | null {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(lectureId)) return null;
  const programs = [['police', policeOutline], ['real-estate', realEstateOutline], ['firefighter', firefighterOutline]] as const;
  for (const [site, outline] of programs) {
    const group = outline.find(group => group.parts.some(part => part.sections.some(section => section.lessons.some(
      lesson => lesson.id === lectureId && lesson.number > 3 && lesson.ready,
    ))));
    if (group) return lecturePcSubject(site, group.subject) ?? null;
  }
  return null;
}

export async function readPaidLecture(subject: PcSubject, lectureId: string): Promise<Lecture | null> {
  const site = pcSite(subject);
  if (!site || paidLectureSubject(lectureId) !== subject) return null;
  let catalog = definitions.get(subject);
  if (!catalog) {
    catalog = readFile(path.join(process.cwd(), 'data', `${site}-pro-lectures`, `${PC_SUBJECTS[subject].lectureSubject}.json`), 'utf8')
      .then(content => JSON.parse(content))
      .catch(error => { definitions.delete(subject); throw error; });
    definitions.set(subject, catalog);
  }
  return (await catalog)[lectureId] || null;
}

export function audioSource(lecture: Lecture, sceneFile: string): URL | null {
  const match = /^scene-(\d{2})\.m4a$/.exec(sceneFile);
  if (!match || Number(match[1]) < 1 || Number(match[1]) > lecture.scenes.length) return null;
  const base = new URL(lecture.audioBase);
  if (base.origin !== audioOrigin || !base.pathname.startsWith('/lectures/')) return null;
  return new URL(`${base.pathname}/${sceneFile}`, audioOrigin);
}
