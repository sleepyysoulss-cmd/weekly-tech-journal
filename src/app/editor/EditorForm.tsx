'use client';

import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import { LogOut, Plus, X } from 'lucide-react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { ThemeToggle, useTheme } from '@/components/ThemeToggle';
import { logout } from './actions';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const MAX_IMAGES = 5;
const MAX_TAKEAWAYS = 6;
const MAX_SOURCES = 8;
const SUBTITLE_MAX = 200;

const CATEGORY_SUGGESTIONS = [
  'Artificial Intelligence',
  'Open Source',
  'Hardware',
  'Security & Policy',
  'Consumer Tech',
];

type SourceRow = { title: string; outlet: string; url: string };
type Status = { kind: 'error' | 'ok'; message: string } | null;

// Styles use the theme palette (stone/white), so they follow light/dark automatically.
const inputCls =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition-colors focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/30';
const cardCls = 'rounded-xl border border-stone-200 bg-white p-5 shadow-xs sm:p-6';
const smallBtnCls =
  'inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer';

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-stone-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        {hint && <span className="text-xs text-stone-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-bold tracking-wider text-stone-900">{index} {'//'}</span>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-700">{title}</h2>
      </div>
      {note && <p className="mt-1 text-xs text-stone-500">{note}</p>}
    </div>
  );
}

