import React, { useState } from "react";
import { AnalyticsIcon, CheckIcon, DownloadIcon, AlertIcon } from "./icons";

export default function AnalyticsDashboard() {
  const [reportType, setReportType] = useState("OTD Performance");
  const [reportFormat, setReportFormat] = useState("PDF Ledger");
  const [isCompiling, setIsCompiling] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);

  const startCompilation = () => {
    setIsCompiling(true);
    setDownloadReady(false);
    setCompileProgress(0);

    const interval = setInterval(() => {
      setCompileProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompiling(false);
          setDownloadReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Analytics KPIs Highlight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Cost per ton mile */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-1 relative overflow-hidden bg-white border border-slate-200">
          <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Avg Cost / Ton-Mile</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">$1.52</span>
            <span className="text-xs font-bold text-emerald-600">-2.4%</span>
          </div>
        </div>

        {/* Fleet utilization */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-1 relative overflow-hidden bg-white border border-slate-200">
          <div className="absolute top-0 right-0 h-16 w-16 bg-brand-indigo/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Fleet Capacity Utilization</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">84.6%</span>
            <span className="text-xs font-bold text-emerald-600">+5.1%</span>
          </div>
        </div>

        {/* On Time delivery */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-1 relative overflow-hidden bg-white border border-slate-200">
          <div className="absolute top-0 right-0 h-16 w-16 bg-brand-emerald/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">On-Time OTP Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">96.4%</span>
            <span className="text-xs font-bold text-emerald-600">+0.8%</span>
          </div>
        </div>

        {/* Carbon Offset */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-1 relative overflow-hidden bg-white border border-slate-200">
          <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Emissions Offset</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">34.2 Tons</span>
            <span className="text-xs font-bold text-brand-indigo">+12.4%</span>
          </div>
        </div>

      </section>

      {/* SVG Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Cost Trend line chart */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 bg-white border border-slate-200">
          <div>
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">Operations Audit</h3>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Average Freight Spend ($/mile)</h2>
          </div>
          
          <div className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-4">
            {/* Custom line SVG */}
            <svg viewBox="0 0 500 200" className="w-full h-full text-slate-300">
              {/* Horizontal helper lines */}
              <line x1="40" y1="40" x2="480" y2="40" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />
              <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />
              
              {/* Vertical helper lines */}
              <line x1="40" y1="160" x2="40" y2="20" stroke="rgba(15,23,42,0.06)" strokeWidth="1.5" />
              <line x1="480" y1="160" x2="480" y2="20" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="30" y="44" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">$4.0</text>
              <text x="30" y="84" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">$3.0</text>
              <text x="30" y="124" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">$2.0</text>
              <text x="30" y="164" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">$1.0</text>
              
              {/* Trend line paths */}
              {/* Original Route (Red dotted) */}
              <path
                d="M 40 130 L 110 110 L 180 140 L 250 90 L 320 85 L 390 120 L 480 75"
                fill="none"
                stroke="rgba(225, 29, 72, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              
              {/* Optimized Route (Indigo solid) */}
              <path
                d="M 40 130 L 110 100 L 180 95 L 250 70 L 320 65 L 390 55 L 480 40"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Circles */}
              <circle cx="110" cy="100" r="3.5" fill="#4f46e5" stroke="#fff" strokeWidth="1" />
              <circle cx="250" cy="70" r="3.5" fill="#4f46e5" stroke="#fff" strokeWidth="1" />
              <circle cx="390" cy="55" r="3.5" fill="#4f46e5" stroke="#fff" strokeWidth="1" />
              <circle cx="480" cy="40" r="3.5" fill="#4f46e5" stroke="#fff" strokeWidth="1" />

              {/* X Axis Labels */}
              <text x="40" y="180" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Jan</text>
              <text x="110" y="180" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Feb</text>
              <text x="180" y="180" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Mar</text>
              <text x="250" y="180" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Apr</text>
              <text x="320" y="180" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">May</text>
              <text x="390" y="180" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Jun</text>
            </svg>
          </div>
        </div>

        {/* Transporter performance columns bar chart */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 bg-white border border-slate-200">
          <div>
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">OTP audit</h3>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Transporter OTP Performance Matrix</h2>
          </div>

          <div className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-4">
            <svg viewBox="0 0 500 200" className="w-full h-full text-slate-300">
              <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(15,23,42,0.06)" strokeWidth="1.5" />
              <line x1="40" y1="160" x2="40" y2="20" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />

              {/* Y Axis Guide */}
              <text x="30" y="30" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">100%</text>
              <text x="30" y="95" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">50%</text>

              {/* Bar 1: Allied (98.4%) */}
              <rect x="75" y="32" width="30" height="128" fill="#10b981" rx="3" />
              <text x="90" y="25" fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">98.4%</text>
              <text x="90" y="178" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Allied</text>

              {/* Bar 2: Swift (96.2%) */}
              <rect x="155" y="36" width="30" height="124" fill="#4f46e5" rx="3" />
              <text x="170" y="28" fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">96.2%</text>
              <text x="170" y="178" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Swift</text>

              {/* Bar 3: Falcon (94.8%) */}
              <rect x="235" y="40" width="30" height="120" fill="#4f46e5" rx="3" />
              <text x="250" y="32" fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">94.8%</text>
              <text x="250" y="178" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Falcon</text>

              {/* Bar 4: Titan (91.2%) */}
              <rect x="315" y="52" width="30" height="108" fill="#d97706" rx="3" />
              <text x="330" y="44" fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">91.2%</text>
              <text x="330" y="178" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Titan</text>

              {/* Bar 5: Vanguard (99.1%) */}
              <rect x="395" y="30" width="30" height="130" fill="#10b981" rx="3" />
              <text x="410" y="22" fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">99.1%</text>
              <text x="410" y="178" fill="rgba(15,23,42,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Vanguard</text>
            </svg>
          </div>
        </div>

      </div>

      {/* Reports compile dashboard card */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border border-slate-200">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <AnalyticsIcon size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">Custom Ledger Reports Generator</h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-md">Compile data for transporter KPI boards and lane cost savings matrices.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Select Category */}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            disabled={isCompiling}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-indigo transition-colors w-full sm:w-auto"
          >
            <option value="OTD Performance">Transporter OTP Ledger</option>
            <option value="Lane Cost Savings">Lane Cost Savings Sheets</option>
            <option value="Emissions Audit">Emissions & Fuel logs</option>
          </select>

          {/* Select Format */}
          <select
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
            disabled={isCompiling}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-indigo transition-colors w-full sm:w-auto"
          >
            <option value="PDF Ledger">PDF Audit Ledger</option>
            <option value="Excel Sheet">Excel Workbook</option>
            <option value="JSON Dump">Raw JSON stream</option>
          </select>

          {!downloadReady ? (
            <button
              onClick={startCompilation}
              disabled={isCompiling}
              className="px-4 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover disabled:bg-slate-300 text-white rounded-xl transition-colors w-full sm:w-auto text-center"
            >
              {isCompiling ? `Compiling (${compileProgress}%)` : "Compile Ledger"}
            </button>
          ) : (
            <button
              onClick={() => {
                alert(`Downloading report ledger for ${reportType} in ${reportFormat} format.`);
                setDownloadReady(false);
              }}
              className="px-4 py-2 text-xs font-semibold bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto text-center shadow-sm"
            >
              <DownloadIcon size={12} />
              Download Report
            </button>
          )}
        </div>
      </section>

    </div>
  );
}
