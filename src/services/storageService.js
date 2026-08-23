/**
 * Storage Service for LocalStorage Persistence
 * Manages local caching of Audit Logs, Break-Glass Events, Consent Overrides, and Referrals.
 */

const KEYS = {
  AUDIT_LOGS: 'aarogyanet_audit_logs_v1',
  BREAK_GLASS_RECORDS: 'aarogyanet_break_glass_v1',
  CONSENT_OVERRIDES: 'aarogyanet_consent_v1',
  REFERRALS: 'aarogyanet_referrals_v1',
};

// Initial Seed Audit Logs
const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-101',
    timestamp: '2026-08-23T14:10:00.000Z',
    doctorId: '6e5ca01c-32ad-4f1b-91d8-dc5aba809d1e',
    doctorName: 'Dr. Rajesh Sharma',
    doctorHospital: 'AIIMS New Delhi',
    patientId: '09d023bc-80dd-4ec1-85ad-153caa138193',
    patientName: 'Patient 1 (H1)',
    patientAbha: '91-8472-9102-4412',
    action: 'EMERGENCY_BREAK_GLASS',
    severity: 'CRITICAL',
    justification: 'Unconscious polytrauma patient admitted to ER without family present. Critical blood group & allergy check required.',
    ipAddress: '10.204.12.89',
  },
  {
    id: 'audit-102',
    timestamp: '2026-08-23T13:45:22.000Z',
    doctorId: '640664f7-3f49-4486-9518-9fbfc426e172',
    doctorName: 'Dr. Priya Patel',
    doctorHospital: 'Fortis Hospital Gurugram',
    patientId: 'pat-102',
    patientName: 'Priya Verma',
    patientAbha: '91-1209-8834-1102',
    action: 'EHR_VIEW',
    severity: 'INFO',
    justification: 'Routine OPD Follow-up & Vital Signs Review',
    ipAddress: '10.204.14.12',
  },
  {
    id: 'audit-103',
    timestamp: '2026-08-23T12:30:15.000Z',
    doctorId: '35d6b9f1-f1b8-467c-b24b-fe7258bc5b1e',
    doctorName: 'Dr. Vikramaditya Rao',
    doctorHospital: 'Apollo Hospital Chennai',
    patientId: 'pat-105',
    patientName: 'Anil Kulkarni',
    patientAbha: '91-9981-4432-8871',
    action: 'INTER_HOSPITAL_REFERRAL',
    severity: 'WARNING',
    justification: 'Complex Case Flagged: Refractory Ventricular Arrhythmia transferred for Specialist Intervention',
    ipAddress: '10.204.88.4',
  }
];

// Initial Seed Referrals
const INITIAL_REFERRALS = [
  {
    id: 'ref-901',
    patientId: '09d023bc-80dd-4ec1-85ad-153caa138193',
    patientName: 'Patient 1 (H1)',
    patientAge: 40,
    patientGender: 'Female',
    fromHospital: 'City Hospital 1',
    toHospital: 'AIIMS New Delhi',
    toSpecialty: 'Cardiology / Electrophysiology',
    referringDoctor: 'Dr. Smith (H1)',
    urgency: 'HIGH',
    status: 'IN_TRANSIT',
    reason: 'Unstable Acute Coronary Syndrome requiring emergency PCI.',
    createdAt: '2026-08-23T13:00:00.000Z',
  },
  {
    id: 'ref-902',
    patientId: 'pat-108',
    patientName: 'Sunita Reddy',
    patientAge: 58,
    patientGender: 'Female',
    fromHospital: 'City Hospital 3',
    toHospital: 'Apollo Hospital Chennai',
    toSpecialty: 'Neurology / Stroke Unit',
    referringDoctor: 'Dr. A. K. Roy',
    urgency: 'CRITICAL',
    status: 'PENDING_REVIEW',
    reason: 'Acute Ischemic Stroke with thrombolysis candidate evaluation.',
    createdAt: '2026-08-23T14:05:00.000Z',
  }
];

export const getStoredAuditLogs = () => {
  try {
    const data = localStorage.getItem(KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
};

export const saveAuditLog = (logEntry) => {
  try {
    const current = getStoredAuditLogs();
    const updated = [logEntry, ...current];
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save audit log:', e);
    return [];
  }
};

export const getStoredReferrals = () => {
  try {
    const data = localStorage.getItem(KEYS.REFERRALS);
    return data ? JSON.parse(data) : INITIAL_REFERRALS;
  } catch (e) {
    return INITIAL_REFERRALS;
  }
};

export const saveReferral = (referralEntry) => {
  try {
    const current = getStoredReferrals();
    const updated = [referralEntry, ...current];
    localStorage.setItem(KEYS.REFERRALS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save referral:', e);
    return [];
  }
};

export const updateReferralStatus = (id, newStatus) => {
  try {
    const current = getStoredReferrals();
    const updated = current.map(r => r.id === id ? { ...r, status: newStatus } : r);
    localStorage.setItem(KEYS.REFERRALS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getConsentOverrides = () => {
  try {
    const data = localStorage.getItem(KEYS.CONSENT_OVERRIDES);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const setConsentOverride = (patientId, consentStatus) => {
  try {
    const current = getConsentOverrides();
    current[patientId] = consentStatus;
    localStorage.setItem(KEYS.CONSENT_OVERRIDES, JSON.stringify(current));
    return current;
  } catch (e) {
    return {};
  }
};
