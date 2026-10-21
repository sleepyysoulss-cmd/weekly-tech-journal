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
          Click any card to slide out full report
        </span>
      </div>

      {/* Bento Grid based on PDF Page 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 auto-rows-fr">
        {/* BIG STORY #1: lg:col-span-2 lg:row-span-2 */}
        {story1 && (
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 flex">
            <ArticleCard
              article={story1}
              onClick={onSelectArticle}
              layoutVariant="lead"
            />
          </div>
        )}

        {/* STORY #2: lg:col-span-1 lg:row-span-1 */}
        {story2 && (
          <div className="md:col-span-1 lg:col-span-1 lg:row-span-1 flex">
            <ArticleCard
              article={story2}
              onClick={onSelectArticle}
              layoutVariant="compact"
            />
          </div>
        )}

        {/* STORY #3: lg:col-span-1 lg:row-span-1 */}
        {story3 && (
          <div className="md:col-span-1 lg:col-span-1 lg:row-span-1 flex">
            <ArticleCard
              article={story3}
              onClick={onSelectArticle}
              layoutVariant="compact"
            />
          </div>
        )}

        {/* STORY #4: md:col-span-1 lg:col-span-2 lg:row-span-1 */}
        {story4 && (
          <div className="md:col-span-1 lg:col-span-2 lg:row-span-1 flex">
            <ArticleCard
              article={story4}
              onClick={onSelectArticle}
              layoutVariant="wide"
            />
          </div>
        )}

        {/* STORY #5: md:col-span-2 lg:col-span-1 lg:row-span-1 */}
        {story5 && (
          <div className="md:col-span-2 lg:col-span-1 lg:row-span-1 flex">
            <ArticleCard
              article={story5}
              onClick={onSelectArticle}
              layoutVariant="compact"
            />
          </div>
        )}
      </div>
    </section>
  );
};