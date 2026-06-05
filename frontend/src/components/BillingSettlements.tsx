import React, { useState } from "react";
import { BillingIcon, CheckIcon, CloseIcon, AlertIcon, DownloadIcon, SearchIcon } from "./icons";

interface Invoice {
  id: string;
  tripId: string;
  carrier: string;
  amount: string;
  status: "Audited" | "Pending Audit" | "Disputed" | "Settled";
  dueDate: string;
  lane: string;
}

interface BillingSettlementsProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

const TARIFF_LANES = [
  { id: "TL-001", lane: "Seattle Port ➔ Chicago Hub", carrier: "Falcon Carrier", baseRate: "$3,800", fsc: "$450", detentionRate: "$75 / hr", freeTime: "2 hours" },
  { id: "TL-002", lane: "Chicago Hub ➔ New York Depot", carrier: "Allied Logistics", baseRate: "$3,100", fsc: "$320", detentionRate: "$80 / hr", freeTime: "2 hours" },
  { id: "TL-003", lane: "Houston Terminal ➔ Denver CFA", carrier: "Swift Express", baseRate: "$1,650", fsc: "$240", detentionRate: "$65 / hr", freeTime: "1.5 hours" },
  { id: "TL-004", lane: "Atlanta Yard ➔ Houston Terminal", carrier: "Titan Heavy Haul", baseRate: "$9,800", fsc: "$1,200", detentionRate: "$150 / hr", freeTime: "3 hours" },
];

