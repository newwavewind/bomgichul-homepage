/**
 * 봄기출 앱 점검.
 *
 * 앱들이 서로를 베껴 세워져 있어, 한 곳을 고치면 나머지를 다 따라 고쳐야 한다.
 * 그러다 한 곳을 빠뜨리면 조용히 어긋난 채로 나간다. 실제로 그랬다.
 *
 *  · 다섯 앱의 외부 AI 프롬프트에 「공인중개사 기출 OX」가 박혀 있었다
 *  · 경찰 앱만 과목을 알리는 useEffect 가 빠져 노트가 담기고도 보이지 않았다
 *  · 과목 id 가 앱끼리 겹쳐 한 기기에서 하루 한도가 서로 깎였다
 *
 * 셋 다 눈으로는 못 잡고 코드를 뒤져서야 찾았다. 그래서 검사로 굳힌다.
 *
 *   node scripts/audit-apps.mjs
 *   node scripts/audit-apps.mjs --json     기계가 읽을 형태로
 *
 * ## 「모두 통과」를 믿기 전에
 *
 * 검사가 아무것도 짚지 못하면서 통과로 보이는 일이 실제로 있었다. 새 검사를
 * 붙였으면 **일부러 망가뜨려** 걸리는지 먼저 확인한다. 이를테면 경찰 앱의
 * ExamScreen 에서 examSession 을 다른 이름으로 바꿔 놓고 돌려 보는 식이다.
 * (이때 examSessionXX 처럼 원래 이름을 품는 이름으로 바꾸면 안 된다 —
 *  검사가 부분 문자열로 찾으므로 망가뜨린 줄 알고 통과를 보게 된다.)
 *
 * 오탐도 조심한다. 여기 검사 셋이 처음엔 멀쩡한 코드를 문제로 짚었다.
 * 앱마다 사정이 다르기 때문이다 — 유료 앱은 인자 모양이 다르고, 영어 앱은
 * registry 에 없는 과목을 다른 과목이 읽어다 쓰고, 공무원 앱은 열여섯 과목이
 * 한 폴더에 산다. 문제로 짚었으면 **화면을 열어 눈으로 확인한 뒤** 고친다.
 */
import fs from 'node:fs'
import path from 'node:path'

const HOME = process.env.HOME

/**
 * 앱 목록은 여기 적지 않는다 — 앱은 계속 늘어난다.
 *
 * 목록을 손으로 적어 두면 여덟 번째 앱을 만든 날 이 파일을 고치는 것을 잊고,
 * 그 앱만 검사 밖에 남는다. 그래서 홈 아래를 훑어 봄기출 앱을 스스로 찾는다.
 * 앱임을 알아보는 표는 둘이다 — Capacitor 앱 id 가 com.sanghyun 으로 시작하고,
 * src/lib/appIdentity.js 로 저를 밝힐 것.
 *
 * 새 앱은 appIdentity.js 만 채워 두면 처음부터 검사 대상이 된다.
 */
function discoverApps() {
  const out = []
  for (const name of fs.readdirSync(HOME)) {
    // 백업본은 앱이 아니다 — 설정을 그대로 품고 있어 앱처럼 보인다
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
    if (!fs.existsSync(idPath)) {
      out.push({ dir: name, name, missingIdentity: true })
      continue
    }
    const s = fs.readFileSync(idPath, 'utf8')
    const pick = (k) => s.match(new RegExp(`export const ${k} = '([^']*)'`))?.[1]
    out.push({
      dir: name,
      name: pick('APP_NAME') ?? name,
      appKey: pick('APP_KEY'),
      exam: pick('EXAM_NAME'),
      paid: /export const HAS_PURCHASE = true/.test(s),
    })
  }
  return out.sort((a, b) => a.dir.localeCompare(b.dir))
}

const APPS = discoverApps()

/**
 * 다른 시험 이름이 남아 있으면 안 되는 파일들.
 * 찾아낸 앱들의 시험 이름을 그대로 쓴다 — 앱이 늘면 여기도 저절로 는다.
 */
const OTHER_EXAMS = [...new Set(APPS.map((a) => a.exam).filter(Boolean))]

const read = (app, rel) => {
  try {
    return fs.readFileSync(path.join(HOME, app.dir, 'src', rel), 'utf8')
  } catch {
    return null
  }
}

const exists = (app, rel) => fs.existsSync(path.join(HOME, app.dir, 'src', rel))

