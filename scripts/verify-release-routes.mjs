import {readFileSync,existsSync,readdirSync} from 'node:fs'
import {createHash} from 'node:crypto'

const paths=JSON.parse(readFileSync('.next/server/app-paths-manifest.json','utf8'))
const required=[
 '/api/daily/app/route',
 '/api/pc-access/web/route', '/api/pc-access/mobile/route',
 '/api/pc-access/study/route', '/api/pc-access/study-context/route', '/api/exam-sources/route',
 '/api/pc-access/lecture/[lecture]/route', '/api/pc-access/lecture/[lecture]/[scene]/route',
 ...['real-estate','firefighter','police'].flatMap(site=>[
  `/${site}/lectures/page`, `/${site}/lectures/[subject]/page`, `/${site}/textbooks/page`,
 ]),
]
for(const route of required)if(!paths[route])throw Error(`Release route missing: ${route}`)
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex')
if(hash('public/pdfjs/pdf.worker.min.mjs')!==hash('node_modules/pdfjs-dist/build/pdf.worker.min.mjs'))throw Error('PDF worker and renderer versions differ')
for(const directory of ['cmaps','standard_fonts','wasm','iccs'])if(!existsSync(`public/pdfjs/${directory}`))throw Error(`PDF resource missing: ${directory}`)
const cssDirectory = '.next/static/chunks'
const hasReadingScale = readdirSync(cssDirectory).filter(name => name.endsWith('.css')).some(name =>
  /\.text-sm\s*\{[^}]*font-size:[^;}]*--reading-font-scale/.test(readFileSync(`${cssDirectory}/${name}`, 'utf8'))
)
if (!hasReadingScale) throw Error('The production stylesheet is missing the shared reading scale')
console.log(`Release guard passed: ${required.length} critical routes, matching PDF resources, and shared reading scale.`)
