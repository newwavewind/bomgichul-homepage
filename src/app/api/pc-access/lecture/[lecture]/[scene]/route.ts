import { hasPcPro } from '@/lib/pc-access/pro';
import { audioSource, paidLectureSubject, readPaidLecture } from '@/lib/pc-access/lectures';
import { getPcViewer, pcJson } from '@/lib/pc-access/session';

export async function GET(request: Request, { params }: { params: Promise<{ lecture: string; scene: string }> }) {
  try {
    const { lecture, scene } = await params;
    const subject = paidLectureSubject(lecture);
    if (!subject) return pcJson({ error: '강의를 찾을 수 없어요.' }, 404);
    const viewer = await getPcViewer();
    if (!viewer) return pcJson({ error: '먼저 로그인해 주세요.' }, 401);
    if (!await hasPcPro(viewer.id, subject, viewer.beta)) return pcJson({ error: '이 과목의 Pro 수강권을 연결해 주세요.' }, 403);
    const definition = await readPaidLecture(subject, lecture);
    const source = definition && audioSource(definition, scene);
    if (!source) return pcJson({ error: '음원을 찾을 수 없어요.' }, 404);
    const range = request.headers.get('range');
    if (range && !/^bytes=(\d{1,12}-\d{0,12}|-\d{1,12})$/.test(range)) {
      return new Response(null, { status: 416, headers: { 'Cache-Control': 'private, no-store' } });
    }
    const upstream = await fetch(source, {
      headers: range ? { Range: range } : undefined, cache: 'no-store', redirect: 'error',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]),
    });
    if (upstream.status !== 416 && !upstream.ok) return pcJson({ error: '음원을 불러오지 못했어요.' }, 503);
    const headers = new Headers({ 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Type': 'audio/mp4' });
    for (const name of ['accept-ranges', 'content-length', 'content-range']) {
      const value = upstream.headers.get(name);
      if (value !== null) headers.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch {
    return pcJson({ error: '음원을 불러오지 못했어요.' }, 503);
  }
}