// ── 기출 데이터 읽기 ───────────────────────────────────
// 앞의 검사들은 「코드가 제자리에 있는가」를 본다. 그것만으로는 부족했다 —
// 경찰 앱은 파일이 다 제자리에 있는데도 시험 모드에서 무엇을 눌러도 0문항이었다.
// 아래 둘은 기출 JSON 을 실제로 읽어 「데이터가 화면까지 흐르는가」를 본다.

/** 기출 JSON 이 놓인 곳 — 앱마다 모양이 달라 둘 다 훑는다. [과목id|null, 경로] */
function examDirs(app) {
  const out = []
  const flat = path.join(HOME, app.dir, 'src/data/exam')
  if (fs.existsSync(flat)) out.push([null, flat])
  const subs = path.join(HOME, app.dir, 'src/data/subjects')
  if (fs.existsSync(subs)) {
    for (const s of fs.readdirSync(subs)) {
      const p = path.join(subs, s, 'exam')
      if (fs.existsSync(p)) out.push([s, p])
    }
  }
  return out
}

/** index.json 은 문항이 아니라 목록이다 — 세면 안 된다 */
function readQuestions(dir) {
  const out = []
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json') || f === 'index.json') continue
    try {
      for (const q of Object.values(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))) {
        if (q?.year != null) out.push(q)
      }
    } catch {
      /* 읽을 수 없으면 넘긴다 */
    }
  }
  return out
}

/**
 * 「한 학습 단위 안에서」 한 해에 시험을 몇 번 치는가.
 *
 * 학습 단위로 갈라 세는 것이 핵심이다. 공무원 앱은 16과목의 국가직·지방직이
 * 한 폴더에 들어 있어, 폴더째로 세면 어느 해나 「두 번」으로 보인다. 하지만
 * 화면에서는 「행정학개론 · 국가직」이 이미 한 과목이라 20문항만 나온다.
 * 실제로 갈라야 하는 것은 경찰처럼 **같은 과목이 한 해에 두 번** 치러질 때다.
 *
 * 단위는 문항 id 의 앞머리(경찰학-2025-2-Q1 → 경찰학)와 출처를 합쳐 잡는다.
 */
function sessionsByYear(questions) {
  const units = new Map()
  for (const q of questions) {
    const unit = `${String(q.id ?? '').split('-')[0]}|${q.source_code ?? ''}`
    if (!units.has(unit)) units.set(unit, new Map())
    const byYear = units.get(unit)
    if (!byYear.has(q.year)) byYear.set(q.year, new Set())
    byYear.get(q.year).add(q.round ?? null)
  }
  // 한 해에 두 번 이상인 단위만 돌려준다
  const out = new Map()
  for (const byYear of units.values()) {
    for (const [year, rounds] of byYear) {
      if (rounds.size > 1) out.set(year, rounds)
    }
  }
  return out
}

/** registry 에 올라 있는 과목 id — 여기 없으면 앱이 그 과목 화면을 만들지 않는다 */
function registeredSubjects(app) {
  const dir = path.join(HOME, app.dir, 'src/subjects')
  if (!fs.existsSync(dir)) return null
  const ids = new Set()
  for (const f of fs.readdirSync(dir)) {
    if (!/^registry\.(ts|js)$/.test(f)) continue
    const s = fs.readFileSync(path.join(dir, f), 'utf8')
    for (const m of s.matchAll(/\bid: '([a-z][a-z0-9-]*)'/g)) ids.add(m[1])
    // TS 는 union 타입으로도 적어 둔다: type SubjectId = 'a' | 'b'
    const union = s.match(/type SubjectId = ([^\n]+)/)?.[1]
    if (union) for (const m of union.matchAll(/'([a-z][a-z0-9-]*)'/g)) ids.add(m[1])
  }
  return ids.size ? ids : null
}

/**
 * 그 과목 폴더를 밖에서 가져다 쓰는 곳이 있는가.
 *
 * loadExam 만 좇으면 모자란다. 경찰 앱은 공인중개사 부동산학개론 폴더를 통째로
 * 부품 삼아 쓴다 — 밖에서 부르는 것은 examStats·pastExamGrade 지만 그것들이
 * 같은 폴더의 loadExam 을 읽으므로 기출 JSON 도 함께 살아 있다.
 * 그래서 「폴더에 닿는 손이 하나라도 있는가」로 넉넉히 본다.
 */
function isLoadedFromOutside(app, subjectId) {
  const root = path.join(HOME, app.dir, 'src')
  const own = path.join('subjects', subjectId) + path.sep
  const needle = `${subjectId}/`
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (walk(p)) return true
      } else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) {
        if (p.includes(own)) continue
        if (fs.readFileSync(p, 'utf8').includes(needle)) return true
      }
    }
    return false
  }
  return walk(root)
}

