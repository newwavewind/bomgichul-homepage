import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'

const paths=JSON.parse(readFileSync('.next/server/app-paths-manifest.json','utf8'))
const required=[
 '/api/daily/app/route',
 ...['real-estate','firefighter','police'].flatMap(site=>[
  `/${site}/lectures/page`, `/${site}/lectures/[subject]/page`, `/${site}/textbooks/page`,
 ]),
]
for(const route of required)if(!paths[route])throw Error(`Release route missing: ${route}`)
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex')
if(hash('public/pdfjs/pdf.worker.min.mjs')!==hash('node_modules/pdfjs-dist/build/pdf.worker.min.mjs'))throw Error('PDF worker and renderer versions differ')
for(const directory of ['cmaps','standard_fonts','wasm','iccs'])if(!existsSync(`public/pdfjs/${directory}`))throw Error(`PDF resource missing: ${directory}`)
console.log(`Release guard passed: ${required.length} critical routes and matching PDF renderer resources.`)
