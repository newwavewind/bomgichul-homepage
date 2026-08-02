import { permanentRedirect } from "next/navigation";

/** 기존 학습 허브 주소는 공인중개사 학습 홈으로 유지 */
export default function StudyHubPage() {
  permanentRedirect("/real-estate");
}
