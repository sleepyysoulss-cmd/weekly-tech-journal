import React from 'react';
import { Article } from '@/types/journal';
import { ArticleCard } from './ArticleCard';

interface BentoGridProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  articles,
  onSelectArticle
}) => {
  const sorted = [...articles].sort((a, b) => a.rank - b.rank);
  const story1 = sorted.find((a) => a.rank === 1) || sorted[0];
  const story2 = sorted.find((a) => a.rank === 2) || sorted[1];
  const story3 = sorted.find((a) => a.rank === 3) || sorted[2];
  const story4 = sorted.find((a) => a.rank === 4) || sorted[3];
  const story5 = sorted.find((a) => a.rank === 5) || sorted[4];

  return (
    <section aria-label="Top 5 Weekly Stories Bento Grid" className="w-full">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-900">
            Section 01 //
          </span>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase">
            Top 5 Stories
          </h2>
        </div>
        <span className="text-xs text-zinc-500 italic">
          Click any card to read the full story
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-fr">
        {story1 && (
          <div className="sm:col-span-2 flex">
            <ArticleCard article={story1} onClick={onSelectArticle} layoutVariant="lead" />
          </div>
        )}
        {story2 && (
          <div className="flex">
            <ArticleCard article={story2} onClick={onSelectArticle} layoutVariant="compact" />
          </div>
        )}
        {[story3, story4, story5].map(
          (s) =>
            s && (
              <div key={s.id} className="flex">
                <ArticleCard article={s} onClick={onSelectArticle} layoutVariant="compact" />
              </div>
            )
        )}
      </div>
    </section>
  );
};