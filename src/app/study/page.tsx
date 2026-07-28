import { permanentRedirect } from "next/navigation";

/** 학습 허브는 홈(`/`)과 동일 — soft-duplicate 방지 */
export default function StudyHubPage() {
  permanentRedirect("/");
}
