'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  totalRecords: number;
}

const PROGRESS_MESSAGES = [
  'Uploading CSV data structure...',
  'Parsing column headers...',
  'Analyzing custom schema matching...',
  'Initializing Gemini AI mapping engine...',
  'Processing batch 1 of lead records...',
  'Running AI fuzzy name and phone matching...',
  'Extracting primary emails and secondary mobile numbers...',
  'Resolving date formats and timestamps...',
  'Mapping status fields to standard GrowEasy schema...',
  'Filtering out invalid records...',
  'Polishing output JSON structure...',
  'Finalizing lead batch integration...'
];

export default function LoadingOverlay({ isVisible, totalRecords }: LoadingOverlayProps) {
  const [messageIdx, setMessageIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgressPercent(0);
      setMessageIdx(0);
      return;
    }

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 2800);

    // Simulate progress percentage (slowing down as it reaches 90% until finished)
    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 30) return prev + Math.floor(Math.random() * 8) + 2;
        if (prev < 60) return prev + Math.floor(Math.random() * 4) + 1;
        if (prev < 92) return prev + Math.floor(Math.random() * 2) + 0.5;
        return prev; // Hold at 92-93% until backend completes and overlay closes
      });
    }, 1500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/40 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in px-4">
      <div className="flex flex-col items-center text-center max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl dark:shadow-2xl">
        {/* Animated Loader */}
        <div className="relative mb-6">
          <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-5050/10 dark:text-indigo-400 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 bg-indigo-500/10 blur-xl rounded-full animate-pulse" />
        </div>

        {/* Progress Percent */}
        <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
          {Math.floor(progressPercent)}%
        </span>

        {/* Message */}
        <p className="text-zinc-850 dark:text-zinc-200 font-semibold mt-4 text-base transition-all duration-300">
          {PROGRESS_MESSAGES[messageIdx]}
        </p>

        {/* Dynamic Details */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          Processing {totalRecords} records through Gemini LLM mapping. This may take up to a minute depending on batch size.
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-950 h-1.5 rounded-full overflow-hidden mt-6 border border-zinc-200 dark:border-zinc-850">
          <div 
            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.2)] dark:shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