export default function BillingSettlements({ invoices, setInvoices }: BillingSettlementsProps) {
  const [claimsActionMessage, setClaimsActionMessage] = useState<string | null>(null);
  const [disputeResolved, setDisputeResolved] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const resolveDispute = (action: "approve" | "adjust" | "reject") => {
    setDisputeResolved(true);
    let message = "";
    
    // Update invoice list state
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === "INV-2705") {
          let updatedStatus: Invoice["status"] = "Audited";
          if (action === "approve") {
            message = "Approved! $275 waiting detention claim added to invoice billing. Adjusted Total: $4,525.00.";
            updatedStatus = "Audited";
          } else if (action === "adjust") {
            message = "Adjusted! Offered $150 final settlement for wait time. Adjusted Total: $4,400.00.";
            updatedStatus = "Audited";
          } else {
            message = "Rejected! Claims denied due to GPS exit geofence log mismatches. Total remains $4,250.00.";
            updatedStatus = "Audited"; // Resolves dispute
          }
          return { ...inv, status: updatedStatus, amount: action === "approve" ? "$4,525.00" : action === "adjust" ? "$4,400.00" : "$4,250.00" };
        }
        return inv;
      })
    );
    setClaimsActionMessage(message);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.carrier.toLowerCase().includes(search.toLowerCase()) ||
      inv.lane.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus =
      filter === "all" || inv.status.toLowerCase().replace(" ", "-") === filter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Top Section: Claims dispute auditor & rates */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Interactive Detention Claim Auditor Card */}
        <div className="xl:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[380px] relative overflow-hidden bg-white border border-slate-200">
          <div className="absolute top-0 right-0 h-32 w-32 bg-brand-emerald/5 rounded-bl-full pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-[10px] text-rose-600 uppercase font-mono font-bold">Telematics Detention Claim Audit</span>
            </div>

            {!disputeResolved ? (
              <div className="mt-4 flex flex-col gap-4 font-sans text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">INV-2705 • Falcon Carrier Claim</h3>
                    <p className="text-slate-500 mt-1">Trip ID: <span className="font-mono text-brand-indigo font-bold">TR-7089</span> | Lane: Seattle ➔ Chicago</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-rose-600 font-bold block font-mono">+$275.00 Claimed</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">3h 40m Waiting Time</span>
                  </div>
                </div>

                {/* GPS Telematics Validation Feed */}
                <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl flex flex-col gap-2 font-mono text-[10px] text-slate-600">
                  <span className="text-slate-800 font-bold">GPS Geofence Log Match:</span>
                  <div className="flex flex-col gap-1 text-slate-500 leading-relaxed">
                    <div>[13:40:12] GEO: Vehicle entered destination yard geofence boundary.</div>
                    <div className="text-amber-600 font-semibold">[14:15:33] DOCK: Target docked at Bay 4. (Delay: 35 mins waiting queue).</div>
                    <div>[17:25:01] GEO: Vehicle departed destination yard geofence.</div>
                    <div className="text-brand-indigo font-bold">
                      Audit: Total yard duration: 3h 44m. Contract allowance free time: 2h 00m.
                      Unbillable queue wait: 1h 44m.
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex gap-3 text-emerald-800">
                  <AlertIcon size={16} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                  <p className="text-[10px] leading-normal text-emerald-700">
                    Carrier logged demurrage at 14:15. Telematics confirms truck arrived at dock 14:45. Valid waiting variance is 1 hour 44 minutes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center flex flex-col items-center gap-4 py-8 animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckIcon size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dispute Audited Successfully</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">{claimsActionMessage}</p>
                </div>
                <button
                  onClick={() => {
                    setDisputeResolved(false);
                    setClaimsActionMessage(null);
                  }}
                  className="px-3.5 py-1.5 text-[10px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                >
                  Audit Another
                </button>
              </div>
            )}
          </div>

          {!disputeResolved && (
            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => resolveDispute("approve")}
                className="flex-1 py-2 text-xs font-semibold bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-sm"
              >
                Approve Full Claim
              </button>
              <button
                onClick={() => resolveDispute("adjust")}
                className="flex-1 py-2 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
              >
                Offer Adjust ($150)
              </button>
              <button
                onClick={() => resolveDispute("reject")}
                className="flex-1 py-2 text-xs font-semibold bg-brand-rose hover:bg-rose-600 text-white rounded-xl transition-colors shadow-sm"
              >
                Deny Claim
              </button>
            </div>
          )}
        </div>

        {/* Lane Contract Tariffs Summary */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 bg-white border border-slate-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Contract Tariff Sheet</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">Assigned lanes and spot pricing contracts</p>
          </div>

          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[300px] pr-1">
            {TARIFF_LANES.map((tl) => (
              <div
                key={tl.id}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col gap-2 hover:border-slate-350 transition-colors"
              >
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-700 font-bold">{tl.lane}</span>
                  <span className="text-slate-400 font-normal">{tl.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400">Rate:</span>
                    <p className="font-bold text-slate-700 mt-0.5">{tl.baseRate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">FSC surcharge:</span>
                    <p className="font-bold text-slate-700 mt-0.5">{tl.fsc}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Carrier:</span>
                    <p className="font-bold text-brand-emerald mt-0.5 truncate">{tl.carrier}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Invoice Logs table */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Settlement Ledger & Invoices</h2>
            <p className="text-xs text-slate-500 mt-0.5">Auditing base freight and surcharge invoice files</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <SearchIcon size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices, carriers, lanes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-emerald transition-colors"
              />
            </div>
            
            <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 w-full sm:w-auto">
              {["all", "audited", "pending-audit", "disputed", "settled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold capitalize transition-colors ${
                    filter === st
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {st.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="pb-3 px-4 rounded-tl-lg">Invoice ID</th>
                <th className="pb-3 px-4">Trip ID</th>
                <th className="pb-3 px-4">Carrier</th>
                <th className="pb-3 px-4">Logistics Lane</th>
                <th className="pb-3 px-4 font-mono">Amount</th>
                <th className="pb-3 px-4">Due Date</th>
                <th className="pb-3 px-4 rounded-tr-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.map((inv) => {
                let statusBadge = "text-emerald-700 border-emerald-200 bg-emerald-50";
                if (inv.status === "Pending Audit") statusBadge = "text-indigo-700 border-indigo-200 bg-indigo-50";
                if (inv.status === "Disputed") statusBadge = "text-rose-700 border-rose-200 bg-rose-50";
                if (inv.status === "Settled") statusBadge = "text-slate-600 border-slate-200 bg-slate-100";

                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-brand-emerald">{inv.id}</td>
                    <td className="py-4 px-4 font-mono text-brand-indigo">{inv.tripId}</td>
                    <td className="py-4 px-4 font-semibold text-slate-900">{inv.carrier}</td>
                    <td className="py-4 px-4 text-slate-600">{inv.lane}</td>
                    <td className="py-4 px-4 font-mono text-slate-900 font-bold">{inv.amount}</td>
                    <td className="py-4 px-4 font-mono text-slate-500">{inv.dueDate}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusBadge}`}>
                        {inv.status}
                      </span>
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
