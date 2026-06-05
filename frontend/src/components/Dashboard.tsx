import React from "react";
import { CheckIcon, AlertIcon, TruckIcon, BillingIcon } from "./icons";

export default function Dashboard() {
  const kpis = [
    { label: "Active Trip Operations", value: "842", change: "+12.5%", color: "text-emerald-600", desc: "Vehicles en-route" },
    { label: "Pending Shipments", value: "1,249", change: "-4.3%", color: "text-slate-500", desc: "Awaiting dispatch allocation" },
    { label: "Critical SLA Risks", value: "37", change: "+8.1%", color: "text-rose-600", desc: "Requires route adjustment" },
    { label: "On-Time Performance (OTP)", value: "96.4%", change: "+0.8%", color: "text-emerald-600", desc: "Rolling 30-day average" },
  ];

  const recentReconciliations = [
    { id: "REC-901", order: "ORD-8812", client: "MedVantage Pharms", amount: "$3,420.00", status: "Reconciled" },
    { id: "REC-902", order: "ORD-8744", client: "BioGrid Energy", amount: "$12,400.00", status: "Audit Queue" },
    { id: "REC-903", order: "ORD-9081", client: "TechCorp Global", amount: "$4,250.00", status: "Disputed" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Executive KPIs Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-2xl p-5 flex flex-col justify-between bg-white border border-slate-200"
          >
            <div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">{kpi.label}</span>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">{kpi.value}</h3>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[10px]">
              <span className="text-slate-400 font-medium">{kpi.desc}</span>
              <span className={`font-bold ${kpi.color}`}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Fleet Utilization and Reconciliations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* SVG Chart Summary */}
        <div className="xl:col-span-2 glass-panel rounded-2xl p-6 bg-white border border-slate-200 flex flex-col justify-between min-h-[340px]">
          <div>
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">Performance Index</h3>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Weekly Delivery Status Summary</h2>
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center p-4">
            <svg viewBox="0 0 500 150" className="w-full h-full text-slate-300">
              <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(15,23,42,0.06)" strokeWidth="1" />
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />

              {/* Weekly bar groupings */}
              {/* Mon */}
              <rect x="70" y="30" width="16" height="90" fill="#4f46e5" rx="2" />
              <rect x="90" y="70" width="16" height="50" fill="#10b981" rx="2" />
              <text x="88" y="135" fill="rgba(15,23,42,0.4)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Mon</text>

              {/* Tue */}
              <rect x="140" y="25" width="16" height="95" fill="#4f46e5" rx="2" />
              <rect x="160" y="45" width="16" height="75" fill="#10b981" rx="2" />
              <text x="158" y="135" fill="rgba(15,23,42,0.4)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Tue</text>

              {/* Wed */}
              <rect x="210" y="40" width="16" height="80" fill="#4f46e5" rx="2" />
              <rect x="230" y="50" width="16" height="70" fill="#10b981" rx="2" />
              <text x="228" y="135" fill="rgba(15,23,42,0.4)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Wed</text>

              {/* Thu */}
              <rect x="280" y="20" width="16" height="100" fill="#4f46e5" rx="2" />
              <rect x="300" y="35" width="16" height="85" fill="#10b981" rx="2" />
              <text x="298" y="135" fill="rgba(15,23,42,0.4)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Thu</text>

              {/* Fri */}
              <rect x="350" y="35" width="16" height="85" fill="#4f46e5" rx="2" />
              <rect x="370" y="40" width="16" height="80" fill="#10b981" rx="2" />
              <text x="368" y="135" fill="rgba(15,23,42,0.4)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Fri</text>

              {/* Legend overlay inside SVG */}
              <rect x="420" y="15" width="60" height="30" fill="#f8fafc" rx="4" stroke="#e2e8f0" strokeWidth="1" />
              <circle cx="430" cy="23" r="3" fill="#4f46e5" />
              <text x="438" y="26" fill="#475569" fontSize="7" fontFamily="sans-serif">Dispatched</text>
              <circle cx="430" cy="35" r="3" fill="#10b981" />
              <text x="438" y="38" fill="#475569" fontSize="7" fontFamily="sans-serif">Delivered</text>
            </svg>
          </div>
        </div>

        {/* Order Reconciliations Summary Panel */}
        <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Order Reconciliation Logs</h2>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Auditing digital POD matches & billings</p>
          </div>

          <div className="flex flex-col gap-3">
            {recentReconciliations.map((rec) => {
              let recBadge = "text-emerald-700 border-emerald-200 bg-emerald-50";
              if (rec.status === "Audit Queue") recBadge = "text-indigo-700 border-indigo-200 bg-indigo-50";
              if (rec.status === "Disputed") recBadge = "text-rose-700 border-rose-200 bg-rose-50";
              
              return (
                <div
                  key={rec.id}
                  className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-500 block">{rec.id}</span>
                    <span className="text-slate-900 font-semibold block mt-0.5">{rec.client}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Order: {rec.order}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="font-mono text-slate-800 font-bold">{rec.amount}</span>
                    <span className={`px-2 py-0.5 text-[8px] font-semibold rounded-full border ${recBadge}`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
