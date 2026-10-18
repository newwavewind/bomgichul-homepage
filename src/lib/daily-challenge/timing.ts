export const LONG_ELAPSED_THRESHOLD_MS = 30 * 60 * 1000;
export const MAX_VALID_ELAPSED_MS = 24 * 60 * 60 * 1000;

// `elapsed_ms` is a non-null Postgres int. Reserving its maximum value keeps
// invalid timings sortable after every measured attempt without a schema
// migration or a misleading made-up duration.
export const INVALID_ELAPSED_MS = 2_147_483_647;

export function isInvalidElapsed(ms: number) {
  return ms === INVALID_ELAPSED_MS;
}
