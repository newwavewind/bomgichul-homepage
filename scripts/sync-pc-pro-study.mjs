/** Build the opt-in web study catalog from the current app checkouts and existing web exam data. */
import { execFileSync } from 'node:child_process';
import { access, mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { gzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';

const mappingFile = process.argv[2];
if (!mappingFile) throw new Error('Provide a JSON map of website exam slug to current app checkout.');
const load = async file => JSON.parse(await readFile(file, 'utf8'));
const fileExists = file => access(file).then(() => true, () => false);
const roots = await load(mappingFile);
const programs = await load('src/lib/pc-access/app-offers.json');
programs.unshift(
  { site: 'police', subjects: [['constitution','registry-law'],['criminal-law','realestate-tax'],['police-science','broker-law']]
    .map(([id, subjectId]) => ({ id, subjectId, webId: id })) },
  { site: 'real-estate', subjects: ['civillaw','realestate','broker-law','registry-law','realestate-tax','realestate-public-law']
    .map(id => ({ id, subjectId: id, webId: id })) },
);
const output = 'data/pc-pro-study';
await mkdir(output, { recursive: true });
const manifest = {};
const cacheDir = await mkdtemp(path.join(tmpdir(), 'pc-pro-study-import-'));
const sourceCommits = {};
const syllables = { civillaw: '민법', realestate: '부동산', 'broker-law': '공인중개사법',
  'registry-law': '부동산공시법령', 'realestate-tax': '부동산세법', 'realestate-public-law': '부동산공법' };
const fillNames = { 'broker-law': 'brokerlaw', 'registry-law': 'registryLaw', 'realestate-tax': 'realestateTax',
  'realestate-public-law': 'realestatePublicLaw', 'civil-law': 'civilLaw', 'housing-law': 'housingLaw', 'housing-admin': 'housingAdmin' };
const webNames = { english: 'gong9', history: 'simhwa' };
const clean = value => String(value ?? '').trim();
const baseId = key => key.replace(/_[^_]+$/, '');
const examCode = id => id.match(/^(.*?)-\d{2,4}(?:-|$)/u)?.[1];
const fileList = dir => readdir(dir).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error));
const safeLink = url => /^https:\/\/[^/\s]+/iu.test(clean(url)) ? url : undefined;
const displayLine = value => clean(value).replace(/[\x1d\x1e]/gu, '').replace(/\x1f/gu, ' | ');

function examEntry(exam, site, offer, webIds) {
  const year = exam.year;
  const source = exam.sourceCode ?? exam.source_code ?? exam.source;
  const no = exam.questionNo ?? exam.question_no;
  const subject = offer.webId ?? webNames[site] ?? offer.subjectId;
  const id = exam.id ?? (site === 'real-estate' ? syllables[subject] + '-' + year + '-Q' + no : '');
  if (!id || !Number.isInteger(no)) return null;
  const route = site === 'real-estate' ? '/exam/' + subject + '/' + year + '/' + no
    : '/' + site + '/exam/' + subject + '/' + year + '/' + encodeURIComponent(source) + '/' + no;
  return {
    id, year, source, no, label: [year, source, no + '번'].filter(Boolean).join(' · '), href: webIds.has(id) ? route : undefined,
    stem: clean(exam.stem ?? exam.question), type: exam.questionType ?? exam.question_type,
    visual: Boolean(exam.table || exam.materials?.length || (exam.compositeLayout ?? exam.composite_layout) === 'table'),
    items: exam.items ?? [],
  };
}

