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

interface ControlTowerProps {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  events: any[];
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ControlTower({ trips, setTrips, events, setEvents }: ControlTowerProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Update selectedTrip if it's open, so progress/coordinates refresh in real-time
  useEffect(() => {
    if (selectedTrip) {
      const updated = trips.find((t) => t.id === selectedTrip.id);
      if (updated) {
        setSelectedTrip(updated);
      }
    }
  }, [trips, selectedTrip]);

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
    <div className="flex flex-col gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Real-time Map and Alert Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Animated Vector Map Card */}
        <div className="xl:col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[480px] bg-white border border-slate-200">
          {/* Header Overlay */}
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">Telemetry Radar</h3>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Active Fleet Route Coordinates</h2>
          </div>
          
          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 z-10 bg-white/95 border border-slate-200 backdrop-blur-md rounded-xl p-3 flex flex-col gap-1.5 text-[10px] font-mono shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-cyan" />
              <span className="text-slate-600 font-semibold">In Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-amber animate-pulse" />
              <span className="text-slate-600 font-semibold">SLA / Traffic Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-emerald" />
              <span className="text-slate-600 font-semibold">Hub Terminal</span>
            </div>
          </div>
          
          {/* SVG Map Grid */}
          <div className="flex-1 w-full relative flex items-center justify-center pt-12">
            <svg
              viewBox="0 0 800 480"
              className="w-full h-full max-h-[400px] text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />
                </pattern>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(79, 70, 229, 0.04)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="400" cy="240" r="300" fill="url(#mapGlow)" pointerEvents="none" />
              
              {/* Map Outline Borders (Stylized US Layout) */}
              <path
                d="M 50 120 Q 120 70 250 80 T 450 70 T 700 80 Q 750 150 780 220 T 750 380 Q 600 450 450 430 T 200 440 Q 100 380 50 300 Z"
                fill="none"
                stroke="rgba(15, 23, 42, 0.05)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Transit Lanes */}
              {trips.map((trip) => {
                let strokeColor = "rgba(2, 132, 199, 0.2)"; // cyan
                if (trip.status === "Delayed" || trip.status === "SLA Risk") {
                  strokeColor = "rgba(217, 119, 6, 0.2)"; // amber
                } else if (trip.status === "Delivered") {
                  strokeColor = "rgba(16, 185, 129, 0.1)"; // emerald
                }
                
                return (
                  <path
                    key={`lane-${trip.id}`}
                    d={`M ${trip.routePoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}

              {/* Station Hubs */}
              {/* Seattle */}
              <circle cx="80" cy="80" r="5" fill="#10b981" />
              <text x="75" y="70" fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="monospace" fontWeight="bold">SEA-HUB</text>
              
              {/* Los Angeles */}
              <circle cx="90" cy="320" r="5" fill="#10b981" />
              <text x="80" y="340" fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="monospace" fontWeight="bold">LAX-CFA</text>
              
              {/* Denver */}
              <circle cx="190" cy="180" r="5" fill="#10b981" />
              <text x="180" y="170" fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="monospace" fontWeight="bold">DEN-HUB</text>
              
              {/* Chicago */}
              <circle cx="500" cy="160" r="5" fill="#10b981" />
              <text x="485" y="150" fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="monospace" fontWeight="bold">ORD-HUB</text>

              {/* Houston */}
              <circle cx="300" cy="380" r="5" fill="#10b981" />
              <text x="290" y="398" fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="monospace" fontWeight="bold">IAH-TERM</text>

              {/* Atlanta */}
              <circle cx="560" cy="320" r="5" fill="#10b981" />
              <text x="550" y="338" fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="monospace" fontWeight="bold">ATL-YARD</text>

              {/* New York */}
              <circle cx="680" cy="170" r="5" fill="#10b981" />
              <text x="670" y="160" fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="monospace" fontWeight="bold">NYC-DEPOT</text>
              
              {/* Miami */}
              <circle cx="620" cy="420" r="5" fill="#10b981" />

              {/* Active Vehicles (Simulated Real-time GPS nodes) */}
              {trips.map((trip) => {
                if (trip.status === "Delivered") return null;
                
                let markerColor = "#4f46e5"; // brand indigo
                let markerGlow = "rgba(79, 70, 229, 0.2)";
                
                if (trip.status === "Delayed" || trip.status === "SLA Risk") {
                  markerColor = "#d97706"; // amber
                  markerGlow = "rgba(217, 119, 6, 0.2)";
                }
                
                return (
                  <g
                    key={`car-${trip.id}`}
                    className="cursor-pointer group/node"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <circle cx={trip.currentPos.x} cy={trip.currentPos.y} r="10" fill={markerGlow} className="animate-pulse" />
                    <circle cx={trip.currentPos.x} cy={trip.currentPos.y} r="5" fill={markerColor} stroke="#fff" strokeWidth="1.5" />
                    <path
                      d={`M ${trip.currentPos.x - 14} ${trip.currentPos.y - 18} H ${trip.currentPos.x + 14} V ${trip.currentPos.y - 30} H ${trip.currentPos.x - 14} Z`}
                      fill="#0f172a"
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
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Telematics Event Broker</h2>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Broker latency: 8ms</p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-indigo opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-indigo"></span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 max-h-[380px]">
            {events.map((event) => {
              let tagColor = "border-blue-200 text-blue-700 bg-blue-50";
              if (event.severity === "warning") tagColor = "border-amber-200 text-amber-700 bg-amber-50";
              if (event.severity === "danger") tagColor = "border-rose-200 text-rose-700 bg-rose-50";
              if (event.severity === "success") tagColor = "border-emerald-200 text-emerald-700 bg-emerald-50";
              
              return (
                <div
                  key={event.id}
                  className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex gap-3 items-start hover:border-slate-200 transition-colors"
                >
                  <span className="font-mono text-[10px] text-slate-400 mt-0.5">{event.time}</span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`inline-block text-[8px] px-2 py-0.5 rounded-full border font-mono font-bold tracking-wider ${tagColor}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{event.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trip Telemetry Control Console */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Movement Operations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Control lane health and real-time execution logs</p>
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
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo transition-colors"
              />
            </div>
            
            {/* Filters */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 w-full sm:w-auto">
              {["all", "in-transit", "alert", "delivered"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold capitalize transition-colors ${
                    statusFilter === filter
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
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
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="py-2.5 px-4 rounded-tl-lg">Trip ID</th>
                <th className="py-2.5 px-4">Carrier & Driver</th>
                <th className="py-2.5 px-4">Lane Route</th>
                <th className="py-2.5 px-4">Transit Progress</th>
                <th className="py-2.5 px-4">Payload specs</th>
                <th className="py-2.5 px-4">Execution Status</th>
                <th className="py-2.5 px-4 rounded-tr-lg text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTrips.map((trip) => {
                let statusColor = "text-blue-700 border-blue-200 bg-blue-50";
                let badgeDot = "bg-blue-600";
                
                if (trip.status === "Delayed") {
                  statusColor = "text-amber-700 border-amber-200 bg-amber-50";
                  badgeDot = "bg-amber-600";
                } else if (trip.status === "SLA Risk") {
                  statusColor = "text-rose-700 border-rose-200 bg-rose-50";
                  badgeDot = "bg-rose-600";
                } else if (trip.status === "Delivered") {
                  statusColor = "text-emerald-700 border-emerald-200 bg-emerald-50";
                  badgeDot = "bg-emerald-600";
                }

                return (
                  <tr
                    key={trip.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <td className="py-4 px-4 font-mono font-bold text-brand-indigo">{trip.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{trip.transporter}</div>
                      <div className="text-slate-500 mt-0.5">{trip.driver} • {trip.vehicle.split(" (")[0]}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-800 flex items-center gap-1 font-semibold">
                        <span>{trip.origin}</span>
                        <span className="text-slate-400 font-normal">➔</span>
                        <span>{trip.destination}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              trip.status === "Delayed" || trip.status === "SLA Risk"
                                ? "bg-amber-500"
                                : trip.status === "Delivered"
                                ? "bg-emerald-500"
                                : "bg-brand-indigo"
                            }`}
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                        <span className="text-slate-500 font-mono font-bold">{trip.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div>{trip.cargo}</div>
                      {trip.temp && <div className="text-[10px] text-brand-cyan mt-0.5 font-mono">Temp: {trip.temp.split(" (")[0]}</div>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.2 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${statusColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${badgeDot}`} />
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-right text-slate-600 font-bold">{trip.eta}</td>
                  </tr>
                );
              })}
              {filteredTrips.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
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
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={() => setSelectedTrip(null)}
          />
          
          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-white border-l border-slate-200 h-full shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto animate-slide-up text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-indigo tracking-wider">TELEMETRY INJECTOR</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Audit Shipment {selectedTrip.id}</h2>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-mono">STATUS</span>
                <span className={`text-xs font-bold ${
                  selectedTrip.status === "Delivered" ? "text-emerald-600" : selectedTrip.status === "Delayed" || selectedTrip.status === "SLA Risk" ? "text-amber-600" : "text-brand-indigo"
                }`}>
                  {selectedTrip.status}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-mono">ETA VALIDATION</span>
                <span className="text-xs font-bold text-slate-800 truncate">{selectedTrip.eta}</span>
              </div>
            </div>

            {/* Route Lane Details */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-3">
              <h3 className="text-[10px] font-bold text-slate-900 font-mono uppercase tracking-wider">Lane Operations</h3>
              <div className="flex items-start gap-3">
                <MapPinIcon size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Origin</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{selectedTrip.origin}</div>
                </div>
              </div>
              <div className="border-l border-dashed border-slate-300 h-6 ml-2" />
              <div className="flex items-start gap-3">
                <MapPinIcon size={16} className="text-emerald-500 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Destination</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{selectedTrip.destination}</div>
                </div>
              </div>
            </div>

            {/* Payload & Equipment specs */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-3">
              <h3 className="text-[10px] font-bold text-slate-900 font-mono uppercase tracking-wider">Equipment & Cargo</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Carrier:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTrip.transporter}</p>
                </div>
                <div>
                  <span className="text-slate-500">Asset:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTrip.vehicle.split(" (")[0]}</p>
                </div>
                <div>
                  <span className="text-slate-500">Driver Roster:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTrip.driver}</p>
                </div>
                <div>
                  <span className="text-slate-500">Contact:</span>
                  <p className="font-bold text-slate-800 mt-0.5 font-mono text-[10px]">{selectedTrip.phone}</p>
                </div>
                <div className="col-span-2 border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Cargo Manifest:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTrip.cargo}</p>
                </div>
                {selectedTrip.temp && (
                  <div className="col-span-2 bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-blue-700 font-mono text-[9px] font-semibold">Active Temperature:</span>
                    <span className="text-blue-800 font-mono text-xs font-bold">{selectedTrip.temp.split(" (")[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Telematics Logs / Simulated Terminal */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 font-mono text-[10px]">
              <span className="text-xs text-slate-500 font-bold border-b border-slate-200 pb-1">Geofence & Sensor Telemetry Log</span>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-slate-600 pr-1 select-none">
                <div>[11:00:23] SYS: Telematics receiver binding successful.</div>
                <div>[11:01:45] GPS: Initial lock acquired. Speed: 0mph.</div>
                <div>[11:05:00] GEO: Vehicle entered {selectedTrip.origin} boundary.</div>
                <div>[11:32:10] SYS: Departure gate-out check verified.</div>
                <div>[11:35:12] GEO: Vehicle departed {selectedTrip.origin} geofence.</div>
                <div>[12:00:19] SENSOR: Battery terminal diagnostic OK.</div>
                {selectedTrip.status === "Delayed" && (
                  <div className="text-amber-600 font-bold">[12:15:30] TRAFFIC: Telematics processor flagged delay alert (+45 mins).</div>
                )}
                {selectedTrip.status === "SLA Risk" && (
                  <div className="text-rose-600 font-bold">[12:20:44] WEATHER: Severe headwinds detected. Velocity down.</div>
                )}
                {selectedTrip.status === "Delivered" && (
                  <div className="text-emerald-600 font-bold">[12:44:11] GEO: Vehicle entered {selectedTrip.destination} terminal boundary.</div>
                )}
              </div>
            </div>

            {/* Quick Action */}
            <div className="border-t border-slate-100 pt-4 mt-auto flex gap-3">
              <button
                className="flex-1 py-2.5 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors font-sans shadow-sm"
                onClick={() => alert(`Initiating direct operational check-in with driver ${selectedTrip.driver}`)}
              >
                Ping Driver Link
              </button>
              <button
                className="px-4 py-2.5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors font-sans"
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
