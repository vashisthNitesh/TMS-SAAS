import React, { useState } from "react";
import { CheckIcon, PlusIcon, TruckIcon } from "./icons";

interface EquipmentItem {
  id: string;
  name: string;
  class: "Container" | "Trailer" | "Truck Type";
  specification: string;
  capacity: string;
  status: "Active" | "Maintenance" | "Audit Queue";
}

export default function EquipmentRegistry() {
  const [equipments, setEquipments] = useState<EquipmentItem[]>([
    { id: "EQ-401", name: "40FT High-Cube Reefer", class: "Container", specification: "ISO 45R1 • Temp Controlled", capacity: "58,200 lbs / 67 CBM", status: "Active" },
    { id: "EQ-402", name: "20FT Standard Dry Van", class: "Container", specification: "ISO 22G1 • General Purpose", capacity: "47,950 lbs / 33 CBM", status: "Active" },
    { id: "EQ-403", name: "Lowboy Gooseneck Semi-Trailer", class: "Trailer", specification: "3-Axle Heavy Duty TLR-901", capacity: "80,000 lbs Max Load", status: "Active" },
    { id: "EQ-404", name: "Step Deck Flatbed", class: "Trailer", specification: "Dual Axle Flatbed TLR-402", capacity: "48,000 lbs Max Load", status: "Active" },
    { id: "EQ-405", name: "16-Wheeler Heavy Semi-Tractor", class: "Truck Type", specification: "Class 8 Heavy Duty Diesel", capacity: "45,000 lbs Base Pull", status: "Maintenance" },
    { id: "EQ-406", name: "Refrigerated Box Truck", class: "Truck Type", specification: "24FT Medium Duty Temp-Control", capacity: "15,000 lbs Base Pull", status: "Active" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newEq, setNewEq] = useState({
    name: "",
    class: "Container" as EquipmentItem["class"],
    specification: "",
    capacity: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const item: EquipmentItem = {
      id: `EQ-${Math.floor(500 + Math.random() * 499)}`,
      name: newEq.name,
      class: newEq.class,
      specification: newEq.specification,
      capacity: newEq.capacity,
      status: "Active"
    };
    setEquipments([...equipments, item]);
    setIsAdding(false);
    setNewEq({ name: "", class: "Container", specification: "", capacity: "" });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800 font-sans">
      
      {/* Equipment list card */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Equipment & Asset Registry</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage ISO containers, specialized trailers, and fleet tractor classifications</p>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors shadow-sm"
          >
            <PlusIcon size={12} />
            Register Asset
          </button>
        </div>

        {/* Data Grid table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="py-2.5 px-4 rounded-tl-lg">Equipment ID</th>
                <th className="py-2.5 px-4">Asset Class</th>
                <th className="py-2.5 px-4">Equipment Model / Name</th>
                <th className="py-2.5 px-4">Technical Specifications</th>
                <th className="py-2.5 px-4">Rated Capacity Index</th>
                <th className="py-2.5 px-4 rounded-tr-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {equipments.map((eq) => {
                let badgeColor = "text-slate-600 bg-slate-100 border border-slate-200";
                if (eq.class === "Container") badgeColor = "text-blue-700 border-blue-200 bg-blue-50";
                if (eq.class === "Trailer") badgeColor = "text-indigo-700 border-indigo-200 bg-indigo-50";
                
                let statusBadge = "text-emerald-700 border-emerald-200 bg-emerald-50";
                if (eq.status === "Maintenance") statusBadge = "text-amber-700 border-amber-200 bg-amber-50";
                
                return (
                  <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-indigo">{eq.id}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeColor}`}>
                        {eq.class}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{eq.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{eq.specification}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">{eq.capacity}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${statusBadge}`}>
                        {eq.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Equipment Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          
          <form
            onSubmit={handleAdd}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-slide-up text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Register Fleet Equipment</h2>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">ASSET CLASS</label>
              <select
                value={newEq.class}
                onChange={(e) => setNewEq({ ...newEq, class: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
              >
                <option value="Container">Shipping Container</option>
                <option value="Trailer">Trailer Unit</option>
                <option value="Truck Type">Truck Tractor Type</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">EQUIPMENT MODEL / NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. 40FT Open Top Container"
                value={newEq.name}
                onChange={(e) => setNewEq({ ...newEq, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">TECHNICAL SPECIFICATIONS</label>
              <input
                type="text"
                required
                placeholder="e.g. Dual Axle, ISO 22U1"
                value={newEq.specification}
                onChange={(e) => setNewEq({ ...newEq, specification: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">RATED CAPACITY INDEX</label>
              <input
                type="text"
                required
                placeholder="e.g. 45,000 lbs / 80 CBM"
                value={newEq.capacity}
                onChange={(e) => setNewEq({ ...newEq, capacity: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-lg shadow-sm"
              >
                Register Asset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
