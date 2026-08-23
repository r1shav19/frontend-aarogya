import React, { useState } from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { 
  FileText, 
  ShieldAlert, 
  Eye, 
  Lock, 
  Network, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2,
  Terminal
} from 'lucide-react';

export const AuditLedger = () => {
  const { auditLogs } = useAarogya();
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const q = searchQuery.toLowerCase();
    const matchesQuery = searchQuery === '' ||
      log.doctorName?.toLowerCase().includes(q) ||
      log.doctorHospital?.toLowerCase().includes(q) ||
      log.patientName?.toLowerCase().includes(q) ||
      log.patientAbha?.toLowerCase().includes(q) ||
      log.justification?.toLowerCase().includes(q);

    return matchesAction && matchesQuery;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Doctor Name', 'Doctor Hospital', 'Action', 'Severity', 'Patient Name', 'ABHA ID', 'Justification', 'IP Address'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      `"${l.doctorName}"`,
      `"${l.doctorHospital}"`,
      l.action,
      l.severity,
      `"${l.patientName}"`,
      l.patientAbha,
      `"${l.justification.replace(/"/g, '""')}"`,
      l.ipAddress || '10.204.18.42'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AarogyaNet_Audit_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Immutable Security Audit Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed audit log tracking every patient record view, break-glass override, and consent update
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Action Filter */}
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Event Type:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Events ({auditLogs.length})</option>
              <option value="EMERGENCY_BREAK_GLASS" className="bg-slate-900">🚨 Break-Glass Overrides</option>
              <option value="EHR_VIEW" className="bg-slate-900">👁️ Standard EHR Views</option>
              <option value="CONSENT_UPDATE" className="bg-slate-900">🔒 Consent Policy Changes</option>
              <option value="INTER_HOSPITAL_REFERRAL" className="bg-slate-900">🌐 Inter-Hospital Referrals</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp (IST)</th>
                <th className="py-3.5 px-4">Action / Event</th>
                <th className="py-3.5 px-4">Doctor & Credential</th>
                <th className="py-3.5 px-4">Patient & ABHA ID</th>
                <th className="py-3.5 px-4">Clinical Justification & Audit Trail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLogs.map((log) => {
                const isBreakGlass = log.action === 'EMERGENCY_BREAK_GLASS';
                const isConsent = log.action === 'CONSENT_UPDATE';
                const isReferral = log.action === 'INTER_HOSPITAL_REFERRAL';

                let actionBadge = 'bg-cyan-950 text-cyan-300 border-cyan-500/30';
                let icon = <Eye className="w-3.5 h-3.5 text-cyan-400" />;

                if (isBreakGlass) {
                  actionBadge = 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse';
                  icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
                } else if (isConsent) {
                  actionBadge = 'bg-amber-950 text-amber-300 border-amber-500/30';
                  icon = <Lock className="w-3.5 h-3.5 text-amber-400" />;
                } else if (isReferral) {
                  actionBadge = 'bg-indigo-950 text-indigo-300 border-indigo-500/30';
                  icon = <Network className="w-3.5 h-3.5 text-indigo-400" />;
                }

                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-cyan-400 text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${actionBadge}`}>
                        {icon}
                        <span>{log.action.replace(/_/g, ' ')}</span>
                      </span>
                    </td>

                    {/* Doctor Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{log.doctorName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-cyan-400" />
                        <span>{log.doctorHospital}</span>
                      </div>
                    </td>

                    {/* Patient Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{log.patientName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">
                        ABHA: {log.patientAbha}
                      </div>
                    </td>

                    {/* Justification */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono text-[11px]">
                        {log.justification}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
