import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Passcode gate for /editor.
 *
 * - The passcode lives only in the EDITOR_PASSCODE env var (server side).
 * - After a correct passcode we set an httpOnly cookie holding an HMAC token
 *   derived from the passcode, so the passcode itself is never stored in the
 *   browser. Changing EDITOR_PASSCODE signs everyone out.
 * - If EDITOR_PASSCODE is not set the editor stays locked (fails closed).
 */

export const EDITOR_COOKIE = 'editor_session';
export const EDITOR_SESSION_SECONDS = 60 * 60 * 8; // 8 hours

const TOKEN_MESSAGE = 'weekly-tech-journal:editor-session:v1';

export function passcodeConfigured(): boolean {
  return Boolean(process.env.EDITOR_PASSCODE);
}

function tokenFor(passcode: string): string {
  return createHmac('sha256', passcode).update(TOKEN_MESSAGE).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Constant-time passcode comparison (hashes first so lengths always match). */
export function passcodeMatches(given: string): boolean {
  const expected = process.env.EDITOR_PASSCODE;
  if (!expected) return false;
  const a = createHmac('sha256', 'compare').update(given).digest();
  const b = createHmac('sha256', 'compare').update(expected).digest();
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const expected = process.env.EDITOR_PASSCODE;
  if (!expected) throw new Error('EDITOR_PASSCODE is not set');
  return tokenFor(expected);
}

/** True when the request carries a valid editor session cookie. */
export async function isEditorAuthed(): Promise<boolean> {
  const expected = process.env.EDITOR_PASSCODE;
  if (!expected) return false;
  const token = (await cookies()).get(EDITOR_COOKIE)?.value ?? '';
  return safeEqual(token, tokenFor(expected));
}
