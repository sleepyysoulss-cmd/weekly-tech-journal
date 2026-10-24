'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EDITIONS } from '@/data/mockEditions';
import { Article, Edition } from '@/types/journal';
import { Header } from '@/components/reader/Header';
import { BentoGrid } from '@/components/reader/BentoGrid';
import { WeeklySummary } from '@/components/reader/WeeklySummary';
import { EditorsNote } from '@/components/reader/EditorsNote';
import { WeeklyArchive } from '@/components/reader/WeeklyArchive';
import { Calendar, Layers, Sparkles } from 'lucide-react';

export default function ReaderPage() {
  const router = useRouter();
  const [currentEdition, setCurrentEdition] = useState<Edition>(EDITIONS[0]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const handleSelectArticle = (article: Article) => {
  router.push(`/articles/${article.id}`);
};

const handleSelectEdition = (edition: Edition) => {
  setCurrentEdition(edition);
};

  return (
    <div className="min-h-screen bg-paper text-stone-900 flex flex-col selection:bg-stone-900 selection:text-white">
      {/* Editorial Header */}
      <Header
        currentEdition={currentEdition}
        onOpenArchive={() => setIsArchiveOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
        {/* Edition Quick Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-l-2 border-stone-900 pl-4 py-1 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">Weekly Tech Journal</span>
            <span>—</span>
            <span>Issue {currentEdition.issueCode} ({currentEdition.dateRange})</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              Published Friday
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-stone-400" />
              5 Curated Stories
            </span>
          </div>
        </div>

        {/* 1. Top 5 Bento Grid */}
        <BentoGrid
          articles={currentEdition.stories}
          onSelectArticle={handleSelectArticle}
        />

        {/* Two-Column Editorial Features: 3. Weekly Summary & 4. Editor's Note */}
        <div className="grid grid-cols-1 gap-8">
          {/* THE WEEK, IN 150 WORDS (PDF requirement #3) */}
          <div>
            <WeeklySummary summary={currentEdition.weeklySummary} />
          </div>

          {/* FROM THE EDITOR (PDF requirement #4) */}
          <div>
            <EditorsNote note={currentEdition.editorsNote} />
          </div>
        </div>

        {/* Bottom Callout & Archive Teaser */}
        <section className="rounded-2xl border border-stone-200 bg-stone-100/70 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Explore More Editions</span>
            </div>
            <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold text-stone-900">
              Missed previous Friday issues?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-stone-600">
              Browse issues #068, #067 and more in the Weekly Archive.
            </p>
          </div>

          <button
            onClick={() => setIsArchiveOpen(true)}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors text-xs sm:text-sm shadow-xs cursor-pointer"
          >
            Browse Past Issues
          </button>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 bg-stone-100/90 py-10 px-4 sm:px-8 text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="font-editorial-display text-lg font-bold text-stone-900">
              WEEKLY TECH JOURNAL
            </span>
            <span className="hidden sm:inline text-stone-300">|</span>
            <span>A curated editorial publication</span>
          </div>

          <div className="text-center sm:text-right font-editorial-serif italic text-stone-600">
            See you next Friday -&gt;
          </div>
        </div>
      </footer>

      
      

      {/* 6. Weekly Archive Drawer */}
      <WeeklyArchive
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        editions={EDITIONS}
        currentEditionId={currentEdition.id}
        onSelectEdition={handleSelectEdition}
      />
    </div>
  );
}
