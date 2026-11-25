const PDF_FONT_STACK = "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif"

export const CELL_PRINT_EDITIONS = { filled: '학습표', blank: '빈칸 연습지', answer: '정답표' }

const PAGE_CSS = `
  .cell-print { box-sizing:border-box; width:794px; min-height:1123px; padding:54px; color:#1c2d25;
    background:white; font-family:${PDF_FONT_STACK}; font-size:15px; line-height:1.55; font-synthesis:none; }
  .cell-print h1 { font-size:31px; line-height:1.2; margin:0 0 22px; }
  .cell-print th.cell-print-band { background:#e3efe7; color:#1b5e3c; font-size:13px; }
  .cell-print .brand { color:#236842; font-weight:700; margin:0 0 10px; }
  .cell-print table { border-collapse:separate; border-spacing:0; table-layout:fixed; width:100%;
    border-top:1px solid #99aa9e; border-left:1px solid #99aa9e; }
  .cell-print th,.cell-print td { box-sizing:border-box; vertical-align:top; text-align:left;
    padding:12px; border-right:1px solid #99aa9e; border-bottom:1px solid #99aa9e; }
  .cell-print th { background:#eff5f1; font-weight:700; }
  .cell-print td { height:98px; }
  .cell-print .cell-print-axis { background:#e9eeeb; color:#52655e; font-size:12px; font-weight:600; text-align:center;
    vertical-align:middle; padding:5px 4px; }
  .cell-print col.cell-print-index { width:38px; }
  .cell-print col.cell-print-subject { width:150px; }
  @media print { @page { size:A4; margin:0; } body { margin:0; } .cell-print { width:210mm; min-height:296mm; print-color-adjust:exact; } }
`

function makePage(doc, sheet, edition, addresses) {
  const add = (parent, tag, text, className) => {
    const element = doc.createElement(tag)
    if (text) element.textContent = text
    if (className) element.className = className
    parent.appendChild(element)
    return element
  }
  const page = doc.createElement('article')
  page.className = 'cell-print'
  add(page, 'p', `봄기출 · 기출 셀 학습 · ${CELL_PRINT_EDITIONS[edition]}`, 'brand')
  add(page, 'h1', sheet.title)
  // 화면 시트처럼 위에 열 머리(A·B·C), 왼쪽에 행 번호(1·2·3)를 둔다
  const table = add(page, 'table')
  const cols = add(table, 'colgroup')
  add(cols, 'col', null, 'cell-print-index')
  add(cols, 'col', null, 'cell-print-subject')
  sheet.columns.forEach(() => add(cols, 'col'))
  const head = add(table, 'thead')
  const axis = add(head, 'tr')
  add(axis, 'th', '', 'cell-print-axis')
  add(axis, 'th', 'A', 'cell-print-axis')
  sheet.columns.forEach(column => add(axis, 'th', column.letter, 'cell-print-axis'))
  const header = add(head, 'tr')
  add(header, 'th', '1', 'cell-print-axis')
  add(header, 'th', sheet.firstColumnLabel ?? (sheet.chapter ? '쟁점' : '구분'))
  sheet.columns.forEach(column => add(header, 'th', column.label))
  const body = add(table, 'tbody')
  for (const row of sheet.rows) {
    const line = add(body, 'tr')
    add(line, 'th', String(row.number), 'cell-print-axis')
    if (row.kind === 'band') {
      if (row.headers) {
        add(line, 'th', row.label, 'cell-print-band')
        row.headers.forEach(label => add(line, 'th', label, 'cell-print-band'))
      } else {
        const cell = add(line, 'th', row.label, 'cell-print-band')
        cell.colSpan = 1 + sheet.columns.length
      }
      continue
    }
    add(line, 'th', row.gridLabel ?? row.label)
    row.cells.forEach((cell, index) => {
      const address = `${sheet.columns[index].letter}${row.number}`
      const selected = addresses.has(address)
      const box = add(line, 'td')
      if (edition === 'filled' || (edition === 'blank' && !selected) || (edition === 'answer' && selected)) {
        add(box, 'div', cell.value)
      }
    })
  }
  return page
}

