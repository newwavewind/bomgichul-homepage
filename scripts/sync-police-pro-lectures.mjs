/** Export production police lectures into the server-only PC catalog. */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/sync-police-pro-lectures.mjs <police-app-checkout>');
const app = path.resolve(source);
const appCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: app, encoding: 'utf8' }).trim();
const police = 'src/components/lectures/police';
const outline = JSON.parse(await readFile(path.join(police, 'outline.json'), 'utf8'));
const previews = JSON.parse(await readFile(path.join(police, 'catalog.json'), 'utf8'));
const output = 'data/police-pro-lectures';
const sourcePath = 'src/data/concepts';
const sourceHost = 'https://pub-018addf460ef45fcad17018a675217b0.r2.dev';
const examParts = { constitution: '헌법', 'criminal-law': '형사법', 'police-science': '경찰학' };
const figureBase = JSON.parse(await readFile(path.join(police, 'source-manifest.json'), 'utf8')).figureBase;
const manifest = { appCommit, subjects: {} };
await mkdir(output, { recursive: true });

for (const group of outline) {
  const lessons = group.parts.flatMap(part => part.sections.flatMap(section => section.lessons));
  const publicIds = new Set(previews.find(preview => preview.subject === group.subject).lectures.map(lesson => lesson.id));
  const definitions = {};
  for (const lesson of lessons) {
    if (publicIds.has(lesson.id) || !lesson.ready) continue;
    const file = `${lesson.sourceId}MicroLecture.js`;
    const module = await import(pathToFileURL(path.join(app, sourcePath, file)));
    const audioBase = Object.entries(module).find(([key]) => key.endsWith('_AUDIO_BASE'))?.[1];
    const scenes = module[`${lesson.sourceId}MicroLecture`];
    const exams = module[`${lesson.sourceId}LectureExams`];
    const cues = JSON.parse(await readFile(path.join(app, sourcePath, `${lesson.sourceId}LectureCues.json`), 'utf8'));
    if (!Array.isArray(scenes) || !scenes.length || !scenes.every(scene => scene.id && scene.steps?.length) ||
        !cues || typeof audioBase !== 'string' || !audioBase.startsWith(`${sourceHost}/lectures/`)) {
      throw new Error(`Incomplete lecture ${lesson.id}`);
    }
    const examLinks = (exams || []).flatMap(exam => {
      const match = /^(.+)-(\d{4})-([12])-Q(\d+)$/.exec(exam.id);
      if (!match || match[1] !== examParts[group.subject]) return [];
      const [, , year, round, no] = match;
      return [{ label: exam.label, href: `/police/exam/${group.subject}/${year}/${encodeURIComponent(round + '차')}/${no}` }];
    });
    definitions[lesson.id] = { title: lesson.title, boardLabel: `봄기출 · ${examParts[group.subject]}`, scenes, cues, audioBase, figureBase, boundedWriting: true, examLinks };
  }
  const filename = `${group.subject}.json`;
  const content = JSON.stringify(definitions) + '\n';
  await writeFile(path.join(output, filename), content);
  manifest.subjects[group.subject] = {
    public: publicIds.size,
    paid: Object.keys(definitions).length,
    sha256: createHash('sha256').update(content).digest('hex'),
  };
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
