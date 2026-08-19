/**
 * 공무원 영어 기출을 앱 형식에서 홈페이지 형식으로 옮긴다.
 *
 * 앱은 국가직·지방직을 서로 다른 폴더로 나누고 한 해에 한 파일을 둔다.
 * 홈페이지는 한 과목을 한 파일에 담고 회차를 `sourceCode` 로 가른다.
 * 그래서 스무 파일을 하나로 합치되, 어느 계열인지는 sourceCode 에 남긴다.
 *
 * 이름이 다른 자리만 바꾼다 — question_no → questionNo, correct_choice →
 * correctChoice. 나머지(stem·items·category)는 두 쪽이 이미 같은 이름을 쓴다.
 *
 * 앱에만 있고 홈페이지 틀에 없던 것 셋은 그대로 실어 보낸다.
 *   translation      지문 해석
 *   items[].translation  선지 해석
 *   vocab            그 문항에서 챙길 어휘·표현
 * 영어 기출에서 이 셋은 곁다리가 아니라 해설의 일부다. 선지 해설만 남기면
 * 「왜 답이 이건지」는 알아도 「지문이 무슨 말인지」는 끝내 모른다.
 *
 * 구문 올인원과 기출 단어장은 옮기지 않는다.
 *
 * 사용: node scripts/convert-english-exam.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const APP = '/Users/newsang/englishbomgichul'
const HOME = process.cwd()
const OUT_DIR = path.join(HOME, 'src', 'data', 'english')
const IMG_OUT = path.join(HOME, 'public', 'exam', 'english')

const SERIES = [
  { dir: 'national', code: '국가직', label: '국가직' },
  { dir: 'local', code: '지방직', label: '지방직' },
]

const exams = []
const years = new Set()
const sources = new Set()
const copiedImages = new Set()

mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(IMG_OUT, { recursive: true })

for (const series of SERIES) {
  const dir = path.join(APP, 'src', 'data', 'subjects', series.dir, 'exam')
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const rows = JSON.parse(readFileSync(path.join(dir, file), 'utf8'))

    for (const q of rows) {
      years.add(q.year)
      sources.add(series.code)

      // 그림은 홈페이지 공개 폴더로 옮기고 주소를 다시 쓴다.
      // 여러 문항이 한 그림을 나눠 쓰므로 이미 옮긴 것은 건너뛴다.
      let material = null
      if (q.passageImage) {
        const name = q.passageImage.split('/').pop()
        const from = path.join(APP, 'public', 'exam-images', name)
        if (existsSync(from)) {
          if (!copiedImages.has(name)) {
            copyFileSync(from, path.join(IMG_OUT, name))
            copiedImages.add(name)
          }
          material = { image: `/exam/english/${name}` }
        }
      }

      exams.push({
        id: q.id,
        year: q.year,
        sourceCode: series.code,
        source: `${q.year}년 ${series.label} 9급 영어`,
        round: q.year,
        questionNo: q.question_no,
        points: 1,
        stem: q.stem,
        questionType: q.question_type,
        correctChoice: q.correct_choice,
        category: q.category,
        subcategory: q.subcategory,
        ...(material ? { material } : {}),
        ...(q.passageText ? { passageText: q.passageText } : {}),
        // 앱은 선지에 번호표(①②③④)를 화면에서 붙이지만 홈페이지 데이터는
        // label 을 들고 있어야 한다 — 여기서 채워 둔다.
        items: (q.items ?? []).map((it) => ({
          key: it.key,
          label: '①②③④⑤'[Number(it.key) - 1] ?? it.key,
          text: it.text,
          answer: it.answer,
          explanation: it.explanation,
          ...(it.translation ? { translation: it.translation } : {}),
        })),
        ...(q.translation ? { translation: q.translation } : {}),
        ...(q.vocab?.length ? { vocab: q.vocab } : {}),
      })
    }
  }
}

// 최근 회차가 위로. 같은 해에서는 국가직을 먼저 둔다 — 앱 목록과 같은 차례다.
exams.sort(
  (a, b) =>
    b.year - a.year ||
    (a.sourceCode === b.sourceCode ? 0 : a.sourceCode === '국가직' ? -1 : 1) ||
    a.questionNo - b.questionNo,
)

const subject = { id: 'gong9', label: '9급 영어', track: '공무원 영어' }
const payload = {
  subject,
  years: [...years].sort((a, b) => b - a),
  sources: [...sources],
  concepts: [], // 구문 올인원은 옮기지 않는다
  exams,
}

writeFileSync(path.join(OUT_DIR, 'gong9.json'), JSON.stringify(payload, null, 2) + '\n')
writeFileSync(
  path.join(OUT_DIR, 'manifest.json'),
  JSON.stringify(
    [
      {
        id: subject.id,
        label: subject.label,
        track: subject.track,
        conceptCount: 0,
        examCount: exams.length,
        years: payload.years,
        sources: payload.sources,
      },
    ],
    null,
    2,
  ) + '\n',
)

console.log(`문항 ${exams.length}개 · 연도 ${payload.years.length}개 · 계열 ${payload.sources.join('·')}`)
console.log(`그림 ${copiedImages.size}개 → public/exam/english/`)
console.log(`해석 있는 문항 ${exams.filter((e) => e.translation).length}개`)
console.log(`어휘 있는 문항 ${exams.filter((e) => e.vocab).length}개`)
