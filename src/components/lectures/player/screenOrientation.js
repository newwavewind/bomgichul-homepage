// Native plugin is unnecessary on the homepage. Keep the app's web fallback.
async function lock(orientation) { try { await window.screen.orientation.lock(orientation); return true; } catch { return false; } }
export const lockLandscape = () => lock('landscape');
export const lockPortrait = () => lock('portrait');
export async function unlockOrientation() { try { window.screen.orientation.unlock(); return true; } catch { return false; } }