export function EditorForm() {
  const theme = useTheme();

  const [markdownValue, setMarkdownValue] = useState<string | undefined>('');
  const [subtitle, setSubtitle] = useState('');
  const [takeaways, setTakeaways] = useState<string[]>(['']);
  const [sources, setSources] = useState<SourceRow[]>([{ title: '', outlet: '', url: '' }]);
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [status, setStatus] = useState<Status>(null);

  /* ---------- images ---------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const availableSlots = MAX_IMAGES - images.length;
    const newImages = files.slice(0, availableSlots).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[indexToRemove].url);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  /* ---------- takeaways ---------- */
  const setTakeaway = (i: number, value: string) =>
    setTakeaways((prev) => prev.map((t, idx) => (idx === i ? value : t)));
  const addTakeaway = () => setTakeaways((prev) => [...prev, '']);
  const removeTakeaway = (i: number) =>
    setTakeaways((prev) => (prev.length === 1 ? [''] : prev.filter((_, idx) => idx !== i)));

  /* ---------- sources ---------- */
  const setSource = (i: number, key: keyof SourceRow, value: string) =>
    setSources((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const addSource = () => setSources((prev) => [...prev, { title: '', outlet: '', url: '' }]);
  const removeSource = (i: number) =>
    setSources((prev) =>
      prev.length === 1 ? [{ title: '', outlet: '', url: '' }] : prev.filter((_, idx) => idx !== i)
    );

  /* ---------- submit ---------- */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const fd = new FormData(e.currentTarget);
    const text = (name: string) => String(fd.get(name) ?? '').trim();

    if (!(markdownValue ?? '').trim()) {
      setStatus({ kind: 'error', message: 'Please write the article body before submitting.' });
      return;
    }

    const cleanTakeaways = takeaways.map((t) => t.trim()).filter(Boolean);

    const filledSources = sources.filter((s) => s.title.trim() || s.outlet.trim() || s.url.trim());
    if (filledSources.some((s) => !s.title.trim() || !s.url.trim())) {
      setStatus({
        kind: 'error',
        message: 'Each source needs a title and a URL. Complete it or remove the row.',
      });
      return;
    }

    const payload = {
      rank: Number(text('rank')),
      category: text('category'),
      title: text('title'),
      subtitle: text('subtitle'),
      author: {
        name: text('authorName'),
        role: text('authorRole'),
        avatar: text('authorAvatar'),
      },
      content: markdownValue ?? '',
      keyTakeaways: cleanTakeaways,
      sources: filledSources.map((s) => ({
        title: s.title.trim(),
        outlet: s.outlet.trim(),
        url: s.url.trim(),
      })),
      images: images.map(({ file }) => file.name),
    };

    console.log('Submitting data:', payload);
    setStatus({
      kind: 'ok',
      message: 'Article validated. Saving to the database is not connected yet, so nothing was stored.',
    });
  };

  return (
    <div className="min-h-screen bg-paper text-stone-900">
      {/* Top bar */}
      <header className="relative z-30 border-b border-stone-200 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
              Weekly Tech Journal
            </div>
            <div className="font-serif text-xl font-bold tracking-tight text-stone-900">Editor</div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form action={logout}>
              <button type="submit" className={smallBtnCls}>
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 01 Story details */}
          <section className={cardCls}>
            <SectionTitle index="01" title="Story details" />
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field label="Rank" htmlFor="rank" required hint="1 = lead story">
                  <select id="rank" name="rank" required defaultValue="" className={inputCls}>
                    <option value="" disabled>
                      Select…
                    </option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        #{String(n).padStart(2, '0')}
                        {n === 1 ? ' · Big story' : ''}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Category" htmlFor="category" required>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      required
                      list="category-suggestions"
                      maxLength={60}
                      className={inputCls}
                      placeholder="e.g. Artificial Intelligence"
                    />
                    <datalist id="category-suggestions">
                      {CATEGORY_SUGGESTIONS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </Field>
                </div>
              </div>

              <Field label="Article title" htmlFor="title" required>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={200}
                  className={inputCls}
                  placeholder="Enter a title"
                />
              </Field>

              <Field
                label="Subtitle"
                htmlFor="subtitle"
                required
                hint={`${subtitle.length}/${SUBTITLE_MAX}`}
              >
                <textarea
                  id="subtitle"
                  name="subtitle"
                  required
                  rows={2}
                  maxLength={SUBTITLE_MAX}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className={`${inputCls} resize-y`}
                  placeholder="One or two sentences shown under the title on the card"
                />
              </Field>
            </div>
          </section>

          {/* 02 Author */}
          <section className={cardCls}>
            <SectionTitle index="02" title="Author" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="authorName" required>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  required
                  maxLength={80}
                  className={inputCls}
                  placeholder="e.g. Marcus Vance"
                />
              </Field>
              <Field label="Role" htmlFor="authorRole">
                <input
                  id="authorRole"
                  name="authorRole"
                  type="text"
                  maxLength={80}
                  className={inputCls}
                  placeholder="e.g. Systems Architecture Lead"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Avatar URL" htmlFor="authorAvatar" hint="Optional">
                  <input
                    id="authorAvatar"
                    name="authorAvatar"
                    type="url"
                    className={inputCls}
                    placeholder="https://…"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* 03 Body */}
          <section className={cardCls}>
            <SectionTitle index="03" title="Body" note="Write in Markdown. The preview updates as you type." />
            <div data-color-mode={theme === 'dark' ? 'dark' : 'light'} className="w-full">
              <MDEditor value={markdownValue} onChange={setMarkdownValue} height={400} />
            </div>
          </section>

          {/* 04 Key takeaways */}
          <section className={cardCls}>
            <SectionTitle
              index="04"
              title="Key takeaways"
              note={`Short bullet points shown at the end of the story (up to ${MAX_TAKEAWAYS}).`}
            />
            <div className="space-y-3">
              {takeaways.map((value, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-center font-mono text-xs text-stone-400">{i + 1}</span>
                  <input
                    type="text"
                    aria-label={`Takeaway ${i + 1}`}
                    value={value}
                    onChange={(e) => setTakeaway(i, e.target.value)}
                    maxLength={240}
                    className={inputCls}
                    placeholder="One clear point readers should remember"
                  />
                  <button
                    type="button"
                    onClick={() => removeTakeaway(i)}
                    aria-label={`Remove takeaway ${i + 1}`}
                    className="shrink-0 rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTakeaway}
              disabled={takeaways.length >= MAX_TAKEAWAYS}
              className={`${smallBtnCls} mt-4`}
            >
              <Plus className="h-3.5 w-3.5" />
              Add takeaway
            </button>
          </section>

          {/* 05 Sources */}
          <section className={cardCls}>
            <SectionTitle
              index="05"
              title="Sources"
              note={`Where the story comes from (up to ${MAX_SOURCES}). Each source needs a title and a URL.`}
            />
            <div className="space-y-4">
              {sources.map((s, i) => (
                <div key={i} className="rounded-lg border border-stone-200 bg-stone-50 p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Source {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSource(i)}
                      aria-label={`Remove source ${i + 1}`}
                      className="rounded-md p-1 text-stone-400 transition-colors hover:text-stone-900 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      aria-label={`Source ${i + 1} title`}
                      value={s.title}
                      onChange={(e) => setSource(i, 'title', e.target.value)}
                      className={inputCls}
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      aria-label={`Source ${i + 1} outlet`}
                      value={s.outlet}
                      onChange={(e) => setSource(i, 'outlet', e.target.value)}
                      className={inputCls}
                      placeholder="Outlet (e.g. IEEE Software)"
                    />
                    <div className="sm:col-span-2">
                      <input
                        type="url"
                        aria-label={`Source ${i + 1} URL`}
                        value={s.url}
                        onChange={(e) => setSource(i, 'url', e.target.value)}
                        className={inputCls}
                        placeholder="https://…"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSource}
              disabled={sources.length >= MAX_SOURCES}
              className={`${smallBtnCls} mt-4`}
            >
              <Plus className="h-3.5 w-3.5" />
              Add source
            </button>
          </section>

          {/* 06 Images */}
          <section className={cardCls}>
            <SectionTitle
              index="06"
              title={`Images (${images.length}/${MAX_IMAGES})`}
              note="The first image is used as the cover."
            />
            <div className="flex flex-wrap gap-4">
              {images.map(({ url }, index) => (
                <div
                  key={url}
                  className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-stone-300 bg-stone-100"
                >
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                    width={160}
                    height={96}
                  />
                  {index === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#fff]">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-xs font-medium text-[#fff] opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <label className="flex h-24 w-40 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-700">
                  <Plus className="h-6 w-6" />
                  <span className="mt-1 text-xs font-medium">Add image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </section>

          {/* Actions */}
          {status && (
            <p
              role={status.kind === 'error' ? 'alert' : 'status'}
              className={`rounded-lg border px-4 py-3 text-sm ${
                status.kind === 'error'
                  ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50 cursor-pointer"
            >
              Preview article
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 cursor-pointer"
            >
              Submit article
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
