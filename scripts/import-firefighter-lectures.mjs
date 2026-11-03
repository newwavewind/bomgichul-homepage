/** Import published app lectures, exposing only the first three per subject. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const source = process.argv[process.argv.indexOf('--source') + 1];
if (!process.argv.includes('--source') || !source) throw new Error('Supply --source /path/to/the/current/firefighter/app');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/components/lectures/firefighter');
const pkg = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
if (pkg.name !== 'firebomgichul') throw new Error('The source must be the firefighter app');
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
const figureBase = playerSource.match(/const FIGURE_BASE\s*=\s*['"]([^'"]+)['"]/)?.[1];
if (!figureBase) throw new Error('The original textbook figure URL must be preserved');
const labels = { sobang: '소방학개론', sobangbeop: '소방관계법규', haengjeongbeop: '행정법총론' };
const catalog = [], outline = [], imports = [], sourceHashes = {};
await mkdir(path.join(target, 'data'), { recursive: true });
await mkdir(path.join(target, 'players'), { recursive: true });
for (const [subject, label] of Object.entries(labels)) {
  let number = 0;
  // Empty curriculum slots are not lectures. Keep the app's order of actual lessons.
  const parts = app.buildOutlineParts(subject).map(part => ({ title: part.chapter, sections: part.sections.map(section => ({ title: section.section, lessons: section.items.filter(item => !app.getChalkLectureCover(subject, item) && app.getChalkLecture(subject, item)).map(item => {
    const lecture = app.getChalkLecture(subject, item);
    return { id: `fire-${lecture.id}`, sourceId: lecture.id, title: item.titleKo, number: ++number, ready: true, seconds: Math.round(app.lectureTotalSeconds(lecture.id)), description: lecture.description || '' };
  }) })).filter(section => section.lessons.length) })).filter(part => part.sections.length);
  const previews = parts.flatMap(part => part.sections.flatMap(section => section.lessons)).slice(0, 3);
  if (previews.length !== 3) throw new Error(`${label}: three available lessons required`);
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
      const match = exam.id.match(/^(.+)-(\d{4})-(.+)-Q(\d+)$/);
      if (!match || match[3] !== '국가직') throw new Error(`${id}: unexpected public-recruitment exam ${exam.id}`);
      return { label: exam.label, href: `/firefighter/exam/${subject}/${match[2]}/${encodeURIComponent(match[3])}/${match[4]}` };
    });
    const definition = { ...original, boundedWriting: true, subject, figureBase, examLinks };
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
if (count !== app.CHALK_LECTURES.length) throw new Error('Some registered app lectures were not matched to the curriculum');
await writeFile(path.join(target, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
await writeFile(path.join(target, 'outline.json'), JSON.stringify(outline, null, 2) + '\n');
await writeFile(path.join(target, 'players.jsx'), `import { lazy } from 'react';\nexport const firefighterPlayers = {\n${imports.join('\n')}\n};\n`);
const metadata = { sourceCommit: execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), registeredLectures: count, previewCount: 9, previewsPerSubject: 3, figureBase, hashes: sourceHashes };
await writeFile(path.join(target, 'source-manifest.json'), JSON.stringify(metadata, null, 2) + '\n');
console.log(JSON.stringify({ count, subjects: outline.map(group => ({ subject: group.subject, count: group.parts.flatMap(part => part.sections.flatMap(section => section.lessons)).length })), previews: Object.keys(sourceHashes) }, null, 2));
