"use client";

import React, { useState } from "react";

// Mock operational data representing real-time state of the system
const MOCK_STATS = [
  { label: "Active Vehicles", value: "842", change: "+12.5%", color: "text-emerald-500" },
  { label: "Pending Shipments", value: "1,249", change: "-4.3%", color: "text-amber-500" },
  { label: "Delayed Trips (SLA Risk)", value: "37", change: "+8.1%", color: "text-rose-500" },
  { label: "On-Time Performance", value: "96.4%", change: "+0.8%", color: "text-sky-500" },
];

const MOCK_ACTIVE_TRIPS = [
  {
    id: "TR-9022",
    transporter: "Allied Logistics",
    vehicle: "TRK-2090 (FTL)",
    driver: "Marcus Vance",
    route: "Warehouse A ➔ Chicago Hub",
    progress: 75,
    status: "In Transit",
    eta: "14:45 (On Time)",
    color: "bg-emerald-500",
  },
  {
    id: "TR-8114",
    transporter: "Swift Express",
    vehicle: "TRK-7411 (LTL)",
    driver: "Devon Reynolds",
    route: "Warehouse B ➔ Austin Distribution",
    progress: 95,
    status: "Near Destination",
    eta: "13:10 (On Time)",
    color: "bg-teal-500",
  },
  {
    id: "TR-7089",
    transporter: "Falcon Carrier",
    vehicle: "TRK-1022 (FTL)",
    driver: "Sarah Chen",
    route: "Warehouse C ➔ Denver CFA",
    progress: 40,
    status: "Delayed",
    eta: "16:20 (+45 mins)",
    color: "bg-rose-500",
  },
  {
    id: "TR-9902",
    transporter: "Apex Freight",
    vehicle: "TRK-8890 (FTL)",
    driver: "Carlos Santana",
    route: "Warehouse A ➔ Seattle Outlet",
    progress: 15,
    status: "In Transit",
    eta: "18:30 (On Time)",
    color: "bg-emerald-500",
  },
];

