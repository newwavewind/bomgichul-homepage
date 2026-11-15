import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  start: vi.fn(),
  submit: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ auth: { getUser: mocks.getUser } }),
}));
vi.mock("@/lib/daily-challenge/actions", () => ({
  startDailyAttempt: mocks.start,
  submitDailyAttempt: mocks.submit,
  getDailyInsights: async () => ({ calendar: [], streak: 0, monthDone: 0 }),
  getTodayBoard: async () => [],
  getCumulativeBoard: async () => [],
  getViewerDailyShareContext: async () => ({ inviterNickname: "", attempt: null }),
}));

import { DAILY_EXAMS } from "@/lib/daily-challenge/exams";
import { listDailySubjects } from "@/lib/daily-challenge/pool";
import { OPTIONS, POST } from "./route";

function request(body: unknown, headers = {}) {
  return new Request("https://www.bomgichul.com/api/daily/app", {
    method: "POST",
    headers: { origin: "capacitor://localhost", "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.start.mockResolvedValue({ ok: true, timerToken: "", startedAt: null });
  mocks.submit.mockResolvedValue({ ok: true });
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error("expired") });
});

describe("native app daily API", () => {
  it.each(["capacitor://localhost", "https://localhost", "null"])("allows native preflight from %s including auth", (origin) => {
    const response = OPTIONS(new Request("https://www.bomgichul.com/api/daily/app", {
      method: "OPTIONS", headers: { origin, "access-control-request-headers": "authorization,content-type" },
    }));
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
    expect(response.headers.get("access-control-allow-headers")).toContain("authorization");
    expect(response.headers.get("access-control-allow-methods")).toContain("POST");
  });

  for (const exam of DAILY_EXAMS) {
    it(`${exam.label}: returns ten questions for every available subject`, async () => {
      const subjects = listDailySubjects(exam.slug);
      expect(subjects.length).toBeGreaterThan(0);
      for (const subject of subjects) {
        const response = await POST(request({ action: "open", arm: false, examSlug: exam.slug, subjectId: subject.id, deviceId: "route-regression-test" }));
        const body = await response.json();
        expect(response.status, `${exam.slug}/${subject.id}: ${body.message}`).toBe(200);
        expect(body.questions, `${exam.slug}/${subject.id}`).toHaveLength(10);
        expect(new Set(body.questions.map((q: { id: string }) => q.id)).size).toBe(10);
        for (const question of body.questions) {
          expect(question.stem).toBeTruthy();
          expect(question.choices.length).toBeGreaterThan(1);
          expect(question).not.toHaveProperty("correctKeys");
        }
        expect(response.headers.get("access-control-allow-origin")).toBe("capacitor://localhost");
        expect(mocks.start).toHaveBeenLastCalledWith(expect.objectContaining({ arm: false }));
      }
    }, 120_000);
  }

  it.each([
    ["police", "broker-law", "police-science"],
    ["police", "registry-law", "constitution"],
    ["police", "realestate-tax", "criminal-law"],
    ["english", "english", "gong9"],
    ["history", "history", "simhwa"],
  ])("accepts shipped %s subject %s", async (examSlug, subjectId, canonical) => {
    const response = await POST(request({ examSlug, subjectId, deviceId: "alias-test", arm: false }));
    expect(response.status).toBe(200);
    expect(mocks.start).toHaveBeenCalledWith(expect.objectContaining({ subject: canonical }));
  });

  it("returns a readable CORS response for an expired login", async () => {
    const response = await POST(request({ examSlug: "real-estate", subjectId: "civillaw", deviceId: "auth-test" }, { authorization: "Bearer expired-test-token" }));
    expect(response.status).toBe(401);
    expect(response.headers.get("access-control-allow-origin")).toBe("capacitor://localhost");
    expect((await response.json()).message).toContain("로그인");
  });

  it("forwards timer arming and answer submission", async () => {
    const base = { examSlug: "real-estate", subjectId: "civillaw", deviceId: "flow-test" };
    expect((await POST(request({ ...base, action: "arm" }))).status).toBe(200);
    expect(mocks.start).toHaveBeenCalledWith(expect.objectContaining({ arm: true }));
    const picks = [{ id: "question", key: "1" }];
    expect((await POST(request({ ...base, action: "submit", timerToken: "signed-timer", picks }))).status).toBe(200);
    expect(mocks.submit).toHaveBeenCalledWith(expect.objectContaining({ timerToken: "signed-timer", picks }));
  });
});
