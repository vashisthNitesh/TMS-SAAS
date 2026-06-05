import React, { useState } from "react";
import { RouteIcon, ZapIcon, AlertIcon, CheckIcon } from "./icons";

interface Order {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  weight: string;
  status: "Pending" | "Scheduled" | "In Transit" | "Delivered" | "Disputed";
  priority: "Standard" | "Express" | "Critical SLA";
  carrier: string;
  createdDate: string;
}

interface RouteOptimizationProps {
  orders: Order[];
}

export default function RouteOptimization({ orders }: RouteOptimizationProps) {
  const [stops, setStops] = useState<string[]>([
    "Seattle Port (Origin)",
    "Denver CFA (Stop A)",
    "Chicago Hub (Stop B)",
    "New York Depot (Destination)",
  ]);
  const [newStop, setNewStop] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState("FTL - Dry Van");

  const addStop = () => {
    if (!newStop) return;
    const updated = [...stops];
    updated.splice(stops.length - 1, 0, newStop); // Insert before destination
    setStops(updated);
    setNewStop("");
  };

  const removeStop = (index: number) => {
    if (index === 0 || index === stops.length - 1) return; // Lock origin and destination
    setStops(stops.filter((_, idx) => idx !== index));
  };

  const runOptimizer = () => {
    setIsRunning(true);
    setShowResults(false);
    setConsoleLogs(["[0.0s] OPT-ENGINE: Initializing node matrix..."]);

    const steps = [
      { t: 600, log: "[0.6s] NODES: Calculating coordinates for 4 lane stops. Target matrix initialized." },
      { t: 1200, log: "[1.2s] TRAFFIC: Fetching live API density feeds. 1 active congestion node identified at Denver I-70." },
      { t: 1800, log: "[1.8s] WEATHER: Evaluating storm cells in Nebraska region. Restructuring routes SW." },
      { t: 2400, log: "[2.4s] COSTING: Auditing contract carrier rate matrices for Allied Logistics and Falcon Carrier." },
      { t: 3000, log: "[3.0s] SUCCESS: Found optimal stop sequence. Distance reduced by 270 miles. Saving $870." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, step.log]);
        if (idx === steps.length - 1) {
          setIsRunning(false);
          setShowResults(true);
        }
      }, step.t);
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Route Stops Inputs Panel */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">Lane Optimizer Planner</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure address stops to trigger AI stop re-sequencing</p>
        </div>

        {/* Vehicle Selection profile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-500 text-xs font-mono">ASSET EQUIPMENT PROFILE</label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-850 focus:outline-none focus:border-brand-indigo transition-colors"
          >
            <option value="FTL - Dry Van">FTL - Dry Van (Standard)</option>
            <option value="FTL - Reefer">FTL - Reefer (Cold Chain)</option>
            <option value="LTL - Flatbed">LTL - Flatbed (Heavy Load)</option>
            <option value="Hazmat Class 3">Hazmat Class 3 (Specialty)</option>
          </select>
        </div>

        {/* Address Stop Nodes List */}
        <div className="flex flex-col gap-3">
          <label className="text-slate-500 text-xs font-mono">ROUTE WAYPOINTS</label>
          <div className="flex flex-col gap-2 relative pl-3 border-l border-slate-200">
            {stops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === stops.length - 1;
              return (
                <div key={idx} className="flex items-center gap-2 group/stop">
                  <span className={`h-2 w-2 rounded-full absolute -left-[5px] ${isFirst ? "bg-brand-cyan" : isLast ? "bg-brand-emerald" : "bg-brand-indigo"}`} />
                  <div className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 rounded-xl flex items-center justify-between">
                    <span>{stop}</span>
                    {!isFirst && !isLast && (
                      <button
                        onClick={() => removeStop(idx)}
                        className="text-slate-400 hover:text-rose-600 text-[9px] font-bold font-mono transition-colors opacity-0 group-hover/stop:opacity-100"
                      >
                        REMOVE
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add waypoint input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add stop address..."
            value={newStop}
            onChange={(e) => setNewStop(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo transition-colors"
          />
          <button
            onClick={addStop}
            className="px-4 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-650 rounded-xl border border-slate-200 transition-colors"
          >
            Add Stop
          </button>
        </div>

        <button
          onClick={runOptimizer}
          disabled={isRunning}
          className="w-full mt-4 py-3 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <ZapIcon size={14} className="text-white" />
          {isRunning ? "Optimizing Lane..." : "Execute Optimizer Engine"}
        </button>
      </section>

      {/* Simulator Results & Logs Display */}
      <section className="xl:col-span-2 flex flex-col gap-6">
        
        {/* Console Logs */}
        {consoleLogs.length > 0 && (
          <div className="bg-slate-55 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 font-mono text-[10px] min-h-[160px] relative overflow-hidden bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-400">
              <span>AI LANES ENGINE OUTPUT</span>
              {isRunning && <span className="animate-pulse text-brand-indigo font-bold">CALCULATING...</span>}
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-slate-500 pr-1 select-all">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-600 font-bold" : ""}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparative Cards Dashboard */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {/* Cost saving card */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden bg-white border border-slate-200">
              <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[9px] text-brand-emerald font-mono font-bold uppercase">FINANCIAL YIELD</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">$870 Saved</h3>
              <p className="text-xs text-slate-500 mt-2 font-sans leading-normal">
                Avoided Denver I-70 tolls and reallocated to Allied Contract Lane. Total cost reduced by 18.2%.
              </p>
            </div>

            {/* Time efficiency card */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden bg-white border border-slate-200">
              <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[9px] text-brand-cyan font-mono font-bold uppercase">TIME EFFICIENCY</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">-5.5 Hours</h3>
              <p className="text-xs text-slate-500 mt-2 font-sans leading-normal">
                Bypassed Nebraska winter cells. Total transit time reduced from 26.5h to 21.0h. Preserved SLA window.
              </p>
            </div>

            {/* Carbon reduction card */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden bg-white border border-slate-200">
              <div className="absolute top-0 right-0 h-16 w-16 bg-brand-indigo/5 rounded-bl-full pointer-events-none" />
              <span className="text-[9px] text-brand-indigo font-mono font-bold uppercase">CARBON OFFSET</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">-45 Gal Fuel</h3>
              <p className="text-xs text-slate-500 mt-2 font-sans leading-normal">
                Bypassed 270 circuitous miles. Prevented 0.46 Metric Tons of CO2 emissions.
              </p>
            </div>

            {/* Map visual representation */}
            <div className="glass-panel rounded-2xl p-6 md:col-span-3 flex flex-col gap-3 bg-white border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">Visual Route Comparison</h3>
              <div className="w-full h-32 bg-slate-50 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-200">
                {/* SVG Visualizing lanes */}
                <svg viewBox="0 0 600 120" className="w-full h-full text-slate-300">
                  {/* Original route path (dashed red) */}
                  <path d="M 50 60 Q 200 110 350 10 Q 550 60 550 60" fill="none" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                  {/* Optimized route path (solid indigo) */}
                  <path d="M 50 60 L 200 40 L 350 80 L 550 60" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
                  
                  {/* Stop nodes */}
                  <circle cx="50" cy="60" r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="200" cy="40" r="4.5" fill="#4f46e5" />
                  <circle cx="350" cy="80" r="4.5" fill="#4f46e5" />
                  <circle cx="550" cy="60" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />

                  {/* Node label text */}
                  <text x="50" y="85" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Seattle</text>
                  <text x="200" y="25" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Denver</text>
                  <text x="350" y="105" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Chicago</text>
                  <text x="550" y="85" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">New York</text>
                </svg>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