const MOCK_RECENT_EVENTS = [
  { id: 1, time: "12:54:10", type: "Geofence", message: "TRK-2090 departed Warehouse A geofence boundary." },
  { id: 2, time: "12:51:33", type: "POD Approved", message: "Finance approved digital POD voucher for TR-6623." },
  { id: 3, time: "12:47:01", type: "Delay Alert", message: "TR-7089 reported heavy traffic delay on Highway 70." },
  { id: 4, time: "12:42:15", type: "Gate-In", message: "TRK-8890 completed gate-in routine at Dock Bay 4." },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("control-tower");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrips = MOCK_ACTIVE_TRIPS.filter(
    (trip) =>
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.transporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-sky-500/20">
            T
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TAME PLATFORM
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Logistics Execution OS</p>
          </div>
        </div>

        {/* Global Connection Health Badge */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-300">Live Connection OK</span>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Sidebar Controls */}
        <aside className="w-full lg:w-64 border-r border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Core Modules</p>
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab("control-tower")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === "control-tower"
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                🛰️ Control Tower
              </button>
              <button
                onClick={() => setActiveTab("order-management")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === "order-management"
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                📦 Order Intake
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === "billing"
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                💳 Settlements
              </button>
            </nav>
          </div>

          <div className="mt-auto border-t border-slate-800 pt-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sky-400">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold text-white">John Doe</p>
                <p className="text-xs text-slate-400">Operations Lead</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 lg:p-8 flex flex-col gap-8">
          
          {/* Section: Operational Banner Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300 backdrop-blur-md"
              >
                <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <p className="text-xs font-medium text-slate-400 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold tracking-tight text-white">{stat.value}</span>
                  <span className={`text-xs font-semibold ${stat.color}`}>{stat.change}</span>
                </div>
              </div>
            ))}
          </section>

          {activeTab === "control-tower" && (
            <>
              {/* Section: Active Control Tower Monitoring */}
              <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Active Movements Monitor</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time validation and tracking logs</p>
                  </div>
                  <div className="relative max-w-sm w-full">
                    <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                    <input
                      type="text"
                      placeholder="Search active trips, carriers, routes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all duration-150"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400 text-xs font-mono tracking-wider uppercase">
                        <th className="py-3 px-4">Trip ID</th>
                        <th className="py-3 px-4">Carrier / Driver</th>
                        <th className="py-3 px-4">Route Path</th>
                        <th className="py-3 px-4">Transit Progress</th>
                        <th className="py-3 px-4">Execution Status</th>
                        <th className="py-3 px-4">ETA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/50 text-sm">
                      {filteredTrips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-slate-800/20 transition-all duration-150">
                          <td className="py-4 px-4 font-mono font-bold text-sky-400">{trip.id}</td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-white">{trip.transporter}</div>
                            <div className="text-xs text-slate-400">{trip.driver} • {trip.vehicle}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-300">{trip.route}</td>
                          <td className="py-4 px-4 min-w-[160px]">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${trip.color}`} style={{ width: `${trip.progress}%` }} />
                              </div>
                              <span className="text-xs font-mono text-slate-400">{trip.progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-white">
                              <span className={`h-1.5 w-1.5 rounded-full ${trip.color === 'bg-rose-500' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                              {trip.status}
                            </span>
                          </td>
                          <td className={`py-4 px-4 font-mono text-xs ${trip.status === "Delayed" ? "text-rose-400" : "text-slate-300"}`}>
                            {trip.eta}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section: Live Event Pipeline */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/20 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    ⚡ Live Telematics Event Broker
                  </h3>
                  <div className="flex flex-col gap-3">
                    {MOCK_RECENT_EVENTS.map((event) => (
                      <div
                        key={event.id}
                        className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex gap-4 items-start hover:border-slate-750 transition-all duration-200"
                      >
                        <span className="font-mono text-xs text-sky-400 mt-0.5">{event.time}</span>
                        <div className="flex-1">
                          <span className="inline-block text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-400 mb-1">
                            {event.type}
                          </span>
                          <p className="text-sm text-slate-200">{event.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-b from-slate-900/40 to-slate-950/20 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-sky-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">FeroGPT AI System</span>
                    <h3 className="text-xl font-bold text-white mt-2">Logistics Consulting AI</h3>
                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                      "I detected an active traffic anomaly delaying Falcons TRK-1022. Reallocating backup vehicle TRK-9900 will preserve customer SLA for Order ORD-4089."
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-all duration-150">
                      Accept AI Action
                    </button>
                    <button className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-150">
                      Query AI
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "order-management" && (
            <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-white">Order Intake Portal</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure sales requests & manifest bookings</p>
              </div>
              <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center flex flex-col items-center gap-4">
                <span className="text-3xl">📤</span>
                <div>
                  <h3 className="text-md font-semibold text-slate-200">Drag & Drop Order CSV</h3>
                  <p className="text-xs text-slate-400 mt-1">Accepts UTF-8 formatted manifest listings.</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-all duration-150">
                  Select File
                </button>
              </div>
            </section>
          )}

          {activeTab === "billing" && (
            <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-white">Financial Settlement Engine</h2>
                <p className="text-xs text-slate-400 mt-0.5">Audits base freight tariffs and expense statements</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] text-rose-400 uppercase font-mono font-bold">Detention Claim Warning</span>
                  <h3 className="text-md font-semibold text-white mt-1">TR-7089 • falcon carrier claim</h3>
                  <p className="text-xs text-slate-400 mt-1">Transporter requests 3 hours ($75.00) waiting reimbursement.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all duration-150">
                    Approve Payment
                  </button>
                  <button className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-150">
                    Audit Logs
                  </button>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 font-mono">
        <p>© 2026 TAME. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="text-emerald-400 font-bold">API Backend Online</span>
          <span>•</span>
          <span>v1.0.0 Stable</span>
        </div>
      </footer>
    </div>
  );
}
