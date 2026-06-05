import React, { useState } from "react";
import { CheckIcon, PlusIcon, AlertIcon } from "./icons";

interface DocumentType {
  id: string;
  name: string;
  scope: "Driver" | "Vehicle" | "Carrier" | "Shipment";
  mandatory: "Yes" | "Conditional" | "No";
  expiryCheck: string;
}

interface VerificationLog {
  id: string;
  document: string;
  entity: string;
  uploadedDate: string;
  status: "Verified" | "Under Review" | "Expiring Soon";
}

export default function DocPermits() {
  const [docTypes, setDocTypes] = useState<DocumentType[]>([
    { id: "DOC-101", name: "Commercial Driver License (CDL)", scope: "Driver", mandatory: "Yes", expiryCheck: "Annual Validation" },
    { id: "DOC-102", name: "DOT Vehicle Safety Certificate", scope: "Vehicle", mandatory: "Yes", expiryCheck: "Every 6 Months" },
    { id: "DOC-103", name: "EPA Hazardous Transport Permit", scope: "Shipment", mandatory: "Conditional", expiryCheck: "Per Shipment" },
    { id: "DOC-104", name: "transporter Insurance Indemnity", scope: "Carrier", mandatory: "Yes", expiryCheck: "Annual Validation" },
  ]);

  const [verificationQueue, setVerificationQueue] = useState<VerificationLog[]>([
    { id: "VER-401", document: "CDL Class A (Marcus Vance)", entity: "Driver", uploadedDate: "2026-06-01", status: "Verified" },
    { id: "VER-402", document: "HAZMAT Route Permit (TR-7089)", entity: "Shipment", uploadedDate: "2026-06-04", status: "Under Review" },
    { id: "VER-403", document: "Tractor Insurance (TRK-2090)", entity: "Vehicle", uploadedDate: "2026-05-15", status: "Expiring Soon" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", scope: "Driver" as DocumentType["scope"], mandatory: "Yes" as DocumentType["mandatory"], expiryCheck: "Annual" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const item: DocumentType = {
      id: `DOC-${Math.floor(200 + Math.random() * 799)}`,
      name: newDoc.name,
      scope: newDoc.scope,
      mandatory: newDoc.mandatory,
      expiryCheck: newDoc.expiryCheck,
    };
    setDocTypes([...docTypes, item]);
    setIsAdding(false);
    setNewDoc({ name: "", scope: "Driver", mandatory: "Yes", expiryCheck: "Annual" });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Document Registry Table */}
      <section className="xl:col-span-2 glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Compliance Document Checklist</h2>
            <p className="text-xs text-slate-500 mt-0.5">Register required permits, safety certificates, and driver license checkpoints</p>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors shadow-sm"
          >
            <PlusIcon size={12} />
            Add Doc Profile
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="py-2.5 px-4 rounded-tl-lg">Doc ID</th>
                <th className="py-2.5 px-4">Document Profile</th>
                <th className="py-2.5 px-4">Compliance Scope</th>
                <th className="py-2.5 px-4">Validation Interval</th>
                <th className="py-2.5 px-4 rounded-tr-lg text-right">Mandatory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {docTypes.map((doc) => {
                let badgeColor = "text-slate-600 bg-slate-100 border border-slate-200";
                if (doc.scope === "Driver") badgeColor = "text-indigo-700 border-indigo-200 bg-indigo-50";
                if (doc.scope === "Vehicle") badgeColor = "text-blue-700 border-blue-200 bg-blue-50";
                
                let mandatoryBadge = "text-slate-650 bg-slate-100 border border-slate-200";
                if (doc.mandatory === "Yes") mandatoryBadge = "text-emerald-700 border-emerald-200 bg-emerald-50";
                if (doc.mandatory === "Conditional") mandatoryBadge = "text-amber-700 border-amber-200 bg-amber-50";

                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-indigo">{doc.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{doc.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeColor}`}>
                        {doc.scope}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{doc.expiryCheck}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${mandatoryBadge}`}>
                        {doc.mandatory}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verification Audit Queue */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col gap-4 bg-white border border-slate-200 h-fit">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">Verification Ledger Queue</h2>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Verify incoming driver licenses & DOT certificates</p>
        </div>

        <div className="flex flex-col gap-3">
          {verificationQueue.map((v) => {
            let statusBadge = "text-emerald-700 border-emerald-200 bg-emerald-50";
            if (v.status === "Under Review") statusBadge = "text-indigo-700 border-indigo-200 bg-indigo-50";
            if (v.status === "Expiring Soon") statusBadge = "text-rose-700 border-rose-200 bg-rose-50";
            
            return (
              <div
                key={v.id}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-500 block">{v.id}</span>
                  <span className="text-slate-900 font-semibold block mt-0.5">{v.document}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Scope: {v.entity} | Date: {v.uploadedDate}</span>
                </div>
                <span className={`px-2 py-0.5 text-[8px] font-semibold rounded-full border ${statusBadge} flex-shrink-0 ml-2`}>
                  {v.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Document Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          
          <form
            onSubmit={handleAdd}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-slide-up text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Add Document Requirement</h2>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">DOCUMENT NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. Hazardous Cargo Route Pass"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">COMPLIANCE SCOPE</label>
                <select
                  value={newDoc.scope}
                  onChange={(e) => setNewDoc({ ...newDoc, scope: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                >
                  <option value="Driver">Driver Checklist</option>
                  <option value="Vehicle">Vehicle Chassis</option>
                  <option value="Carrier">transporter Vendor</option>
                  <option value="Shipment">Cargo Manifest</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">MANDATORY STATUS</label>
                <select
                  value={newDoc.mandatory}
                  onChange={(e) => setNewDoc({ ...newDoc, mandatory: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                >
                  <option value="Yes">Yes (Lock dispatch)</option>
                  <option value="Conditional">Conditional (Alert only)</option>
                  <option value="No">No (Optional file)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">VALIDATION INTERVAL</label>
              <input
                type="text"
                required
                placeholder="e.g. Annual Validation, Every 6 months"
                value={newDoc.expiryCheck}
                onChange={(e) => setNewDoc({ ...newDoc, expiryCheck: e.target.value })}
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
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
