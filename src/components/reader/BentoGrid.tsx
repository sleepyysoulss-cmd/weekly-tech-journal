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
  const [lead, ...rest] = sorted.slice(0, 5);

  return (
    <section aria-label="Top 5 Weekly Stories" className="w-full">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-5 border-b border-zinc-200 pb-3">
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

      {/*
        Layout: the lead story spans the full width (image beside text on
        desktop). The remaining four sit in an even 2x2 grid. Every card
        stretches to the height of its row, so footers always line up and
        there are no empty gaps.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
        {lead && (
          <div className="sm:col-span-2 flex">
            <ArticleCard article={lead} onClick={onSelectArticle} layoutVariant="lead" />
          </div>
        )}
        {rest.map((story) => (
          <div key={story.id} className="flex">
            <ArticleCard article={story} onClick={onSelectArticle} layoutVariant="compact" />
          </div>
        ))}
      </div>
    </section>
  );
};