/** 그 과목의 시험 모드 화면 — 과목별로 따로 둔 앱이 있다 */
function examScreensFor(app, subjectId) {
  const out = []
  if (subjectId) {
    const p = path.join(HOME, app.dir, 'src/components/subjects', subjectId, 'ExamScreen.jsx')
    if (fs.existsSync(p)) out.push([`subjects/${subjectId}/ExamScreen.jsx`, p])
  }
  if (!out.length) {
    const p = path.join(HOME, app.dir, 'src/components/ExamScreen.jsx')
    if (fs.existsSync(p)) out.push(['ExamScreen.jsx', p])
  }
  return out
}

/**
 * 앱이 몇 개든 글자 하나까지 같아야 하는 파일들.
 *
 * 앱마다 달라야 하는 값은 src/lib/appIdentity.js 로 빼 두었다. 그러니 아래
 * 파일들이 서로 다르다면 둘 중 하나다 — 한 앱만 고치고 나머지를 안 고쳤거나,
 * 앱마다 달라야 할 값이 아직 파일 안에 박혀 있거나. 어느 쪽이든 갈라진다.
 */
const SHARED_FILES = [
  'components/AiAnswerBody.jsx',
  'components/AiNotesScreen.jsx',
  'components/AiLinkButtons.jsx',
  'lib/aiExplainScope.js',
  'lib/aiExplain.js',
  'data/aiExplanationNotes.js',
]

/** 같은 파일을 앱 수만큼 거듭 읽지 않도록 */
const fileCache = new Map()
function readCached(app, rel) {
  const k = `${app.dir}/${rel}`
  if (!fileCache.has(k)) fileCache.set(k, read(app, rel))
  return fileCache.get(k)
}

