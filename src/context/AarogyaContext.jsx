import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchHospitalsData } from '../services/apiService';
import { enrichHospitals, enrichDoctors, enrichPatients } from '../services/enrichmentEngine';
import { 
  getStoredAuditLogs, 
  saveAuditLog, 
  getStoredReferrals, 
  saveReferral, 
  updateReferralStatus as updateReferralStatusStorage,
  getConsentOverrides, 
  setConsentOverride 
} from '../services/storageService';

const AarogyaContext = createContext();

export const DEFAULT_DOCTOR = {
  id: 'doc-aiims-01',
  name: 'Dr. Rajesh Sharma',
  specialty: 'Emergency Medicine & Critical Care',
  hospital: 'AIIMS New Delhi',
  hospitalId: 'fbab488c-53a3-4378-b0be-c691f9371aef',
  badge: 'Senior Consultant',
  registrationNo: 'NMC-2018-84920'
};

export const AarogyaProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [dataSource, setDataSource] = useState('live');

  // Network Raw & Enriched Data
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // Active View & Navigation
  const [activeTab, setActiveTab] = useState('overview'); // overview, hospitals, patients, break-glass, cdss, referrals, audit
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState('ALL');

  // Active Doctor Persona
  const [activeDoctor, setActiveDoctor] = useState(DEFAULT_DOCTOR);

  // Modals & Active Selections
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetailModalOpen, setPatientDetailModalOpen] = useState(false);
  const [breakGlassModalOpen, setBreakGlassModalOpen] = useState(false);
  const [breakGlassTargetPatient, setBreakGlassTargetPatient] = useState(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [referralTargetPatient, setReferralTargetPatient] = useState(null);

  // Audit Logs & Referrals State
  const [auditLogs, setAuditLogs] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [consentOverrides, setConsentOverridesState] = useState({});

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Toast trigger helper
  const showToast = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  // Hydrate Data from API & Storage
  const loadData = useCallback(async () => {
    setLoading(true);
    setDataError(null);

    // Load LocalStorage states first
    const storedLogs = getStoredAuditLogs();
    const storedRefs = getStoredReferrals();
    const storedConsents = getConsentOverrides();

    setAuditLogs(storedLogs);
    setReferrals(storedRefs);
    setConsentOverridesState(storedConsents);

    // Fetch live API
    const res = await fetchHospitalsData();
    setDataSource(res.source);

    if (res.success && res.data) {
      // Enrich Hospitals
      const enrichedHosps = enrichHospitals(res.data);
      const hospsMap = {};
      enrichedHosps.forEach(h => { hospsMap[h.id] = h; });

      // Flatten Doctors & Patients from hospitals response
      const rawDoctors = res.data.flatMap(h => h.doctors || []);
      const rawPatients = res.data.flatMap(h => h.patients || []);

      // Enrich Doctors
      const enrichedDocs = enrichDoctors(rawDoctors, hospsMap);
      const docsMap = {};
      enrichedDocs.forEach(d => { docsMap[d.id] = d; });

      // Enrich Patients
      let enrichedPats = enrichPatients(rawPatients, hospsMap, docsMap);

      // Apply consent overrides from local storage
      enrichedPats = enrichedPats.map(p => {
        if (storedConsents[p.id]) {
          return { ...p, consentState: storedConsents[p.id] };
        }
        return p;
      });

      setHospitals(enrichedHosps);
      setDoctors(enrichedDocs);
      setPatients(enrichedPats);
    } else {
      setDataError('Could not connect to Railway backend API. Showing offline mode.');
      showToast('API Connection Warning', 'Backend unreachable. Running on synthesized offline cache.', 'warning');
    }

    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Patient Detail Modal with audit logging
  const openPatientDetail = (patient) => {
    setSelectedPatient(patient);
    setPatientDetailModalOpen(true);

    // Log standard EHR view access
    if (patient.consentState !== 'Revoked') {
      const logEntry = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        doctorHospital: activeDoctor.hospital,
        patientId: patient.id,
        patientName: patient.name,
        patientAbha: patient.abhaId,
        action: 'EHR_VIEW',
        severity: 'INFO',
        justification: `Standard Clinical Record Access via ${activeTab.toUpperCase()} Module`,
        ipAddress: '10.204.18.42',
      };
      const updated = saveAuditLog(logEntry);
      setAuditLogs(updated);
    }
  };

  // Open Break Glass Modal
  const openBreakGlass = (patient = null) => {
    setBreakGlassTargetPatient(patient);
    setBreakGlassModalOpen(true);
  };

  // Execute Break Glass Protocol
  const executeBreakGlass = (patientId, justification, scenario) => {
    const targetPat = patients.find(p => p.id === patientId) || breakGlassTargetPatient;
    if (!targetPat) return;

    // Update patient break-glass active state in state
    setPatients(prev => prev.map(p => {
      if (p.id === targetPat.id) {
        return { 
          ...p, 
          isBreakGlassActive: true, 
          consentState: 'Full Access (Break-Glass Active)' 
        };
      }
      return p;
    }));

    // Update selected patient if open
    if (selectedPatient && selectedPatient.id === targetPat.id) {
      setSelectedPatient(prev => ({
        ...prev,
        isBreakGlassActive: true,
        consentState: 'Full Access (Break-Glass Active)'
      }));
    }

    // Create Immutable Audit Log
    const auditEntry = {
      id: `bg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      doctorHospital: activeDoctor.hospital,
      patientId: targetPat.id,
      patientName: targetPat.name,
      patientAbha: targetPat.abhaId,
      action: 'EMERGENCY_BREAK_GLASS',
      severity: 'CRITICAL',
      justification: `Emergency Override [${scenario}]: ${justification}`,
      ipAddress: '10.204.18.42',
    };

    const updatedLogs = saveAuditLog(auditEntry);
    setAuditLogs(updatedLogs);

    showToast(
      '🚨 BREAK-GLASS EMERGENCY OVERRIDE ENGAGED',
      `Emergency medical access unlocked for ${targetPat.name} (${targetPat.abhaId}). Security audit log generated.`,
      'emergency'
    );

    setBreakGlassModalOpen(false);
  };

  // Update Patient Consent Toggle
  const updatePatientConsent = (patientId, newConsent) => {
    const updatedOverrides = setConsentOverride(patientId, newConsent);
    setConsentOverridesState(updatedOverrides);

    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, consentState: newConsent } : p));
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient(prev => ({ ...prev, consentState: newConsent }));
    }

    const pat = patients.find(p => p.id === patientId);
    const auditEntry = {
      id: `consent-${Date.now()}`,
      timestamp: new Date().toISOString(),
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      doctorHospital: activeDoctor.hospital,
      patientId,
      patientName: pat?.name || 'Unknown Patient',
      patientAbha: pat?.abhaId || 'N/A',
      action: 'CONSENT_UPDATE',
      severity: newConsent === 'Revoked' ? 'WARNING' : 'INFO',
      justification: `Patient data access consent updated to: ${newConsent}`,
      ipAddress: '10.204.18.42',
    };

    const updatedLogs = saveAuditLog(auditEntry);
    setAuditLogs(updatedLogs);

    showToast('Consent Preference Updated', `Data access consent for patient updated to '${newConsent}'`, 'success');
  };

  // Open Inter-Hospital Referral Modal
  const openReferralModal = (patient) => {
    setReferralTargetPatient(patient);
    setReferralModalOpen(true);
  };

  // Create Inter-Hospital Referral
  const createReferral = (patientId, toHospital, toSpecialty, urgency, reason) => {
    const targetPat = patients.find(p => p.id === patientId) || referralTargetPatient;
    if (!targetPat) return;

    const newRef = {
      id: `ref-${Date.now()}`,
      patientId: targetPat.id,
      patientName: targetPat.name,
      patientAge: targetPat.age,
      patientGender: targetPat.gender,
      fromHospital: targetPat.hospitalName || activeDoctor.hospital,
      toHospital,
      toSpecialty,
      referringDoctor: activeDoctor.name,
      urgency,
      status: 'PENDING_REVIEW',
      reason,
      createdAt: new Date().toISOString(),
    };

    const updatedRefs = saveReferral(newRef);
    setReferrals(updatedRefs);

    // Audit log
    const auditEntry = {
      id: `ref-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      doctorHospital: activeDoctor.hospital,
      patientId: targetPat.id,
      patientName: targetPat.name,
      patientAbha: targetPat.abhaId,
      action: 'INTER_HOSPITAL_REFERRAL',
      severity: 'WARNING',
      justification: `Complex case flagged & routed to ${toHospital} [Specialty: ${toSpecialty}]`,
      ipAddress: '10.204.18.42',
    };
    setAuditLogs(saveAuditLog(auditEntry));

    showToast(
      'Inter-Hospital Referral Dispatched',
      `Complex case referral for ${targetPat.name} submitted to ${toHospital}.`,
      'info'
    );

    setReferralModalOpen(false);
  };

  // Update Referral Status
  const handleUpdateReferralStatus = (id, newStatus) => {
    const updated = updateReferralStatusStorage(id, newStatus);
    setReferrals(updated);
    showToast('Referral Status Updated', `Referral request status changed to ${newStatus}`, 'success');
  };

  return (
    <AarogyaContext.Provider
      value={{
        loading,
        dataError,
        dataSource,
        hospitals,
        doctors,
        patients,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        selectedSpecialtyFilter,
        setSelectedSpecialtyFilter,
        selectedRiskFilter,
        setSelectedRiskFilter,
        selectedHospitalFilter,
        setSelectedHospitalFilter,
        activeDoctor,
        setActiveDoctor,
        selectedPatient,
        setSelectedPatient,
        patientDetailModalOpen,
        setPatientDetailModalOpen,
        openPatientDetail,
        breakGlassModalOpen,
        setBreakGlassModalOpen,
        breakGlassTargetPatient,
        openBreakGlass,
        executeBreakGlass,
        referralModalOpen,
        setReferralModalOpen,
        referralTargetPatient,
        openReferralModal,
        createReferral,
        handleUpdateReferralStatus,
        auditLogs,
        referrals,
        consentOverrides,
        updatePatientConsent,
        toasts,
        showToast,
        refreshData: loadData,
      }}
    >
      {children}
    </AarogyaContext.Provider>
  );
};

export const useAarogya = () => useContext(AarogyaContext);
