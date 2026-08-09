import { permanentRedirect } from "next/navigation";

export default function LegacyDiaryPage() {
  permanentRedirect("/diary");
}
