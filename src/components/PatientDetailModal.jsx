import React from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { 
  X, 
  User, 
  Activity, 
  Heart, 
  ShieldAlert, 
  Pill, 
  History, 
  Lock, 
  PhoneCall, 
  Network, 
  FileText, 
  Building2, 
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Thermometer,
  Wind
} from 'lucide-react';

export const PatientDetailModal = () => {
  const { 
    selectedPatient, 
    patientDetailModalOpen, 
    setPatientDetailModalOpen,
    updatePatientConsent,
    openBreakGlass,
    openReferralModal
  } = useAarogya();

  if (!patientDetailModalOpen || !selectedPatient) return null;

  const p = selectedPatient;
  const isCritical = p.riskLevel === 'Critical';
  const isRevoked = p.consentState === 'Revoked';
  const isEmergencyOnly = p.consentState === 'Emergency Only';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel border-cyan-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/90 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold font-mono text-xl border shadow-lg ${
              isCritical
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 glow-rose animate-pulse'
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
            }`}>
              {p.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-slate-100 font-['Outfit']">{p.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isCritical
                    ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                }`}>
                  Risk: {p.riskLevel} ({p.riskScore}/100)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                <span className="font-mono text-cyan-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  ABHA ID: {p.abhaId}
                </span>
                <span>•</span>
                <span>{p.age} Yrs ({p.gender})</span>
                <span>•</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  {p.hospitalName}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPatientDetailModalOpen(false)}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Revoked Consent Banner warning if applicable */}
          {isRevoked && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/50 text-rose-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Patient Consent Restricted (Revoked)</div>
                  <div className="text-xs opacity-90">Detailed clinical telemetry and visit logs are locked by patient consent protocol.</div>
                </div>
              </div>
              <button
                onClick={() => openBreakGlass(p)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shrink-0 flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Break-Glass Override</span>
              </button>
            </div>
          )}

          {/* Vitals Telemetry Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Clinical Telemetry & Vitals</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Heart Rate */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1 font-semibold">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Heart Rate</span>
                </div>
                <div className="text-xl font-extrabold font-mono text-slate-100 mt-1">
                  {p.vitals.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
                </div>
              </div>

              {/* BP */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Blood Pressure</span>
                </div>
                <div className="text-xl font-extrabold font-mono text-slate-100 mt-1">
                  {p.vitals.bloodPressureSys}/{p.vitals.bloodPressureDia} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </div>
              </div>

              {/* SpO2 */}
              <div className={`p-3.5 rounded-xl border text-center ${
                p.vitals.spO2 < 90 ? 'bg-rose-950/60 border-rose-500/50 text-rose-200 animate-pulse' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1 font-semibold">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  <span>SpO2 Oxygen</span>
                </div>
                <div className={`text-xl font-extrabold font-mono mt-1 ${p.vitals.spO2 < 90 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {p.vitals.spO2}%
                </div>
              </div>

              {/* Temp */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1 font-semibold">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Body Temp</span>
                </div>
                <div className="text-xl font-extrabold font-mono text-slate-100 mt-1">
                  {p.vitals.temperature}°C
                </div>
              </div>

              {/* ECG */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ECG Status</span>
                </div>
                <div className="text-xs font-bold font-mono text-cyan-300 mt-2 truncate">
                  {p.vitals.ecg}
                </div>
              </div>
            </div>
          </div>

          {/* Allergies Alert & Active Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allergies Warning */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Critical Allergies & Warnings</span>
              </h4>
              <div className="space-y-1.5">
                {p.allergies.map((alg, idx) => (
                  <div key={idx} className="text-xs font-semibold text-amber-200 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/20">
                    ⚠️ {alg}
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>Next of Kin Emergency Contact</span>
              </h4>
              <div className="text-sm font-bold text-slate-200">{p.emergencyContact.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">Relation: {p.emergencyContact.relation}</div>
              <div className="text-xs font-mono text-cyan-400 mt-1">{p.emergencyContact.phone}</div>
            </div>
          </div>

          {/* Diagnoses & Medications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diagnoses */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Active Diagnoses</span>
              </h4>
              <div className="space-y-2">
                {p.activeDiagnoses.map((diag, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{diag.condition}</div>
                      <div className="text-[10px] font-mono text-slate-500">ICD Code: {diag.icd}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      diag.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border-rose-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {diag.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Pill className="w-4 h-4 text-emerald-400" />
                <span>Current Prescriptions</span>
              </h4>
              <div className="space-y-2">
                {p.currentMedications.map((med, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{med.name}</div>
                      <div className="text-[10px] text-slate-400">{med.freq}</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {med.dose}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inter-Hospital Visit Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Inter-Hospital Health Record Timeline (ABDM Interoperable)</span>
            </h4>
            <div className="space-y-2.5">
              {p.pastVisits.map((visit) => (
                <div key={visit.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 text-cyan-400 border border-slate-800">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{visit.hospitalName}</div>
                      <div className="text-[11px] text-slate-400">{visit.chiefComplaint}</div>
                    </div>
                  </div>
                  <div className="text-right sm:text-right text-[11px]">
                    <div className="text-cyan-400 font-mono flex items-center gap-1 sm:justify-end">
                      <Calendar className="w-3 h-3" />
                      <span>{visit.date}</span>
                    </div>
                    <div className="text-slate-500 mt-0.5">{visit.doctorName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consent Level Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Patient Data Access Consent Policy</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {['Full Access', 'Emergency Only', 'Revoked'].map((status) => (
                <button
                  key={status}
                  onClick={() => updatePatientConsent(p.id, status)}
                  className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition-all ${
                    p.consentState === status
                      ? 'bg-cyan-950 text-cyan-200 border-cyan-500/50 shadow-lg'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${p.consentState === status ? 'text-cyan-400' : 'text-slate-600'}`} />
                  <span>{status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setPatientDetailModalOpen(false);
              openBreakGlass(p);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Break-Glass Access</span>
          </button>

          <button
            onClick={() => {
              setPatientDetailModalOpen(false);
              openReferralModal(p);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
          >
            <Network className="w-4 h-4" />
            <span>Route Inter-Hospital Referral</span>
          </button>
        </div>

      </div>
    </div>
  );
};
