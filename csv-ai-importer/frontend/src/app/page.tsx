'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertCircle, Sun, Moon } from 'lucide-react';
import ApiStatus from '@/components/ApiStatus';
import UploadZone from '@/components/UploadZone';
import PreviewTable from '@/components/PreviewTable';
import ResultTable from '@/components/ResultTable';
import SummaryCards from '@/components/SummaryCards';
import LoadingOverlay from '@/components/LoadingOverlay';
import { ImportResult } from '@/types/crm';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [step, setStep] = useState<'upload' | 'preview' | 'results'>('upload');
  const [filename, setFilename] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFileParsed = (data: {
    filename: string;
    headers: string[];
    rows: Record<string, string>[];
    totalRows: number;
  }) => {
    setFilename(data.filename);
    setHeaders(data.headers);
    setRows(data.rows);
    setTotalRows(data.totalRows);
    setError(null);
    setStep('preview');
  };

  const handleConfirmImport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: rows,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process CSV file with AI.');
      }

      setImportResult({
        records: data.records,
        skipped: data.skipped,
        summary: data.summary,
      });

      setStep('results');
    } catch (err: any) {
      console.error('Import Error:', err);
      setError(err.message || 'An error occurred while connecting to the mapping service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFilename('');
    setHeaders([]);
    setRows([]);
    setTotalRows(0);
    setImportResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased pb-20 transition-colors duration-200">
      <div className="relative max-w-6xl mx-auto px-6 pt-16 flex flex-col gap-12">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">GrowEasy CRM</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
              AI-Powered CSV Importer
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-sm md:text-base">
              Upload leads from Facebook, Google Ads, Real Estate, or custom formats. AI maps headers into standard GrowEasy CRM records.
            </p>
          </div>

          {/* Controls: Theme & Status */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <ApiStatus />
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center gap-3 p-5 rounded-2xl border border-rose-200 dark:border-rose-950/30 bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-semibold">Import Error:</span> {error}
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-xs text-rose-500 dark:text-rose-400 hover:underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step Content */}
        <div className="w-full">
          {step === 'upload' && (
            <div className="flex flex-col gap-6 items-center">
              <UploadZone onFileParsed={handleFileParsed} isLoading={isLoading} />
              
              <div className="flex items-center gap-6 mt-8 p-4 rounded-2xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/40 text-xs text-zinc-500 max-w-xl text-center">
                <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>Gemini AI Engine</span>
                </div>
                <span>Automatically cleans dates, formats phone numbers, extracts multiple contacts, and skips invalid entries.</span>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <PreviewTable
              filename={filename}
              headers={headers}
              rows={rows}
              totalRows={totalRows}
              onConfirm={handleConfirmImport}
              onClear={handleReset}
              isLoading={isLoading}
            />
          )}

          {step === 'results' && importResult && (
            <div className="flex flex-col gap-10">
              <SummaryCards summary={importResult.summary} />
              <ResultTable
                records={importResult.records}
                skipped={importResult.skipped}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay for AI mapping */}
      <LoadingOverlay isVisible={isLoading} totalRecords={totalRows} />
    </main>
  );
}
