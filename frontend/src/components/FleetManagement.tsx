import React, { useState } from "react";
import { TruckIcon, UserIcon, CheckIcon, AlertIcon, SearchIcon } from "./icons";

interface Carrier {
  name: string;
  type: string;
  rating: number;
  otp: string;
  activeTrucks: number;
  totalFleet: number;
  specialization: string;
  compliance: "DOT Compliant" | "Pending Audit" | "Hazard Certified";
}

interface Driver {
  name: string;
  carrier: string;
  truckId: string;
  status: "En Route" | "Rest Stop" | "Off Duty" | "Pre-Trip Check";
  gpsPing: string;
  phone: string;
}

const CARRIERS: Carrier[] = [
  { name: "Allied Logistics", type: "Reefer & Cold Chain FTL", rating: 4.9, otp: "98.4%", activeTrucks: 42, totalFleet: 65, specialization: "Temp-Control / Pharma", compliance: "DOT Compliant" },
  { name: "Swift Express", type: "Dry Van & LTL Operations", rating: 4.7, otp: "96.2%", activeTrucks: 88, totalFleet: 120, specialization: "Short-haul Courier", compliance: "DOT Compliant" },
  { name: "Falcon Carrier", type: "Flatbed & Dry Van FTL", rating: 4.6, otp: "94.8%", activeTrucks: 31, totalFleet: 50, specialization: "Steel & Construction", compliance: "Hazard Certified" },
  { name: "Titan Heavy Haul", type: "Specialized Superload", rating: 4.8, otp: "91.2%", activeTrucks: 12, totalFleet: 20, specialization: "Heavy Machinery", compliance: "Pending Audit" },
  { name: "Vanguard Carrier", type: "Express Air-Freight Feeder", rating: 4.9, otp: "99.1%", activeTrucks: 18, totalFleet: 25, specialization: "Time-Critical Medical", compliance: "DOT Compliant" },
];

const DRIVERS: Driver[] = [
  { name: "Marcus Vance", carrier: "Allied Logistics", truckId: "TRK-2090", status: "En Route", gpsPing: "2 mins ago", phone: "+1 (555) 019-2834" },
  { name: "Devon Reynolds", carrier: "Swift Express", truckId: "TRK-7411", status: "Rest Stop", gpsPing: "12 mins ago", phone: "+1 (555) 041-9988" },
  { name: "Sarah Chen", carrier: "Falcon Carrier", truckId: "TRK-1022", status: "En Route", gpsPing: "Just now", phone: "+1 (555) 012-4402" },
  { name: "Carlos Santana", carrier: "Apex Freight", truckId: "TRK-8890", status: "Pre-Trip Check", gpsPing: "35 mins ago", phone: "+1 (555) 032-9011" },
  { name: "Bradley Hughes", carrier: "Titan Heavy Haul", truckId: "TRK-0092", status: "En Route", gpsPing: "5 mins ago", phone: "+1 (555) 098-7711" },
  { name: "Elena Rostova", carrier: "Vanguard Carrier", truckId: "TRK-5541", status: "Off Duty", gpsPing: "1 hour ago", phone: "+1 (555) 077-8899" },
];

export default function FleetManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [search, setSearch] = useState("");

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.carrier.toLowerCase().includes(search.toLowerCase()) ||
    d.truckId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Transporter profiles grid */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Transporter Scorecard Profiles</h2>
          <p className="text-xs text-slate-500 mt-0.5">Audited carriers, lane capability ratings, and safety reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CARRIERS.map((carrier, idx) => {
            let compBadge = "text-emerald-700 border-emerald-200 bg-emerald-50";
            if (carrier.compliance === "Pending Audit") compBadge = "text-amber-700 border-amber-200 bg-amber-50";
            if (carrier.compliance === "Hazard Certified") compBadge = "text-purple-700 border-purple-200 bg-purple-50";
            
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden bg-white border border-slate-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{carrier.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{carrier.type}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-semibold font-mono rounded-full border ${compBadge}`}>
                    {carrier.compliance}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-center bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-mono">OTP Rating</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">{carrier.otp}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-mono">Safety rating</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">★ {carrier.rating}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-mono">Active Load</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">{carrier.activeTrucks}/{carrier.totalFleet}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600">
                  <span className="text-slate-400 font-mono">Lane specialty: </span>
                  <span className="font-semibold text-slate-800">{carrier.specialization}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Driver Duty Roster */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Driver Roster & Duty Status</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live check-in times and active duty states</p>
          </div>

          <div className="relative w-full sm:w-64">
            <SearchIcon size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver, carrier, asset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="pb-3 px-4 rounded-tl-lg">Driver Name</th>
                <th className="pb-3 px-4">Carrier</th>
                <th className="pb-3 px-4">Allocated Asset</th>
                <th className="pb-3 px-4 font-mono">GPS Heartbeat</th>
                <th className="pb-3 px-4">Duty Status</th>
                <th className="pb-3 px-4 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDrivers.map((driver, index) => {
                let statusBadge = "text-blue-700 border-blue-200 bg-blue-50";
                if (driver.status === "Rest Stop") statusBadge = "text-amber-700 border-amber-200 bg-amber-50";
                if (driver.status === "Off Duty") statusBadge = "text-slate-600 border-slate-250 bg-slate-100";
                if (driver.status === "Pre-Trip Check") statusBadge = "text-indigo-700 border-indigo-200 bg-indigo-50";
                
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold font-mono text-[10px]">
                        {driver.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span>{driver.name}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{driver.carrier}</td>
                    <td className="py-4 px-4 font-mono text-brand-indigo font-bold">{driver.truckId}</td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{driver.gpsPing}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${statusBadge}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => alert(`Direct Line established with ${driver.name} at ${driver.phone}`)}
                        className="px-2.5 py-1.5 text-[10px] font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-colors font-sans"
                      >
                        Ping Link
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
