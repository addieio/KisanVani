'use client';

import React, { useEffect, useState } from 'react';
import { subscribeToCaptions, SpokenCaptionEvent } from '@/lib/speech';
import { Volume2, X } from 'lucide-react';

export function SpeechCaptions() {
  const [currentCaption, setCurrentCaption] = useState<SpokenCaptionEvent | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCaptions((event) => {
      setCurrentCaption(event);
      const timer = setTimeout(() => {
        setCurrentCaption((prev) => (prev?.timestamp === event.timestamp ? null : prev));
      }, 7000);
      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  if (!currentCaption) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-[#132A1C]/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl flex-shrink-0 animate-pulse">
          <Volume2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
            आवाज विवरण (Spoken Audio Caption)
          </div>
          <p className="text-sm font-medium leading-snug line-clamp-2 text-emerald-50">
            {currentCaption.text}
          </p>
        </div>
        <button
          onClick={() => setCurrentCaption(null)}
          className="text-gray-400 hover:text-white p-1 rounded-lg"
          aria-label="Dismiss caption"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
