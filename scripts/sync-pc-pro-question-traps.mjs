import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';

const directory = 'data/pc-pro-study';
const fixes = JSON.parse(readFileSync(path.join(directory, 'verified-traps.json'), 'utf8'));
const byScope = {};
for (const name of readdirSync(directory)) {
  if (!name.endsWith('.json.gz')) continue;
  const scope = name.slice(0, -8);
  const { traps, choices } = JSON.parse(gunzipSync(readFileSync(path.join(directory, name))));
  const rows = {};
  for (const trap of traps) {
    if (trap.href) (rows[trap.href] ??= []).push(trap);
  }
  for (const fix of fixes.filter(fix => fix.scope === scope)) {
    const choice = choices.find(item => item.id === fix.choice);
    const at = choice?.text.indexOf(fix.wrong) ?? -1;
    if (!choice?.href || at < 0) continue;
    (rows[choice.href] ??= []).push({
      id: choice.id, source: choice.source, href: choice.href, explanation: choice.explanation,
      before: choice.text.slice(0, at), after: choice.text.slice(at + fix.wrong.length),
      wrong: fix.wrong, right: fix.right,
    });
  }
  if (Object.keys(rows).length) byScope[scope] = rows;
}
writeFileSync('data/pc-pro-question-traps.json.gz', gzipSync(JSON.stringify(byScope), { level: 9 }));
console.log(Object.keys(byScope).length + ' question trap scopes');
