import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const read = async file => JSON.parse(await readFile(file, 'utf8'));
const app = process.argv[2];
if (!app || (await read(path.join(app, 'capacitor.config.json'))).appId !== 'com.sanghyun.history') {
  throw new Error('사료 한국사 앱 경로가 필요합니다.');
}

const history = path.join(app, 'src/data/subjects/history');
const [hanja, glossary, { exams }] = await Promise.all([
  read(path.join(history, 'hanjaTerms.json')),
  read(path.join(history, 'explTerms.json')),
  read('src/data/history/simhwa.json'),
]);
const linesByArticle = new Map();
for (const { ek, def } of [...hanja, ...Object.values(glossary).flat()]) {
  if (!ek || !def || linesByArticle.has(ek)) continue;
  const sentences = def.match(/\S.*?[.!?](?=\s|$)/gu) ?? [];
  // The first sentence in the app glossary can cite the encyclopedia verbatim.
  const summary = sentences.slice(1, 3).join(' ');
  if (summary) linesByArticle.set(ek, [summary]);
}

// Checked against the encyclopedia articles on the exam's first answer card.
linesByArticle.set('E0003901', [
  '고인돌은 큰 덮개돌을 올려 만든 청동기 시대의 무덤 또는 기념물이다. 돌을 받치는 방식과 무덤방의 위치에 따라 탁자식, 바둑판식 등으로 나뉜다.',
  '화순 효산리와 대신리의 고인돌군은 고창·강화의 고인돌군과 함께 2000년에 유네스코 세계유산이 되었다.',
]);
linesByArticle.set('E0056357', [
  '한반도 청동기 시대에는 민무늬 토기와 간석기, 청동기가 함께 쓰였다. 벼를 비롯한 곡물을 재배했고 마을에는 땅을 파서 만든 집이 있었다.',
  '고인돌과 같은 무덤에서는 비파형 동검처럼 무기로 쓰인 청동기와 제사에 쓰인 청동 거울 등이 확인된다.',
]);

const previews = {};
for (const exam of exams) {
  for (const item of exam.items) {
    for (const { label, url } of item.sources ?? []) {
      const match = /^https:\/\/encykorea\.aks\.ac\.kr\/Article\/(E\d{7})$/u.exec(url);
      if (!match) continue;
      const id = match[1];
      const lines = linesByArticle.get(id);
      if (lines) previews['aks:' + id] ??= { title: label, url, lines, summary: true };
    }
  }
}
await writeFile('data/history-source-previews.json.gz', gzipSync(JSON.stringify(previews), { level: 9 }));
console.log(Object.keys(previews).length + ' linked Korean history source previews');
