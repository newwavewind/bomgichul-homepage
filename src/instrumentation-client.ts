import { initBotId } from "botid/client/core";

try {
  initBotId({
    protect: [
      { path: "/api/analytics/visit", method: "POST" },
    ],
  });
} catch {
  // 분석 기능 실패가 사이트 이용을 방해하지 않게 합니다.
}