function printWeb(sheet, edition, addresses) {
  const frame = document.createElement('iframe')
  frame.title = '시트 인쇄'
  frame.style.cssText = 'position:fixed;width:1px;height:1px;left:0;bottom:0;border:0;opacity:0;pointer-events:none;'
  document.body.appendChild(frame)
  const doc = frame.contentDocument
  const win = frame.contentWindow
  if (!doc || !win) { frame.remove(); throw new Error('인쇄 창을 열 수 없어요.') }
  doc.title = `${sheet.title} ${CELL_PRINT_EDITIONS[edition]}`
  const style = doc.createElement('style')
  style.textContent = PAGE_CSS
  doc.head.appendChild(style)
  doc.body.appendChild(makePage(doc, sheet, edition, addresses))
  win.addEventListener('afterprint', () => frame.remove(), { once: true })
  win.focus()
  try { win.print() } catch (error) { frame.remove(); throw error }
}

const MAX_IMAGE_PIXELS = 16_000_000
const MAX_PIXEL_RATIO = 4

/**
 * 시트를 초고화질 그림(PNG)으로 만들어 사진첩에 저장한다(웹에서는 내려받기).
 * 인쇄와 같은 깔끔한 학습표 모양으로, 화면보다 최대 4배 촘촘하게 그린다.
 * 시트가 아주 길면 휴대폰 그림 한계를 넘지 않을 만큼만 배율을 낮춘다.
 */
/** 시트 그림(PNG data URL)과 실제 화소 크기 */
export async function makeSheetImage(sheet, edition, addresses) {
  const { toPng } = await import('html-to-image')
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;left:-12000px;top:0;pointer-events:none;'
  host.setAttribute('aria-hidden', 'true')
  const style = document.createElement('style')
  style.textContent = PAGE_CSS + '\n.cell-print { min-height: 0; }'
  const page = makePage(document, sheet, edition, addresses)
  host.append(style, page)
  document.body.appendChild(host)
  try {
    if (document.fonts?.ready) await document.fonts.ready
    const width = page.offsetWidth
    const height = page.offsetHeight
    const pixelRatio = Math.max(1, Math.min(MAX_PIXEL_RATIO, Math.sqrt(MAX_IMAGE_PIXELS / (width * height))))
    const dataUrl = await toPng(page, { pixelRatio, backgroundColor: '#ffffff', cacheBust: true })
    return { dataUrl, width: Math.round(width * pixelRatio), height: Math.round(height * pixelRatio) }
  } finally {
    host.remove()
  }
}


function download(url, name) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  return { mode: 'download' }
}

export async function saveSheetPhoto(sheet, edition, addresses) {
  const image = await makeSheetImage(sheet, edition, addresses)
  const title = `${sheet.title} ${CELL_PRINT_EDITIONS[edition]}`
  return { ...download(image.dataUrl, `봄기출 ${title}.png`), width: image.width, height: image.height }
}

export async function deliverSheet(sheet, edition, addresses, action) {
  if (action === 'print') return printWeb(sheet, edition, addresses)

  const [{ PDFDocument, PageSizes }, image] = await Promise.all([
    import('pdf-lib'), makeSheetImage(sheet, edition, addresses),
  ])
  const pdf = await PDFDocument.create()
  const [pageWidth, pageHeight] = PageSizes.A4
  const scale = pageWidth / image.width
  const sliceHeight = Math.floor(pageHeight / scale)
  const bitmap = new Image()
  bitmap.src = image.dataUrl
  await bitmap.decode()
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  const ctx = canvas.getContext('2d')
  for (let top = 0; top < image.height; top += sliceHeight) {
    const height = Math.min(sliceHeight, image.height - top)
    canvas.height = height
    ctx.drawImage(bitmap, 0, top, image.width, height, 0, 0, image.width, height)
    const jpeg = await pdf.embedJpg(canvas.toDataURL('image/jpeg', 0.94))
    const page = pdf.addPage(PageSizes.A4)
    page.drawImage(jpeg, { x: 0, y: pageHeight - height * scale, width: pageWidth, height: height * scale })
  }
  const title = `${sheet.title} ${CELL_PRINT_EDITIONS[edition]}`
  pdf.setTitle(title)
  pdf.setAuthor('봄기출')
  const url = URL.createObjectURL(new Blob([await pdf.save()], { type: 'application/pdf' }))
  const result = download(url, `봄기출 ${title}.pdf`)
  window.setTimeout(() => URL.revokeObjectURL(url), 60000)
  return result
}
