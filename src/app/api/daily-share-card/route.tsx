import { ImageResponse } from "next/og";
import { getDailyExam } from "@/lib/daily-challenge/exams";
import { getDailySet, listDailySubjects } from "@/lib/daily-challenge/pool";
import { getKSTDateString } from "@/lib/exam";

export const runtime = "nodejs";

const SIZE = { width: 800, height: 800 };

function clipped(text: string, length: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > length ? `${clean.slice(0, length).trim()}…` : clean;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const exam = url.searchParams.get("exam") ?? "";
  const subjectId = url.searchParams.get("subject") ?? "";
  const date = url.searchParams.get("date") ?? getKSTDateString();
  const meta = getDailyExam(exam);
  const subject = listDailySubjects(exam).find((item) => item.id === subjectId);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? date
    : getKSTDateString();
  const question =
    meta && subject
      ? getDailySet(exam, validDate, "ranked", subjectId, 0)[0]
      : null;
  const title = question
    ? clipped(question.stem, 92)
    : "오늘의 기출 10문제, 몇 개 맞힐 수 있을까요?";
  const choices = (question?.choices ?? []).slice(0, 4);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 48,
        background:
          "linear-gradient(145deg,#EAF5FF 0%,#F8FBFF 54%,#FFF8D9 100%)",
        color: "#10243E",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          <span style={{ display: "flex" }}>매일 새로운 기출 10문제</span>
          <span style={{ display: "flex", fontSize: 20, color: "#536B84" }}>
            {meta?.label ?? "기출 학습"} · 같이 풀기
          </span>
        </div>
        <div
          style={{
            display: "flex",
            borderRadius: 999,
            background: "#087CFF",
            color: "#FFFFFF",
            padding: "10px 22px",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          무료
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 24,
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: "-0.04em",
          }}
        >
          {subject?.label ?? "기출 문제"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#56708D",
            fontWeight: 700,
          }}
        >
          {Number(validDate.slice(5, 7))}월 {Number(validDate.slice(8, 10))}일
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginTop: 22,
          borderRadius: 30,
          background: "rgba(255,255,255,0.94)",
          border: "2px solid #D6E7FA",
          padding: 30,
          boxShadow: "0 14px 36px rgba(15,54,96,0.10)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#087CFF",
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          <span
            style={{
              display: "flex",
              width: 32,
              height: 32,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              background: "#E8F4FF",
            }}
          >
            1
          </span>
          먼저 이 문제부터
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 29,
            lineHeight: 1.35,
            fontWeight: 850,
            letterSpacing: "-0.035em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 20,
          }}
        >
          {choices.map((choice) => (
            <div
              key={choice.key}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                borderRadius: 15,
                background: "#F7FAFE",
                border: "1px solid #DDE9F7",
                padding: "11px 15px",
                fontSize: 17,
                color: "#304A67",
              }}
            >
              <span
                style={{ display: "flex", color: "#087CFF", fontWeight: 900 }}
              >
                {choice.label}
              </span>
              <span style={{ display: "flex" }}>
                {clipped(choice.text, 42)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 22,
          fontSize: 19,
          fontWeight: 800,
        }}
      >
        <span style={{ display: "flex", color: "#536B84" }}>
          문제·채점·해설까지 무료
        </span>
        <span style={{ display: "flex", color: "#087CFF" }}>
          무료로 풀기 →
        </span>
      </div>
    </div>,
    {
      ...SIZE,
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
