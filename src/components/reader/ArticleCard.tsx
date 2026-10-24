import React from 'react';
import { ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { Article } from '@/types/journal';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  layoutVariant?: 'lead' | 'wide' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onClick,
  layoutVariant = 'compact'
}) => {
  const isLead = layoutVariant === 'lead';
  const isWide = layoutVariant === 'wide';
  const isHorizontal = isLead || isWide;

  return (
    <article
      onClick={() => onClick(article)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(article);
        }
      }}
      tabIndex={0}
      role="button"
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-zinc-400 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 cursor-pointer"
    >
      {/* Top meta */}
      <div className="mb-4 flex shrink-0 items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium text-zinc-500">
          <span className="font-mono text-xs font-bold tracking-wider text-zinc-900">
            #{String(article.rank).padStart(2, '0')}
          </span>
          <span aria-hidden>·</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700">
            {article.category}
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px]">
            <Clock className="h-3 w-3 text-zinc-400" />
            {article.readTime}
          </span>
        </div>
        <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-zinc-300 transition-all group-hover:text-zinc-900 sm:block" />
      </div>

      {/* Main content: grows to fill the card so the footer stays pinned to the bottom */}
      <div
        className={`flex flex-1 flex-col gap-4 pb-5 ${
          isHorizontal ? 'md:flex-row md:items-stretch md:gap-6' : ''
        }`}
      >
        {/* Cover image */}
        <div
          className={`relative shrink-0 overflow-hidden rounded-lg bg-zinc-100 ${
            isHorizontal ? 'aspect-video w-full md:aspect-auto md:min-h-60 md:w-5/12' : 'aspect-video w-full'
          }`}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isLead && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-zinc-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Big Story #01</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className={`flex min-w-0 flex-1 flex-col ${isHorizontal ? 'md:justify-center' : ''}`}>
          <h2
            className={`mb-2 font-serif font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-700 ${
              isLead
                ? 'text-2xl sm:text-3xl line-clamp-4'
                : 'text-lg sm:text-xl line-clamp-3'
            }`}
          >
            {article.title}
          </h2>
          <p
            className={`leading-relaxed text-zinc-600 ${
              isLead ? 'text-sm sm:text-base line-clamp-3' : 'text-sm line-clamp-3'
            }`}
          >
            {article.subtitle}
          </p>
        </div>
      </div>

      {/* Author + date footer, always at the bottom of the card */}
      <div className="mt-auto flex shrink-0 items-center justify-between gap-3 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={article.author.avatar}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
          <span className="truncate font-medium text-zinc-800">{article.author.name}</span>
        </div>
        <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-zinc-400">
          {article.publishedDate}
        </span>
      </div>
    </article>
  );
};
