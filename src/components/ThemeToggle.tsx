'use client';

import React, { useEffect, useLayoutEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

// The source of truth is the `dark` class on <html>. The inline script in
// layout.tsx sets it before first paint; this component just mirrors it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

// null on the server -> render the track without a state, avoiding a hydration mismatch
const getServerSnapshot = (): Theme | null => null;

/** Current theme ('light' | 'dark'), or null during server rendering. */
export function useTheme(): Theme | null {
  return useSyncExternalStore<Theme | null>(subscribe, getSnapshot, getServerSnapshot);
}

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const theme = useTheme();

  // In development, React Strict Mode's remount resets <html> to the attributes
  // from JSX, clearing the class the inline script set. Re-apply it before paint.
  // (A no-op in production.)
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const dark = saved
        ? saved === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', dark);
    } catch {
      /* storage unavailable: keep whatever is applied */
    }
  }, []);

  // Enable colour transitions only after first paint so page load doesn't animate.
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className={`group relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border border-stone-300 bg-stone-100 shadow-inner transition-colors hover:border-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer ${className}`}
    >
      {/* Track icons: sit on either side of the thumb */}
      <Sun aria-hidden className="absolute left-1.5 h-3.5 w-3.5 text-stone-400" />
      <Moon aria-hidden className="absolute right-1.5 h-3.5 w-3.5 text-stone-400" />

      {/* Thumb: slides over the active side and shows the active mode's icon */}
      <span
        aria-hidden
        className={`absolute left-[3px] top-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm transition-transform duration-200 ease-out ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {theme === null ? null : isDark ? (
          <Moon className="h-3 w-3" />
        ) : (
          <Sun className="h-3 w-3" />
        )}
      </span>
    </button>
  );
};
