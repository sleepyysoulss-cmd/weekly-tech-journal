'use client';

import React, { useEffect, useState } from 'react';
import { X, Clock, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, Share2, Check } from 'lucide-react';
import { Article } from '@/types/journal';

interface ArticleSlidePanelProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
  allArticles: Article[];
}

export const ArticleSlidePanel: React.FC<ArticleSlidePanelProps> = ({
  article,
  isOpen,
  onClose,
  onSelectArticle,
  allArticles
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!article) return null;

  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-zinc-900/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-full sm:max-w-2xl lg:max-w-3xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-3.5 backdrop-blur-md">
          <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
            STORY #{String(article.rank).padStart(2, '0')} · {article.category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 rounded flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
          <div className="text-xs text-zinc-500 flex items-center gap-2 mb-2">
            <span>{article.publishedDate}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 leading-tight">
            {article.title}
          </h1>
          <p className="mt-2 text-zinc-600 italic border-l-2 border-zinc-300 pl-3">
            {article.subtitle}
          </p>

          <div className="my-5 flex items-center gap-3 border-y border-zinc-200 py-3">
            <img src={article.author.avatar} alt={article.author.name} className="h-9 w-9 rounded-full object-cover" />
            <div>
              <div className="text-sm font-semibold text-zinc-900">{article.author.name}</div>
              <div className="text-xs text-zinc-500">{article.author.role}</div>
            </div>
          </div>

          <img src={article.coverImage} alt={article.title} className="mb-6 rounded-xl w-full h-64 object-cover" />

          {article.fullContent.keyTakeaways?.length > 0 && (
            <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                Key Takeaways
              </div>
              <ul className="space-y-2">
                {article.fullContent.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4 text-zinc-800 text-base leading-relaxed">
            {article.fullContent.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {article.fullContent.sources?.length > 0 && (
            <div className="mt-8 border-t border-zinc-200 pt-4">
              <div className="text-xs font-bold uppercase text-zinc-900 mb-2">Sources</div>
              {article.fullContent.sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded border border-zinc-200 hover:bg-zinc-50 text-xs mb-1.5">
                  <span className="font-medium text-zinc-800">{s.title} ({s.outlet})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-5 py-3 flex items-center justify-between text-xs">
          {prev ? (
            <button onClick={() => onSelectArticle(prev)} className="flex items-center gap-1 font-medium text-zinc-700 hover:text-zinc-900">
              <ChevronLeft className="w-4 h-4" /> Story #{prev.rank}
            </button>
          ) : <span className="text-zinc-400">First story</span>}

          <button onClick={onClose} className="font-semibold text-zinc-600 hover:text-zinc-900 uppercase">
            Close
          </button>

          {next ? (
            <button onClick={() => onSelectArticle(next)} className="flex items-center gap-1 font-medium text-zinc-700 hover:text-zinc-900">
              Story #{next.rank} <ChevronRight className="w-4 h-4" />
            </button>
          ) : <span className="text-zinc-400">End of Top 5</span>}
        </div>
      </aside>
    </>
  );
};