/** 검사 하나 = { id, 설명, 실행 } — 실행은 문제를 문자열 배열로 돌려준다 */
const CHECKS = [
  {
    id: 'identity',
    label: '이 앱이 저를 밝히는가',
    run(app) {
      if (app.missingIdentity) {
        return ['src/lib/appIdentity.js 가 없다 — 점검 도구가 이 앱을 알아볼 수 없다']
      }
      const out = []
      if (!app.appKey) out.push('APP_KEY 가 없다 — 다른 앱과 하루 한도가 섞인다')
      if (!app.exam) out.push('EXAM_NAME 이 없다 — 외부 AI 에게 어느 시험인지 못 알린다')

      // 앞머리가 겹치면 한 기기에서 서로의 한도를 깎는다
      const twin = APPS.find((o) => o.dir !== app.dir && o.appKey && o.appKey === app.appKey)
      if (twin) out.push(`APP_KEY '${app.appKey}' 가 ${twin.name} 과 같다`)

      // 노트 저장소가 겹치면 한 기기에서 앱끼리 노트가 섞인다
      const notes = read(app, 'lib/appIdentity.js')?.match(
        /export const NOTES_STORAGE_KEY = '([^']+)'/,
      )?.[1]
      if (!notes) out.push('NOTES_STORAGE_KEY 가 없다')
      else {
        const same = APPS.find((o) => {
          if (o.dir === app.dir) return false
          return (
            read(o, 'lib/appIdentity.js')?.includes(`NOTES_STORAGE_KEY = '${notes}'`) ?? false
          )
        })
        if (same) out.push(`AI해설노트 저장소가 ${same.name} 과 같다 — 노트가 섞인다`)
      }
      return out
    },
  },
  {
    id: 'shared-files',
    label: '한 벌이어야 하는 파일이 갈라지지 않았는가',
    run(app) {
      if (app.missingIdentity) return []
      const out = []
      for (const rel of SHARED_FILES) {
        const mine = readCached(app, rel)
        if (mine == null) continue // 없는 것은 ai-files 검사가 짚는다

        // 가장 많은 앱이 가진 판본을 기준으로 삼는다
        const counts = new Map()
        for (const other of APPS) {
          const s = readCached(other, rel)
          if (s != null) counts.set(s, (counts.get(s) ?? 0) + 1)
        }
        const [text, n] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? []
        if (n > 1 && text !== mine) {
          out.push(`${rel} 만 홀로 다르다 — 다른 ${n}개 앱은 같은 판본을 쓴다`)
        }
      }
      return out
    },
  },
  {
    id: 'ai-files',
    label: 'AI 해설 파일이 다 있는가',
    run(app) {
      const need = [
        'components/AiAnswerBody.jsx',
        'components/AiNotesScreen.jsx',
        'components/InAppAiExplanationSheet.jsx',
        'components/AiLinkButtons.jsx',
        'data/aiExplanationNotes.js',
        'lib/aiExplain.js',
        'lib/aiExplainScope.js',
        'utils/aiExplainContext.js',
      ]
      return need.filter((f) => !exists(app, f)).map((f) => `없음: ${f}`)
    },
  },
  {
    id: 'scope-call',
    label: '지금 과목을 시트에 알리는가',
    run(app) {
      // 공무원 앱은 셸이 달라 문항에서 바로 과목을 얻는다
      if (app.dir === 'ox-admin-quiz-app') {
        const sheet = read(app, 'components/InAppAiExplanationSheet.jsx')
        return sheet?.includes('examSubjectKey(exam)') ? [] : ['시트가 과목을 얻는 자리가 없다']
      }
      const hook = read(app, 'hooks/useSubjectPremium.js')
      if (!hook) return ['hooks/useSubjectPremium.js 없음']

      // 유료 앱은 구매 상태까지 함께 넘기므로 인자 모양이 다르다.
      // import 줄에도 이름이 나오니, 「부르는 자리」만 세야 한다.
      const calls = (hook.match(/setAiExplainScope\s*\(/g) ?? []).length
      if (calls === 0) {
        return hook.includes('setAiExplainScope')
          ? ['import 만 있고 호출이 없다 — 노트가 담겨도 보이지 않는다']
          : ['과목을 알리지 않는다 — 노트가 담겨도 보이지 않는다']
      }
      return []
    },
  },
  {
    id: 'prompt-exam-name',
    label: '외부 AI 프롬프트가 제 시험을 말하는가',
    run(app) {
      const s = read(app, 'utils/aiLinks.js')
      if (!s) return ['utils/aiLinks.js 없음']
      const bad = OTHER_EXAMS.filter((e) => e !== app.exam && !app.exam.includes(e) && s.includes(e))
      const out = bad.map((e) => `다른 시험 이름이 남아 있다: 「${e}」`)
      if (!s.includes('EXAM_NAME') && app.dir !== 'ox-quiz-app' && app.dir !== 'ox-admin-quiz-app') {
        out.push('EXAM_NAME 상수가 없다 — 시험 이름이 하드코딩돼 있을 수 있다')
      }
      return out
    },
  },
  {
    id: 'free-tier',
    label: '무료 앱이 구매를 권하지 않는가',
    run(app) {
      if (app.paid) return []
      const s = read(app, 'components/InAppAiExplanationSheet.jsx')
      if (!s) return ['시트 없음']
      const out = []
      if (!s.includes('const premiumUnlocked = false')) out.push('하루 3회로 굳어 있지 않다')
      if (s.includes('구매하시면')) out.push('살 것이 없는데 구매를 권한다')
      return out
    },
  },
  {
    id: 'notes-button',
    label: '홈에서 AI해설노트로 갈 수 있는가',
    run(app) {
      const homes = []
      const common = path.join(HOME, app.dir, 'src/components/HomeScreen.jsx')
      if (fs.existsSync(common)) homes.push(common)
      const subDir = path.join(HOME, app.dir, 'src/components/subjects')
      if (fs.existsSync(subDir)) {
        for (const s of fs.readdirSync(subDir)) {
          const p = path.join(subDir, s, 'HomeScreen.jsx')
          if (fs.existsSync(p)) homes.push(p)
        }
      }
      if (!homes.length) return ['홈 화면을 못 찾음']

      const bad = []
      for (const p of homes) {
        const s = fs.readFileSync(p, 'utf8')
        const where = path.basename(path.dirname(p)) + '/' + path.basename(p)
        const ai = s.indexOf('aria-label="AI해설노트"')
        if (ai === -1) {
          bad.push(`버튼 없음: ${where}`)
          continue
        }
        // 버튼을 별도 컴포넌트로 빼 둔 화면도 있다 — 그 경우 자리 검사는 뜻이 없다
        if (/function \w*AiNotes\w*\(/.test(s)) continue

        const anchor = s.indexOf('aria-label="북마크"')
        const close = s.indexOf('\n                </ScreenHeaderActionButton>\n              ) : null}\n', anchor)
        if (anchor !== -1 && close !== -1 && ai < close) {
          bad.push(`버튼이 북마크 안에 끼어 있다 — 눌러도 북마크가 열린다: ${where}`)
        }
      }
      return bad
    },
  },
  {
    id: 'stale-data',
    label: '남의 과목 데이터가 남아 있지 않은가',
    run(app) {
      if (app.dir === 'ox-quiz-app') return []
      const dir = path.join(HOME, app.dir, 'src/data/exam')
      if (!fs.existsSync(dir)) return []
      const out = []
      for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).slice(0, 3)) {
        try {
          const first = Object.values(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))[0]
          const head = String(first?.id ?? '').split('-')[0]
          if (head && OTHER_EXAMS.some((e) => e.includes(head) || head === '민법')) {
            out.push(`src/data/exam/${f} 가 「${head}」 데이터 — 쓰이지 않는 잔재로 보인다`)
          }
        } catch {
          /* 읽을 수 없으면 넘긴다 */
        }
      }
      return out
    },
  },
  {
    id: 'exam-session',
    label: '한 해에 두 번 치는 시험을 갈라 주는가',
    run(app) {
      const out = []
      for (const [subjectId, dir] of examDirs(app)) {
        const multi = [...sessionsByYear(readQuestions(dir))]
        if (!multi.length) continue

        for (const [where, p] of examScreensFor(app, subjectId)) {
          const s = fs.readFileSync(p, 'utf8')
          // 연도 말고 다른 축으로 묶어야 한다. 경찰은 examSession, 그 밖은 출처 이름.
          if (s.includes('examSession') || s.includes('source_code')) continue
          const [y, marks] = multi[0]
          out.push(
            `${subjectId ?? '(공용)'}: ${y}년에 시험이 ${marks.size}번(${[...marks].join('·')})인데 ` +
              `${where} 는 연도로만 묶는다 — 한 회분씩 풀 수 없다`,
          )
        }
      }
      return out
    },
  },
  {
    id: 'unregistered-subject',
    label: '등록하지 않은 과목의 기출이 남아 있지 않은가',
    run(app) {
      const ids = registeredSubjects(app)
      if (!ids) return []
      const out = []
      for (const [subjectId, dir] of examDirs(app)) {
        if (!subjectId || ids.has(subjectId)) continue
        // registry 에 없어도 다른 과목이 읽어다 쓰는 수가 있다 —
        // 영어 앱은 english 하나만 올려 두고 국가직·지방직 두 벌을 합쳐 읽는다.
        if (isLoadedFromOutside(app, subjectId)) continue
        const n = readQuestions(dir).length
        if (n) out.push(`src/data/subjects/${subjectId}/exam — ${n}문항이 있으나 아무도 읽지 않는다`)
      }
      return out
    },
  },
  {
    id: 'ios-version',
    label: 'iOS 버전 (참고)',
    info: true,
    run(app) {
      const p = path.join(HOME, app.dir, 'ios/App/App.xcodeproj/project.pbxproj')
      if (!fs.existsSync(p)) return ['iOS 프로젝트 없음']
      const s = fs.readFileSync(p, 'utf8')
      const v = s.match(/MARKETING_VERSION = ([0-9.]+)/)?.[1]
      const b = s.match(/CURRENT_PROJECT_VERSION = (\d+)/)?.[1]
      return [`${v} (빌드 ${b})`]
    },
  },
]