function choiceRows(exams) {
  return exams.flatMap(exam => {
    if (!exam.stem || exam.visual || /<\s*img\b|!\[|\[\s*(?:그림|그래프)/iu.test(exam.stem)) return [];
    const predicate = /(?:설명|내용|진술|정의|서술)\s*(?:로|으로|중)\s*(?:옳은|틀린|옳지\s*않은|잘못된)\s*것/u.test(exam.stem);
    return exam.items.flatMap(item => {
      const text = clean(item.text);
      if (!text || item.image || !['O','X'].includes(item.answer)) return [];
      const isTrue = item.answer === 'O';
      return [{
        id: exam.id + '::' + item.key, stem: exam.stem, text, explanation: clean(item.explanation),
        mode: predicate ? 'ox' : 'match', answer: predicate ? isTrue : isTrue !== (exam.type === 'wrong'),
        source: exam.label, href: exam.href,
      }];
    });
  });
}

function rawCell(value, exams) {
  const [text, ...refs] = Array.isArray(value) ? value : [value];
  return {
    text: clean(text),
    notes: refs.filter(ref => typeof ref === 'object' && ref?.type === 'expl').map(ref => ref.text),
    sources: refs.flatMap(ref => {
      if (typeof ref === 'string') {
        const [id, key] = ref.split('#');
        const exam = exams.get(id);
        return exam ? [{ label: exam.label + (key ? ' · ' + key + '번 선지' : ''), url: exam.href }] : [];
      }
      if (ref?.type === 'law' && ref.name) return [{
        label: [ref.name, ref.article].filter(Boolean).join(' '),
        url: 'https://www.law.go.kr/법령/' + encodeURIComponent(ref.name)
          + (ref.article ? '/' + encodeURIComponent(ref.article.split(/\s/u)[0]) : ''),
      }];
      if (ref?.type === 'case') return [{ label: [ref.court, ref.caseNo ?? ref.number ?? ref.id].filter(Boolean).join(' '), url: safeLink(ref.url) }];
      return [];
    }).filter(source => source.label),
  };
}

function normalizeGenericCells(deck, key, exams) {
  return (deck.groups ?? []).flatMap(group => group.chapters.flatMap(chapter => chapter.topics.map(topic => ({
    id: key + '-' + chapter.id + '-' + topic.id, group: group.title + ' · ' + chapter.title, title: topic.title,
    columns: Array.from({ length: Math.max(0, ...topic.rows.map(row => row.length - 1)) },
      (_, index) => topic.columns?.[index + 1] ?? (index === 0 ? '핵심 기준' : '비교·유의점 ' + index)),
    rows: topic.rows.map(([label, ...cells]) => ({ label, cells: cells.map(cell => rawCell(cell, exams)) })),
  }))));
}

function originalCells(sheets, exams) {
  return sheets.map(sheet => ({
    id: sheet.id, group: sheet.group, title: sheet.title, columns: sheet.columns.map(c => c.label),
    rows: sheet.rows.filter(row => row.kind !== 'band').map(row => ({
      label: row.label,
      cells: row.cells.map(cell => {
        const refs = cell.examRefs ?? (cell.items ?? []).map(([year,no,choice]) => ['민법-' + year + '-Q' + no, choice]);
        const sources = refs.flatMap(([id,key]) => {
          const e = exams.get(id);
          return e ? [{ label: e.label + ' · ' + key + '번 선지', url: e.href }] : [];
        });
        const former = (cell.sources ?? cell.references ?? []).flatMap(ref => {
          if (ref.type === 'law') return rawCell(['',ref],exams).sources;
          if (ref.label) return [{ label: ref.label, url: safeLink(ref.url) }];
          return rawCell(['', ref],exams).sources;
        });
        return { text: clean(cell.value), notes: [cell.explanation, cell.detail].filter(v => typeof v === 'string' && v !== cell.value),
          sources: [...sources,...former] };
      }),
    })),
  }));
}

function lawRows(articles, cases, exams) {
  return [
    ...articles.map(card => ({ ...card, type: '조문', label: [card.law,card.article,card.title].filter(Boolean).join(' · ') })),
    ...cases.map(card => ({ ...card, type: '판례', label: [card.court,card.caseNo,card.name].filter(Boolean).join(' · ') })),
  ].flatMap(card => {
    if (!card.lines?.length || card.missing) return [];
    const blanks = Array.isArray(card.blanks) ? card.blanks.filter(b => (
      Number.isInteger(b.line) && Number.isInteger(b.start) && Number.isInteger(b.end) &&
      b.end > b.start && card.lines[b.line]?.slice(b.start,b.end) === b.answer
    )) : [];
    const sources = (card.examIds ?? []).flatMap(id => {
      const exam = exams.get(id);
      return exam ? [{label:exam.label, url:exam.href}] : [];
    });
    return [{ id:card.id, label:card.label, type:card.type, lines:card.lines.map(displayLine),
      blanks:blanks.filter(b => displayLine(card.lines[b.line]) === card.lines[b.line]),
      date:card.effectiveDate ?? card.date, sourceUrl:safeLink(card.url), citations:card.cited ?? 0, sources }];
  }).sort((a,b) => b.citations - a.citations);
}

for (const program of programs) {
  const { site } = program;
  if (!roots[site]) throw new Error('Missing current source checkout for ' + site);
  const root = path.resolve(roots[site]);
  sourceCommits[site] = execFileSync('git', ['rev-parse', 'HEAD'], { cwd:root, encoding:'utf8' }).trim();
  const nativeData = path.join(root,'src/data');
  const packages = await import(pathToFileURL(path.join(root,'node_modules/vite/dist/node/index.js')));
  const vite = await packages.createServer({ root, configFile:false, cacheDir:path.join(cacheDir,site), optimizeDeps:{noDiscovery:true,include:[]}, server:{ middlewareMode:true, hmr:false, watch:null, ws:false }, appType:'custom' });
  const files = await fileList(path.join(nativeData,'cellStudy'));
  const fixFiles = await fileList(path.join(nativeData,'choiceFixes'));
  const report = [];
  const nativeLoader = await fileExists(path.join(nativeData,'subjectDataLoader.js'))
    ? await vite.ssrLoadModule('/src/data/subjectDataLoader.js') : null;
  const registryPath = await fileExists(path.join(root,'src/subjects/registry.ts')) ? '/src/subjects/registry.ts' : '/src/subjects/registry.js';
  const registry = await vite.ssrLoadModule(registryPath);
  const trapLogic = await fileExists(path.join(nativeData,'trapSentences.js')) ? await vite.ssrLoadModule('/src/data/trapSentences.js') : null;
  const loadedExams = new Map();

  try {
    for (const offer of program.subjects) {
      const {id, subjectId} = offer;
      const webId = offer.webId ?? webNames[site] ?? subjectId;
      const webDir = site === 'real-estate' ? 'exam-questions' : site;
      const webFile = path.join('src/data',webDir,webId+'.json');
      const web = await fileExists(webFile) ? await load(webFile) : {};
      const webExams = Array.isArray(web) ? web : web.exams ?? [];
      const webIds = new Set(webExams.map(exam => exam.id ?? syllables[webId]+'-'+exam.year+'-Q'+exam.questionNo));
      const webSources = new Map(webExams.map(exam => [exam.id ?? syllables[webId]+'-'+exam.year+'-Q'+exam.questionNo, exam.sourceCode]));
      if (!loadedExams.has(subjectId)) {
        let originals;
        try {
          originals = await (nativeLoader?.loadExamsForSubject?.(subjectId)
            ?? registry.getSubject?.(subjectId)?.examDataLoader?.().then(module => module.allExams));
        } catch (error) { if (!webExams.length) console.error(id, error.message); }
        loadedExams.set(subjectId, originals?.length ? originals : webExams);
      }
      const native = loadedExams.get(subjectId);
      const scoped = native.filter(exam => !offer.source || site === 'firefighter' ||
        [exam.sourceCode,exam.source_code,exam.source,webSources.get(exam.id)].some(s => clean(s).includes(offer.source)));
      const rows = scoped.map(exam => examEntry(exam,site,offer,webIds)).filter(Boolean)
        .map(e => ({ ...e, href: e.href && webSources.get(e.id) && site !== 'real-estate'
          ? e.href.replace('/'+encodeURIComponent(e.source)+'/'+e.no, '/'+encodeURIComponent(webSources.get(e.id))+'/'+e.no) : e.href }));
      const exams = new Map(rows.map(row => [row.id,row]));
      const choices = choiceRows(rows);
      let cells = [];
      if (site === 'real-estate' && subjectId === 'civillaw') {
        const {CIVIL_CELL_TOPIC_SHEETS} = await vite.ssrLoadModule('/src/data/civilLawCellStudy.js');
        cells = originalCells(CIVIL_CELL_TOPIC_SHEETS,exams);
      } else if (site === 'real-estate') {
        const {loadSubjectCellStudy,buildSubjectCellSheets} = await vite.ssrLoadModule('/src/data/subjectCellStudy.js');
        cells = originalCells(buildSubjectCellSheets(await loadSubjectCellStudy(subjectId),scoped),exams);
      } else {
        const keys = [...new Set(rows.map(e => examCode(e.id)).filter(Boolean))];
        for (const key of keys) {
          if (!files.includes(key+'.js')) continue;
          const deck = await vite.ssrLoadModule('/src/data/cellStudy/'+key+'.js');
          cells.push(...normalizeGenericCells(deck.default,key,exams));
        }
      }
      const fixes = {};
      for (const key of new Set(rows.map(e => examCode(e.id)).filter(Boolean))) {
        if (fixFiles.includes(key+'.json')) Object.assign(fixes,await load(path.join(nativeData,'choiceFixes',key+'.json')));
      }
      const traps = (trapLogic?.collectTraps(fixes,scoped) ?? []).flatMap(trap => {
        const exam = exams.get(trap.examId);
        return exam ? [{ id:trap.id, before:trap.before, after:trap.after, wrong:trap.wrong, right:trap.right,
          source:exam.label, href:exam.href, explanation:clean(trap.item.explanation) }] : [];
      });
      const art = path.join(nativeData,'articleDrill',subjectId+'.json');
      const prec = path.join(nativeData,'caseDrill',subjectId+'.json');
      const law = lawRows(await fileExists(art)?(await load(art)).articles ?? []:[],
        await fileExists(prec)?(await load(prec)).cases ?? []:[], exams);
      const possible = [
        path.join(nativeData,'pocketstudy',subjectId+'.json'),
        path.join(nativeData,'fillblank',(fillNames[subjectId] ?? subjectId)+'.json'),
        ...(['english','gugeo'].includes(site) ? [path.join(nativeData,'fillblank','national.json'),path.join(nativeData,'fillblank','local.json')] : []),
      ];
      const pocketIds = new Set();
      for (const file of possible) if (await fileExists(file)) {
        const deck = await load(file);
        if (!Array.isArray(deck)) continue;
        for (const item of deck) if (typeof item.id === 'string' && exams.has(baseId(item.id))) {
          pocketIds.add(baseId(item.id) + '::' + item.id.slice(baseId(item.id).length+1));
        }
      }
      const ox = choices.filter(choice => pocketIds.has(choice.id) && choice.mode === 'ox').map(({stem,mode, ...choice}) => choice);
      const audioAvailable = ox.length > 0 && await fileExists(path.join(nativeData,'pocketAudioSupport.js'));
      const values = { cells, choices, traps, law, ox, audio: audioAvailable };
      const counts = Object.fromEntries(Object.entries(values).map(([key,value]) => [key,Array.isArray(value)?value.length:value?ox.length:0]));
      if (Object.values(counts).some(Boolean)) {
        manifest[id] = counts;
        await writeFile(path.join(output,id+'.json.gz'),gzipSync(JSON.stringify(values)+'\n',{level:9}));
      }
      report.push([id,counts]);
    }
    console.log(site,JSON.stringify(report));
  } finally { await vite.close(); }
}
await writeFile(path.join(output,'manifest.json'),JSON.stringify({sourceCommits,scopes:manifest},null,2)+'\n');
console.log(Object.keys(manifest).length,'study scopes');
