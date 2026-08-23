import React, { useState } from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { 
  Network, 
  Building2, 
  User, 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  X, 
  Send,
  ArrowRight,
  ShieldAlert,
  Ambulance
} from 'lucide-react';

export const ReferralNetwork = () => {
  const { 
    referrals, 
    hospitals, 
    patients, 
    activeDoctor, 
    createReferral, 
    handleUpdateReferralStatus,
    referralModalOpen,
    setReferralModalOpen,
    referralTargetPatient
  } = useAarogya();

  const [filterStatus, setFilterStatus] = useState('ALL');

  // Form State for new referral modal
  const [selectedPatId, setSelectedPatId] = useState('');
  const [targetHosp, setTargetHosp] = useState('AIIMS New Delhi');
  const [targetSpecialty, setTargetSpecialty] = useState('Cardiology / Electrophysiology');
  const [urgency, setUrgency] = useState('HIGH');
  const [reason, setReason] = useState('');

  const filteredReferrals = referrals.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const activeTargetPatient = referralTargetPatient || patients.find(p => p.id === selectedPatId) || patients[0];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    createReferral(
      activeTargetPatient.id,
      targetHosp,
      targetSpecialty,
      urgency,
      reason
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
            <Network className="w-5 h-5 text-teal-400" />
            <span>Inter-Hospital Specialist Referral Network</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Routing complex medical cases and emergency transfers across 10 ABDM integrated hospitals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Pipeline Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Referrals ({referrals.length})</option>
              <option value="PENDING_REVIEW" className="bg-slate-900">Pending Review</option>
              <option value="IN_TRANSIT" className="bg-slate-900">In Transit</option>
              <option value="ADMITTED" className="bg-slate-900">Admitted</option>
            </select>
          </div>

          <button
            onClick={() => setReferralModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Route Complex Case</span>
          </button>
        </div>
      </div>

      {/* Referrals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReferrals.map((ref) => {
          const isPending = ref.status === 'PENDING_REVIEW';
          const isInTransit = ref.status === 'IN_TRANSIT';
          const isAdmitted = ref.status === 'ADMITTED';

          let statusBadge = 'bg-amber-950 text-amber-300 border-amber-500/40';
          if (isInTransit) statusBadge = 'bg-cyan-950 text-cyan-300 border-cyan-500/40 animate-pulse';
          else if (isAdmitted) statusBadge = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';

          return (
            <div
              key={ref.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 relative"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-100">{ref.patientName}</span>
                    <span className="text-xs text-slate-400 font-mono">({ref.patientAge}y, {ref.patientGender})</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Referring Doctor: <span className="text-slate-200 font-medium">{ref.referringDoctor}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusBadge}`}>
                  {ref.status.replace('_', ' ')}
                </span>
              </div>

              {/* Transfer Route Banner */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">From Hospital</div>
                  <div className="font-bold text-slate-200 truncate max-w-[130px]">{ref.fromHospital}</div>
                </div>

                <div className="flex flex-col items-center px-2">
                  <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-cyan-300 mt-0.5">{ref.urgency}</span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Destination Hospital</div>
                  <div className="font-bold text-cyan-300 truncate max-w-[130px]">{ref.toHospital}</div>
                </div>
              </div>

              {/* Reason & Specialty */}
              <div className="text-xs space-y-1">
                <div className="text-slate-400 font-medium">
                  Specialty Required: <span className="text-slate-200 font-bold">{ref.toSpecialty}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 italic">
                  "{ref.reason}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ref.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => handleUpdateReferralStatus(ref.id, 'IN_TRANSIT')}
                      className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 font-semibold text-xs flex items-center gap-1"
                    >
                      <Ambulance className="w-3.5 h-3.5" />
                      <span>Dispatch ICU Transport</span>
                    </button>
                  )}

                  {isInTransit && (
                    <button
                      onClick={() => handleUpdateReferralStatus(ref.id, 'ADMITTED')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 font-semibold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Specialist Admission</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating New Referral */}
      {referralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-base font-['Outfit']">
                  Route Inter-Hospital Referral Request
                </h3>
              </div>
              <button onClick={() => setReferralModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Patient Selector if not target */}
              {!referralTargetPatient && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Select Complex Case Patient:</label>
                  <select
                    value={selectedPatId || activeTargetPatient.id}
                    onChange={(e) => setSelectedPatId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.abhaId}) — [{p.riskLevel}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Patient Preview */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100">{activeTargetPatient.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400">ABHA: {activeTargetPatient.abhaId}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Current: {activeTargetPatient.hospitalName}</div>
                  <div className="text-xs font-bold text-amber-400">Risk: {activeTargetPatient.riskLevel}</div>
                </div>
              </div>

              {/* Destination Hospital Dropdown */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Destination Target Hospital:</label>
                <select
                  value={targetHosp}
                  onChange={(e) => setTargetHosp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-medium"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.displayName || h.name}>
                      {h.displayName || h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Specialty */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Required Specialist Unit:</label>
                <select
                  value={targetSpecialty}
                  onChange={(e) => setTargetSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-medium"
                >
                  <option value="Cardiology / Electrophysiology">Cardiology / Electrophysiology</option>
                  <option value="Neurology / Comprehensive Stroke Center">Neurology / Comprehensive Stroke Center</option>
                  <option value="Pediatric Intensive Care (PICU)">Pediatric Intensive Care (PICU)</option>
                  <option value="Polytrauma & Neurosurgery">Polytrauma & Neurosurgery</option>
                  <option value="Nephrology & Dialysis">Nephrology & Dialysis</option>
                  <option value="Oncology & Bone Marrow Unit">Oncology & Bone Marrow Unit</option>
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Transfer Urgency Level:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['HIGH', 'CRITICAL', 'ELECTIVE'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`p-2 rounded-xl border font-bold text-center transition-all ${
                        urgency === lvl
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Justification */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Complex Case Summary & Reason:</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe why specialist transfer is required..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReferralModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Referral Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
