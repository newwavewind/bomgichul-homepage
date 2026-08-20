export const ACCOUNT_DELETION_CONFIRMATION = "탈퇴합니다";

export function isValidAccountDeletionConfirmation(value: unknown) {
  return value === ACCOUNT_DELETION_CONFIRMATION;
}

export function isSameOriginRequest(requestUrl: string, originHeader: string | null) {
  if (!originHeader) return true;

  try {
    return new URL(originHeader).origin === new URL(requestUrl).origin;
  } catch {
    return false;
  }
}
