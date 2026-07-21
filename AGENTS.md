<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project boundary: homepage vs. licensed realtor app

- `https://app.bomgichul.com/` and this `bomgichulhomepage` workspace are the homepage/PC web experience. They are not the licensed realtor mobile app.
- The licensed realtor mobile app (공인중개사 앱) is the separate project at `/Users/newsang/ox-quiz-app`.
- When the user asks to work on, build, release, or update the 공인중개사 앱, operate only on `/Users/newsang/ox-quiz-app` and its Android/iOS store releases.
- Do not deploy or modify `app.bomgichul.com` or the homepage project unless the user explicitly requests homepage/PC-web work.
