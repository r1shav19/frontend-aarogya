import React from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { Building2, Stethoscope, Users, ShieldAlert, AlertTriangle, Network, TrendingUp, Sparkles } from 'lucide-react';

export const KPICards = () => {
  const { hospitals, doctors, patients, auditLogs, referrals } = useAarogya();

  const breakGlassCount = auditLogs.filter(l => l.action === 'EMERGENCY_BREAK_GLASS').length;
  const criticalCount = patients.filter(p => p.riskLevel === 'Critical').length;
  const activeReferralsCount = referrals.filter(r => r.status !== 'ADMITTED').length;

  const kpiData = [
    {
      title: 'Connected Hospitals',
      value: hospitals.length || 10,
      subtext: '100% NABH & ABDM Synchronized',
      icon: Building2,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      badge: '10 Live',
    },
    {
      title: 'Verified Network Doctors',
      value: doctors.length || 30,
      subtext: 'NMC Registered Specialists',
      icon: Stethoscope,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'Active Duty',
    },
    {
      title: 'Monitored EHR Patients',
      value: patients.length || 100,
      subtext: '360° Universal Health Records',
      icon: Users,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
      badge: '100 Enriched',
    },
    {
      title: 'Break-Glass Overrides',
      value: breakGlassCount,
      subtext: 'Immutable Audit Trail Logged',
      icon: ShieldAlert,
      color: 'from-rose-500/25 to-red-500/15 border-rose-500/40 text-rose-400',
      badge: `${breakGlassCount} Events`,
      glow: true,
    },
    {
      title: 'Critical Risk Patients',
      value: criticalCount,
      subtext: 'AI Stratified (SpO2/ECG Flags)',
      icon: AlertTriangle,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      badge: 'AI Flagged',
    },
    {
      title: 'Inter-Hospital Referrals',
      value: activeReferralsCount,
      subtext: 'Specialist Transfer Pipeline',
      icon: Network,
      color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/30 text-teal-400',
      badge: 'Active Pipeline',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-gradient-to-br ${kpi.color} border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between relative overflow-hidden group`}
          >
            {/* Background ambient glow for break-glass card */}
            {kpi.glow && (
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/20 rounded-full blur-xl group-hover:bg-rose-500/30 transition-all" />
            )}

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <Icon className={`w-4 h-4 ${kpi.textClass || ''}`} />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold tracking-tight font-['Outfit'] flex items-baseline gap-2">
                <span>{kpi.value}</span>
                <span className="text-xs font-mono font-medium opacity-80 px-2 py-0.5 rounded-full bg-slate-900/70 border border-slate-800">
                  {kpi.badge}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{kpi.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
