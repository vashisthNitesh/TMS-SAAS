import React, { useState } from "react";
import { CheckIcon, PlusIcon, AlertIcon } from "./icons";

interface Branch {
  id: string;
  name: string;
  code: string;
  type: "Port" | "CFA" | "Hub" | "Depot" | "Yard";
  radius: number; // in meters
  hours: string;
}

interface RateCard {
  id: string;
  carrier: string;
  lane: string;
  baseRate: number;
  fscPercent: number;
  freeTime: number; // hours
  detentionRate: number; // dollars per hour
}

export default function MasterConfig() {
  const [branches, setBranches] = useState<Branch[]>([
    { id: "BR-01", name: "Seattle Port", code: "SEA-HUB", type: "Port", radius: 150, hours: "24/7 Operations" },
    { id: "BR-02", name: "Los Angeles CFA", code: "LAX-CFA", type: "CFA", radius: 100, hours: "06:00 - 22:00" },
    { id: "BR-03", name: "Denver CFA", code: "DEN-HUB", type: "CFA", radius: 100, hours: "08:00 - 18:00" },
    { id: "BR-04", name: "Chicago Hub", code: "ORD-HUB", type: "Hub", radius: 200, hours: "24/7 Operations" },
    { id: "BR-05", name: "Houston Terminal", code: "IAH-TERM", type: "Depot", radius: 150, hours: "07:00 - 23:00" },
    { id: "BR-06", name: "Atlanta Yard", code: "ATL-YARD", type: "Yard", radius: 120, hours: "24/7 Operations" },
  ]);

  const [rateCards, setRateCards] = useState<RateCard[]>([
    { id: "RC-101", carrier: "Allied Logistics", lane: "Chicago ➔ New York", baseRate: 3100, fscPercent: 12, freeTime: 2.0, detentionRate: 80 },
    { id: "RC-102", carrier: "Swift Express", lane: "Houston ➔ Denver", baseRate: 1650, fscPercent: 8, freeTime: 1.5, detentionRate: 65 },
    { id: "RC-103", carrier: "Falcon Carrier", lane: "Seattle ➔ Chicago", baseRate: 3800, fscPercent: 14, freeTime: 2.0, detentionRate: 75 },
    { id: "RC-104", carrier: "Titan Heavy Haul", lane: "Atlanta ➔ Houston", baseRate: 9800, fscPercent: 18, freeTime: 3.0, detentionRate: 150 },
  ]);

  // SLA config states
  const [slaTime, setSlaTime] = useState(30); // minutes before delay alert
  const [tempVariance, setTempVariance] = useState(0.5); // temperature degree variance
  const [detentionGrace, setDetentionGrace] = useState(120); // free waiting minutes
  const [isSaved, setIsSaved] = useState(false);

  const [newBranch, setNewBranch] = useState({ name: "", code: "", type: "Hub" as Branch["type"], radius: 100, hours: "24/7" });
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const branch: Branch = {
      id: `BR-${Math.floor(10 + Math.random() * 90)}`,
      name: newBranch.name,
      code: newBranch.code.toUpperCase(),
      type: newBranch.type,
      radius: newBranch.radius,
      hours: newBranch.hours,
    };
    setBranches([...branches, branch]);
    setIsAddingBranch(false);
    setNewBranch({ name: "", code: "", type: "Hub", radius: 100, hours: "24/7" });
  };

  const handleSaveSLA = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* SLA Configuration Controls */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col gap-6 h-fit bg-white">
        <div>
          <h2 className="text-base font-bold text-slate-900">System SLA Controls</h2>
          <p className="text-xs text-slate-500 mt-0.5">Define automated warning triggers and grace periods</p>
        </div>

        <div className="flex flex-col gap-5 text-xs">
          {/* Critical warning trigger */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-mono font-bold text-[10px] text-slate-600">
              <span>ETA SLA WARNING REACH (MINUTES)</span>
              <span className="text-brand-indigo font-bold">{slaTime} Mins</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={slaTime}
              onChange={(e) => setSlaTime(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
            <p className="text-[10px] text-slate-400">Trigger warnings when calculated arrival time is within this buffer limit.</p>
          </div>

          {/* Temperature variance threshold */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-mono font-bold text-[10px] text-slate-600">
              <span>COLD CHAIN VARIANCE LIMIT (°C)</span>
              <span className="text-brand-indigo font-bold">±{tempVariance} °C</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={tempVariance}
              onChange={(e) => setTempVariance(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
            <p className="text-[10px] text-slate-400">Allowable temperature deviation on pharmaceutical/perishable freight before alarm.</p>
          </div>

          {/* Free detention allowance */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-mono font-bold text-[10px] text-slate-600">
              <span>FREE DETENTION TIME (MINUTES)</span>
              <span className="text-brand-indigo font-bold">{detentionGrace} Mins</span>
            </div>
            <input
              type="range"
              min="30"
              max="240"
              step="15"
              value={detentionGrace}
              onChange={(e) => setDetentionGrace(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
            <p className="text-[10px] text-slate-400">Standard loading yard waiting time allocated before hourly demurrage rates apply.</p>
          </div>
        </div>

        <button
          onClick={handleSaveSLA}
          className="w-full mt-2 py-2.5 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors shadow-sm"
        >
          {isSaved ? "SLA Configuration Saved ✓" : "Save Configurations"}
        </button>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3">
          <AlertIcon size={16} className="text-brand-indigo flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-normal font-sans">
            Modifications to SLA rules trigger immediate recalculations across active telemetry streams. Event logs will report shifts in ETA flags.
          </p>
        </div>
      </section>

      {/* Operations Nodes & Warehouses Registry */}
      <section className="xl:col-span-2 glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Branch & Warehouse Registry</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage operational hub coordinate centers and geofences</p>
          </div>
          
          <button
            onClick={() => setIsAddingBranch(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors shadow-sm"
          >
            <PlusIcon size={12} />
            Add Node
          </button>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((b) => (
            <div
              key={b.id}
              className="border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:border-slate-300 transition-colors"
            >
              <div>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold uppercase mb-2">
                  {b.type}
                </span>
                <h3 className="text-xs font-bold text-slate-900">{b.name}</h3>
                <p className="text-[10px] text-slate-500 mt-1">Code: <span className="font-mono">{b.code}</span> | Hours: {b.hours}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-mono block">GEOFENCE</span>
                <span className="text-xs font-bold text-slate-700 font-mono block mt-0.5">{b.radius}m</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rates cards manager list */}
      <section className="xl:col-span-3 glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Carrier Contract Rate Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage standard lane contract rates, fuel surcharges, and detention tariffs</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="py-2.5 px-4 rounded-tl-lg">ID</th>
                <th className="py-2.5 px-4">Carrier</th>
                <th className="py-2.5 px-4">Logistics Lane</th>
                <th className="py-2.5 px-4 font-mono">Base Rate</th>
                <th className="py-2.5 px-4">Fuel Surcharge (FSC)</th>
                <th className="py-2.5 px-4 font-mono">Detention Rate</th>
                <th className="py-2.5 px-4 rounded-tr-lg text-right">Free Time Allowance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rateCards.map((rc) => (
                <tr key={rc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-indigo">{rc.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{rc.carrier}</td>
                  <td className="py-3 px-4 text-slate-600">{rc.lane}</td>
                  <td className="py-3 px-4 font-mono text-slate-800 font-semibold">${rc.baseRate.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-600 font-semibold">{rc.fscPercent}% Base</td>
                  <td className="py-3 px-4 font-mono text-slate-700">${rc.detentionRate}/hr</td>
                  <td className="py-3 px-4 font-mono text-right text-slate-600">{rc.freeTime} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal to add node */}
      {isAddingBranch && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddingBranch(false)} />
          
          <form
            onSubmit={handleAddBranch}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-slide-up"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Add Operational Node</h2>
              <button
                type="button"
                onClick={() => setIsAddingBranch(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">NODE NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. Dallas CFA"
                value={newBranch.name}
                onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">NODE CODE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DFW-CFA"
                  value={newBranch.code}
                  onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">NODE TYPE</label>
                <select
                  value={newBranch.type}
                  onChange={(e) => setNewBranch({ ...newBranch, type: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                >
                  <option value="Hub">Hub Terminal</option>
                  <option value="CFA">CFA Center</option>
                  <option value="Port">Port Node</option>
                  <option value="Depot">Distribution Depot</option>
                  <option value="Yard">Vehicle Yard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">GEOFENCE RADIUS (M)</label>
                <input
                  type="number"
                  required
                  value={newBranch.radius}
                  onChange={(e) => setNewBranch({ ...newBranch, radius: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">OPERATING HOURS</label>
                <input
                  type="text"
                  required
                  value={newBranch.hours}
                  onChange={(e) => setNewBranch({ ...newBranch, hours: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAddingBranch(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-lg shadow-sm"
              >
                Save Node
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
