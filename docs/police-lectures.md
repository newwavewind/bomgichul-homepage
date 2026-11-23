# 경찰공무원 칠판 강의 홈페이지 이식

- 앱 원본: 경찰공무원 앱 체크아웃(`police-bomgichul`). 등록 강의는 헌법·형사법·경찰학.
- 홈페이지: `/police`의 미리보기 배너 → `/police/lectures/constitution`.
- 공인중개사·소방과 같이 **과목별 첫 3강**만 웹에서 재생한다. 나머지는 경찰공무원 앱의 App Store / Google Play 안내를 표시한다.
- 빈 교육과정 항목은 제외하고 앱에 완성된 강의 순서로 번호를 매긴다. 헌법 첫 3강은 `hnU101_1`…, 경찰학 첫 3강은 `gcU101_1`, `gcU101_2`, `gcU101_3`이다.
- `police-` 접두사로 다른 시험의 조회수·댓글·복습 위치와 구분한다.
- 전체 목록에는 강의 메타데이터만 포함하고, 대본·판서·큐 데이터와 플레이어는 공개 6강만 포함한다. 음원은 앱의 원본 공개 주소로 스트리밍한다.
- 원본 장면·큐 SHA-256과 음원 출처는 `src/components/lectures/police/source-manifest.json`에 기록한다.

## 갱신

현재 경찰공무원 앱 체크아웃을 지정해 실행한다. 홈페이지의 esbuild 설치는 필요 없으며 원본 앱의 esbuild를 사용한다.

```sh
node scripts/import-police-lectures.mjs --source /path/to/police-app
npm test -- src/lib/police-lectures.test.ts
npx tsc --noEmit
npm run build
```

공개 강의가 바뀌면 `public/lecture-boards/police-*-board-v1.jpg`도 해당 강의의 실제 화면으로 갱신한다. 원본 앱의 대본·판서·자막·음성은 이 작업에서 수정하지 않는다.
