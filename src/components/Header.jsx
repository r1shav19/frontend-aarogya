import React, { useState, useEffect } from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { Search, RefreshCw, Radio, Bell, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const Header = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    dataSource, 
    loading, 
    refreshData, 
    auditLogs, 
    referrals, 
    patients 
  } = useAarogya();

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = patients.filter(p => p.riskLevel === 'Critical').length;
  const breakGlassCount = auditLogs.filter(l => l.action === 'EMERGENCY_BREAK_GLASS').length;

  return (
    <header className="h-16 glass-panel border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Search Input */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search ABHA ID, Patient, Doctor, or Hospital..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Center Ticker / Telemetry Bar */}
      <div className="hidden lg:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Railway API:</span>
          <span className="font-semibold text-emerald-400">Connected</span>
        </div>

        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-bold font-mono">{criticalCount} Critical Patients</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Live IST Clock */}
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr || '19:45:00 IST'}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshData}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition-all disabled:opacity-50"
          title="Refresh Live Railway Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>
    </header>
  );
};
