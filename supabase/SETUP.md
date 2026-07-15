# Supabase × Vercel 연동 가이드 (봄기출 홈페이지)

> ox-quiz-app(`jisoyiiimgaxihpyntrj`)과 **별도 Supabase 프로젝트**를 사용하세요.

## 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard) → **New project**
2. 이름 예: `bomgichul-homepage`
3. Region: Northeast Asia (Seoul) 권장
4. DB 비밀번호 저장

## 2. DB 스키마 적용

**방법 A — SQL Editor (가장 빠름)**

`supabase/schema.sql` 전체를 SQL Editor에 붙여넣고 실행.

**방법 B — CLI**

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
```

`PROJECT_REF`는 Dashboard → Project Settings → General → **Reference ID**.

## 3. Storage (자료실)

마이그레이션 `20250703100003_storage.sql`에 포함되어 있습니다.
`db push` 또는 `schema.sql` 실행 시 `archive` public 버킷이 생성됩니다.

## 4. Authentication URL 설정

Dashboard → **Authentication** → **URL Configuration**

| 항목 | 값 |
|------|-----|
| Site URL | `https://www.bomgichul.com` |
| Redirect URLs | 아래 모두 추가 |

```
http://localhost:3000/auth/callback
https://www.bomgichul.com/auth/callback
https://bomgichul.com/auth/callback
https://bomgichul-homepage.vercel.app/auth/callback
```

Email provider가 꺼져 있으면 **Authentication → Providers → Email** 활성화.

### Google 로그인에 `*.supabase.co` 난수 주소가 보일 때

Google이 OAuth 콜백 호스트를 그대로 보여 줍니다.  
`auth.bomgichul.com` Custom Domain으로 바꾸는 절차는 **[`CUSTOM_DOMAIN.md`](./CUSTOM_DOMAIN.md)** 참고.

> Org가 Free면 Custom Domain을 켤 수 없습니다. Pro + Custom Domains 애드온이 필요합니다.

## 5. 환경 변수

Dashboard → **Project Settings** → **API**에서 복사:

| 변수 | 위치 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

### 로컬 (`.env.local`)

```bash
cp .env.local.example .env.local
# 값 입력 후
npm run dev
```

### Vercel

Project → **Settings** → **Environment Variables**에 동일하게 추가 후 **Redeploy**.

## 6. Cursor Supabase MCP

프로젝트에 `.cursor/mcp.json`이 설정되어 있습니다.

1. **Cursor Settings** → **Tools & MCP**
2. `supabase` 서버 활성화 (브라우저 OAuth 로그인)
3. 채팅에서 MCP로 `apply_migration`, `execute_sql` 등 사용 가능

프로젝트만 제한하려면 MCP URL에 `?project_ref=<REF>` 추가.

## 7. 동작 확인

- [ ] `/community` — 게시글 목록 (빈 목록 OK)
- [ ] `/login` — 회원가입·로그인
- [ ] `/archive/new` — 자료 업로드 (로그인 후)
- [ ] `/diary` — 수험일기 저장 (로그인 후)

## 프로젝트 분리 체크리스트

- [ ] Supabase project ref가 ox-quiz-app과 **다름**
- [ ] Vercel env가 새 프로젝트 URL/키
- [ ] Git remote가 `bomgichul-homepage` (ox-quiz-app 아님)
