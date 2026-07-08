import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

interface NewsSearchItem {
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: string;
}

const NEWS_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          source_name: { type: "string" },
          source_url: { type: "string" },
          published_at: { type: "string", description: "YYYY-MM-DD" },
        },
        required: ["title", "summary", "source_name", "source_url", "published_at"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
} as const;

function buildSearchPrompt(count: number): string {
  return (
    `최근 24~48시간 이내 한국 공인중개사(부동산 중개업·자격시험·부동산 정책) 관련 뉴스를 웹 검색으로 찾아 ${count}건 선별해줘. ` +
    "각 기사는 title(원제목), summary(한국어 2~3문장 요약), source_name(언론사명), source_url(원문 링크), published_at(YYYY-MM-DD) 형식으로 정리해줘. " +
    "신뢰할 수 있는 언론사나 정부기관 발표 위주로 고르고, 광고성 기사나 중복 보도는 제외해줘."
  );
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const requestedCount = Number(new URL(request.url).searchParams.get("count")) || 10;
  const count = Math.min(Math.max(requestedCount, 1), 15);

  const anthropic = new Anthropic();

  const response = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }],
    output_config: { format: { type: "json_schema", schema: NEWS_SCHEMA } },
    messages: [{ role: "user", content: buildSearchPrompt(count) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "no text output from model" }, { status: 502 });
  }

  let parsed: { items: NewsSearchItem[] };
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    return NextResponse.json({ error: "failed to parse model output" }, { status: 502 });
  }

  const rows = parsed.items
    .filter(
      (item) =>
        item.title?.trim() &&
        item.summary?.trim() &&
        item.source_url?.trim().startsWith("http") &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.published_at ?? "")
    )
    .slice(0, count)
    .map((item) => ({
      title: item.title.trim(),
      summary: item.summary.trim(),
      source_name: item.source_name?.trim() || "출처 미상",
      source_url: item.source_url.trim(),
      published_at: item.published_at,
    }));

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("news_items")
    .upsert(rows, { onConflict: "source_url,published_at", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
