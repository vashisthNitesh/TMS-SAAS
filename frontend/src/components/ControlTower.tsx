import React, { useState, useEffect } from "react";
import { SearchIcon, MapPinIcon, ClockIcon, TruckIcon, UserIcon, CloseIcon, AlertIcon } from "./icons";

interface Trip {
  id: string;
  transporter: string;
  vehicle: string;
  driver: string;
  phone: string;
  origin: string;
  destination: string;
  progress: number;
  status: "In Transit" | "Near Destination" | "Delayed" | "SLA Risk" | "Delivered";
  eta: string;
  cargo: string;
  temp?: string;
  routePoints: { x: number; y: number }[];
  currentPos: { x: number; y: number };
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: "TR-9022",
    transporter: "Allied Logistics",
    vehicle: "TRK-2090 (FTL • Reefer)",
    driver: "Marcus Vance",
    phone: "+1 (555) 019-2834",
    origin: "Chicago Hub",
    destination: "New York Depot",
    progress: 72,
    status: "In Transit",
    eta: "14:45 (On Time)",
    cargo: "Pharmaceuticals (Cold Chain)",
    temp: "4.2 °C (Target: 4.0 °C)",
    routePoints: [{ x: 200, y: 150 }, { x: 350, y: 140 }, { x: 500, y: 160 }, { x: 680, y: 170 }],
    currentPos: { x: 546, y: 162 }
  },
  {
    id: "TR-8114",
    transporter: "Swift Express",
    vehicle: "TRK-7411 (LTL • Dry Van)",
    driver: "Devon Reynolds",
    phone: "+1 (555) 041-9988",
    origin: "Houston Terminal",
    destination: "Denver CFA",
    progress: 95,
    status: "Near Destination",
    eta: "13:10 (On Time)",
    cargo: "Industrial Electronic Components",
    routePoints: [{ x: 300, y: 380 }, { x: 260, y: 300 }, { x: 220, y: 220 }, { x: 190, y: 180 }],
    currentPos: { x: 191, y: 182 }
  },
  {
    id: "TR-7089",
    transporter: "Falcon Carrier",
    vehicle: "TRK-1022 (FTL • Flatbed)",
    driver: "Sarah Chen",
    phone: "+1 (555) 012-4402",
    origin: "Seattle Port",
    destination: "Chicago Hub",
    progress: 38,
    status: "Delayed",
    eta: "17:30 (+45 mins delay)",
    cargo: "Structural Steel Girders",
    routePoints: [{ x: 80, y: 80 }, { x: 220, y: 100 }, { x: 350, y: 110 }, { x: 500, y: 160 }],
    currentPos: { x: 240, y: 103 }
  },
  {
    id: "TR-9902",
    transporter: "Apex Freight",
    vehicle: "TRK-8890 (FTL • Dry Van)",
    driver: "Carlos Santana",
    phone: "+1 (555) 032-9011",
    origin: "Los Angeles CFA",
    destination: "Austin Distribution",
    progress: 18,
    status: "In Transit",
    eta: "18:30 (On Time)",
    cargo: "High-value Consumer Electronics",
    routePoints: [{ x: 90, y: 320 }, { x: 180, y: 330 }, { x: 250, y: 350 }, { x: 300, y: 380 }],
    currentPos: { x: 128, y: 324 }
  },
  {
    id: "TR-3419",
    transporter: "Titan Heavy Haul",
    vehicle: "TRK-0092 (Superload)",
    driver: "Bradley Hughes",
    phone: "+1 (555) 098-7711",
    origin: "Atlanta Yard",
    destination: "Houston Terminal",
    progress: 54,
    status: "SLA Risk",
    eta: "19:15 (Adverse Weather)",
    cargo: "Power Generator Turbine",
    routePoints: [{ x: 560, y: 320 }, { x: 480, y: 340 }, { x: 400, y: 360 }, { x: 300, y: 380 }],
    currentPos: { x: 440, y: 350 }
  },
  {
    id: "TR-6623",
    transporter: "Vanguard Carrier",
    vehicle: "TRK-5541 (FTL • Reefer)",
    driver: "Elena Rostova",
    phone: "+1 (555) 077-8899",
    origin: "Miami Port",
    destination: "Atlanta Yard",
    progress: 100,
    status: "Delivered",
    eta: "11:45 (Completed)",
    cargo: "Fresh Organic Produce",
    temp: "3.5 °C (Target: 3.0 °C)",
    routePoints: [{ x: 620, y: 420 }, { x: 600, y: 370 }, { x: 560, y: 320 }],
    currentPos: { x: 560, y: 320 }
  }
];

