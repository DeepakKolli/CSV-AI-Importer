import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Simple component that checks backend health and displays status with optional latency.
const ApiStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      const start = Date.now();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/health`);
        const elapsed = Date.now() - start;
        setLatency(elapsed);
        if (response.ok) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
          const data = await response.json();
          setErrorMsg(data.error || 'Backend unavailable');
        }
      } catch (err: any) {
        setIsConnected(false);
        setErrorMsg(err.message || 'Network error');
        setLatency(null);
      }
    };
    checkHealth();
  }, []);

  const renderContent = () => {
    if (isConnected === null) {
      return (
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Loader2 className="w-3 h-3 animate-spin" /> Connecting...
        </div>
      );
    }
    if (isConnected) {
      return (
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <CheckCircle className="w-3 h-3 text-emerald-500" />
          API Connected{latency !== null ? ` (${latency}ms)` : ''}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-3 h-3" />
        API Error: {errorMsg || 'Unavailable'}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {renderContent()}
    </div>
  );
};

export default ApiStatus;
