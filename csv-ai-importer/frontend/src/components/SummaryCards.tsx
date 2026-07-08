import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { ImportSummary } from '../types/crm';

interface SummaryCardsProps {
  summary: ImportSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const importRate = summary.totalRecords > 0 
    ? Math.round((summary.importedRecords / summary.totalRecords) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-in">
      {/* Total Processed Card */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Records</span>
          <span className="text-4xl font-extrabold text-zinc-850 dark:text-zinc-100 mt-1">{summary.totalRecords}</span>
          <span className="text-xs text-zinc-450 dark:text-zinc-500 mt-2">Parsed from original CSV</span>
        </div>
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
          <Layers className="w-6 h-6" />
        </div>
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
      </div>

      {/* Successfully Imported Card */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Imported to CRM</span>
          <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{summary.importedRecords}</span>
          <span className="text-xs text-zinc-450 dark:text-zinc-500 mt-2">Mapped by AI ({importRate}% success rate)</span>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
      </div>

      {/* Skipped Records Card */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Skipped / Failed</span>
          <span className="text-4xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{summary.skippedRecords}</span>
          <span className="text-xs text-zinc-450 dark:text-zinc-500 mt-2">Missing required info or batch errors</span>
        </div>
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl">
          <XCircle className="w-6 h-6" />
        </div>
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
      </div>
    </div>
  );
}
