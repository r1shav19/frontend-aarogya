/**
 * Synthesized Clinical Telemetry & Data Enrichment Engine
 * Enriches raw Prisma/Express API objects with rich medical records,
 * ABHA Universal Health IDs, risk scores, allergies, vitals, and audit trails.
 */

// Helper to generate pseudo-random deterministic numbers from string ID
const hashCode = (str) => {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ALLERGIES_LIST = [
  'Penicillin & Amoxicillin',
  'NSAIDs (Ibuprofen / Aspirin)',
  'Sulfa Drugs (Sulfonamides)',
  'IV Contrast Dye (Iodine)',
  'General Anesthesia (Succinylcholine)',
  'Latex',
  'Peanuts & Tree Nuts',
  'Cephalosporins',
  'None Known (NKDA)'
];

const DIAGNOSES_POOL = [
  { condition: 'Acute Coronary Syndrome (STEMI)', severity: 'Critical', icd: 'I21.3' },
  { condition: 'Type 2 Diabetes Mellitus with Neuropathy', severity: 'Medium', icd: 'E11.4' },
  { condition: 'Chronic Kidney Disease (Stage 4)', severity: 'Critical', icd: 'N18.4' },
  { condition: 'Essential Hypertension', severity: 'Low', icd: 'I10' },
  { condition: 'Severe Acute Asthma Exacerbation', severity: 'Critical', icd: 'J45.901' },
  { condition: 'Polytrauma & Closed Head Injury', severity: 'Critical', icd: 'T07' },
  { condition: 'Acute Ischemic Stroke (CVA)', severity: 'Critical', icd: 'I63.9' },
  { condition: 'COPD with Acute Bronchospasm', severity: 'Medium', icd: 'J44.1' },
  { condition: 'Systemic Sepsis (qSOFA Positive)', severity: 'Critical', icd: 'A41.9' },
  { condition: 'Rheumatoid Arthritis', severity: 'Low', icd: 'M06.9' },
  { condition: 'Heart Failure with Reduced EF (HFrEF)', severity: 'Medium', icd: 'I50.22' },
  { condition: 'Acute Pancreatitis', severity: 'Medium', icd: 'K85.9' }
];

const MEDICATIONS_POOL = [
  { name: 'Metformin HCl', dose: '500mg', freq: 'Twice daily after meals' },
  { name: 'Atorvastatin', dose: '20mg', freq: 'Once daily at bedtime' },
  { name: 'Amlodipine Besylate', dose: '5mg', freq: 'Once daily morning' },
  { name: 'Aspirin (EC)', dose: '75mg', freq: 'Once daily after breakfast' },
  { name: 'Clopidogrel', dose: '75mg', freq: 'Once daily' },
  { name: 'Levothyroxine Sodium', dose: '50mcg', freq: 'Once daily fasting' },
  { name: 'Enoxaparin Sodium', dose: '40mg SC', freq: 'Twice daily' },
  { name: 'Salbutamol Inhaler', dose: '100mcg', freq: '2 puffs as needed' },
  { name: 'Pantoprazole', dose: '40mg', freq: 'Once daily before breakfast' },
  { name: 'Cefrtaxone Sodium', dose: '1g IV', freq: 'Twice daily' },
  { name: 'Furosemide (Lasix)', dose: '40mg', freq: 'Once daily morning' }
];

const INDIAN_CITIES = [
  { city: 'New Delhi', state: 'Delhi NCR', region: 'North' },
  { city: 'Mumbai', state: 'Maharashtra', region: 'West' },
  { city: 'Bengaluru', state: 'Karnataka', region: 'South' },
  { city: 'Chennai', state: 'Tamil Nadu', region: 'South' },
  { city: 'Kolkata', state: 'West Bengal', region: 'East' },
  { city: 'Hyderabad', state: 'Telangana', region: 'South' },
  { city: 'Ahmedabad', state: 'Gujarat', region: 'West' },
  { city: 'Chandigarh', state: 'Punjab/Haryana', region: 'North' },
  { city: 'Jaipur', state: 'Rajasthan', region: 'North' },
  { city: 'Kochi', state: 'Kerala', region: 'South' }
];

const EMERGENCY_RELATIONS = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Guardian'];

/**
 * Enriches Raw Hospitals from API
 */
export const enrichHospitals = (rawHospitals) => {
  if (!rawHospitals || !Array.isArray(rawHospitals)) return [];

  return rawHospitals.map((h, idx) => {
    const hash = hashCode(h.id || `hosp-${idx}`);
    const cityInfo = INDIAN_CITIES[idx % INDIAN_CITIES.length];
    
    // Status distribution
    let status = 'Operational';
    if (idx === 1 || idx === 6) status = 'Emergency Surge';
    if (idx === 3 || idx === 8) status = 'High Occupancy';

    const totalIcuBeds = 30 + (hash % 35);
    const availableIcuBeds = Math.max(1, (hash % 12));
    const occupancyRate = Math.round(((totalIcuBeds - availableIcuBeds) / totalIcuBeds) * 100);

    return {
      ...h,
      displayName: h.name.includes('Hospital') ? h.name : `${h.name} Medical Center`,
      city: cityInfo.city,
      state: cityInfo.state,
      region: cityInfo.region,
      status,
      occupancyRate,
      icuCapacity: {
        total: totalIcuBeds,
        available: availableIcuBeds,
      },
      accreditation: 'NABH Accredited | ABDM Integrated',
      traumaCenterLevel: idx % 3 === 0 ? 'Level 1 Trauma Center' : 'Tertiary Care Hospital',
      emergencyPhone: `+91 1800-11-${1000 + (hash % 8999)}`,
      doctorCount: h.doctors?.length || 0,
      patientCount: h.patients?.length || 0,
    };
  });
};

/**
 * Enriches Raw Doctors from API
 */
export const enrichDoctors = (rawDoctors, enrichedHospitalsMap) => {
  if (!rawDoctors || !Array.isArray(rawDoctors)) return [];

  return rawDoctors.map((doc, idx) => {
    const hash = hashCode(doc.id || `doc-${idx}`);
    const hosp = enrichedHospitalsMap[doc.hospitalId] || {};
    
    const regNo = `NMC-${2015 + (hash % 8)}-${10000 + (hash % 89999)}`;
    const yearsExp = 5 + (hash % 22);

    return {
      ...doc,
      registrationNumber: regNo,
      yearsExperience: yearsExp,
      hospitalName: hosp.displayName || hosp.name || 'Network Hospital',
      hospitalCity: hosp.city || 'Delhi',
      availability: hash % 5 === 0 ? 'On Emergency Duty' : 'Active Duty',
      contactEmail: `${doc.name.toLowerCase().replace(/[^a-z]/g, '')}@aarogyanet.gov.in`,
    };
  });
};

/**
 * Enriches Raw Patients from API
 */
export const enrichPatients = (rawPatients, enrichedHospitalsMap, enrichedDoctorsMap) => {
  if (!rawPatients || !Array.isArray(rawPatients)) return [];

  return rawPatients.map((p, idx) => {
    const hash = hashCode(p.id || `pat-${idx}`);
    const hosp = enrichedHospitalsMap[p.hospitalId] || {};
    const doc = enrichedDoctorsMap[p.doctorId] || {};

    // Generate ABHA ID (e.g. 91-8472-9102-4412)
    const abhaId = `91-${1000 + (hash % 8999)}-${2000 + ((hash * 3) % 7999)}-${1000 + ((hash * 7) % 8999)}`;

    // Blood Group
    const bloodGroup = BLOOD_GROUPS[hash % BLOOD_GROUPS.length];

    // Allergies
    const allergy1 = ALLERGIES_LIST[hash % ALLERGIES_LIST.length];
    const allergy2 = ALLERGIES_LIST[(hash * 2) % ALLERGIES_LIST.length];
    const allergies = [];
    if (allergy1 !== 'None Known (NKDA)') allergies.push(allergy1);
    if (allergy2 !== 'None Known (NKDA)' && allergy2 !== allergy1 && allergies.length < 2) {
      allergies.push(allergy2);
    }
    if (allergies.length === 0) allergies.push('None Known (NKDA)');

    // Risk Stratification & Clinical Vitals
    let riskLevel = 'Low';
    let riskScore = 15 + (hash % 35); // 15-50
    let vitals = {
      heartRate: 72 + (hash % 16),
      bloodPressureSys: 118 + (hash % 16),
      bloodPressureDia: 76 + (hash % 10),
      spO2: 97 + (hash % 3),
      temperature: 36.6 + ((hash % 8) / 10),
      respiratoryRate: 14 + (hash % 5),
      ecg: 'Normal Sinus Rhythm',
    };

    // Specific critical & medium patients distribution
    if (idx % 7 === 0 || idx % 11 === 0) {
      riskLevel = 'Critical';
      riskScore = 82 + (hash % 17); // 82-99
      vitals = {
        heartRate: 128 + (hash % 25),
        bloodPressureSys: 165 + (hash % 30),
        bloodPressureDia: 102 + (hash % 15),
        spO2: 86 + (hash % 6), // Hypoxia!
        temperature: 38.8 + ((hash % 12) / 10),
        respiratoryRate: 26 + (hash % 8),
        ecg: hash % 2 === 0 ? 'ST Elevation (Lateral)' : 'Tachycardia / Ventricular Ectopy',
      };
    } else if (idx % 3 === 0) {
      riskLevel = 'Medium';
      riskScore = 55 + (hash % 22); // 55-77
      vitals = {
        heartRate: 94 + (hash % 15),
        bloodPressureSys: 138 + (hash % 18),
        bloodPressureDia: 88 + (hash % 8),
        spO2: 94 + (hash % 3),
        temperature: 37.4 + ((hash % 8) / 10),
        respiratoryRate: 19 + (hash % 4),
        ecg: 'Borderline ST Changes',
      };
    }

    // Diagnoses
    const primaryDiag = DIAGNOSES_POOL[hash % DIAGNOSES_POOL.length];
    const secondaryDiag = DIAGNOSES_POOL[(hash * 4) % DIAGNOSES_POOL.length];
    const activeDiagnoses = [primaryDiag];
    if (secondaryDiag.condition !== primaryDiag.condition && (riskLevel !== 'Low' || hash % 2 === 0)) {
      activeDiagnoses.push(secondaryDiag);
    }

    // Medications
    const med1 = MEDICATIONS_POOL[hash % MEDICATIONS_POOL.length];
    const med2 = MEDICATIONS_POOL[(hash * 3) % MEDICATIONS_POOL.length];
    const currentMedications = [med1];
    if (med2.name !== med1.name) currentMedications.push(med2);

    // Past Visits (Simulating inter-hospital records!)
    const pastVisits = [
      {
        id: `v1-${hash}`,
        hospitalName: hosp.displayName || 'Current Hospital',
        date: '2026-08-10',
        chiefComplaint: primaryDiag.condition,
        doctorName: doc.name || 'Attending Physician',
        outcome: 'Admitted / Under Observation',
      },
      {
        id: `v2-${hash}`,
        hospitalName: INDIAN_CITIES[(idx + 2) % INDIAN_CITIES.length].city + ' General Hospital',
        date: '2026-02-14',
        chiefComplaint: 'Routine Cardiac & Metabolic Evaluation',
        doctorName: 'Dr. A. K. Sharma',
        outcome: 'Discharged with Medication Adjustment',
      },
      {
        id: `v3-${hash}`,
        hospitalName: INDIAN_CITIES[(idx + 5) % INDIAN_CITIES.length].city + ' Emergency Center',
        date: '2025-09-22',
        chiefComplaint: 'Acute Dyspnea & Vital Fluctuation',
        doctorName: 'Dr. V. Raman',
        outcome: 'Emergency Break-Glass Access Unlocked',
      }
    ];

    // Emergency Contact
    const relation = EMERGENCY_RELATIONS[hash % EMERGENCY_RELATIONS.length];
    const emergencyContact = {
      name: `Smt. / Shri ${p.name.split(' ')[0]} ${relation}`,
      relation,
      phone: `+91 98${10000000 + (hash % 89999999)}`,
    };

    // Consent setting
    let consentState = 'Full Access';
    if (idx % 13 === 0) consentState = 'Emergency Only';
    if (idx % 19 === 0) consentState = 'Revoked';

    // Break-Glass status
    const isBreakGlassActive = riskLevel === 'Critical' && (idx % 2 === 0);

    return {
      ...p,
      abhaId,
      bloodGroup,
      allergies,
      riskLevel,
      riskScore,
      vitals,
      activeDiagnoses,
      currentMedications,
      pastVisits,
      emergencyContact,
      consentState,
      isBreakGlassActive,
      hospitalName: hosp.displayName || hosp.name || 'Network Hospital',
      hospitalCity: hosp.city || 'District Center',
      doctorName: doc.name || 'Assigned Specialist',
      doctorSpecialty: doc.specialty || 'General Medicine',
    };
  });
};
