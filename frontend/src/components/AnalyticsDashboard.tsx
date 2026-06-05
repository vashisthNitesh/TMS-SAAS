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
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Analytics KPIs Highlight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Cost per ton mile */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Avg Cost / Ton-Mile</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-white">$1.52</span>
            <span className="text-xs font-semibold text-emerald-400">-2.4%</span>
          </div>
        </div>

        {/* Fleet utilization */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Fleet Capacity Utilization</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-white">84.6%</span>
            <span className="text-xs font-semibold text-emerald-400">+5.1%</span>
          </div>
        </div>

        {/* On Time delivery */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">On-Time OTP Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-white">96.4%</span>
            <span className="text-xs font-semibold text-emerald-400">+0.8%</span>
          </div>
        </div>

        {/* Carbon Offset */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Emissions Offset</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-white">34.2 Tons</span>
            <span className="text-xs font-semibold text-purple-400">+12.4%</span>
          </div>
        </div>

      </section>

      {/* SVG Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Cost Trend line chart */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-mono">Operations Audit</h3>
            <h2 className="text-lg font-bold text-white mt-1">Average Freight Spend ($/mile)</h2>
          </div>
          
          <div className="w-full h-64 bg-slate-950/20 border border-white/5 rounded-2xl flex items-center justify-center p-4">
            {/* Custom line SVG */}
            <svg viewBox="0 0 500 200" className="w-full h-full text-slate-700">
              {/* Horizontal helper lines */}
              <line x1="40" y1="40" x2="480" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Vertical helper lines */}
              <line x1="40" y1="160" x2="40" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              <line x1="480" y1="160" x2="480" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="30" y="44" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end" fontFamily="monospace">$4.0</text>
              <text x="30" y="84" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end" fontFamily="monospace">$3.0</text>
              <text x="30" y="124" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end" fontFamily="monospace">$2.0</text>
              <text x="30" y="164" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end" fontFamily="monospace">$1.0</text>
              
              {/* Trend line paths */}
              {/* Original Route (Red dotted) */}
              <path
                d="M 40 130 L 110 110 L 180 140 L 250 90 L 320 85 L 390 120 L 480 75"
                fill="none"
                stroke="rgba(244, 63, 94, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              
              {/* Optimized Route (Cyan glowing solid) */}
              <path
                d="M 40 130 L 110 100 L 180 95 L 250 70 L 320 65 L 390 55 L 480 40"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Glowing circles */}
              <circle cx="110" cy="100" r="4" fill="#06b6d4" stroke="#fff" strokeWidth="1" />
              <circle cx="250" cy="70" r="4" fill="#06b6d4" stroke="#fff" strokeWidth="1" />
              <circle cx="390" cy="55" r="4" fill="#06b6d4" stroke="#fff" strokeWidth="1" />
              <circle cx="480" cy="40" r="4" fill="#06b6d4" stroke="#fff" strokeWidth="1" />

              {/* X Axis Labels */}
              <text x="40" y="180" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Jan</text>
              <text x="110" y="180" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Feb</text>
              <text x="180" y="180" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Mar</text>
              <text x="250" y="180" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Apr</text>
              <text x="320" y="180" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">May</text>
              <text x="390" y="180" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Jun</text>
            </svg>
          </div>
        </div>

        {/* Transporter performance columns bar chart */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-mono">OTP audit</h3>
            <h2 className="text-lg font-bold text-white mt-1">Transporter OTP Performance Matrix</h2>
          </div>

          <div className="w-full h-64 bg-slate-950/20 border border-white/5 rounded-2xl flex items-center justify-center p-4">
            <svg viewBox="0 0 500 200" className="w-full h-full text-slate-700">
              <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              <line x1="40" y1="160" x2="40" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* Y Axis Guide */}
              <text x="30" y="30" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end" fontFamily="monospace">100%</text>
              <text x="30" y="95" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end" fontFamily="monospace">50%</text>

              {/* Bar 1: Allied (98.4%) */}
              <rect x="75" y="32" width="30" height="128" fill="#10b981" rx="4" />
              <text x="90" y="25" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">98.4%</text>
              <text x="90" y="178" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Allied</text>

              {/* Bar 2: Swift (96.2%) */}
              <rect x="155" y="36" width="30" height="124" fill="#06b6d4" rx="4" />
              <text x="170" y="28" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">96.2%</text>
              <text x="170" y="178" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Swift</text>

              {/* Bar 3: Falcon (94.8%) */}
              <rect x="235" y="40" width="30" height="120" fill="#06b6d4" rx="4" />
              <text x="250" y="32" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">94.8%</text>
              <text x="250" y="178" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Falcon</text>

              {/* Bar 4: Titan (91.2%) */}
              <rect x="315" y="52" width="30" height="108" fill="#f59e0b" rx="4" />
              <text x="330" y="44" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">91.2%</text>
              <text x="330" y="178" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Titan</text>

              {/* Bar 5: Vanguard (99.1%) */}
              <rect x="395" y="30" width="30" height="130" fill="#10b981" rx="4" />
              <text x="410" y="22" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">99.1%</text>
              <text x="410" y="178" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">Vanguard</text>
            </svg>
          </div>
        </div>

      </div>

      {/* Reports compile dashboard card */}
      <section className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400">
            <AnalyticsIcon size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-sans">Custom Ledger Reports Generator</h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-md">Compile data for transporter KPI boards and lane cost savings matrices.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Select Category */}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            disabled={isCompiling}
            className="px-3.5 py-2 text-xs bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500 transition-colors w-full sm:w-auto"
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
            className="px-3.5 py-2 text-xs bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500 transition-colors w-full sm:w-auto"
          >
            <option value="PDF Ledger">PDF Audit Ledger</option>
            <option value="Excel Sheet">Excel Workbook</option>
            <option value="JSON Dump">Raw JSON stream</option>
          </select>

          {!downloadReady ? (
            <button
              onClick={startCompilation}
              disabled={isCompiling}
              className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white rounded-xl transition-colors w-full sm:w-auto text-center"
            >
              {isCompiling ? `Compiling (${compileProgress}%)` : "Compile Ledger"}
            </button>
          ) : (
            <button
              onClick={() => {
                alert(`Downloading report ledger for ${reportType} in ${reportFormat} format.`);
                setDownloadReady(false);
              }}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto text-center shadow-lg shadow-emerald-500/10"
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
