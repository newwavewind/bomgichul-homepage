import { spawn } from "node:child_process";
import { loadEnvFile } from "node:process";

// 관리자 대시보드와 로컬 데이터 검증에 필요한 서버 전용 키를
// 브라우저 번들에 노출하지 않고 개발 서버 프로세스에만 주입한다.
loadEnvFile(".env.seed.local");

const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev"],
  {
    env: process.env,
    stdio: "inherit",
  }
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
