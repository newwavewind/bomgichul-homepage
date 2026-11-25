import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';

const directory = 'data/pc-pro-glossary';
const file = 'labels.json.gz';
const labels = {};
for (const name of readdirSync(directory).sort()) {
  if (!name.endsWith('.json.gz') || name === file) continue;
  const { entries } = JSON.parse(gunzipSync(readFileSync(path.join(directory, name))));
  for (const [href, choices] of Object.entries(entries)) {
    const question = labels[href] ??= {};
    for (const [key, entries] of Object.entries(choices)) {
      question[key] = [...new Set([...(question[key] ?? []), ...entries.map(entry => entry.term)])];
    }
  }
}
writeFileSync(path.join(directory, file), gzipSync(JSON.stringify(labels), { level: 9 }));
console.log(Object.keys(labels).length + ' public glossary label entries');
