'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Eye, ArrowLeft, RefreshCw } from 'lucide-react';
import { CRMRecord, ImportResult } from '../types/crm';

interface ResultTableProps {
  records: CRMRecord[];
  skipped: ImportResult['skipped'];
  onReset: () => void;
}

export default function ResultTable({ records, skipped, onReset }: ResultTableProps) {
  const [activeTab, setActiveTab] = useState<'imported' | 'skipped'>('imported');
  const [selectedRawRecord, setSelectedRawRecord] = useState<Record<string, string> | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GOOD_LEAD_FOLLOW_UP':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            Good Follow-Up
          </span>
        );
      case 'SALE_DONE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
            Sale Done
          </span>
        );
      case 'DID_NOT_CONNECT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            Did Not Connect
          </span>
        );
      case 'BAD_LEAD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            Bad Lead
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-550 border border-zinc-200 dark:border-zinc-700/50">
            Not Set
          </span>
        );
    }
  };

  const getSourceBadge = (source: string) => {
    if (!source) return <span className="text-zinc-400 dark:text-zinc-600">-</span>;
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50">
        {source.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Header and Reset Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex bg-zinc-150 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('imported')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'imported'
                ? 'bg-white dark:bg-zinc-850 text-zinc-900 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-450 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Imported Leads ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('skipped')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'skipped'
                ? 'bg-white dark:bg-zinc-850 text-zinc-900 dark:text-rose-450 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-450 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Skipped Leads ({skipped.length})
          </button>
        </div>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all text-sm font-medium cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Import Another File
        </button>
      </div>

      {activeTab === 'imported' ? (
        /* IMPORTED LEADS TABLE */
        records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-250 dark:border-zinc-850 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10">
            <CheckCircle2 className="w-12 h-12 text-zinc-400 dark:text-zinc-700 mb-4" />
            <h4 className="text-lg font-semibold text-zinc-400 dark:text-zinc-500">No leads imported</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-600 mt-1">All records were skipped or failed parsing.</p>
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm dark:shadow-2xl">
            <div className="max-h-[500px] overflow-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-850">
                    <th className="p-4 text-xs font-semibold text-zinc-500 sticky top-0 left-0 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-850 z-20 w-12 text-center">#</th>
                    <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 min-w-[140px]">Name</th>
                    <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 min-w-[180px]">Email</th>
                    <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 min-w-[120px]">Phone</th>
                    <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 min-w-[130px]">Company</th>
                    <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 min-w-[150px]">Status</th>
                    <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 min-w-[130px]">Source</th>
                    <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 min-w-[200px]">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
                  {records.map((record, index) => (
                    <tr key={index} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                      <td className="p-4 text-xs text-zinc-400 dark:text-zinc-600 border-r border-zinc-200 dark:border-zinc-900 sticky left-0 bg-white dark:bg-zinc-950 group-hover:bg-zinc-50/50 dark:group-hover:bg-zinc-900/30 text-center z-10">
                        {index + 1}
                      </td>
                      <td className="p-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{record.name}</td>
                      <td className="p-4 text-sm text-zinc-650 dark:text-zinc-300 whitespace-nowrap select-all">{record.email || <span className="text-zinc-400 dark:text-zinc-700 italic">none</span>}</td>
                      <td className="p-4 text-sm text-zinc-650 dark:text-zinc-300 whitespace-nowrap">
                        {record.country_code && <span className="text-zinc-400 dark:text-zinc-500 mr-1">{record.country_code}</span>}
                        {record.mobile_without_country_code || <span className="text-zinc-400 dark:text-zinc-700 italic">none</span>}
                      </td>
                      <td className="p-4 text-sm text-zinc-650 dark:text-zinc-300 whitespace-nowrap">{record.company || <span className="text-zinc-400 dark:text-zinc-700 italic">-</span>}</td>
                      <td className="p-4 text-sm">{getStatusBadge(record.crm_status || '')}</td>
                      <td className="p-4 text-sm">{getSourceBadge(record.data_source || '')}</td>
                      <td className="p-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap" title={record.crm_note}>
                        {record.crm_note || <span className="text-zinc-300 dark:text-zinc-750">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* SKIPPED LEADS TABLE */
        skipped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-250 dark:border-zinc-850 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
            <h4 className="text-lg font-semibold text-zinc-700 dark:text-zinc-400">Zero skipped records</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-600 mt-1">Hooray! 100% of lead data successfully mapped.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
            {/* Main Skipped List */}
            <div className="flex-1 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm dark:shadow-2xl">
              <div className="max-h-[500px] overflow-auto relative">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-850">
                      <th className="p-4 text-xs font-semibold text-zinc-500 sticky top-0 left-0 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-850 z-20 w-16 text-center">Row</th>
                      <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10">Reason</th>
                      <th className="p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-250 dark:border-zinc-850 z-10 text-right w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
                    {skipped.map((skip, index) => (
                      <tr key={index} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                        <td className="p-4 text-sm text-zinc-500 border-r border-zinc-200 dark:border-zinc-900 font-semibold sticky left-0 bg-white dark:bg-zinc-950 group-hover:bg-zinc-50/50 dark:group-hover:bg-zinc-900/30 text-center z-10">
                          {skip.rowNumber}
                        </td>
                        <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                            <span>{skip.reason}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedRawRecord(skip.rawRecord)}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                            title="Inspect Raw Data"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Raw Inspector (Conditional) */}
            {selectedRawRecord && (
              <div className="w-full lg:w-[350px] flex flex-col p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-slide-in gap-4 sticky top-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-3">
                  <h4 className="font-semibold text-zinc-700 dark:text-zinc-200 text-sm">Raw Record Data</h4>
                  <button
                    onClick={() => setSelectedRawRecord(null)}
                    className="text-xs text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Hide
                  </button>
                </div>
                <div className="text-xs font-mono overflow-auto max-h-[300px] p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-zinc-600 dark:text-zinc-400">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(selectedRawRecord, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
