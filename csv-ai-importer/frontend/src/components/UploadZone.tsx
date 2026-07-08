'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

interface UploadZoneProps {
  onFileParsed: (data: {
    filename: string;
    headers: string[];
    rows: Record<string, string>[];
    totalRows: number;
  }) => void;
  isLoading: boolean;
}

export default function UploadZone({ onFileParsed, isLoading }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);

    // Basic validation
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file (.csv extension).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size allowed is 10MB.');
      return;
    }

    const rowsAccumulator: Record<string, string>[] = [];
    let headers: string[] = [];

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      chunkSize: 1024 * 128, // 128KB chunks for incremental streaming
      chunk: (results) => {
        if (results.data && results.data.length > 0) {
          rowsAccumulator.push(...results.data);
        }
        if (headers.length === 0 && results.meta.fields) {
          headers = results.meta.fields;
        }
      },
      complete: () => {
        if (rowsAccumulator.length === 0) {
          setError('The uploaded CSV file is empty.');
          return;
        }

        onFileParsed({
          filename: file.name,
          headers: headers,
          rows: rowsAccumulator,
          totalRows: rowsAccumulator.length,
        });
      },
      error: (err) => {
        setError(`Failed to parse CSV file: ${err.message}`);
      },
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-lg dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={`p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-4 transition-transform duration-300 ${isDragActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
            <Upload className="w-8 h-8" />
          </div>
          <p className="mb-2 text-lg font-medium text-zinc-700 dark:text-zinc-200">
            Drag & drop your CSV file here, or{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">browse</span>
          </p>
          <p className="text-xs text-zinc-500 mb-1">
            Supports Facebook Ads, Google Ads, agency reports, and custom sheets
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-650">CSV file format up to 10MB</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 p-4 rounded-xl border border-rose-200 dark:border-rose-950/30 bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
