# 네이버 IndexNow 운영

## 배포할 파일

- `scripts/indexnow.mjs`
- `public/9abda0c95758ad2649d9a4ac5d9c5b6d.txt`
- 선택 사항: `package-script.patch`의 `indexnow` 명령

공개 검증키는 비밀 API 토큰이 아닙니다. 파일 이름과 본문을 동일하게 유지하고 소스에 함께 보관합니다. 배포 후 아래 주소가 로그인·리디렉션 없이 HTTP 200과 키 문자열을 반환해야 합니다.

https://www.bomgichul.com/9abda0c95758ad2649d9a4ac5d9c5b6d.txt

## 운영 순서

1. 실제로 새로 만들거나 수정·삭제한 페이지를 배포합니다.
2. 이번 변경의 대표 URL만 텍스트 파일에 한 줄씩 기록합니다. 절대 HTTPS 주소와 `www.bomgichul.com` 호스트를 사용합니다. 빈 줄과 `#`로 시작하는 주석은 허용합니다.
3. 로컬에서 전송할 JSON을 먼저 검토합니다.

```sh
node scripts/indexnow.mjs --file /tmp/changed-urls.txt
# 또는 package script를 적용한 경우
npm run indexnow -- --file /tmp/changed-urls.txt
```

4. 목록과 공개 키 배포가 확인되면 `--submit`을 명시해 한 번 전송합니다.

```sh
node scripts/indexnow.mjs --file /tmp/changed-urls.txt --submit
```

기본 실행은 네트워크에 접근하지 않는 dry-run입니다. `--submit` 실행도 먼저 공개 키의 내용과 HTTP 200을 확인하며, 일치할 때만 네이버에 POST합니다. 별도 환경변수나 로그인이 필요하지 않습니다. Node.js 20 이상을 사용합니다.

## 입력과 결과

- 같은 origin의 HTTPS URL만 받습니다. 다른 호스트, HTTP, 인증정보, 사용자 지정 포트, fragment, 잘못된 percent escape를 거부합니다.
- URL을 정규화한 뒤 중복을 제거하고, 고유 URL 10,000개를 초과하면 전송하지 않습니다.
- 입력 파일에 적힌 주소만 사용합니다. 사이트맵이나 사이트 전체를 자동 탐색하지 않습니다.
- 페이지의 실제 변경 여부, HTML canonical, noindex 여부는 운영자가 확인합니다. CLI가 이를 추측해 목록에 추가하거나 변경하지 않습니다.
- HTTP 200은 알림 접수, 202는 접수 후 키 확인 중을 뜻합니다. 크롤링·색인·검색 순위·파비콘 반영 완료를 뜻하지 않습니다.
- 400/403/422는 형식·키·URL 범위를 확인합니다. 429/500 등도 자동 재전송하지 않습니다. 응답을 검토한 뒤 필요할 때만 다시 실행합니다.

IndexNow 도입 이전의 전체 URL이나 오래된 수정 내역을 소급해 재전송하지 않습니다. 이후 발생한 실제 변경의 대표 URL만 알립니다. 정기 배치나 전체 사이트 재전송을 등록하지 않습니다.

## 공식 문서

- [키 규칙과 공개 위치](https://searchadvisor.naver.com/guide/indexnow-api-key)
- [POST 주소·최대 10,000개·응답 코드](https://searchadvisor.naver.com/guide/indexnow-request)
- [이전 URL 소급 제출 및 색인 보장 관련 FAQ](https://searchadvisor.naver.com/guide/indexnow-faq)

이 초안은 소스 작성만 완료했으며 실행·테스트·제출하지 않았습니다.
