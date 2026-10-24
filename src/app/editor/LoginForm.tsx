'use client';

import React, { useActionState } from 'react';
import { Lock } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { login } from './actions';

export function LoginForm({ locked = false }: { locked?: boolean }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-stone-900">
      <div className="flex justify-end px-4 py-3 sm:px-8">
        <ThemeToggle />
      </div>

      <main className="flex flex-1 items-center justify-center px-4 pb-24">
        <form
          action={action}
          className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-xs sm:p-8"
        >
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
            <Lock className="h-5 w-5" />
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Editor access
          </h1>
          <p className="mt-1.5 text-sm text-stone-600">
            Enter the editor passcode to write and manage articles.
          </p>

          <label htmlFor="passcode" className="mt-6 block text-sm font-semibold text-stone-700">
            Passcode
          </label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            disabled={locked || pending}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/30 disabled:opacity-60"
            placeholder="••••••••"
          />

          {(state?.error || locked) && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {locked
                ? 'The editor is locked: EDITOR_PASSCODE is not set on the server.'
                : state?.error}
            </p>
          )}

          <button
            type="submit"
            disabled={locked || pending}
            className="mt-6 w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {pending ? 'Checking…' : 'Unlock editor'}
          </button>
        </form>
      </main>
    </div>
  );
}
