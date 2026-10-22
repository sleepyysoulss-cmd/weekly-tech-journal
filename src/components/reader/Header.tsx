'use client';

import React from 'react';
import { Archive, BookOpen, Compass } from 'lucide-react';
import { Edition } from '@/types/journal';

interface HeaderProps {
  currentEdition: Edition;
  onOpenArchive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentEdition,
  onOpenArchive
}) => {
  return (
    <header className="border-b border-stone-200 bg-[#faf9f6]/95 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="border-b border-stone-200/60 py-2 px-4 sm:px-8 text-[11px] uppercase tracking-wider text-stone-500 font-medium flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>{currentEdition.dateRange}</span>
          <span className="text-stone-300">|</span>
          <span className="font-semibold text-stone-700">Issue {currentEdition.issueCode}</span>
        </div>
        <div className="flex items-center gap-3 text-stone-400">
          <span>Curated Weekly Tech Journal</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-5 sm:py-7 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-stone-500 text-xs font-semibold tracking-widest uppercase">
            <BookOpen className="w-4 h-4 text-stone-700" />
            <span>Weekly Tech Journal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 font-editorial-display leading-none">
            THE WEEK IN TECH <span className="text-stone-400 font-normal">{currentEdition.issueCode}</span>
          </h1>
          <p className="mt-1.5 text-stone-600 text-sm sm:text-base font-editorial-serif italic">
            {currentEdition.headline}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenArchive}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-stone-700 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-all shadow-2xs cursor-pointer"
            aria-label="Browse past editions in the Weekly Archive"
          >
            <Archive className="w-4 h-4 text-stone-500" />
            <span>Weekly Archive</span>
          </button>

          <a
            href="#weekly-summary"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs sm:text-sm font-medium transition-all shadow-xs"
          >
            <Compass className="w-4 h-4 text-stone-300" />
            <span>Summary & Note</span>
          </a>
        </div>
      </div>
    </header>
  );
};