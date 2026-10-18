<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project boundary: homepage vs. licensed realtor app

- `https://app.bomgichul.com/` and this `bomgichulhomepage` workspace are the homepage/PC web experience. They are not the licensed realtor mobile app.
- The licensed realtor mobile app (공인중개사 앱) is maintained in an active Git worktree, not the legacy `/Users/newsang/ox-quiz-app` root checkout. Never launch that root checkout as the app preview.
- Before working on, building, releasing, or previewing the 공인중개사 앱, locate the current active worktree and verify `appName` is `봄기출 공인중개사` and `appId` is `com.sanghyun.civillaw`. As of 2026-10-18, the active worktree is `/Users/newsang/bomgichul-release/rel4/civil`.
- Do not deploy or modify `app.bomgichul.com` or the homepage project unless the user explicitly requests homepage/PC-web work.
