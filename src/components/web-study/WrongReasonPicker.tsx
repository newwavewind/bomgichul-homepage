"use client";
import { useState } from "react";
import { readWebStudy, saveWebStudy, type WrongReason } from "@/lib/web-study";
export function WrongReasonPicker({
  actor,
  id,
}: {
  actor: string;
  id: string;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);
  return (
    <fieldset className="web-panel">
      <legend>어떤 부분이 어려웠나요?</legend>
      <p className="text-sm">
        오답 이유는 이 브라우저의 주간 보고서와 요약집에 저장됩니다.
      </p>
      <div className="web-actions">
        {(["개념 부족", "선지 혼동", "실수", "시간 부족"] as WrongReason[]).map(
          (value) => (
            <button
              key={value}
              aria-pressed={reason === value}
              onClick={() => {
                const data = readWebStudy(actor);
                const index = data.entries.findLastIndex((e) => e.id === id);
                if (index < 0) {
                  setError(true);
                  return;
                }
                data.entries[index].reason = value;
                const ok = saveWebStudy(actor, data);
                setError(!ok);
                if (ok) setReason(value);
              }}
            >
              {value}
            </button>
          ),
        )}
      </div>
      {error && (
        <p role="alert">
          기록을 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.
        </p>
      )}
    </fieldset>
  );
}
