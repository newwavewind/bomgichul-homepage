"use client";

import { useMemo, useState } from "react";
import { OutlineButton } from "@/components/ui/Button";
import { copyText } from "@/lib/ai-links";

export function CopyToClipboardButton({
  text,
  label = "복사",
  className = "",
  event,
}: {
  text: string;
  label?: string;
  className?: string;
  event?: string;
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");

  const safeText = useMemo(() => text ?? "", [text]);

  return (
    <OutlineButton
      onClick={async () => {
        const ok = await copyText(safeText);
        setStatus(ok ? "ok" : "fail");
        window.setTimeout(() => setStatus("idle"), 1600);
      }}
      className={className}
      event={event}
      eventParams={{ label }}
    >
      {status === "ok" ? "복사됨" : status === "fail" ? "복사 실패" : label}
    </OutlineButton>
  );
}

