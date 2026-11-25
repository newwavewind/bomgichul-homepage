import { hasPolicePro, paidLectureSubject, readPaidLecture } from '@/lib/pc-access/pro';
import { getPcViewer, pcJson } from '@/lib/pc-access/session';

export async function GET(_request: Request, { params }: { params: Promise<{ lecture: string }> }) {
  try {
    const { lecture } = await params;
    const subject = paidLectureSubject(lecture);
    if (!subject) return pcJson({ error: '강의를 찾을 수 없어요.' }, 404);
    const viewer = await getPcViewer();
    if (!viewer) return pcJson({ error: '로그인 후 강의를 들을 수 있어요.' }, 401);
    if (!await hasPolicePro(viewer.id, subject)) return pcJson({ error: '이 과목의 Pro 수강권을 연결해 주세요.' }, 403);
    const definition = await readPaidLecture(subject, lecture);
    if (!definition) return pcJson({ error: '강의 자료를 찾을 수 없어요.' }, 404);
    return pcJson({ ...definition, audioBase: `/api/pc-access/lecture/${lecture}` });
  } catch {
    return pcJson({ error: '강의를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }, 503);
  }
}
