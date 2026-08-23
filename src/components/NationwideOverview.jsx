import React, { useState } from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { 
  Building2, 
  MapPin, 
  Users, 
  Stethoscope, 
  Activity, 
  PhoneCall, 
  ShieldCheck, 
  Filter, 
  Bed, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const NationwideOverview = () => {
  const { 
    hospitals, 
    searchTerm, 
    setActiveTab, 
    setSelectedHospitalFilter 
  } = useAarogya();

  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter hospitals based on search & drop downs
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = searchTerm === '' || 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.state?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'ALL' || h.region === selectedRegion;
    const matchesStatus = selectedStatus === 'ALL' || h.status === selectedStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleSelectHospital = (hospId) => {
    setSelectedHospitalFilter(hospId);
    setActiveTab('patients');
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Nationwide Connected Hospital Grid</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time occupancy, doctors on duty, and clinical capability across 10 ABDM integrated hospitals
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Regions</option>
              <option value="North" className="bg-slate-900">North India</option>
              <option value="South" className="bg-slate-900">South India</option>
              <option value="West" className="bg-slate-900">West India</option>
              <option value="East" className="bg-slate-900">East India</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="Operational" className="bg-slate-900">Operational</option>
              <option value="Emergency Surge" className="bg-slate-900">Emergency Surge</option>
              <option value="High Occupancy" className="bg-slate-900">High Occupancy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredHospitals.map((hosp) => {
          const isSurge = hosp.status === 'Emergency Surge';
          const isHigh = hosp.status === 'High Occupancy';

          let statusBadge = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
          if (isSurge) statusBadge = 'bg-rose-950/80 text-rose-400 border-rose-500/40 animate-pulse';
          else if (isHigh) statusBadge = 'bg-amber-950/80 text-amber-400 border-amber-500/40';

          return (
            <div
              key={hosp.id}
              className="glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative group"
            >
              <div>
                {/* Top Status & Location */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                    {hosp.status}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{hosp.city || hosp.location}</span>
                  </span>
                </div>

                {/* Hospital Name */}
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {hosp.displayName || hosp.name}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{hosp.accreditation || 'NABH Accredited'}</span>
                </div>

                {/* Level Badge */}
                <div className="mt-2 text-[10px] font-semibold text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 inline-block">
                  {hosp.traumaCenterLevel || 'Tertiary Care Hospital'}
                </div>

                {/* ICU Capacity Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ICU Occupancy</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {hosp.icuCapacity?.available || 6} / {hosp.icuCapacity?.total || 40} Beds Avail
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        (hosp.occupancyRate || 75) > 85
                          ? 'bg-rose-500'
                          : (hosp.occupancyRate || 75) > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${hosp.occupancyRate || 75}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Active Doctors</div>
                    <div className="font-extrabold text-cyan-400 font-mono text-sm mt-0.5 flex items-center justify-center gap-1">
                      <Stethoscope className="w-3 h-3" />
                      <span>{hosp.doctorCount || hosp.doctors?.length || 3}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Admitted EHR</div>
                    <div className="font-extrabold text-emerald-400 font-mono text-sm mt-0.5 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{hosp.patientCount || hosp.patients?.length || 10}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-slate-400" />
                  <span>{hosp.emergencyPhone || '+91 1800-11-2041'}</span>
                </span>
                <button
                  onClick={() => handleSelectHospital(hosp.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all"
                >
                  <span>View Roster</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
