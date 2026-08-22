/**
 * 봄기출 일곱 앱 점검.
 *
 * 앱들이 서로를 베껴 세워져 있어, 한 곳을 고치면 여섯 곳을 따라 고쳐야 한다.
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
 */
import fs from 'node:fs'
import path from 'node:path'

const HOME = process.env.HOME

/** 앱마다 다르게 나와야 하는 값들 — 같으면 서로의 자리를 침범한다 */
const APPS = [
  { dir: 'ox-quiz-app', name: '공인중개사', appKey: 'broker', exam: '공인중개사', paid: true },
  { dir: 'ox-admin-quiz-app', name: '공무원', appKey: 'admin', exam: '9급 공무원' },
  { dir: 'policebomgichul', name: '경찰', appKey: 'police', exam: '경찰공무원' },
  { dir: 'socialworkerbomgichul', name: '사회복지사', appKey: 'social', exam: '사회복지사 1급' },
  { dir: 'housingbomgichul', name: '주택관리사', appKey: 'housing', exam: '주택관리사' },
  { dir: 'historybomgichul', name: '한국사', appKey: 'history', exam: '한국사능력검정시험' },
  { dir: 'englishbomgichul', name: '영어', appKey: 'english', exam: '9급 공무원 영어' },
]

/** 다른 시험 이름이 남아 있으면 안 되는 파일들 */
const OTHER_EXAMS = ['공인중개사', '주택관리사', '사회복지사', '경찰공무원', '한국사능력검정시험']

const read = (app, rel) => {
  try {
    return fs.readFileSync(path.join(HOME, app.dir, 'src', rel), 'utf8')
  } catch {
    return null
  }
}

const exists = (app, rel) => fs.existsSync(path.join(HOME, app.dir, 'src', rel))

/** 검사 하나 = { id, 설명, 실행 } — 실행은 문제를 문자열 배열로 돌려준다 */
const CHECKS = [
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
    id: 'app-key',
    label: '과목 id 앞머리가 앱마다 다른가',
    run(app) {
      const s = read(app, 'lib/aiExplain.js')
      if (!s) return ['lib/aiExplain.js 없음']
      const m = s.match(/const APP_KEY = '([^']+)'/)
      if (!m) return ['APP_KEY 가 없다 — 다른 앱과 하루 한도가 섞인다']
      return m[1] === app.appKey ? [] : [`APP_KEY 가 '${m[1]}' — '${app.appKey}' 여야 한다`]
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
    id: 'notes-storage',
    label: 'AI해설노트 저장소가 앱마다 다른가',
    run(app) {
      const s = read(app, 'data/aiExplanationNotes.js')
      if (!s) return ['data/aiExplanationNotes.js 없음']
      const m = s.match(/const STORAGE_KEY = '([^']+)'/)
      if (!m) return ['STORAGE_KEY 를 못 찾음']
      if (app.dir !== 'ox-quiz-app' && m[1] === 'ox_ai_explanation_notes_v1') {
        return [`저장소 키가 공인중개사 것 그대로 — 앱끼리 노트가 섞인다`]
      }
      return []
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
    : `\n────────\n일곱 앱 모두 통과.`
)
process.exit(problems ? 1 : 0)
