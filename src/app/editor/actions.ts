'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  EDITOR_COOKIE,
  EDITOR_SESSION_SECONDS,
  createSessionToken,
  passcodeConfigured,
  passcodeMatches,
  isEditorAuthed,
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

export async function createEntry(
  title: string,
  content: string,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isEditorAuthed())) {
    return { ok: false, message: 'Your editor session has expired. Please sign in again.' };
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiWriteToken = process.env.API_WRITE_TOKEN;
  if (!apiBaseUrl || !apiWriteToken) {
    return { ok: false, message: 'The API is not configured on the server.' };
  }

  try {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiWriteToken}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: result.error?.message ?? 'The article could not be saved.',
      };
    }

    return { ok: true, message: 'Article saved.' };
  } catch {
    return { ok: false, message: 'Could not reach the API. Please try again.' };
  }
}
