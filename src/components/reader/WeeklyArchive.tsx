'use client';

import React from 'react';
import { X, Calendar, ArrowRight, Check, BookOpen } from 'lucide-react';
import { Edition } from '@/types/journal';

interface WeeklyArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  editions: Edition[];
  currentEditionId: string;
  onSelectEdition: (edition: Edition) => void;
}

export const WeeklyArchive: React.FC<WeeklyArchiveProps> = ({
  isOpen,
  onClose,
  editions,
  currentEditionId,
  onSelectEdition
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Weekly Archive"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full sm:max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-stone-800" />
            <div>
              <h2 className="text-base font-bold text-stone-900 font-editorial-display sm:text-lg">
                Weekly Archive
              </h2>
              <p className="text-xs text-stone-500">
                Browse and read all previous weekly editions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition-colors cursor-pointer"
            aria-label="Close Weekly Archive"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {editions.map((edition) => {
            const isSelected = edition.id === currentEditionId;
            const leadStory = edition.stories.find((s) => s.rank === 1) || edition.stories[0];

            return (
              <div
                key={edition.id}
                onClick={() => {
                  onSelectEdition(edition);
                  onClose();
                }}
                className={`group cursor-pointer rounded-xl border p-5 transition-all ${
                  isSelected
                    ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50/40 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900">
                      Issue {edition.issueCode}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {edition.dateRange}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-900 bg-stone-200/70 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3 text-stone-900" />
                      Active
                    </span>
                  )}
                </div>

                <h3 className="font-editorial-serif text-lg font-bold text-stone-900 group-hover:text-stone-800 transition-colors leading-snug">
                  Lead: {leadStory.title}
                </h3>

                <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {edition.weeklySummary.narrative}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>5 Curated Stories · 150-word synthesis</span>
                  <div className="inline-flex items-center gap-1 font-medium text-stone-900 group-hover:translate-x-1 transition-transform">
                    <span>{isSelected ? 'Currently viewing' : 'Open edition'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3.5 text-xs text-stone-500 flex items-center justify-between">
          <span>{editions.length} editions available</span>
          <span className="font-mono text-stone-400">Published every Friday</span>
        </div>
      </div>
    </>
  );
};