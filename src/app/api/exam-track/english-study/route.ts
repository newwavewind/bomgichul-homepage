import { getEnglishWordbook, getSyntaxPracticeDay } from "@/lib/english-study-data";

const headers = { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" };

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const day = params.get("day");
  if (day !== null) {
    const number = Number(day);
    if (!Number.isInteger(number) || number < 1 || number > 30) {
      return Response.json({ error: "Invalid day" }, { status: 400 });
    }
    return Response.json(await getSyntaxPracticeDay(number), { headers });
  }

  if (params.get("view") === "words") {
    return Response.json((await getEnglishWordbook()).rows, { headers });
  }

  const id = params.get("word");
  if (id && /^wb-\d{4}$/.test(id)) {
    const word = (await getEnglishWordbook()).details.get(id);
    if (word) return Response.json(word, { headers });
  }
  return Response.json({ error: "Not found" }, { status: 404 });
}
