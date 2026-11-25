import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import path from 'node:path';

const studyDir = 'data/pc-pro-study';
const noteDir = 'data/pc-pro-notes';
const load = async filename => JSON.parse(await readFile(filename,'utf8'));
const roots = await load(process.argv[2]);
const manifest = await load(studyDir + '/manifest.json');
const programs = await load('src/lib/pc-access/app-offers.json');
const sites = new Map(programs.flatMap(app => app.subjects.map(offer => [offer.id, app.site])));
for (const scope of ['constitution','criminal-law','police-science']) sites.set(scope,'police');
for (const scope of ['civillaw','realestate','broker-law','registry-law','realestate-tax','realestate-public-law']) sites.set(scope,'real-estate');

await mkdir(noteDir,{recursive:true});
const allPaths = new Set();
const notesBySite = new Map();
for (const scope of Object.keys(manifest.scopes)) {
  const site = sites.get(scope);
  if (!notesBySite.has(site)) {
    const root = roots[site];
    const folder = path.join(root,'src/data/easyExplanations/crafted');
    const files = await readdir(folder).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error));
    const notes = Object.assign({}, ...await Promise.all(files.filter(name => name.endsWith('.json')).map(name => load(path.join(folder,name)))));
    const module = path.join(root,'src/data/easyExplanations/overrides.js');
    // The app keeps some reviewed notes in a JavaScript module. Read them only when that file is directly importable.
    try {
      const { EASY_EXPLANATION_OVERRIDES } = await import(new URL('file://' + module).href);
      Object.assign(notes,EASY_EXPLANATION_OVERRIDES);
    } catch (error) {
      if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
    }
    notesBySite.set(site,notes);
  }
  const notes = notesBySite.get(site);
  const study = JSON.parse(gunzipSync(await readFile(studyDir + '/' + scope + '.json.gz')));
  const mapped = {};
  for (const { id, href } of study.choices) {
    if (!href || Object.hasOwn(mapped,href)) continue;
    const note = notes[id.split('::')[0]];
    if (typeof note?.intro !== 'string' || !Array.isArray(note.points)) continue;
    if (!note.intro.trim() || !note.points.every(point => typeof point === 'string')) continue;
    mapped[href] = Object.fromEntries(['intro','points','contrast','insight','pattern','pitfall','example']
      .filter(key => note[key]).map(key => [key,note[key]]));
    const sources = (Array.isArray(note.sources) ? note.sources : []).flatMap(src => {
      const label = src?.label || src?.title || src?.name || src?.text;
      const url = src?.url || src?.href || src?.sourceUrl;
      return typeof label === 'string' && /^https:\/\//u.test(url) ? [{ label, url }] : [];
    });
    if (sources.length) mapped[href].sources = sources;
    allPaths.add(href);
  }
  if (Object.keys(mapped).length) {
    await writeFile(noteDir + '/' + scope + '.json.gz',gzipSync(JSON.stringify(mapped),{level:9}));
  }
}
await writeFile(noteDir + '/index.json',JSON.stringify([...allPaths].sort()) + '\n');
console.log(allPaths.size + ' exact notebook paths');
