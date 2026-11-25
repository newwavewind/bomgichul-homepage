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
const glossaryOutput = 'data/pc-pro-glossary';
const glossaryOnly = process.argv.includes('--glossary-only');
await mkdir(glossaryOutput, { recursive: true });
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
    id, year, source, no, appExam: exam, label: [year, source, no + '번'].filter(Boolean).join(' · '), href: webIds.has(id) ? route : undefined,
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

function workbookData(sheets, exams, fixes, explTermsFor, choiceFixFor) {
  const used = new Map();
  const add = (id, key = null) => {
    if (!exams.has(id)) return;
    if (!used.has(id)) used.set(id, new Set());
    if (key !== null) used.get(id).add(String(key));
  };
  const related = list => list?.filter(exam => {
    add(exam.id);
    return exams.has(exam.id);
  }).map(({ id, stem, year, round, source, question_no }) => ({
    id, stem, year, round, source, question_no, href: exams.get(id).href,
  }));
  const cells = sheets.map(sheet => ({
    ...sheet,
    relatedExams: related(sheet.relatedExams),
    rows: sheet.rows.map(row => row.kind === 'band' ? row : {
      ...row,
      relatedExams: related(row.relatedExams),
      cells: row.cells.map(cell => {
        const refs = cell.examRefs ?? (cell.items ?? []).map(([year,no,key]) => ['민법-' + year + '-Q' + no, key]);
        refs.forEach(([id,key]) => add(id,key));
        return { ...cell, examRefs: refs, sources: cell.sources ?? [] };
      }),
    }),
  }));
  const cellExams = [...used].map(([id, keys]) => {
    const { appExam, href, year, source, stem, no, type } = exams.get(id);
    const { round, underlines, passage, passageText, passage_text, extraPassage, passageImage, passage_image,
      table, composite_layout, compositeLayout, materials, referenceEntries } = appExam;
    const pickItem = item => ({
      key: item.key, label: item.label, text: item.text, answer: item.answer,
      explanation: item.explanation, sources: item.sources, underlines: item.underlines, image: item.image,
      terms: explTermsFor(id, item.key).map(({ term, def, hanja }) => ({ term, def, hanja })),
      fix: choiceFixFor(fixes, id, item),
    });
    return {
      id, href, year, source, stem, round, question_no: no, question_type: type, underlines,
      passage, passageText, passage_text, extraPassage, passageImage, passage_image,
      table, materials, referenceEntries, composite_layout: composite_layout ?? compositeLayout,
      items: (appExam.items ?? []).filter(item => keys.has(String(item.key))).map(pickItem),
    };
  });
  return { cells, cellExams };
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

async function glossaryData(rows, glossary, points, basis, articles) {
  const entries = {};
  const sources = {};
  const related = {};
  const byId = new Map(rows.filter(row => row.href).map(row => [row.id, row]));
  const byTerm = new Map();
  for (const row of byId.values()) {
    const terms = {};
    for (const item of row.items) {
      const list = glossary.explTermsFor?.(row.id, item.key) ?? [];
      if (!list.length) continue;
      const results = [];
      for (const native of list) {
        const { term, def, hanja, ex } = native;
        if (!term || !def) continue;
        if (!byTerm.has(term)) byTerm.set(term, new Map());
        byTerm.get(term).set(row.href, { href: row.href, label: row.label });
        const point = points.termPoint?.(term, row.id);
        const references = [];
        const day = row.appExam.examDate ?? row.appExam.exam_date ?? null;
        for (const chip of basis.termBasisLinks?.(native, day) ?? []) {
          if (!safeLink(chip.url)) continue;
          if (!Object.hasOwn(sources, chip.url)) {
            const full = chip.caseNo ? await articles.findCaseText?.(chip.caseNo) : await articles.findArticleText?.(chip.law, chip.jo);
            sources[chip.url] = full?.lines?.length && !full.missing ? {
              title: [chip.caseNo ? full.court : full.law,
                chip.caseNo ? full.caseNo : full.article,
                full.name ?? full.title].filter(Boolean).join(' '),
              lines: full.lines.map(displayLine),
              date: full.effectiveDate ?? full.date,
              url: safeLink(full.url) ?? chip.url,
            } : null;
          }
          references.push({ label: chip.label, url: chip.url });
        }
        const examples = Array.isArray(ex) ? ex.map(example => {
          if (!Array.isArray(example)) return null;
          const [id, choice, year, edition, no] = example;
          const original = byId.get(id);
          const selected = original?.items.find(item => String(item.key) === String(choice));
          return original && selected ? {
            label: [year, /^\d+$/u.test(edition ?? '') ? null : edition, no + '번'].filter(Boolean).join(' · '),
            href: original.href, stem: original.stem, choice: selected.text, choiceLabel: selected.label,
            explanation: selected.explanation, answer: selected.answer,
          } : null;
        }) : undefined;
        results.push({ term, def, hanja, point, ...(references.length ? { references } : {}), examples });
      }
      if (results.length) terms[String(item.key)] = results;
    }
    if (Object.keys(terms).length) entries[row.href] = terms;
  }
  for (const [term, questions] of byTerm) {
    if (questions.size >= 2) related[term] = [...questions.values()];
  }
  return { entries, sources, related };
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
  const cellEngine = await fileExists(path.join(root, 'src/cellstudy/cellStudyEngine.js'))
    ? await vite.ssrLoadModule('/src/cellstudy/cellStudyEngine.js') : null;
  const glossary = await fileExists(path.join(nativeData, 'explTermsIndex.js'))
    ? await vite.ssrLoadModule('/src/data/explTermsIndex.js') : {};
  const appFixes = await fileExists(path.join(nativeData, 'choiceFixes.js'))
    ? await vite.ssrLoadModule('/src/data/choiceFixes.js') : {};
  const nativeModule = async (uri) => await fileExists(path.join(root, uri))
    ? vite.ssrLoadModule('/' + uri) : {};
  const [points, basis, articles] = await Promise.all([
    nativeModule('src/data/explTermPoints.js'),
    nativeModule('src/utils/termBasisLinks.js'),
    nativeModule('src/data/termArticleText.js'),
  ]);
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
      if (glossary.explTermsFor) {
        const data = await glossaryData(rows, glossary, points, basis, articles);
        if (Object.keys(data.entries).length) {
          await writeFile(path.join(glossaryOutput, id + '.json.gz'), gzipSync(JSON.stringify(data) + '\n'));
          if (glossaryOnly) report.push([id, Object.keys(data.entries).length]);
        }
      }
      if (glossaryOnly) continue;
      const exams = new Map(rows.map(row => [row.id,row]));
      const choices = choiceRows(rows);
      let cells = [];
      if (site === 'real-estate' && subjectId === 'civillaw') {
        const {CIVIL_CELL_SHEETS} = await vite.ssrLoadModule('/src/data/civilLawCellStudy.js');
        cells = CIVIL_CELL_SHEETS;
      } else if (site === 'real-estate') {
        const {loadSubjectCellStudy,buildSubjectCellSheets,chapterSubjectCellSheets} = await vite.ssrLoadModule('/src/data/subjectCellStudy.js');
        const catalog = await loadSubjectCellStudy(subjectId);
        cells = chapterSubjectCellSheets(buildSubjectCellSheets(catalog, scoped), catalog.topics);
      } else if (cellEngine) {
        const keys = [...new Set(rows.map(e => examCode(e.id)).filter(Boolean))];
        for (const key of keys) {
          if (!files.includes(key+'.js')) continue;
          const deck = await vite.ssrLoadModule('/src/data/cellStudy/'+key+'.js');
          const sheets = cellEngine.buildCellSheets(deck.default);
          cells.push(...sheets.map(sheet => ({ ...sheet, id: keys.length === 1 ? sheet.id : key + '-' + sheet.id,
            unitId: keys.length === 1 ? sheet.unitId : key + '-' + sheet.unitId })));
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
      const workbook = workbookData(cells, exams, fixes, glossary.explTermsFor ?? (() => []), appFixes.choiceFixFor ?? (() => null));
      const values = { cells, choices, traps, law, ox, audio: audioAvailable };
      const counts = Object.fromEntries(Object.entries(values).map(([key,value]) => [key,Array.isArray(value)?value.length:value?ox.length:0]));
      if (Object.values(counts).some(Boolean)) {
        manifest[id] = counts;
        await writeFile(path.join(output,id+'.json.gz'),gzipSync(JSON.stringify({ ...values, ...workbook })+'\n',{level:9}));
      }
      report.push([id,counts]);
    }
    console.log(site,JSON.stringify(report));
  } finally { await vite.close(); }
}
if (!glossaryOnly) {
  await writeFile(path.join(output,'manifest.json'),JSON.stringify({sourceCommits,scopes:manifest},null,2)+'\n');
  console.log(Object.keys(manifest).length,'study scopes');
}

await import("./sync-pc-pro-glossary-labels.mjs");
