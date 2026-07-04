/** 공개 활동용 아이디 규칙 (실명·이메일 사용 금지) */
export const USERNAME_MIN = 2;
export const USERNAME_MAX = 16;
export const USERNAME_REGEX = /^[a-zA-Z0-9가-힣_]+$/;

const RESERVED = new Set([
  "admin",
  "administrator",
  "운영자",
  "관리자",
  "anonymous",
  "익명",
  "수험생",
]);

export function normalizeUsername(raw: string): string {
  return raw.trim();
}

export function validateUsername(raw: string): string | null {
  const username = normalizeUsername(raw);

  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `아이디는 ${USERNAME_MIN}~${USERNAME_MAX}자로 입력해주세요.`;
  }
  if (!USERNAME_REGEX.test(username)) {
    return "아이디는 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.";
  }
  if (RESERVED.has(username.toLowerCase())) {
    return "사용할 수 없는 아이디입니다.";
  }
  if (/^수험생[a-f0-9]+$/i.test(username)) {
    return "임시 아이디 형식은 사용할 수 없습니다.";
  }

  return null;
}
