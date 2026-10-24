'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  EDITOR_COOKIE,
  EDITOR_SESSION_SECONDS,
  createSessionToken,
  passcodeConfigured,
  passcodeMatches,
} from '@/lib/editor-auth';

export type LoginState = { error?: string } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!passcodeConfigured()) {
    return { error: 'The editor is locked: EDITOR_PASSCODE is not set on the server.' };
  }

  const given = String(formData.get('passcode') ?? '');
  if (!passcodeMatches(given)) {
    // Small delay to slow down guessing.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { error: 'Incorrect passcode.' };
  }

  (await cookies()).set(EDITOR_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: EDITOR_SESSION_SECONDS,
  });
  redirect('/editor');
}

export async function logout(): Promise<void> {
  (await cookies()).delete(EDITOR_COOKIE);
  redirect('/editor');
}
