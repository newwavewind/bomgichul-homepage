# 봄기출 홈페이지

수험생을 위한 기출문제 앱 **봄기출**의 공식 홈페이지 & 커뮤니티입니다.

## 기능

- **홈**: 앱 소개 및 주요 기능 안내
- **커뮤니티**: 카테고리별 게시판 (질문, 자료공유, 수다, 수험정보)
- **페이지네이션**: 게시글 목록 페이지 단위 조회
- **글쓰기 / 상세 / 댓글**: Supabase 연동 CRUD
- **로그인 / 회원가입**: Supabase Auth

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase (Auth + PostgreSQL)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Authentication > URL Configuration에 Site URL 및 Redirect URL 설정
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`

### 3. 환경 변수

`.env.local.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

Supabase 프로젝트의 URL과 anon key를 입력:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 홈 (앱 소개)
│   ├── community/
│   │   ├── page.tsx          # 게시판 목록 + 페이지네이션
│   │   ├── write/page.tsx    # 글쓰기
│   │   └── [id]/page.tsx     # 게시글 상세 + 댓글
│   ├── login/page.tsx        # 로그인 / 회원가입
│   └── auth/callback/        # OAuth 콜백
├── components/
│   ├── layout/               # Header, Footer
│   └── board/                # PostCard, Pagination, CategoryFilter
├── lib/
│   ├── supabase/             # Supabase 클라이언트
│   ├── posts.ts              # 게시글 데이터 fetching
│   └── constants.ts          # 상수 (카테고리, 페이지 크기 등)
└── types/
    └── database.ts           # TypeScript 타입
supabase/
└── schema.sql                # DB 스키마 + RLS 정책
```

## 카테고리

| 값 | 라벨 | 설명 |
|---|---|---|
| `question` | 질문 | 공부 관련 질문 |
| `resource` | 자료공유 | 기출, 노트, 팁 공유 |
| `chat` | 수다 | 자유로운 수험생 수다 |
| `info` | 수험정보 | 시험 일정, 합격 후기 등 |
