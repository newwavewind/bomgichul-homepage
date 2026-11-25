/** Export purchased-subject lecture definitions for the server-only PC player. */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/sync-real-estate-pro-lectures.mjs <real-estate-app-checkout>');
const app = path.resolve(source);
const appCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: app, encoding: 'utf8' }).trim();
const lectureFiles = path.join(app, 'src/data/concepts');
const load = async file => JSON.parse(await readFile(file, 'utf8'));
const outline = await load('src/components/lectures/outline.json');
const previews = await load('src/components/lectures/catalog.json');
const output = 'data/real-estate-pro-lectures';
const manifest = { appCommit, subjects: {} };
await mkdir(output, { recursive: true });

for (const group of outline) {
  const lessons = group.parts.flatMap(part => part.sections.flatMap(section => section.lessons));
  const preview = previews.find(item => item.subject === group.subject);
  const sample = await load(`src/components/lectures/data/${preview.lectures[0].id}.json`);
  const publicIds = new Set(preview.lectures.map(lesson => lesson.id));
  const definitions = {};
  for (const { id, title, ready, number } of lessons) {
    if (!ready || number <= 3) continue;
    if (publicIds.has(id)) throw new Error(`Paid lecture is a public preview: ${id}`);
    const module = await import(pathToFileURL(path.join(lectureFiles, `${id}MicroLecture.js`)));
    const audioBase = Object.entries(module).find(([key]) => /audio_?base$/i.test(key))?.[1];
    const scenes = module[id + 'MicroLecture'];
    const cues = await load(path.join(lectureFiles, id + 'LectureCues.json'));
    const exams = module[id + 'LectureExams'] || [];
    if (!Array.isArray(scenes) || !scenes.length || !scenes.every(scene => scene.id && scene.steps?.length && cues[scene.id]) ||
        typeof audioBase !== 'string' || !audioBase.startsWith('https://pub-018addf460ef45fcad17018a675217b0.r2.dev/lectures/')) {
      throw new Error(`Incomplete lecture definition: ${id}`);
    }
    const examLinks = exams.flatMap(({ label, year, no }) => Number.isInteger(year) && Number.isInteger(no)
      ? [{ label, href: `/exam/${group.subject}/${year}/${no}` }] : []);
    definitions[id] = { title, boardLabel: `봄기출 · ${title}`, scenes, cues, audioBase, boundedWriting: true, examLinks,
      ...(sample.figureBase ? { figureBase: sample.figureBase } : {}) };
  }
  const content = JSON.stringify(definitions) + '\n';
  await writeFile(path.join(output, group.subject + '.json'), content);
  manifest.subjects[group.subject] = {
    public: publicIds.size,
    paid: Object.keys(definitions).length,
    sha256: createHash('sha256').update(content).digest('hex'),
  };
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
