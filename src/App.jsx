import React from 'react';
import { AarogyaProvider, useAarogya } from './context/AarogyaContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { NationwideOverview } from './components/NationwideOverview';
import { PatientDirectory } from './components/PatientDirectory';
import { PatientDetailModal } from './components/PatientDetailModal';
import { BreakGlassModal } from './components/BreakGlassModal';
import { AIClinicalDSS } from './components/AIClinicalDSS';
import { ReferralNetwork } from './components/ReferralNetwork';
import { AuditLedger } from './components/AuditLedger';
import { ToastContainer } from './components/ToastContainer';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const DashboardContent = () => {
  const { activeTab, loading, dataError, dataSource, openBreakGlass, patients } = useAarogya();

  const criticalBreakGlassPatients = patients.filter(p => p.riskLevel === 'Critical');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Dynamic Body Content */}
        <main className="p-6 flex-1 space-y-6 overflow-y-auto">
          {/* Loading Indicator */}
          {loading && (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-semibold text-cyan-400 font-mono">
                Hydrating Live Railway Data & Enriched Clinical Telemetry...
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* Tab Views */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <KPICards />
                  <NationwideOverview />
                </div>
              )}

              {activeTab === 'hospitals' && (
                <div className="space-y-6">
                  <NationwideOverview />
                </div>
              )}

              {activeTab === 'patients' && (
                <div className="space-y-6">
                  <PatientDirectory />
                </div>
              )}

              {activeTab === 'break-glass' && (
                <div className="space-y-6">
                  <div className="glass-panel p-6 rounded-2xl border-rose-500/50 bg-gradient-to-r from-rose-950/40 via-slate-900 to-red-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-rose-300 font-['Outfit'] tracking-wider">
                          Emergency "Break-Glass" Access Portal
                        </h2>
                        <p className="text-xs text-rose-200/80 mt-1">
                          Critical Override Access for Unconscious / Emergency Patients • Immutable Ledger Recording Enabled
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => openBreakGlass(criticalBreakGlassPatients[0] || null)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4 animate-bounce" />
                      <span>Execute Emergency Override</span>
                    </button>
                  </div>

                  <AuditLedger />
                </div>
              )}

              {activeTab === 'cdss' && (
                <div className="space-y-6">
                  <AIClinicalDSS />
                </div>
              )}

              {activeTab === 'referrals' && (
                <div className="space-y-6">
                  <ReferralNetwork />
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <AuditLedger />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <PatientDetailModal />
      <BreakGlassModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AarogyaProvider>
      <DashboardContent />
    </AarogyaProvider>
  );
}
