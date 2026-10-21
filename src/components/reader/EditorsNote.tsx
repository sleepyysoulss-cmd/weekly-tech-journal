import React from 'react';
import { PenTool, ArrowRight } from 'lucide-react';
import { Edition } from '@/types/journal';

interface EditorsNoteProps {
  note: Edition['editorsNote'];
}

export const EditorsNote: React.FC<EditorsNoteProps> = ({ note }) => {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-10 shadow-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-white">
            <PenTool className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900">
            {note.title}
          </h2>
        </div>
      </div>

      <p className="font-serif text-base sm:text-lg text-zinc-800 leading-relaxed">
        {note.content}
      </p>

      <div className="mt-8 pt-5 border-t border-zinc-200 flex items-center justify-between">
        <div>
          <div className="font-bold text-zinc-900 text-sm">{note.editorName}</div>
          <div className="text-xs text-zinc-500">{note.editorRole}</div>
        </div>
        <div className="inline-flex items-center gap-1 font-mono text-sm font-bold text-zinc-900">
          <span>{note.signOff}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
};