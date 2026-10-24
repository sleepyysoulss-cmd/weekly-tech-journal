
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  Share2,
  Check,
} from 'lucide-react';
import { EDITIONS } from '@/data/mockEditions';


export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const allArticles = EDITIONS.flatMap((edition) => edition.stories);
  const article = allArticles.find((story) => story.id === params.id);

  if (!article) {
    return (
      <main className="min-h-screen bg-paper px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">
          Article not found
        </h1>
        <p className="mt-3 text-zinc-600">
          This story may have moved or the link may be incorrect.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 rounded-full bg-zinc-900 px-5 py-3 text-sm text-white"
        >
          Back to the journal
        </button>
      </main>
    );
  }

  const currentIndex = allArticles.findIndex(
    (story) => story.id === article.id
  );

  const previousArticle =
    currentIndex > 0 ? allArticles[currentIndex - 1] : null;

  const nextArticle =
    currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this article link:', window.location.href);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to journal
          </button>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {copied ? 'Link copied!' : 'Share article'}
            </button>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <span>#{String(article.rank).padStart(2, '0')}</span>
          <span>·</span>
          <span>{article.category}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {article.title}
        </h1>

        <p className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-lg">
          {article.subtitle}
        </p>

        <div className="mt-8 flex items-center gap-3 border-y border-zinc-200 py-5">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{article.author.name}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {article.author.role} · {article.publishedDate}
            </p>
          </div>
        </div>

        <img
          src={article.coverImage}
          alt={article.title}
          className="mt-8 max-h-[460px] w-full rounded-xl object-cover"
        />

        {article.fullContent.keyTakeaways.length > 0 && (
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold">
              Key takeaways
            </h2>
            <ul className="mt-4 space-y-3">
              {article.fullContent.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex gap-3 text-sm leading-relaxed text-zinc-700">
                  <span className="font-bold text-zinc-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.fullContent.quote && (
          <blockquote className="my-10 border-l-2 border-zinc-400 pl-5">
            <p className="font-serif text-xl italic leading-relaxed text-zinc-800">
              “{article.fullContent.quote.text}”
            </p>
            <cite className="mt-3 block text-sm not-italic text-zinc-500">
              — {article.fullContent.quote.attribution}
            </cite>
          </blockquote>
        )}

        <div className="mt-10 space-y-6">
          {article.fullContent.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-8 text-zinc-700"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {article.fullContent.sources.length > 0 && (
          <section className="mt-12 border-t border-zinc-200 pt-8">
            <h2 className="font-serif text-xl font-bold">
              Sources & further reading
            </h2>
            <ul className="mt-4 space-y-3">
              {article.fullContent.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-400"
                  >
                    <span>
                      <span className="block text-sm font-medium text-zinc-900">
                        {source.title}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {source.outlet}
                      </span>
                    </span>
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="mt-12 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-8 sm:grid-cols-2">
          {previousArticle ? (
            <button
              onClick={() => router.push(`/articles/${previousArticle.id}`)}
              className="rounded-xl border border-zinc-200 bg-white p-5 text-left hover:border-zinc-400"
            >
              <span className="flex items-center gap-2 text-xs text-zinc-500">
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous story
              </span>
              <span className="mt-2 block text-sm font-semibold">
                {previousArticle.title}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextArticle && (
            <button
              onClick={() => router.push(`/articles/${nextArticle.id}`)}
              className="rounded-xl border border-zinc-200 bg-white p-5 text-left hover:border-zinc-400 sm:text-right"
            >
              <span className="flex items-center gap-2 text-xs text-zinc-500 sm:justify-end">
                Next story
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-2 block text-sm font-semibold">
                {nextArticle.title}
              </span>
            </button>
          )}
        </nav>
      </article>
    </main>
  );
}
