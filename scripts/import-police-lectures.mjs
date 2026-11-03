/** Import published police-app lectures, exposing only the first three per subject. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const source = process.argv[process.argv.indexOf('--source') + 1];
if (!process.argv.includes('--source') || !source) throw new Error('Supply --source /path/to/the/current/police/app');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/components/lectures/police');
const pkg = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
if (pkg.name !== 'police-bomgichul') throw new Error('The source must be the police app (police-bomgichul)');
const { build } = createRequire(path.join(source, 'package.json'))('esbuild');
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const capture = { name: 'capture-original-definition', setup(b) {
  b.onResolve({ filter: /createChalkLecture(?:\.jsx)?$/ }, () => ({ path: 'capture', namespace: 'capture' }));
  b.onLoad({ filter: /.*/, namespace: 'capture' }, () => ({ contents: 'export default definition => definition', loader: 'js' }));
} };
async function bundled(contents, plugins = []) {
  const result = await build({ stdin: { contents, resolveDir: source, sourcefile: 'website-lecture-export.mjs' }, bundle: true, platform: 'node', format: 'esm', write: false, plugins, logLevel: 'error' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
const app = await bundled(`export {buildOutlineParts} from './src/data/concepts/conceptOutline.js'; export {CHALK_LECTURES,getChalkLecture,getChalkLectureCover} from './src/data/concepts/lectureCatalog.js'; export {lectureTotalSeconds} from './src/data/concepts/lectureDurations.js';`);
const playerSource = await readFile(path.join(source, 'src/components/concepts/createChalkLecture.jsx'), 'utf8');
const figureBase = playerSource.match(/const FIGURE_BASE\s*=\s*['"]([^'"]+)['"]/)?.[1] || null;
// App subject id → homepage subject slug + label (경찰학은 아직 등록 강의가 없으면 건너뛴다)
const subjects = [
  { appId: 'registry-law', subject: 'constitution', label: '헌법' },
  { appId: 'realestate-tax', subject: 'criminal-law', label: '형사법' },
  { appId: 'broker-law', subject: 'police-science', label: '경찰학' },
];
const catalog = [], outline = [], imports = [], sourceHashes = {};
await mkdir(path.join(target, 'data'), { recursive: true });
await mkdir(path.join(target, 'players'), { recursive: true });
for (const { appId, subject, label } of subjects) {
  let number = 0;
  const parts = app.buildOutlineParts(appId).map(part => ({ title: part.chapter, sections: part.sections.map(section => ({ title: section.section, lessons: section.items.filter(item => !app.getChalkLectureCover(appId, item) && app.getChalkLecture(appId, item)).map(item => {
    const lecture = app.getChalkLecture(appId, item);
    return { id: `police-${lecture.id}`, sourceId: lecture.id, title: item.titleKo, number: ++number, ready: true, seconds: Math.round(app.lectureTotalSeconds(lecture.id)), description: lecture.description || '' };
  }) })).filter(section => section.lessons.length) })).filter(part => part.sections.length);
  const allLessons = parts.flatMap(part => part.sections.flatMap(section => section.lessons));
  if (allLessons.length === 0) continue;
  if (allLessons.length < 3) throw new Error(`${label}: at least three available lessons required`);
  const previews = allLessons.slice(0, 3);
  const lectures = [];
  for (const lesson of previews) {
    const id = lesson.sourceId;
    const component = id[0].toUpperCase() + id.slice(1) + 'MicroLecture.jsx';
    const original = (await bundled(`export {default} from './src/components/concepts/${component}';`, [capture])).default;
    if (!original.audioBase?.startsWith('https://')) throw new Error(`${id}: published audio required`);
    for (const scene of original.scenes) {
      if (original.cues[scene.id]?.starts?.length !== scene.steps.length) throw new Error(`${id}/${scene.id}: script/cue mismatch`);
    }
    const seconds = Math.round(Object.values(original.cues).reduce((total, cue) => total + (Number.isFinite(cue?.duration) ? cue.duration : 0), 0));
    lesson.seconds = seconds;
    const examLinks = (original.exams || []).map(exam => {
      // 경찰 순경 공채: 헌법-2023-1-Q1 → /police/exam/constitution/2023/1차/1
      const match = exam.id.match(/^(.+)-(\d{4})-([12])-Q(\d+)$/);
      if (!match) throw new Error(`${id}: unexpected police exam id ${exam.id}`);
      const round = match[3] === '1' ? '1차' : '2차';
      return { label: exam.label, href: `/police/exam/${subject}/${match[2]}/${encodeURIComponent(round)}/${match[4]}` };
    });
    const definition = { ...original, boundedWriting: true, subject, ...(figureBase ? { figureBase } : {}), examLinks };
    await writeFile(path.join(target, 'data', `${id}.json`), JSON.stringify(definition) + '\n');
    await writeFile(path.join(target, 'players', `${id}.jsx`), `import createChalkLecture from '../../player/createChalkLecture';\nimport definition from '../data/${id}.json';\nexport default createChalkLecture(definition);\n`);
    imports.push(`  '${lesson.id}': lazy(() => import('./players/${id}')),`);
    lectures.push({ id: lesson.id, sourceId: id, title: lesson.title, description: lesson.description, seconds, sceneCount: original.scenes.length });
    sourceHashes[id] = { scenes: hash(original.scenes), cues: hash(original.cues), audioBase: original.audioBase, sceneCount: original.scenes.length };
  }
  catalog.push({ subject, label, lectures });
  outline.push({ subject, label, parts });
}
const count = outline.reduce((sum, group) => sum + group.parts.flatMap(part => part.sections.flatMap(section => section.lessons)).length, 0);
if (count !== app.CHALK_LECTURES.length) throw new Error(`Some registered app lectures were not matched to the curriculum (${count} vs ${app.CHALK_LECTURES.length})`);
if (catalog.length === 0) throw new Error('No police subjects with published lectures');
await writeFile(path.join(target, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
await writeFile(path.join(target, 'outline.json'), JSON.stringify(outline, null, 2) + '\n');
await writeFile(path.join(target, 'players.jsx'), `import { lazy } from 'react';\nexport const policePlayers = {\n${imports.join('\n')}\n};\n`);
const metadata = {
  sourceCommit: execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  registeredLectures: count,
  previewCount: catalog.length * 3,
  previewsPerSubject: 3,
  figureBase,
  hashes: sourceHashes,
};
await writeFile(path.join(target, 'source-manifest.json'), JSON.stringify(metadata, null, 2) + '\n');
console.log(JSON.stringify({ count, subjects: outline.map(group => ({ subject: group.subject, count: group.parts.flatMap(part => part.sections.flatMap(section => section.lessons)).length })), previews: Object.keys(sourceHashes) }, null, 2));
