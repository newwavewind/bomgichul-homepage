import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const root = 'data/pc-pro-study';
const index = new Map();
const supplements = JSON.parse(readFileSync(root + '/verified-traps.json', 'utf8'));
const pending = new Set(supplements);
const mark = (href, bit) => { if (href) index.set(href, (index.get(href) ?? 0) | bit); };

for (const filename of readdirSync(root).filter(name => name.endsWith('.json.gz'))) {
  const scope = filename.slice(0, -8);
  const data = JSON.parse(gunzipSync(readFileSync(root + '/' + filename)));
  for (const item of data.choices) mark(item.href, 1);
  for (const item of data.traps) mark(item.href, 2);
  for (const fix of supplements.filter(item => item.scope === scope)) {
    const choice = data.choices.find(item => item.id === fix.choice);
    if (!choice?.href || choice.answer !== false || !choice.text.includes(fix.wrong)) {
      throw new Error('Verify the original incorrect choice for ' + fix.choice);
    }
    mark(choice.href, 2);
    pending.delete(fix);
  }
}
if (pending.size) throw new Error('A verified correction has no matching Pro scope.');
writeFileSync(root + '/question-index.json', JSON.stringify(Object.fromEntries([...index].sort())) + '\n');
console.log(index.size + ' question paths');
