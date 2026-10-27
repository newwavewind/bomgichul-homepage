/** Share cards always use the matching lecture's real opening board. */
export const LECTURE_SHARE_DESCRIPTION = '음성과 판서로 공부하는 공인중개사 칠판 강의.';
export function lectureBoardImage(lectureId: string) {
  return `/lecture-boards/${encodeURIComponent(lectureId)}-board-v1.png`;
}
