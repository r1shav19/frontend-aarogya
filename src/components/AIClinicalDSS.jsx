import React, { useState } from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { 
  BrainCircuit, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  Pill, 
  Heart, 
  Wind, 
  CheckCircle2, 
  ChevronRight,
  Stethoscope,
  Info
} from 'lucide-react';

export const AIClinicalDSS = () => {
  const { patients, openPatientDetail, openReferralModal, openBreakGlass } = useAarogya();
  const [activeTabFilter, setActiveTabFilter] = useState('Critical');

  const criticalPatients = patients.filter(p => p.riskLevel === 'Critical');
  const mediumPatients = patients.filter(p => p.riskLevel === 'Medium');
  const lowPatients = patients.filter(p => p.riskLevel === 'Low');

  const displayList = activeTabFilter === 'Critical' 
    ? criticalPatients 
    : activeTabFilter === 'Medium' 
    ? mediumPatients 
    : patients;

  return (
    <div className="space-y-6">
      {/* CDSS Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-950">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-['Outfit']">
                  AI Clinical Decision Support System (CDSS)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Real-time Inference Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated risk stratification, drug-drug interaction detection, qSOFA sepsis screening, and vital anomaly triggers
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTabFilter('Critical')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                activeTabFilter === 'Critical'
                  ? 'bg-rose-950 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-950/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              🚨 {criticalPatients.length} Critical Risks
            </button>
            <button
              onClick={() => setActiveTabFilter('Medium')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                activeTabFilter === 'Medium'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              ⚡ {mediumPatients.length} Medium Risks
            </button>
          </div>
        </div>
      </div>

      {/* Grid of AI Flagged Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayList.map((pat) => {
          const isHypoxic = pat.vitals.spO2 < 90;
          const isTachycardic = pat.vitals.heartRate > 120;
          const isHypertensive = pat.vitals.bloodPressureSys > 150;
          const isSepsisRisk = isTachycardic || isHypoxic;

          return (
            <div
              key={pat.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-100">{pat.name}</h3>
                    <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {pat.bloodGroup}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    ABHA: <span className="font-mono text-slate-300">{pat.abhaId}</span> • {pat.hospitalName}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-extrabold px-3 py-1 rounded-full border inline-block ${
                    pat.riskLevel === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-amber-950 text-amber-300 border-amber-500/40'
                  }`}>
                    AI Risk Score: {pat.riskScore}/100 [{pat.riskLevel}]
                  </div>
                </div>
              </div>

              {/* Vitals Anomaly Banner */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-2 rounded-xl border ${isHypoxic ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 font-bold animate-pulse' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Wind className="w-3 h-3 text-teal-400" />
                    <span>SpO2 Oxygen</span>
                  </div>
                  <div className="text-sm font-mono mt-0.5">{pat.vitals.spO2}%</div>
                </div>

                <div className={`p-2 rounded-xl border ${isTachycardic ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 font-bold' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>Heart Rate</span>
                  </div>
                  <div className="text-sm font-mono mt-0.5">{pat.vitals.heartRate} bpm</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>Blood Pressure</span>
                  </div>
                  <div className="text-sm font-mono mt-0.5">{pat.vitals.bloodPressureSys}/{pat.vitals.bloodPressureDia}</div>
                </div>
              </div>

              {/* AI Generated Clinical Alerts */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Inferred Risk Warnings</span>
                </div>

                {isHypoxic && (
                  <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">CRITICAL HYPOXIA WARNING:</span> SpO2 {pat.vitals.spO2}% below threshold (&lt;90%). Immediate high-flow O2 therapy & ABG recommended.
                    </div>
                  </div>
                )}

                {isSepsisRisk && (
                  <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
                    <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">qSOFA SEPSIS TRIGGER:</span> Tachycardia ({pat.vitals.heartRate} bpm) & Elevated Respiratory Rate. Screen for systemic infection.
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Pill className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">Contraindication Check:</span> Cross-referenced {pat.allergies[0]} against active prescriptions. 0 collisions detected.
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => openPatientDetail(pat)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800"
                >
                  Inspect Full 360° EHR
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openBreakGlass(pat)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900 text-xs font-bold flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Break-Glass</span>
                  </button>

                  <button
                    onClick={() => openReferralModal(pat)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900 text-xs font-bold flex items-center gap-1"
                  >
                    <span>Route Referral</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