const INITIAL_EVENTS = [
  { id: 1, time: "12:54:10", type: "GEOFENCE", message: "TRK-2090 (Allied) departed Chicago Hub geofence boundary.", severity: "info" },
  { id: 2, time: "12:51:33", type: "FINANCE", message: "Finance approved waiting charges ($150) for TR-6623.", severity: "success" },
  { id: 3, time: "12:47:01", type: "TELEMATICS", message: "TR-7089 (Falcon) engine coolant temp warning: 104°C.", severity: "warning" },
  { id: 4, time: "12:42:15", type: "GATE-IN", message: "TRK-8890 (Apex) completed gate-in checks at Los Angeles CFA Dock 4.", severity: "info" },
  { id: 5, time: "12:35:09", type: "SLA RISK", message: "TR-3419 (Titan) transit speed fell below 25 mph due to storm front.", severity: "danger" }
];

export default function ControlTower() {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Simulate vehicle telemetry movement along their SVG path
  useEffect(() => {
    const interval = setInterval(() => {
      setTrips((prevTrips) =>
        prevTrips.map((trip) => {
          if (trip.status === "Delivered") return trip;
          
          let nextProgress = trip.progress + 0.5;
          if (nextProgress >= 100) {
            nextProgress = 100;
            trip.status = "Delivered";
          }
          
          // Calculate active coordinate on path based on progress
          const pointCount = trip.routePoints.length;
          const segmentIndex = Math.min(
            Math.floor((nextProgress / 100) * (pointCount - 1)),
            pointCount - 2
          );
          
          const startPt = trip.routePoints[segmentIndex];
          const endPt = trip.routePoints[segmentIndex + 1];
          const segmentProgress =
            ((nextProgress / 100) * (pointCount - 1)) - segmentIndex;
            
          const currentPos = {
            x: startPt.x + (endPt.x - startPt.x) * segmentProgress,
            y: startPt.y + (endPt.y - startPt.y) * segmentProgress
          };
          
          return {
            ...trip,
            progress: parseFloat(nextProgress.toFixed(1)),
            currentPos
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update selectedTrip if it's open, so progress/coordinates refresh in real-time
  useEffect(() => {
    if (selectedTrip) {
      const updated = trips.find((t) => t.id === selectedTrip.id);
      if (updated) {
        setSelectedTrip(updated);
      }
    }
  }, [trips]);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.id.toLowerCase().includes(search.toLowerCase()) ||
      trip.transporter.toLowerCase().includes(search.toLowerCase()) ||
      trip.driver.toLowerCase().includes(search.toLowerCase()) ||
      trip.origin.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "alert" && (trip.status === "Delayed" || trip.status === "SLA Risk")) ||
      trip.status.toLowerCase().replace(" ", "-") === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Real-time Map and Alert Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Animated Vector Map Card */}
        <div className="xl:col-span-2 glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-[480px]">
          {/* Header Overlay */}
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-mono">Live Telematics</h3>
            <h2 className="text-lg font-bold text-white mt-1">Simulated Continental Logistics grid</h2>
          </div>
          
          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 z-10 bg-slate-950/80 border border-white/5 backdrop-blur-md rounded-xl p-3 flex flex-col gap-1.5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-cyan animate-pulse-glow" />
              <span className="text-slate-300">In Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-amber animate-pulse" />
              <span className="text-slate-300">SLA Alert / Delay</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-emerald" />
              <span className="text-slate-300">Hub Terminal</span>
            </div>
          </div>
          
          {/* SVG Map Grid */}
          <div className="flex-1 w-full relative flex items-center justify-center pt-12">
            <svg
              viewBox="0 0 800 480"
              className="w-full h-full max-h-[400px] text-slate-800"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                </pattern>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="400" cy="240" r="300" fill="url(#mapGlow)" pointerEvents="none" />
              
              {/* Map Outline Borders (Stylized US Layout) */}
              <path
                d="M 50 120 Q 120 70 250 80 T 450 70 T 700 80 Q 750 150 780 220 T 750 380 Q 600 450 450 430 T 200 440 Q 100 380 50 300 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Transit Lanes */}
              {trips.map((trip) => {
                let strokeColor = "rgba(6, 182, 212, 0.15)";
                if (trip.status === "Delayed" || trip.status === "SLA Risk") {
                  strokeColor = "rgba(245, 158, 11, 0.15)";
                } else if (trip.status === "Delivered") {
                  strokeColor = "rgba(16, 185, 129, 0.1)";
                }
                
                return (
                  <path
                    key={`lane-${trip.id}`}
                    d={`M ${trip.routePoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}

              {/* Station Hubs */}
              {/* Seattle */}
              <circle cx="80" cy="80" r="5" fill="#10b981" />
              <text x="75" y="70" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">SEA-HUB</text>
              
              {/* Los Angeles */}
              <circle cx="90" cy="320" r="5" fill="#10b981" />
              <text x="80" y="340" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">LAX-CFA</text>
              
              {/* Denver */}
              <circle cx="190" cy="180" r="5" fill="#10b981" />
              <text x="180" y="170" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">DEN-HUB</text>
              
              {/* Chicago */}
              <circle cx="500" cy="160" r="5" fill="#10b981" />
              <text x="485" y="150" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">ORD-HUB</text>

              {/* Houston */}
              <circle cx="300" cy="380" r="5" fill="#10b981" />
              <text x="290" y="398" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">IAH-TERM</text>

              {/* Atlanta */}
              <circle cx="560" cy="320" r="5" fill="#10b981" />
              <text x="550" y="338" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">ATL-YARD</text>

              {/* New York */}
              <circle cx="680" cy="170" r="5" fill="#10b981" />
              <text x="670" y="160" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">NYC-DEPOT</text>
              
              {/* Miami */}
              <circle cx="620" cy="420" r="5" fill="#10b981" />

              {/* Active Vehicles (Simulated Real-time GPS nodes) */}
              {trips.map((trip) => {
                if (trip.status === "Delivered") return null;
                
                let markerColor = "#06b6d4"; // cyan
                let markerGlow = "rgba(6, 182, 212, 0.4)";
                
                if (trip.status === "Delayed" || trip.status === "SLA Risk") {
                  markerColor = "#f59e0b"; // amber
                  markerGlow = "rgba(245, 158, 11, 0.4)";
                }
                
                return (
                  <g
                    key={`car-${trip.id}`}
                    className="cursor-pointer group/node"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <circle cx={trip.currentPos.x} cy={trip.currentPos.y} r="12" fill={markerGlow} className="animate-ping" />
                    <circle cx={trip.currentPos.x} cy={trip.currentPos.y} r="6" fill={markerColor} stroke="#fff" strokeWidth="1.5" />
                    <path
                      d={`M ${trip.currentPos.x - 14} ${trip.currentPos.y - 18} H ${trip.currentPos.x + 14} V ${trip.currentPos.y - 30} H ${trip.currentPos.x - 14} Z`}
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      className="opacity-0 group-hover/node:opacity-100 transition-opacity"
                    />
                    <text
                      x={trip.currentPos.x}
                      y={trip.currentPos.y - 21}
                      fill="#fff"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="opacity-0 group-hover/node:opacity-100 transition-opacity font-bold"
                    >
                      {trip.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Live Event Broker Console Card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white">Telematics Event Broker</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">Broker latency: 8ms</p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 max-h-[380px]">
            {events.map((event) => {
              let tagColor = "border-cyan-500/20 text-cyan-400 bg-cyan-500/5";
              if (event.severity === "warning") tagColor = "border-amber-500/20 text-amber-400 bg-amber-500/5";
              if (event.severity === "danger") tagColor = "border-rose-500/20 text-rose-400 bg-rose-500/5";
              if (event.severity === "success") tagColor = "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
              
              return (
                <div
                  key={event.id}
                  className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex gap-3 items-start hover:border-white/10 transition-colors"
                >
                  <span className="font-mono text-xs text-slate-500 mt-1">{event.time}</span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border font-mono font-bold tracking-wider ${tagColor}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{event.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trip Telemetry Control Console */}
      <section className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Active Movement Operations</h2>
            <p className="text-xs text-slate-400 mt-0.5">Control lane health and real-time execution logs</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <SearchIcon size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search trip, driver, hub..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            
            {/* Filters */}
            <div className="flex bg-slate-950 border border-white/5 rounded-xl p-1 w-full sm:w-auto">
              {["all", "in-transit", "alert", "delivered"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold capitalize transition-colors ${
                    statusFilter === filter
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {filter.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs font-mono tracking-wider uppercase">
                <th className="pb-3 px-4">Trip ID</th>
                <th className="pb-3 px-4">Carrier & Driver</th>
                <th className="pb-3 px-4">Lane Route</th>
                <th className="pb-3 px-4">Transit Progress</th>
                <th className="pb-3 px-4">Payload specs</th>
                <th className="pb-3 px-4">Execution Status</th>
                <th className="pb-3 px-4 text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs">
              {filteredTrips.map((trip) => {
                let statusColor = "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
                let badgeDot = "bg-cyan-500";
                
                if (trip.status === "Delayed") {
                  statusColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
                  badgeDot = "bg-amber-500";
                } else if (trip.status === "SLA Risk") {
                  statusColor = "text-rose-400 border-rose-500/20 bg-rose-500/5";
                  badgeDot = "bg-rose-500";
                } else if (trip.status === "Delivered") {
                  statusColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
                  badgeDot = "bg-emerald-500";
                }

                return (
                  <tr
                    key={trip.id}
                    className="hover:bg-white/[0.01] transition-colors cursor-pointer"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <td className="py-4 px-4 font-mono font-bold text-cyan-400">{trip.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{trip.transporter}</div>
                      <div className="text-slate-400 mt-0.5">{trip.driver} • {trip.vehicle.split(" (")[0]}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white flex items-center gap-1">
                        <span>{trip.origin}</span>
                        <span className="text-slate-500">➔</span>
                        <span>{trip.destination}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              trip.status === "Delayed" || trip.status === "SLA Risk"
                                ? "bg-amber-500"
                                : trip.status === "Delivered"
                                ? "bg-emerald-500"
                                : "bg-cyan-500"
                            }`}
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                        <span className="text-slate-400 font-mono">{trip.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <div>{trip.cargo}</div>
                      {trip.temp && <div className="text-[10px] text-cyan-400 mt-0.5 font-mono">Temp: {trip.temp.split(" (")[0]}</div>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold ${statusColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${badgeDot}`} />
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-right text-slate-300">{trip.eta}</td>
                  </tr>
                );
              })}
              {filteredTrips.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No active shipments match current search terms
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inspection Drawer (SLA Panel overlay) */}
      {selectedTrip && (
        <div className="fixed inset-0 z-100 flex justify-end">
          {/* Overlay Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedTrip(null)}
          />
          
          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 h-full shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">TELEMETRY INJECTOR</span>
                <h2 className="text-xl font-bold text-white mt-1">Audit Shipment {selectedTrip.id}</h2>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="h-8 w-8 rounded-lg hover:bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono">STATUS</span>
                <span className={`text-xs font-semibold ${
                  selectedTrip.status === "Delivered" ? "text-emerald-400" : selectedTrip.status === "Delayed" || selectedTrip.status === "SLA Risk" ? "text-amber-400" : "text-cyan-400"
                }`}>
                  {selectedTrip.status}
                </span>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono">ETA VALIDATION</span>
                <span className="text-xs font-semibold text-white truncate">{selectedTrip.eta}</span>
              </div>
            </div>

            {/* Route Lane Details */}
            <div className="bg-slate-900/20 border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Lane Operations</h3>
              <div className="flex items-start gap-3">
                <MapPinIcon size={16} className="text-slate-500 mt-1" />
                <div>
                  <div className="text-xs font-semibold text-white">Origin</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selectedTrip.origin}</div>
                </div>
              </div>
              <div className="border-l border-dashed border-white/10 h-6 ml-2" />
              <div className="flex items-start gap-3">
                <MapPinIcon size={16} className="text-emerald-500 mt-1" />
                <div>
                  <div className="text-xs font-semibold text-white">Destination</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selectedTrip.destination}</div>
                </div>
              </div>
            </div>

            {/* Payload & Equipment specs */}
            <div className="bg-slate-900/20 border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Equipment & Cargo</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Carrier:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedTrip.transporter}</p>
                </div>
                <div>
                  <span className="text-slate-400">Asset:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedTrip.vehicle.split(" (")[0]}</p>
                </div>
                <div>
                  <span className="text-slate-400">Driver Roster:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedTrip.driver}</p>
                </div>
                <div>
                  <span className="text-slate-400">Contact:</span>
                  <p className="font-semibold text-white mt-0.5 font-mono text-[10px]">{selectedTrip.phone}</p>
                </div>
                <div className="col-span-2 border-t border-white/5 pt-2">
                  <span className="text-slate-400">Cargo Manifest:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedTrip.cargo}</p>
                </div>
                {selectedTrip.temp && (
                  <div className="col-span-2 bg-cyan-950/20 border border-cyan-500/20 p-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-cyan-400 font-mono text-[10px]">Active Temperature:</span>
                    <span className="text-cyan-300 font-mono text-xs font-bold">{selectedTrip.temp.split(" (")[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Telematics Logs / Simulated Terminal */}
            <div className="flex-1 bg-slate-950 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 font-mono text-[10px]">
              <span className="text-xs text-slate-400 font-bold border-b border-white/5 pb-1">Geofence & Sensor Telemetry Log</span>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-slate-400 pr-1 select-none">
                <div>[11:00:23] SYS: Telematics receiver binding successful.</div>
                <div>[11:01:45] GPS: Initial lock acquired. Speed: 0mph.</div>
                <div>[11:05:00] GEO: Vehicle entered {selectedTrip.origin} boundary.</div>
                <div>[11:32:10] SYS: Departure gate-out check verified.</div>
                <div>[11:35:12] GEO: Vehicle departed {selectedTrip.origin} geofence.</div>
                <div>[12:00:19] SENSOR: Battery terminal diagnostic OK.</div>
                {selectedTrip.status === "Delayed" && (
                  <div className="text-amber-400 font-bold">[12:15:30] TRAFFIC: Telematics processor flagged delay alert (+45 mins).</div>
                )}
                {selectedTrip.status === "SLA Risk" && (
                  <div className="text-rose-400 font-bold">[12:20:44] WEATHER: Severe headwinds detected. Velocity down.</div>
                )}
                {selectedTrip.status === "Delivered" && (
                  <div className="text-emerald-400 font-bold">[12:44:11] GEO: Vehicle entered {selectedTrip.destination} terminal boundary.</div>
                )}
              </div>
            </div>

            {/* Quick Action */}
            <div className="border-t border-white/5 pt-4 mt-auto flex gap-3">
              <button
                className="flex-1 py-2.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors font-sans"
                onClick={() => alert(`Initiating direct operational check-in with driver ${selectedTrip.driver}`)}
              >
                Ping Driver Link
              </button>
              <button
                className="px-4 py-2.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-colors font-sans"
                onClick={() => setSelectedTrip(null)}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
