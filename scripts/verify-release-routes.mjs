import {readFileSync,existsSync,readdirSync} from 'node:fs'
import {createHash} from 'node:crypto'

const paths=JSON.parse(readFileSync('.next/server/app-paths-manifest.json','utf8'))
const required=[
 '/api/daily/app/route',
 '/history/library/page', '/api/pc-access/history-library/route', '/api/pc-access/history-library/media/[file]/route',
 '/api/pc-access/web/route', '/api/pc-access/mobile/route',
 '/api/pc-access/study/route', '/api/pc-access/question-data/route', '/api/exam-sources/route',
 '/api/pc-access/lecture/[lecture]/route', '/api/pc-access/lecture/[lecture]/[scene]/route',
 ...['real-estate','firefighter','police'].flatMap(site=>[
  `/${site}/lectures/page`, `/${site}/lectures/[subject]/page`, `/${site}/textbooks/page`,
 ]),
]
for(const route of required)if(!paths[route])throw Error(`Release route missing: ${route}`)

const studyTraceOwners = [
  [/\/data\/history-library\/catalogue\.json\.gz$/, ['/history/library/page']],
  [/\/data\/history-library\/records\.json\.gz$/, ['/history/library/page', '/api/pc-access/history-library/route']],
  [/\/data\/history-library\/media\/[^/]+$/, ['/api/pc-access/history-library/media/[file]/route']],
  [/\/data\/pc-pro-study\/[^/]+\.json\.gz$/, ['/api/pc-access/study/route']],
  [/\/data\/(?:(?:pc-pro-glossary|pc-pro-notes)\/[^/]+|pc-pro-question-traps)\.json\.gz$/, ['/api/pc-access/question-data/route']],
]
const ownedFiles = new Set()
for (const [route, bundle] of Object.entries(paths)) {
  const trace = `.next/server/${bundle}.nft.json`
  if (!existsSync(trace)) continue
  for (const file of JSON.parse(readFileSync(trace, 'utf8')).files) {
    const studyTrace = studyTraceOwners.find(([pattern]) => pattern.test(file))
    if (!studyTrace) continue
    const [pattern, owners] = studyTrace
    if (!owners.includes(route)) throw Error(`Unexpected Pro study asset in ${route}: ${file}`)
    ownedFiles.add(`${pattern.source}:${route}`)
  }
}
for (const [pattern, owners] of studyTraceOwners) {
  for (const owner of owners) {
    if (!ownedFiles.has(`${pattern.source}:${owner}`)) throw Error(`Missing Pro study assets in ${owner} (${pattern.source})`)
  }
}

const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex')
if(hash('public/pdfjs/pdf.worker.min.mjs')!==hash('node_modules/pdfjs-dist/build/pdf.worker.min.mjs'))throw Error('PDF worker and renderer versions differ')
for(const directory of ['cmaps','standard_fonts','wasm','iccs'])if(!existsSync(`public/pdfjs/${directory}`))throw Error(`PDF resource missing: ${directory}`)
const cssDirectory = '.next/static/chunks'
const hasReadingScale = readdirSync(cssDirectory).filter(name => name.endsWith('.css')).some(name =>
  /\.text-sm\s*\{[^}]*font-size:[^;}]*--reading-font-scale/.test(readFileSync(`${cssDirectory}/${name}`, 'utf8'))
)
if (!hasReadingScale) throw Error('The production stylesheet is missing the shared reading scale')
console.log(`Release guard passed: ${required.length} critical routes, scoped Pro study assets, matching PDF resources, and shared reading scale.`)
