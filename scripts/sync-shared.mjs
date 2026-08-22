/**
 * 한 벌이어야 하는 파일을 앱들에 맞춰 준다.
 *
 * audit-apps 가 「홀로 다르다」고 짚으면 여기서 맞춘다. 손으로 복사하면
 * 앱 하나를 빠뜨리는데, 그게 지금까지 사고의 대부분이었다.
 *
 *   node scripts/sync-shared.mjs                 무엇이 달라졌는지만 본다
 *   node scripts/sync-shared.mjs --from <앱이름>  그 앱 것을 나머지에 밀어넣는다
 *
 * 기준을 손으로 정하게 한 것은 일부러다. 「다수가 옳다」고 자동으로 정하면,
 * 방금 한 앱에서 제대로 고친 것을 옛 판본으로 되돌려 버린다.
 *
 * @see scripts/audit-apps.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const HOME = process.env.HOME

const SHARED_FILES = [
  'components/AiAnswerBody.jsx',
  'components/AiNotesScreen.jsx',
  'components/AiLinkButtons.jsx',
  'lib/aiExplainScope.js',
  'lib/aiExplain.js',
  'data/aiExplanationNotes.js',
]

/** audit-apps 와 같은 방식으로 앱을 찾는다 */
function discoverApps() {
  const out = []
  for (const name of fs.readdirSync(HOME)) {
    if (/\.(bak|old|orig)$|-backup$|\bcopy\b/i.test(name)) continue
    const root = path.join(HOME, name)
    let cap = null
    for (const ext of ['ts', 'js', 'json']) {
      const p = path.join(root, `capacitor.config.${ext}`)
      if (fs.existsSync(p)) cap = fs.readFileSync(p, 'utf8')
      if (cap) break
    }
    if (!cap?.includes('com.sanghyun.')) continue
    const idPath = path.join(root, 'src/lib/appIdentity.js')
    if (!fs.existsSync(idPath)) continue
    const s = fs.readFileSync(idPath, 'utf8')
    out.push({ dir: name, name: s.match(/export const APP_NAME = '([^']*)'/)?.[1] ?? name })
  }
  return out.sort((a, b) => a.dir.localeCompare(b.dir))
}

const APPS = discoverApps()
const at = (app, rel) => path.join(HOME, app.dir, 'src', rel)
const readOr = (app, rel) => (fs.existsSync(at(app, rel)) ? fs.readFileSync(at(app, rel), 'utf8') : null)

const fromArg = process.argv[process.argv.indexOf('--from') + 1]
const source = process.argv.includes('--from')
  ? APPS.find((a) => a.dir === fromArg || a.name === fromArg)
  : null

if (process.argv.includes('--from') && !source) {
  console.error(`'${fromArg}' 라는 앱이 없다. 고를 수 있는 것:`)
  for (const a of APPS) console.error(`  ${a.dir}  (${a.name})`)
  process.exit(1)
}

let changed = 0
for (const rel of SHARED_FILES) {
  // 같은 내용끼리 묶어 몇 갈래인지 본다
  const groups = new Map()
  for (const app of APPS) {
    const s = readOr(app, rel)
    if (s == null) continue
    if (!groups.has(s)) groups.set(s, [])
    groups.get(s).push(app)
  }
  if (groups.size <= 1) continue

  console.log(`\n── ${rel} — ${groups.size}갈래`)
  for (const [, apps] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`     ${apps.map((a) => a.name).join(', ')}`)
  }

  if (!source) continue

  const want = readOr(source, rel)
  if (want == null) {
    console.log(`     ⚠ ${source.name} 에 이 파일이 없어 건너뛴다`)
    continue
  }
  for (const app of APPS) {
    if (app.dir === source.dir) continue
    const mine = readOr(app, rel)
    if (mine == null || mine === want) continue
    fs.writeFileSync(at(app, rel), want)
    console.log(`     → ${app.name} 에 ${source.name} 것을 썼다`)
    changed += 1
  }
}

if (!source) {
  console.log(
    changed === 0 && !process.argv.includes('--from')
      ? '\n맞추려면 --from <앱이름> 을 준다. 기준으로 삼을 앱을 직접 고른다.'
      : '',
  )
} else if (changed) {
  console.log(`\n${changed}개 파일을 맞췄다. 앱마다 빌드해 보고, 화면도 한 번 열어 본다.`)
} else {
  console.log('\n맞출 것이 없다.')
}
