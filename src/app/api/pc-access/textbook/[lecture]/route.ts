import { hasPcPro, paidLectureSubject } from '@/lib/pc-access/pro';
import { getPcViewer, pcJson } from '@/lib/pc-access/session';
import { proTextbookUrl } from '@/lib/pc-access/textbooks';

export async function GET(request: Request, { params }: { params: Promise<{ lecture: string }> }) {
  try {
    const { lecture } = await params;
    const subject = paidLectureSubject(lecture);
    const source = subject && proTextbookUrl(subject, lecture);
    if (!subject || !source) return pcJson({ error: '교재를 찾을 수 없어요.' }, 404);
    const viewer = await getPcViewer();
    if (!viewer) return pcJson({ error: '로그인 후 교재를 볼 수 있어요.' }, 401);
    if (!await hasPcPro(viewer.id, subject, viewer.beta)) return pcJson({ error: '이 과목의 Pro 권한을 연결해 주세요.' }, 403);

    const range = request.headers.get('range');
    if (range && !/^bytes=(?:\d{1,12}-\d{0,12}|-\d{1,12})$/.test(range)) {
      return pcJson({ error: '교재 페이지 범위를 확인해 주세요.' }, 416);
    }
    const upstream = await fetch(source, {
      headers: range ? { Range: range } : undefined, cache: 'no-store', redirect: 'error',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(30000)]),
    });
    if (upstream.status === 416) {
      return pcJson({ error: '교재 페이지 범위를 확인해 주세요.' }, 416, {
        'Content-Range': upstream.headers.get('content-range') ?? '',
      });
    }
    if (!upstream.ok || !upstream.body || !/^application\/pdf\b/i.test(upstream.headers.get('content-type') ?? '')) {
      return pcJson({ error: '교재 PDF를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }, 502);
    }
    const headers = new Headers({
      'Cache-Control': 'private, no-store',
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
    });
    for (const name of ['content-length', 'content-range', 'accept-ranges']) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch {
    return pcJson({ error: '교재 PDF를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }, 503);
  }
}
