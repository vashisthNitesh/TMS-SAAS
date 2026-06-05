import React, { useState } from "react";
import { RouteIcon, ZapIcon, AlertIcon, CheckIcon } from "./icons";

export default function RouteOptimization() {
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in">
      
      {/* Route Stops Inputs Panel */}
      <section className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-white">Lane Optimizer Planner</h2>
          <p className="text-xs text-slate-400 mt-0.5">Configure address stops to trigger AI stop re-sequencing</p>
        </div>

        {/* Vehicle Selection profile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-mono">ASSET EQUIPMENT PROFILE</label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="FTL - Dry Van">FTL - Dry Van (Standard)</option>
            <option value="FTL - Reefer">FTL - Reefer (Cold Chain)</option>
            <option value="LTL - Flatbed">LTL - Flatbed (Heavy Load)</option>
            <option value="Hazmat Class 3">Hazmat Class 3 (Specialty)</option>
          </select>
        </div>

        {/* Address Stop Nodes List */}
        <div className="flex flex-col gap-3">
          <label className="text-slate-400 text-xs font-mono">ROUTE WAYPOINTS</label>
          <div className="flex flex-col gap-2 relative pl-3 border-l border-white/10">
            {stops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === stops.length - 1;
              return (
                <div key={idx} className="flex items-center gap-2 group/stop">
                  <span className={`h-2 w-2 rounded-full absolute -left-[5px] ${isFirst ? "bg-cyan-500" : isLast ? "bg-emerald-500" : "bg-indigo-500"}`} />
                  <div className="flex-1 bg-slate-950 border border-white/5 px-3 py-2 text-xs text-white rounded-xl flex items-center justify-between">
                    <span>{stop}</span>
                    {!isFirst && !isLast && (
                      <button
                        onClick={() => removeStop(idx)}
                        className="text-slate-500 hover:text-rose-400 text-[10px] font-bold font-mono transition-colors opacity-0 group-hover/stop:opacity-100"
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
            className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={addStop}
            className="px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-colors"
          >
            Add Stop
          </button>
        </div>

        <button
          onClick={runOptimizer}
          disabled={isRunning}
          className="w-full mt-4 py-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/10"
        >
          <ZapIcon size={14} className="text-white animate-pulse" />
          {isRunning ? "Optimizing Lane..." : "Execute Optimizer Engine"}
        </button>
      </section>

      {/* Simulator Results & Logs Display */}
      <section className="xl:col-span-2 flex flex-col gap-6">
        
        {/* Console Logs */}
        {consoleLogs.length > 0 && (
          <div className="bg-slate-950 border border-white/5 rounded-3xl p-5 flex flex-col gap-3 font-mono text-[10px] min-h-[160px] relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 text-slate-500">
              <span>AI LANES ENGINE OUTPUT</span>
              {isRunning && <span className="animate-pulse text-indigo-400 font-bold">CALCULATING...</span>}
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-slate-400 pr-1 select-all">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-400 font-bold" : ""}>
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
            <div className="glass-panel rounded-3xl p-5 flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">FINANCIAL YIELD</span>
              <h3 className="text-2xl font-bold text-white mt-1">$870 Saved</h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-normal">
                Avoided Denver I-70 tolls and reallocated to Allied Contract Lane. Total cost reduced by 18.2%.
              </p>
            </div>

            {/* Time efficiency card */}
            <div className="glass-panel rounded-3xl p-5 flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">TIME EFFICIENCY</span>
              <h3 className="text-2xl font-bold text-white mt-1">-5.5 Hours</h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-normal">
                Bypassed Nebraska winter cells. Total transit time reduced from 26.5h to 21.0h. Preserved SLA window.
              </p>
            </div>

            {/* Carbon reduction card */}
            <div className="glass-panel rounded-3xl p-5 flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">CARBON OFFSET</span>
              <h3 className="text-2xl font-bold text-white mt-1">-45 Gal Fuel</h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-normal">
                Bypassed 270 circuitous miles. Prevented 0.46 Metric Tons of CO2 emissions.
              </p>
            </div>

            {/* Map visual representation */}
            <div className="glass-panel rounded-3xl p-6 md:col-span-3 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Visual Route Comparison</h3>
              <div className="w-full h-32 bg-slate-950 rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/5">
                {/* SVG Visualizing lanes */}
                <svg viewBox="0 0 600 120" className="w-full h-full text-slate-700">
                  {/* Original route path (dashed red) */}
                  <path d="M 50 60 Q 200 110 350 10 Q 550 60 550 60" fill="none" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Optimized route path (solid cyan) */}
                  <path d="M 50 60 L 200 40 L 350 80 L 550 60" fill="none" stroke="#6366f1" strokeWidth="3" />
                  
                  {/* Stop nodes */}
                  <circle cx="50" cy="60" r="6" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="200" cy="40" r="5" fill="#8b5cf6" />
                  <circle cx="350" cy="80" r="5" fill="#8b5cf6" />
                  <circle cx="550" cy="60" r="6" fill="#10b981" stroke="#fff" strokeWidth="1.5" />

                  {/* Node label text */}
                  <text x="50" y="85" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">Seattle</text>
                  <text x="200" y="25" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">Denver</text>
                  <text x="350" y="105" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">Chicago</text>
                  <text x="550" y="85" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">New York</text>
                </svg>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
