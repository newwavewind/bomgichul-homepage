import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const roots = JSON.parse(await readFile(process.argv[2], 'utf8'));
const output = {};
const read = async file => JSON.parse(await readFile(file, 'utf8'));
const files = dir => readdir(dir).catch(error => {
  if (error.code === 'ENOENT') return [];
  throw error;
});
const lawName = name => (name === '헌법' ? '대한민국헌법' : name).replace(/\s/gu, '');
const lawArticle = article => article.replace(/\s/gu, '');

function put(key, item, title, url) {
  if (Object.hasOwn(output, key) || item.missing || !item.lines?.length) return;
  if (!/^https:\/\/(?:www\.)?law\.go\.kr\//u.test(url ?? '')) return;
  output[key] = {
    title, date: item.effectiveDate ?? item.date, url,
    lines: item.lines.map(line => String(line).replace(/[\x1d\x1e]/gu, '').replace(/\x1f/gu, ' | ')),
  };
}

function putArticle(item) {
  if (!item.law || !item.article) return;
  const key = lawName(item.law) + '|' + lawArticle(item.article);
  const title = [item.law, item.article, item.title].filter(Boolean).join(' ');
  put('law:' + key, item, title, item.url ?? 'https://www.law.go.kr/법령/' + encodeURIComponent(item.law) + '/' + encodeURIComponent(item.article));
  if (!item.url) return;
  const url = new URL(item.url);
  const fields = ['lsiSeq', 'efYd', 'joNo', 'joBrNo'].map(field => url.searchParams.get(field) ?? '');
  if (fields[0] && fields[2]) put('version:' + fields.join('|'), item, title, item.url);
}

for (const root of Object.values(roots)) {
  const data = path.join(root, 'src', 'data');
  for (const [folder, property] of [['articleDrill', 'articles'], ['caseDrill', 'cases']]) {
    const directory = path.join(data, folder);
    for (const filename of await files(directory)) {
      if (!filename.endsWith('.json') || filename === 'index.json') continue;
      const values = (await read(path.join(directory, filename)))[property];
      for (const item of Array.isArray(values) ? values : []) {
        if (folder === 'articleDrill') putArticle(item);
        else if (item.caseNo) put('case:' + item.caseNo.replace(/\s/gu, ''), item,
          [item.court, item.caseNo, item.kind, item.name].filter(Boolean).join(' '), item.url);
      }
    }
  }
  const extra = await read(path.join(data, 'termArticles.json')).catch(error => {
    if (error.code === 'ENOENT') return {};
    throw error;
  });
  Object.values(extra).forEach(putArticle);
}
await writeFile('data/exam-source-previews.json.gz', gzipSync(JSON.stringify(output), { level: 9 }));
console.log(Object.keys(output).length + ' article, edition and precedent previews');
