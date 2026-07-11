import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function LogoMark() {
  return (
    <Link href="/study" className="transition-opacity hover:opacity-80">
      <span className="font-display text-body font-semibold text-ink">{SITE_NAME}</span>
    </Link>
  );
}
