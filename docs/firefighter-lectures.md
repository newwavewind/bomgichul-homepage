# 소방공무원 칠판 강의 홈페이지 이식

- 앱 원본 커밋: `f9d71e5c2c4f167a3d4bfc732fedab59bbc44481` (1.0.28, build 43)
- 완성 강의: 소방학개론 72강, 소방관계법규 90강, 행정법총론 53강, 총 215강.
- 홈페이지: `/firefighter`의 미리보기 배너 → `/firefighter/lectures/sobang`.
- 공인중개사와 같이 **각 과목의 첫 3강**만 웹에서 재생한다. 나머지는 소방공무원 앱의 App Store / Google Play 안내를 표시한다.
- 빈 교육과정 항목은 제외하고 앱에 완성된 강의 순서로 번호를 매긴다. 예를 들어 소방학개론 첫 3강은 `sbU101_1`, `sbU101_3`, `sbU101_4`이다.
- `fire-` 접두사로 다른 시험의 조회수·댓글·복습 위치와 구분한다.
- 전체 목록에는 강의 메타데이터만 포함하고, 대본·판서·큐 데이터와 플레이어는 공개 9강만 포함한다. 음원과 소방청 교재 그림은 앱의 원본 공개 주소로 스트리밍한다.
- 원본 장면·큐 SHA-256과 음원 출처는 `src/components/lectures/firefighter/source-manifest.json`에 기록한다. 소방청 그림의 공공누리 출처 표시는 플레이어에 유지한다.

## 갱신

현재 소방공무원 앱 체크아웃을 지정해 실행한다. 홈페이지의 esbuild 설치는 필요 없으며 원본 앱의 esbuild를 사용한다.

```sh
node scripts/import-firefighter-lectures.mjs --source /path/to/firefighter-app
npm test -- src/lib/firefighter-lectures.test.ts
npx tsc --noEmit
npm run build
```

공개 강의가 바뀌면 `public/lecture-boards/fire-*-board-v1.jpg`도 해당 강의의 실제 화면으로 갱신한다. 원본 앱의 대본·판서·자막·음성은 이 작업에서 수정하지 않는다.