// ── 실행 ────────────────────────────────────────────────
const asJson = process.argv.includes('--json')
const result = []
let problems = 0

for (const app of APPS) {
  const found = []
  const notes = []
  for (const check of CHECKS) {
    // 저를 밝히지 않는 앱은 그것부터 짚는다. 나머지 검사는 기준이 없어 헛돈다.
    if (app.missingIdentity && check.id !== 'identity') continue
    const hits = check.run(app)
    if (!hits.length) continue
    if (check.info) notes.push(...hits)
    else {
      found.push({ check: check.id, label: check.label, hits })
      problems += hits.length
    }
  }
  result.push({ app: app.name, dir: app.dir, problems: found, notes })
}

if (asJson) {
  console.log(JSON.stringify({ problems, apps: result }, null, 2))
  process.exit(problems ? 1 : 0)
}

for (const r of result) {
  const mark = r.problems.length ? '✗' : '○'
  console.log(`\n${mark} ${r.app.padEnd(8)} ${r.notes.join(' ')}`)
  for (const p of r.problems) {
    console.log(`    [${p.label}]`)
    for (const h of p.hits) console.log(`      · ${h}`)
  }
}

console.log(
  problems
    ? `\n────────\n문제 ${problems}건. 위를 고치고 다시 돌린다.`
    : `\n────────\n${APPS.length}개 앱 모두 통과.`
)
process.exit(problems ? 1 : 0)
