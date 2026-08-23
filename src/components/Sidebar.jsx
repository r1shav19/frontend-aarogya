import React from 'react';
import { useAarogya, DEFAULT_DOCTOR } from '../context/AarogyaContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ShieldAlert, 
  BrainCircuit, 
  Network, 
  FileText, 
  Activity, 
  Stethoscope, 
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';

const DOCTOR_PERSONAS = [
  DEFAULT_DOCTOR,
  {
    id: 'doc-fortis-02',
    name: 'Dr. Priya Patel',
    specialty: 'Pediatric & Neonatal Intensive Care',
    hospital: 'Fortis Hospital Gurugram',
    hospitalId: '640664f7-3f49-4486-9518-9fbfc426e172',
    badge: 'Senior Consultant',
    registrationNo: 'NMC-2019-77210'
  },
  {
    id: 'doc-apollo-03',
    name: 'Dr. Vikramaditya Rao',
    specialty: 'Cardiothoracic & Vascular Surgery',
    hospital: 'Apollo Hospital Chennai',
    hospitalId: '35d6b9f1-f1b8-467c-b24b-fe7258bc5b1e',
    badge: 'Head of Department',
    registrationNo: 'NMC-2014-99102'
  }
];

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeDoctor, 
    setActiveDoctor,
    hospitals,
    patients,
    referrals,
    auditLogs,
    openBreakGlass,
    showToast
  } = useAarogya();

  const breakGlassCount = auditLogs.filter(l => l.action === 'EMERGENCY_BREAK_GLASS').length;
  const pendingReferralsCount = referrals.filter(r => r.status === 'PENDING_REVIEW').length;
  const criticalPatientsCount = patients.filter(p => p.riskLevel === 'Critical').length;

  const navItems = [
    { id: 'overview', label: 'Network Overview', icon: LayoutDashboard, badge: `${hospitals.length} Hosps` },
    { id: 'hospitals', label: 'Network Hospitals', icon: Building2, badge: '10 Online' },
    { id: 'patients', label: 'Patient Directory', icon: Users, badge: `${patients.length} Live` },
    { 
      id: 'break-glass', 
      label: 'Emergency Break-Glass', 
      icon: ShieldAlert, 
      badge: `${breakGlassCount} Events`,
      highlight: true 
    },
    { id: 'cdss', label: 'AI Clinical Support', icon: BrainCircuit, badge: `${criticalPatientsCount} Critical`, ai: true },
    { id: 'referrals', label: 'Referral Network', icon: Network, badge: `${pendingReferralsCount} Pending` },
    { id: 'audit', label: 'Security Audit Ledger', icon: FileText, badge: 'Immutable' },
  ];

  return (
    <aside className="w-72 glass-panel border-r border-slate-800 flex flex-col h-screen sticky top-0 z-40 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-emerald-300 to-indigo-300 bg-clip-text text-transparent font-['Outfit']">
              AarogyaNet
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest font-semibold uppercase flex items-center gap-1">
              <span>ABDM Interop</span>
              <span className="text-cyan-400">• v2.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Quick Action Button */}
      <div className="p-4 border-b border-slate-800/60">
        <button
          onClick={() => openBreakGlass(null)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-rose-950/60 border border-rose-400/30 flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <ShieldAlert className="w-4 h-4 animate-bounce text-white group-hover:scale-110 transition-transform" />
          <span>🚨 Emergency Break-Glass</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
          Clinical Command
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          let activeStyle = 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200';
          if (isActive) {
            if (item.highlight) {
              activeStyle = 'bg-rose-950/40 text-rose-300 border border-rose-500/40 shadow-md shadow-rose-950/30 font-semibold';
            } else if (item.ai) {
              activeStyle = 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/40 shadow-md shadow-indigo-950/30 font-semibold';
            } else {
              activeStyle = 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/30 font-semibold';
            }
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all duration-150 ${activeStyle}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? (item.highlight ? 'text-rose-400' : item.ai ? 'text-indigo-400' : 'text-cyan-400') : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                  item.highlight
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : item.ai
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Doctor Persona Selector */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
          <span>Active Doctor Credential</span>
          <Stethoscope className="w-3 h-3 text-cyan-400" />
        </div>

        <select
          value={activeDoctor.id}
          onChange={(e) => {
            const found = DOCTOR_PERSONAS.find(d => d.id === e.target.value);
            if (found) {
              setActiveDoctor(found);
              showToast('Doctor Credential Switched', `Active user changed to ${found.name} (${found.hospital})`, 'info');
            }
          }}
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-medium"
        >
          {DOCTOR_PERSONAS.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} ({doc.hospital.split(' ')[0]})
            </option>
          ))}
        </select>

        <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
          <div className="font-semibold text-slate-200 flex items-center justify-between">
            <span>{activeDoctor.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
              VERIFIED
            </span>
          </div>
          <div className="text-slate-400 truncate">{activeDoctor.specialty}</div>
          <div className="text-cyan-400 font-mono text-[10px]">{activeDoctor.registrationNo}</div>
        </div>
      </div>
    </aside>
  );
};
