import React, { useState } from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { ShieldAlert, X, AlertTriangle, Lock, User, FileText, CheckCircle } from 'lucide-react';

const EMERGENCY_SCENARIOS = [
  'Unconscious Polytrauma Patient brought to ER',
  'Acute Cardiac Arrest & Refractory Arrhythmia',
  'Severe Anaphylactic Shock / Mass Casualty Event',
  'Acute Ischemic Stroke / Unconscious ICU Transfer',
];

export const BreakGlassModal = () => {
  const { 
    patients, 
    breakGlassModalOpen, 
    setBreakGlassModalOpen, 
    breakGlassTargetPatient, 
    executeBreakGlass, 
    activeDoctor 
  } = useAarogya();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [scenario, setScenario] = useState(EMERGENCY_SCENARIOS[0]);
  const [justification, setJustification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!breakGlassModalOpen) return null;

  const targetPatient = breakGlassTargetPatient || patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!justification.trim() || justification.length < 15) {
      setErrorMsg('Compulsory clinical justification required (minimum 15 characters).');
      return;
    }
    setErrorMsg('');
    executeBreakGlass(targetPatient.id, justification, scenario);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="glass-panel border-rose-500/60 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl glow-rose animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-950/90 text-rose-500 border border-rose-500/50 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-rose-300 font-['Outfit'] uppercase tracking-wider">
                Emergency Break-Glass Override Protocol
              </h2>
              <p className="text-xs text-rose-400/80">
                ABDM Legal Protocol Section 42 • Immutable Audit Trail Will Be Logged
              </p>
            </div>
          </div>
          <button
            onClick={() => setBreakGlassModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Alert */}
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">CRITICAL WARNING:</span> Bypassing patient consent is strictly monitored. All actions are cryptographically logged with Doctor ID <span className="font-mono font-bold text-rose-300">[{activeDoctor.registrationNo}]</span> and IP timestamp.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Patient Selector if none preselected */}
          {!breakGlassTargetPatient && (
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Select Emergency Patient:</label>
              <select
                value={selectedPatientId || targetPatient.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.abhaId}) — {p.hospitalName} [{p.riskLevel}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selected Patient Preview Box */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-300 font-bold font-mono flex items-center justify-center border border-rose-500/30">
                {targetPatient.bloodGroup}
              </div>
              <div>
                <div className="font-bold text-slate-100 text-sm">{targetPatient.name}</div>
                <div className="text-[10px] font-mono text-cyan-400">ABHA: {targetPatient.abhaId}</div>
              </div>
            </div>
            <div className="text-right text-[11px]">
              <div className="text-slate-400">{targetPatient.hospitalName}</div>
              <div className="text-rose-400 font-bold">Risk: {targetPatient.riskLevel}</div>
            </div>
          </div>

          {/* Emergency Scenario */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Clinical Emergency Scenario:</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500 font-medium"
            >
              {EMERGENCY_SCENARIOS.map((sc, idx) => (
                <option key={idx} value={sc}>{sc}</option>
              ))}
            </select>
          </div>

          {/* Mandatory Justification Reason */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              Compulsory Justification Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="E.g. Unconscious polytrauma patient brought to ER without family. Urgent need to check blood group and severe allergies prior to blood transfusion..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 font-sans"
            />
            {errorMsg && <p className="text-rose-400 font-bold text-[11px] mt-1">{errorMsg}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setBreakGlassModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950/60 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>ENGAGE BREAK-GLASS OVERRIDE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
