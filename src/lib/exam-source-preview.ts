export type ExamSourcePreview = { title: string; date?: string; url: string; lines: string[] };

export function sourcePreviewKey(href: string, label: string) {
  try {
    const url = new URL(href);
    if (!['law.go.kr', 'www.law.go.kr'].includes(url.hostname)) return null;
    const route = decodeURIComponent(url.pathname);
    if (/\/(?:prec|detc)/iu.test(route)) {
      const caseNo = (url.searchParams.get('query') ?? label).match(/\d{2,4}\s*[가-힣]{1,3}\s*\d+/u)?.[0];
      return caseNo ? 'case:' + caseNo.replace(/\s/gu, '') : null;
    }
    const fields = ['lsiSeq', 'efYd', 'joNo', 'joBrNo'].map(field => url.searchParams.get(field) ?? '');
    if (fields[0] && fields[2]) return 'version:' + fields.join('|');
    const [, kind, name, article] = route.split('/');
    if (['법령', '행정규칙'].includes(kind) && name && /^제\d+조(?:의\d+)?$/u.test(article ?? '')) {
      return 'law:' + (name === '헌법' ? '대한민국헌법' : name).replace(/\s/gu, '') + '|' + article;
    }
  } catch {
    return null;
  }
  return null;
}
