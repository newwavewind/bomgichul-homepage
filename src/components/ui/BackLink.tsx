import Link from "next/link";
import { HistoryBackLink } from "@/components/ui/HistoryBackLink";
import { BackLinkChevron, backLinkClass } from "@/components/ui/backLinkShared";

export function BackLink({
  href,
  children,
  emphasized = false,
  preferHistory = false,
}: {
  href: string;
  children: React.ReactNode;
  /** 개념 복귀 등 눈에 띄게 강조할 때 */
  emphasized?: boolean;
  /**
   * 같은 사이트에서 넘어온 경우 브라우저 바로 전 화면으로 돌아가고,
   * 직접 진입·외부 유입이면 href(목록)로 간다.
   */
  preferHistory?: boolean;
}) {
  if (preferHistory) {
    return (
      <HistoryBackLink href={href} emphasized={emphasized}>
        {children}
      </HistoryBackLink>
    );
  }

  return (
    <Link href={href} className={backLinkClass(emphasized)}>
      <BackLinkChevron />
      <span className="underline-offset-4 group-hover:underline">{children}</span>
    </Link>
  );
}
