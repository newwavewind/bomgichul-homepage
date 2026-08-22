/**
 * 스토어에 나간 것과 여기 적힌 것이 맞는지 본다.
 *
 * 홈페이지는 시험마다 스토어 링크를 들고 있고(src/lib/constants.ts), 아직 없는
 * 곳은 null 로 두어 「출시 예정」이 보이게 한다. 그런데 스토어 사정은 조용히
 * 바뀐다 — 심사가 통과하면 링크를 채워야 하고, 앱이 내려가면 비워야 한다.
 * 손으로 기억하면 잊는다. 실제로 여러 날 어긋난 채로 있었다.
 *
 *   node scripts/check-stores.mjs
 *
 * 바깥에 묻는 일이라 audit-apps 와 따로 둔다 — 그쪽은 오프라인으로 빨라야 한다.
 *
 * 세 가지를 맞대어 본다.
 *   · 스토어에 실제로 있는가 (App Store 는 lookup, Google Play 는 페이지 응답)
 *   · 홈페이지 링크가 그 사실과 맞는가
 *   · 스토어에 나간 판이 저장소의 판과 같은가 — 다르면 심사 중이거나,
 *     올리는 것을 잊었거나, 올린 뒤 저장소에 적어 두지 않은 것이다
 *
 * @see scripts/audit-apps.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const HOME = process.env.HOME
const ROOT = path.resolve(import.meta.dirname, '..')

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
    // 설정이 json 인 앱도 ts 인 앱도 있다 — 키에 따옴표가 붙기도 안 붙기도 한다
    const bundleId = cap?.match(/["']?appId["']?\s*:\s*['"]([\w.]+)['"]/)?.[1]
    if (!bundleId?.startsWith('com.sanghyun.')) continue

    const idPath = path.join(root, 'src/lib/appIdentity.js')
    if (!fs.existsSync(idPath)) continue
    const s = fs.readFileSync(idPath, 'utf8')
    const pick = (k) => s.match(new RegExp(`export const ${k} = '([^']*)'`))?.[1]

    const pbx = path.join(root, 'ios/App/App.xcodeproj/project.pbxproj')
    const local = fs.existsSync(pbx)
      ? fs.readFileSync(pbx, 'utf8').match(/MARKETING_VERSION = ([0-9.]+)/)?.[1]
      : null

    out.push({
      dir: name,
      name: pick('APP_NAME') ?? name,
      scope: pick('HOMEPAGE_SCOPE'),
      bundleId,
      local,
    })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}

/** 홈페이지가 이 시험에 걸어 둔 링크 */
function homepageLinks(scope) {
  const src = fs.readFileSync(path.join(ROOT, 'src/lib/constants.ts'), 'utf8')
  if (!scope) return null
  const block = src.match(new RegExp(`case "${scope}":\\s*return \\{([^}]*)\\}`))?.[1]
  if (!block) {
    // real_estate 는 default 로 떨어져 APP_LINKS 를 쓴다
    if (scope === 'real_estate') {
      return {
        ios: src.match(/ios:\s*"([^"]+)"/)?.[1] ?? null,
        android: src.match(/android:\s*\n?\s*"([^"]+)"/)?.[1] ?? null,
      }
    }
    return null
  }
  const pick = (k) => {
    const m = block.match(new RegExp(`${k}:\\s*\\n?\\s*("([^"]*)"|null)`))
    return m?.[2] ?? null
  }
  return { ios: pick('ios'), android: pick('android') }
}

async function appStore(bundleId) {
  try {
    const r = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${bundleId}&country=kr`,
    )
    const j = await r.json()
    const hit = j.results?.[0]
    return hit ? { id: String(hit.trackId), version: hit.version } : null
  } catch {
    return undefined // 물어보지 못했다 — 없다는 뜻이 아니다
  }
}

async function playStore(bundleId) {
  try {
    const r = await fetch(
      `https://play.google.com/store/apps/details?id=${bundleId}&hl=ko`,
      { redirect: 'follow' },
    )
    return r.status === 200
  } catch {
    return undefined
  }
}

// ── 실행 ────────────────────────────────────────────────
const apps = discoverApps()
let problems = 0

console.log('앱             App Store        저장소     Play   홈페이지 링크')
console.log('─'.repeat(74))

for (const app of apps) {
  const [ios, play] = await Promise.all([appStore(app.bundleId), playStore(app.bundleId)])
  const links = homepageLinks(app.scope)
  const notes = []

  // 1) 홈페이지 iOS 링크가 사실과 맞는가
  if (!app.scope) {
    notes.push('HOMEPAGE_SCOPE 가 없어 홈페이지 링크를 맞대 볼 수 없다')
  } else if (links == null) {
    notes.push(`홈페이지 constants.ts 에 "${app.scope}" 자리가 없다`)
  } else if (ios !== undefined) {
    if (ios && !links.ios) notes.push(`App Store 에 나와 있는데 홈페이지는 「출시 예정」이다 (id ${ios.id})`)
    else if (!ios && links.ios) notes.push('App Store 에 없는데 홈페이지가 링크를 걸고 있다')
    else if (ios && links.ios && !links.ios.includes(ios.id)) {
      notes.push(`홈페이지 링크가 다른 앱을 가리킨다 — 실제 id 는 ${ios.id}`)
    }
  }

  // 2) Play 도 같은 방식으로
  if (links && play !== undefined) {
    if (play && !links.android) notes.push('Google Play 에 나와 있는데 홈페이지는 「출시 예정」이다')
    else if (!play && links.android) notes.push('Google Play 에 없는데 홈페이지가 링크를 걸고 있다')
  }

  // 3) 저장소의 판과 스토어의 판 — 다르면 알아야 한다(사고는 아니다)
  let versionNote = ''
  if (ios && app.local && ios.version !== app.local) {
    versionNote = `저장소가 앞선다 (심사 중이거나 아직 안 올렸다)`
  }

  const mark = notes.length ? '✗' : '○'
  console.log(
    `${mark} ${app.name.padEnd(11)} ` +
      `${(ios ? `v${ios.version}` : ios === undefined ? '못 물어봄' : '없음').padEnd(16)} ` +
      `${(app.local ?? '-').padEnd(9)} ` +
      `${(play === undefined ? '?' : play ? '있음' : '없음').padEnd(6)} ` +
      `${links ? (links.ios ? '걸림' : '출시 예정') : '-'}`,
  )
  for (const n of notes) console.log(`      ✗ ${n}`)
  if (versionNote) console.log(`      · ${versionNote}`)
  problems += notes.length
}

console.log('─'.repeat(74))
console.log(
  problems
    ? `어긋남 ${problems}건. src/lib/constants.ts 를 고친다.`
    : '홈페이지 링크가 스토어 사정과 모두 맞는다.',
)
process.exit(problems ? 1 : 0)
