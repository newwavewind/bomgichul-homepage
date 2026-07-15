# Google 로그인에 `*.supabase.co` 대신 `auth.bomgichul.com` 보이기

Google 계정 선택 화면의  
`dedanykawvrxpnmzanuk.supabase.co(으)로 이동`  
문구는 **앱 코드로 지울 수 없습니다.**  
OAuth 콜백 호스트가 그 주소이기 때문에 Google이 보안상 그대로 노출합니다.

해결: Supabase **Custom Domain**을 `auth.bomgichul.com`으로 붙입니다.

## 사전 조건 (현재 블로커)

| 항목 | 상태 |
|------|------|
| Org `newwavewind's Org` | **Free** → Custom Domain / Vanity subdomain **불가** |
| 필요 | **Pro(이상)** + [Custom Domains 애드온](https://supabase.com/docs/guides/platform/manage-your-usage/custom-domains) |
| DNS | `bomgichul.com` 관리 권한 (CNAME·TXT 추가) |
| Google Cloud | OAuth 클라이언트 redirect URI에 커스텀 도메인 추가 |

대시보드에서 업그레이드:  
https://supabase.com/dashboard/org/tgddvigyjmaabouwypky/billing

프로젝트 Custom Domains:  
https://supabase.com/dashboard/project/dedanykawvrxpnmzanuk/settings/general  
(또는 Settings → Custom Domains)

---

## 1. 결제 / 애드온

1. Org를 **Pro**로 업그레이드
2. 프로젝트에 **Custom Domain** 애드온 활성화
3. 호스트명: **`auth.bomgichul.com`** (루트 `bomgichul.com`은 불가, 서브도메인만)

---

## 2. DNS (`bomgichul.com`)

TTL은 낮게(300초 권장) 두고 시작합니다.

| Type | Name / Host | Value / Target |
|------|-------------|----------------|
| **CNAME** | `auth` | `dedanykawvrxpnmzanuk.supabase.co` |
| **TXT** | Supabase가 안내하는 `_acme-challenge…` | Dashboard/CLI에 나온 값 그대로 |

대시보드 **Custom Domains** 마법사 또는 CLI:

```bash
npx supabase login
npx supabase domains create \
  --project-ref dedanykawvrxpnmzanuk \
  --custom-hostname auth.bomgichul.com

# DNS 반영 후 (몇 번 재시도할 수 있음)
npx supabase domains reverify --project-ref dedanykawvrxpnmzanuk
```

일부 등록업체는 호스트에 `auth.bomgichul.com`을 쓰면 `auth.bomgichul.com.bomgichul.com`이 됩니다.  
그 경우 호스트는 **`auth`** 만 입력합니다.

---

## 3. Google Cloud (필수, 활성화 전에)

[Google Auth Platform → Clients](https://console.cloud.google.com/auth/clients)  
→ 봄기출에 쓰는 Web OAuth 클라이언트

**Authorized redirect URIs**에 **둘 다** 유지:

```
https://dedanykawvrxpnmzanuk.supabase.co/auth/v1/callback
https://auth.bomgichul.com/auth/v1/callback
```

(기존 URI를 지우지 마세요. 전환 중·롤백용으로 필요합니다.)

권장 브랜드 설정 (신뢰도 보강):

- 앱 이름: `봄기출`
- 홈페이지: `https://www.bomgichul.com`
- 개인정보처리방침: `https://www.bomgichul.com/privacy`
- Authorized domains: `bomgichul.com` (Search Console에서 소유 확인)

---

## 4. Custom Domain 활성화

DNS 검증·SSL 발급이 끝난 뒤:

```bash
npx supabase domains activate --project-ref dedanykawvrxpnmzanuk
```

또는 Dashboard에서 **Activate**.

활성화 직후 Auth OAuth 콜백이 **`auth.bomgichul.com`** 을 광고합니다.  
로그인 화면에 `auth.bomgichul.com(으)로 이동` 이 보이면 성공입니다.

기본 `*.supabase.co` URL은 계속 살아 있습니다.

---

## 5. 앱·Vercel 환경 변수 (권장)

클라이언트가 커스텀 도메인을 쓰도록 바꿉니다.

| 변수 | 새 값 |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://auth.bomgichul.com` |

적용 위치:

1. 로컬 `.env.local`
2. Vercel → Project → Environment Variables → Redeploy

anon / service_role 키는 **그대로**입니다. URL만 바꿉니다.

---

## 6. Supabase Auth URL Configuration

Dashboard → Authentication → URL Configuration

| 항목 | 권장 값 |
|------|---------|
| Site URL | `https://www.bomgichul.com` |
| Redirect URLs | 아래 포함 |

```
http://localhost:3000/auth/callback
https://www.bomgichul.com/auth/callback
https://bomgichul.com/auth/callback
https://bomgichul-homepage.vercel.app/auth/callback
```

---

## 7. 확인 체크리스트

- [ ] Org Pro + Custom Domain 애드온
- [ ] DNS CNAME `auth` → `dedanykawvrxpnmzanuk.supabase.co`
- [ ] ACME TXT 추가·`reverify` / SSL 완료
- [ ] Google redirect에 `https://auth.bomgichul.com/auth/v1/callback` 추가
- [ ] Domain **Activate**
- [ ] `NEXT_PUBLIC_SUPABASE_URL=https://auth.bomgichul.com` (로컬·Vercel)
- [ ] 시크릿 창에서 `/login` → Google → **`auth.bomgichul.com`(으)로 이동** 확인

---

## Free 플랜일 때 (임시)

Custom Domain 없이 할 수 있는 것:

- Google OAuth 앱 이름·로고·개인정보 링크 정리
- `bomgichul.com` 도메인 소유 확인 + consent screen brand 검증 신청

그래도 **「…supabase.co(으)로 이동」줄 자체는 사라지지 않습니다.**  
그 줄을 `auth.bomgichul.com`으로 바꾸는 것이 이 문서의 목표입니다.
