import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const app = path.resolve(process.argv[2] ?? '');
const require = createRequire(path.join(app, 'package.json'));
if (!process.argv[2] || require('./capacitor.config.json').appId !== 'com.sanghyun.history') {
  throw new Error('사료 한국사 앱 경로가 필요합니다.');
}

const { build } = require('esbuild');
const source = path.join(app, 'src/data/subjects/history');
const bundle = await build({
  stdin: {
    resolveDir: source,
    contents: `
      import saryo from './saryo.json';
      import { SARYO_PERIODS, SARYO_THEMES } from './saryoTaxonomy';
      import { sortSaryo, yearLabel } from './saryoOrder';
      import { dictionaryPeople, personIdForRuler } from './royalPeople';
      import { comparePersonChronology } from './peopleChronology';
      import { indexPersonExams, joseonRulers } from './people';
      import { allExams } from './loadExam';
      import { POLITY_ERAS, polities } from './historyPolities';
      import lifespans from './peopleLifespans.json';
      import notes from './personSaryoNotes.json';
      import landing from './landingPortraits.json';
      import portraits from './profilePortraits.json';
      const people = [...dictionaryPeople].sort(comparePersonChronology);
      const exams = indexPersonExams(allExams, people);
      export { people, exams, lifespans, notes, joseonRulers };
      export const media = [...landing, ...portraits];
      export const sources = sortSaryo(saryo).map(({ item, index }) => ({ ...item, no: index + 1, yearText: yearLabel(item.year) }));
      export const periods = SARYO_PERIODS;
      export const themes = SARYO_THEMES;
      export const dynastyEras = POLITY_ERAS;
      export const dynasties = polities.map(polity => ({ ...polity, rulers: polity.rulers.map(ruler => ({ ...ruler, personId: personIdForRuler(ruler) })) }));
    `,
  },
  write: false, bundle: true, platform: 'node', format: 'esm',
});
const data = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const webExams = JSON.parse(await readFile('src/data/history/simhwa.json', 'utf8')).exams;
const examLinks = Object.fromEntries(webExams.map(({ id, round, questionNo, year, sourceCode }) =>
  [id, { label: `${round}회 ${questionNo}번`, href: `/history/exam/simhwa/${year}/${encodeURIComponent(sourceCode)}/${questionNo}` }]));

const output = 'data/history-library';
const mediaPath = path.join(output, 'media');
await mkdir(mediaPath, { recursive: true });
const copied = new Set();
async function linkAsset(file) {
  const match = /^\/(saryo|history-portraits)\/([a-z0-9_.-]+\.(?:svg|webp|png|jpe?g|gif))$/i.exec(file);
  if (!match) throw new Error(`Unexpected asset path ${file}`);
  const name = match[1] === 'history-portraits' ? `portrait-${match[2]}` : match[2];
  if (!copied.has(name)) {
    await copyFile(path.join(app, 'public', file), path.join(mediaPath, name));
    copied.add(name);
  }
  return `/api/pc-access/history-figures/${name}`;
}

const sources = await Promise.all(data.sources.map(async item => ({
  ...item, period: item.period ?? item.era, exams: (item.exams ?? []).flatMap(id => examLinks[id] ?? []),
  images: await Promise.all((item.images ?? []).map(async image => ({ ...image, file: await linkAsset(image.file) }))),
})));
const byId = new Map(data.people.map(person => [person.id, person]));
const fatherId = person => person.order === 26 ? 'heungseon' : 'joseon-' + person.father;
function familyOf(person) {
  const members = [];
  const father = byId.get(fatherId(person));
  if (person.father) members.push({ label: '아버지', name: father?.name ?? person.father, id: father?.id });
  const relatives = [
    ...(person.id === 'joseon-danjong' ? [{ id: 'joseon-sejo', label: '숙부' }] : []),
    ...(person.id === 'joseon-sejo' ? [{ id: 'joseon-danjong', label: '조카' }] : []),
    ...data.joseonRulers.filter(ruler => ruler.id !== person.id && ruler.father === person.father).map(({ id }) => ({ id, label: '형제' })),
    ...data.joseonRulers.filter(ruler => fatherId(ruler) === person.id).map(({ id }) => ({ id, label: '아들' })),
  ];
  return [...members, ...relatives.map(({ id, label }) => ({ id, label, name: byId.get(id).name }))];
}

const portraits = new Map(data.media.map(portrait => [portrait.personId, portrait]));
const people = await Promise.all(data.people.map(async person => {
  const portrait = portraits.get(person.id);
  const filename = path.join(source, 'people-articles', person.id + '.json');
  const books = await readFile(filename, 'utf8').then(JSON.parse).catch(error => {
    if (error.code === 'ENOENT') return {};
    throw error;
  });
  const exams = (data.exams.get(person.id) ?? []).flatMap(({ id }) => examLinks[id] ?? []);
  return {
    ...person, books, exams,
    reign: person.order === 26 ? '국왕 1863–1897 · 황제 1897–1907'
      : person.order ? [person.start, person.end].join('–') : undefined,
    family: person.order ? familyOf(person) : undefined,
    lifespan: data.lifespans[person.id],
    saryoNotes: data.notes[person.id],
    portrait: portrait ? { ...portrait, file: portrait.imageUrl ?? await linkAsset(`/history-portraits/${portrait.id}.webp`) } : undefined,
  };
}));

const catalogue = {
  appCommit: execFileSync('git', ['-C', app, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  periods: data.periods, themes: data.themes, dynastyEras: data.dynastyEras, dynasties: data.dynasties,
  sources: sources.map(({ id, title, no, period, yearText, themes, clues, exams }) =>
    ({ id, title, no, period, yearText, themes, clues, count: exams.length })),
  people: people.map(({ id, name, hanja, era, aliases, role, lifespan, period, exams }) =>
    ({ id, name, hanja, era, aliases, role, lifespan, period, count: exams.length })),
};
await Promise.all([
  writeFile(path.join(output, 'catalogue.json.gz'), gzipSync(JSON.stringify(catalogue))),
  writeFile(path.join(output, 'records.json.gz'), gzipSync(JSON.stringify({ sources, people }))),
]);
console.log(`${sources.length} 사료, ${people.length} 인물, ${data.dynasties.length} 왕조, ${copied.size} 이미지 (${catalogue.appCommit})`);
