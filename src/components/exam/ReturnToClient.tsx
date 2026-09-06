"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { useMe } from "@/lib/client-session";
import { appendReturnTo, isValidReturnTo, parseConceptReturnTo } from "@/lib/return-to";

/**
 * 문항 상세의 `?from=`(개념 복귀) 문맥을 다루는 클라이언트 조각들.
 *
 * 페이지가 searchParams 를 읽으면 그 순간 동적 렌더로 떨어져 정적(ISR) 생성이
 * 죽는다 — 그래서 from 을 보는 눈은 전부 여기 클라이언트로 옮기고, 각 조각을
 * <Suspense> 로 감싼다(useSearchParams 를 쓰는 클라이언트 트리는 가장 가까운
 * Suspense 경계까지 클라이언트 렌더가 되는 이 판 Next 규칙). fallback 은
 * from 없는 기본 모양과 똑같이 그려 직접 방문(SEO 경로)에서 어긋남이 없게 한다.
 */

function ExamBackLinkInner({ listBase, listLabel }: { listBase: string; listLabel: string }) {
  const from = useSearchParams().get("from");
  if (isValidReturnTo(from)) {
    // 개념 제목(titleKo)까지 넣으려면 과목 전체 개념 데이터를 클라이언트에
    // 실어 보내야 한다 — 정적화의 이득을 번들로 되갚는 꼴이라 일반 문구로 둔다.
    return (
      <BackLink href={from} emphasized>
        개념으로 돌아가기
      </BackLink>
    );
  }
  return <BackLink href={listBase}>{listLabel}</BackLink>;
}

/** 뒤로가기 자리 — from 이 있으면 개념 복귀, 없으면 연도 목록. */
export function ExamBackLink(props: { listBase: string; listLabel: string }) {
  return (
    <Suspense fallback={<BackLink href={props.listBase}>{props.listLabel}</BackLink>}>
      <ExamBackLinkInner {...props} />
    </Suspense>
  );
}

function ReturnAwareNavLinkInner({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const from = useSearchParams().get("from");
  const returnTo = isValidReturnTo(from) ? from : undefined;
  return (
    <Link
      href={appendReturnTo(href, returnTo)}
      // 복귀 문맥이 붙은 주소는 같은 문항의 딴 이름일 뿐 — 크롤러가 따라가지 않게 한다.
      rel={returnTo ? "nofollow" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

/** 이전·다음 문항 링크 — from 문맥을 이어붙이고, 붙였을 땐 nofollow. */
export function ReturnAwareNavLink(props: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} className={props.className}>
          {props.children}
        </Link>
      }
    >
      <ReturnAwareNavLinkInner {...props} />
    </Suspense>
  );
}

function ConceptReturnLoginGateInner() {
  const pathname = usePathname();
  const router = useRouter();
  const from = useSearchParams().get("from");
  const me = useMe();

  useEffect(() => {
    // 개념 복귀 문맥은 로그인 전용 흐름이다 — 서버가 하던 redirect 를
    // 로그인 판정이 끝난 뒤(pending 아님) 클라이언트에서 대신한다.
    if (!isValidReturnTo(from) || !parseConceptReturnTo(from)) return;
    if (me.pending || me.user) return;
    const next = appendReturnTo(pathname ?? "/", from);
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [from, me.pending, me.user, pathname, router]);

  return null;
}

/** 개념에서 넘어온(from) 비로그인 방문자를 /login 으로 보낸다. 화면에는 아무것도 안 그린다. */
export function ConceptReturnLoginGate() {
  return (
    <Suspense fallback={null}>
      <ConceptReturnLoginGateInner />
    </Suspense>
  );
}
