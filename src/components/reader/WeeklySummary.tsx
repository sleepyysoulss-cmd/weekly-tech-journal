import React from 'react';
import { Layers } from 'lucide-react';
import { Edition } from '@/types/journal';

interface WeeklySummaryProps {
  summary: Edition['weeklySummary'];
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ summary }) => {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              Editorial Synthesis
            </span>
            <h2 className="text-2xl font-serif font-bold text-zinc-900">
              {summary.title}
            </h2>
          </div>
        </div>
        <span className="text-xs font-mono text-zinc-500">{summary.wordCount} words</span>
      </div>

      <p className="font-serif text-lg text-zinc-800 leading-relaxed">
        {summary.narrative}
      </p>
    </section>
  );
};