'use client';

import React from 'react';
import { Play, Trash2, FileSpreadsheet } from 'lucide-react';

interface PreviewTableProps {
  filename: string;
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  onConfirm: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function PreviewTable({
  filename,
  headers,
  rows,
  totalRows,
  onConfirm,
  onClear,
  isLoading
}: PreviewTableProps) {
  // Limit to show first 10 rows for preview
  const displayRows = rows.slice(0, 10);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* File info card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{filename}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {totalRows} records found • Previewing first {displayRows.length} rows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors disabled:opacity-50 text-sm font-medium cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-[0_4px_14px_rgba(99,102,241,0.3)] dark:shadow-[0_4px_14px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Confirm & Import with AI
          </button>
        </div>
      </div>

      {/* CSV Preview table container */}
      <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-md dark:shadow-2xl">
        <div className="max-h-[450px] overflow-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 sticky top-0 left-0 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800/80 z-20 w-16 text-center">
                  #
                </th>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="p-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-10 whitespace-nowrap min-w-[150px]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
              {displayRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                  <td className="p-4 text-xs font-medium text-zinc-400 dark:text-zinc-650 border-r border-zinc-200 dark:border-zinc-800/80 sticky left-0 bg-white dark:bg-zinc-950 group-hover:bg-zinc-50/50 dark:group-hover:bg-zinc-900/30 text-center z-10">
                    {rowIndex + 1}
                  </td>
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="p-4 text-sm text-zinc-700 dark:text-zinc-300 font-medium whitespace-nowrap max-w-[300px] overflow-hidden text-ellipsis"
                    >
                      {row[header] || <span className="text-zinc-400 dark:text-zinc-650 italic">empty</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
