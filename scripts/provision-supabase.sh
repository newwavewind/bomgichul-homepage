#!/usr/bin/env bash
# Supabase 프로젝트 생성 + 스키마 적용 (CLI 로그인 후 실행)
set -euo pipefail

PROJECT_NAME="${1:-bomgichul-homepage}"
REGION="${2:-ap-northeast-2}"
DB_PASSWORD="${3:-}"

cd "$(dirname "$0")/.."

if ! npx supabase projects list &>/dev/null; then
  echo "❌ Supabase CLI 로그인이 필요합니다."
  echo "   터미널에서: npx supabase login"
  exit 1
fi

echo "📋 조직 목록:"
npx supabase orgs list

if [[ -z "$DB_PASSWORD" ]]; then
  DB_PASSWORD="$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 24)"
  echo ""
  echo "🔑 생성된 DB 비밀번호 (안전한 곳에 저장하세요):"
  echo "   $DB_PASSWORD"
fi

ORG_ID=$(npx supabase orgs list -o json 2>/dev/null | node -e "
  let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{
    const orgs=JSON.parse(d||'[]');
    if(!orgs.length){ process.exit(1); }
    console.log(orgs[0].id);
  });
" 2>/dev/null || npx supabase orgs list | awk 'NR==2 {print $1}')

echo ""
echo "🚀 프로젝트 생성: $PROJECT_NAME (org: $ORG_ID, region: $REGION)"
CREATE_OUT=$(npx supabase projects create "$PROJECT_NAME" \
  --org-id "$ORG_ID" \
  --db-password "$DB_PASSWORD" \
  --region "$REGION" \
  -o json 2>&1) || { echo "$CREATE_OUT"; exit 1; }

PROJECT_REF=$(echo "$CREATE_OUT" | node -e "
  let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{
    const j=JSON.parse(d);
    console.log(j.id || j.ref || '');
  });
")

echo "✅ 프로젝트 ref: $PROJECT_REF"
echo "⏳ 프로visioning 대기 (약 2~3분)..."
sleep 90

npx supabase link --project-ref "$PROJECT_REF"
npx supabase db push

API_URL="https://${PROJECT_REF}.supabase.co"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Dashboard → Settings → API에서 anon key 복사 후:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL=$API_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=<Dashboard에서 복사>"
echo ""
echo "Vercel + .env.local 에 위 값을 넣으세요."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
