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

  return (
    <article
      onClick={() => onClick(article)}
      tabIndex={0}
      role="button"
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-zinc-400 hover:shadow-lg cursor-pointer w-full ${
        isLead ? 'h-full justify-between' : ''
      }`}
    >
      {/* Top Meta */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500 font-medium min-w-0">
          <span className="font-mono text-xs font-bold text-zinc-900 tracking-wider">
            #{String(article.rank).padStart(2, '0')}
          </span>
          <span>·</span>
          <span className="uppercase tracking-wider text-[11px] font-semibold text-zinc-700 whitespace-nowrap">
            {article.category}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 text-[11px] whitespace-nowrap shrink-0">
            <Clock className="w-3 h-3 text-zinc-400" />
            {article.readTime}
          </span>
        </div>
        <ArrowUpRight className="hidden sm:block shrink-0 w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-all" />
      </div>

      {/* Main Content Area */}
      <div className={`flex flex-col pb-5 ${isLead ? 'flex-1 justify-between gap-5' : 'gap-3'} ${isWide ? 'md:flex-row md:gap-6 md:items-center' : ''}`}>
        {/* Cover Image (400px on Lead story fills the 2-row height naturally) */}
        <div
          className={`relative overflow-hidden rounded-lg bg-zinc-100 shrink-0 ${
            isLead
              ? 'w-full h-56 sm:h-64'
              : isWide
              ? 'w-full md:w-5/12 h-44 mb-2 md:mb-0'
              : 'w-full h-28 mb-1'
          }`}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isLead && (
            <div className="absolute top-3 left-3 bg-zinc-950/85 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Big Story #01</span>
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="flex flex-col justify-start">
          <h2
            className={`font-serif font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700 leading-snug ${
              isLead
                ? 'text-2xl sm:text-3xl mb-2.5'
                : isWide
                ? 'text-xl sm:text-2xl mb-1'
                : 'text-lg sm:text-xl mb-1'
            }`}
          >
            {article.title}
          </h2>
          <p
            className={`text-zinc-600 leading-relaxed ${
              isLead ? 'text-sm sm:text-base line-clamp-3 sm:line-clamp-4' : 'text-xs sm:text-sm line-clamp-2'
            }`}
          >
            {article.subtitle}
          </p>
        </div>
      </div>

      {/* Author and Date Footer */}
      <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 shrink-0">
        <div className="flex items-center gap-2">
          <img src={article.author.avatar} alt={article.author.name} className="w-5 h-5 rounded-full object-cover" />
          <span className="font-medium text-zinc-800 whitespace-nowrap">{article.author.name}</span>
          <span className="hidden">({article.author.role})</span>
        </div>
        <span className="font-mono text-[11px] text-zinc-400 whitespace-nowrap shrink-0">{article.publishedDate}</span>
      </div>
    </article>
  );
};