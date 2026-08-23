import React, { useState } from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldAlert, 
  Heart, 
  Activity, 
  Eye, 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Building2, 
  FileText,
  Clock
} from 'lucide-react';

export const PatientDirectory = () => {
  const { 
    patients, 
    hospitals,
    searchTerm, 
    setSearchTerm,
    selectedRiskFilter, 
    setSelectedRiskFilter,
    selectedHospitalFilter,
    setSelectedHospitalFilter,
    openPatientDetail,
    openBreakGlass,
    openReferralModal
  } = useAarogya();

  const [selectedConsentFilter, setSelectedConsentFilter] = useState('ALL');

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      p.name.toLowerCase().includes(term) ||
      p.abhaId?.toLowerCase().includes(term) ||
      p.hospitalName?.toLowerCase().includes(term) ||
      p.doctorName?.toLowerCase().includes(term) ||
      p.bloodGroup?.toLowerCase().includes(term);

    const matchesRisk = selectedRiskFilter === 'ALL' || p.riskLevel === selectedRiskFilter;
    const matchesHospital = selectedHospitalFilter === 'ALL' || p.hospitalId === selectedHospitalFilter;
    const matchesConsent = selectedConsentFilter === 'ALL' || p.consentState?.includes(selectedConsentFilter);

    return matchesSearch && matchesRisk && matchesHospital && matchesConsent;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Unified Patient Directory & EHR Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Accessing {filteredPatients.length} of {patients.length} synchronized patient records across 10 network hospitals
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Risk Level:</span>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Risk Levels</option>
              <option value="Critical" className="bg-slate-900">🚨 Critical (SpO2/Hypoxia)</option>
              <option value="Medium" className="bg-slate-900">⚡ Medium</option>
              <option value="Low" className="bg-slate-900">✅ Low</option>
            </select>
          </div>

          {/* Hospital Filter */}
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Hospital:</span>
            <select
              value={selectedHospitalFilter}
              onChange={(e) => setSelectedHospitalFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none max-w-[150px] truncate"
            >
              <option value="ALL" className="bg-slate-900">All 10 Hospitals</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id} className="bg-slate-900">
                  {h.displayName || h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Consent Filter */}
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Consent:</span>
            <select
              value={selectedConsentFilter}
              onChange={(e) => setSelectedConsentFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Consents</option>
              <option value="Full Access" className="bg-slate-900">Full Access</option>
              <option value="Emergency Only" className="bg-slate-900">Emergency Only</option>
              <option value="Revoked" className="bg-slate-900">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Patient / ABHA ID</th>
                <th className="py-3.5 px-4">Risk & Vitals</th>
                <th className="py-3.5 px-4">Blood & Allergies</th>
                <th className="py-3.5 px-4">Hospital & Doctor</th>
                <th className="py-3.5 px-4">Primary Diagnosis</th>
                <th className="py-3.5 px-4">Consent Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredPatients.map((pat) => {
                const isCritical = pat.riskLevel === 'Critical';
                const isMedium = pat.riskLevel === 'Medium';
                const isRevoked = pat.consentState === 'Revoked';
                const isEmergencyOnly = pat.consentState === 'Emergency Only';

                let riskBadge = 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
                if (isCritical) riskBadge = 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse';
                else if (isMedium) riskBadge = 'bg-amber-950 text-amber-300 border-amber-500/30';

                return (
                  <tr 
                    key={pat.id} 
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Patient Name & ABHA */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">
                        {pat.name}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400 mt-0.5 flex items-center gap-1">
                        <span>ABHA:</span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {pat.abhaId}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {pat.age} yrs • {pat.gender}
                      </div>
                    </td>

                    {/* Risk & Vitals */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskBadge}`}>
                          {pat.riskLevel} ({pat.riskScore})
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-slate-300 flex items-center gap-2">
                        <span className={pat.vitals.spO2 < 90 ? 'text-rose-400 font-bold' : ''}>
                          SpO2: {pat.vitals.spO2}%
                        </span>
                        <span>•</span>
                        <span>HR: {pat.vitals.heartRate} bpm</span>
                      </div>
                    </td>

                    {/* Blood Group & Allergies */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
                          {pat.bloodGroup}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-300/90 mt-1 line-clamp-1 max-w-[140px]" title={pat.allergies.join(', ')}>
                        ⚠️ {pat.allergies[0]}
                      </div>
                    </td>

                    {/* Hospital & Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-semibold truncate max-w-[150px]">
                        {pat.hospitalName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {pat.doctorName}
                      </div>
                    </td>

                    {/* Diagnosis */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 text-xs truncate max-w-[160px]">
                        {pat.activeDiagnoses[0]?.condition || 'General Evaluation'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        ICD: {pat.activeDiagnoses[0]?.icd || 'R69'}
                      </div>
                    </td>

                    {/* Consent Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        isRevoked
                          ? 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                          : isEmergencyOnly
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {isRevoked ? <Lock className="w-3 h-3" /> : isEmergencyOnly ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{pat.consentState}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openPatientDetail(pat)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 font-semibold text-[11px] flex items-center gap-1 transition-all"
                          title="Open 360° Health Record"
                        >
                          <Eye className="w-3 h-3" />
                          <span>360° EHR</span>
                        </button>

                        <button
                          onClick={() => openBreakGlass(pat)}
                          className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-all"
                          title="Trigger Emergency Break-Glass Access"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openReferralModal(pat)}
                          className="p-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transition-all"
                          title="Flag Complex Case & Route Inter-Hospital Referral"
                        >
                          <Network className="w-3.5 h-3.5" />
                        </button>
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
