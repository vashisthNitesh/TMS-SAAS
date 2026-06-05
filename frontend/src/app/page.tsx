"use client";

import React, { useState, useEffect, useRef } from "react";
import ControlTower from "@/components/ControlTower";
import OrderManagement from "@/components/OrderManagement";
import BillingSettlements from "@/components/BillingSettlements";
import RouteOptimization from "@/components/RouteOptimization";
import FleetManagement from "@/components/FleetManagement";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import MasterConfig from "@/components/MasterConfig";

import {
  RadarIcon,
  PackageIcon,
  BillingIcon,
  RouteIcon,
  TruckIcon,
  AnalyticsIcon,
  SearchIcon,
  BellIcon,
  UserIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SettingsIcon
} from "@/components/icons";

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

interface Invoice {
  id: string;
  tripId: string;
  carrier: string;
  amount: string;
  status: "Audited" | "Pending Audit" | "Disputed" | "Settled";
  dueDate: string;
  lane: string;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "warning" | "danger" | "success" | "info";
  time: string;
}

export default function Shell() {
  const [activeTab, setActiveTab] = useState("control-tower");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. Shared Global Operational States
  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-9081", customer: "TechCorp Global", origin: "Seattle Port", destination: "Chicago Hub", weight: "24,500 lbs", status: "In Transit", priority: "Express", carrier: "Falcon Carrier", createdDate: "2026-06-04" },
    { id: "ORD-8921", customer: "Apex Retail Solutions", origin: "Chicago Hub", destination: "New York Depot", weight: "42,000 lbs", status: "Scheduled", priority: "Standard", carrier: "Allied Logistics", createdDate: "2026-06-04" },
    { id: "ORD-8812", customer: "MedVantage Pharms", origin: "Miami Port", destination: "Atlanta Yard", weight: "12,800 lbs", status: "Delivered", priority: "Critical SLA", carrier: "Vanguard Carrier", createdDate: "2026-06-03" },
    { id: "ORD-8744", customer: "BioGrid Energy", origin: "Atlanta Yard", destination: "Houston Terminal", weight: "88,200 lbs", status: "In Transit", priority: "Critical SLA", carrier: "Titan Heavy Haul", createdDate: "2026-06-03" },
    { id: "ORD-8690", customer: "Zeta Logistics Corp", origin: "Houston Terminal", destination: "Denver CFA", weight: "18,900 lbs", status: "Pending", priority: "Standard", carrier: "Swift Express", createdDate: "2026-06-05" },
  ]);

  const [trips, setTrips] = useState<Trip[]>([
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
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-2901", tripId: "TR-9022", carrier: "Allied Logistics", amount: "$3,420.00", status: "Audited", dueDate: "2026-06-20", lane: "Chicago ➔ New York" },
    { id: "INV-2844", tripId: "TR-8114", carrier: "Swift Express", amount: "$1,890.00", status: "Settled", dueDate: "2026-06-15", lane: "Houston ➔ Denver" },
    { id: "INV-2705", tripId: "TR-7089", carrier: "Falcon Carrier", amount: "$4,250.00", status: "Disputed", dueDate: "2026-06-12", lane: "Seattle ➔ Chicago" },
    { id: "INV-2612", tripId: "TR-3419", carrier: "Titan Heavy Haul", amount: "$12,400.00", status: "Pending Audit", dueDate: "2026-06-25", lane: "Atlanta ➔ Houston" },
    { id: "INV-2590", tripId: "TR-9902", carrier: "Apex Freight", amount: "$2,100.00", status: "Pending Audit", dueDate: "2026-06-28", lane: "Los Angeles ➔ Austin" },
  ]);

  const [events, setEvents] = useState([
    { id: 1, time: "12:54:10", type: "GEOFENCE", message: "TRK-2090 (Allied) departed Chicago Hub geofence boundary.", severity: "info" },
    { id: 2, time: "12:51:33", type: "FINANCE", message: "Finance approved waiting charges ($150) for TR-6623.", severity: "success" },
    { id: 3, time: "12:47:01", type: "TELEMATICS", message: "TR-7089 (Falcon) engine coolant temp warning: 104°C.", severity: "warning" },
    { id: 4, time: "12:42:15", type: "GATE-IN", message: "TRK-8890 (Apex) completed gate-in checks at Los Angeles CFA Dock 4.", severity: "info" },
    { id: 5, time: "12:35:09", type: "SLA RISK", message: "TR-3419 (Titan) transit speed fell below 25 mph due to storm front.", severity: "danger" }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Cold Chain SLA Alert",
      message: "TR-9022 (Allied FTL Reefer) temp rose to 4.2°C (Limit: 4.0°C)",
      type: "warning",
      time: "2 mins ago"
    },
    {
      id: 2,
      title: "Transit Delay Logged",
      message: "TR-7089 (Falcon Flatbed) reported traffic delay (+45 mins)",
      type: "danger",
      time: "10 mins ago"
    }
  ]);

  // 2. Telemetry Coordinate Progression Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTrips((prevTrips) =>
        prevTrips.map((trip) => {
          if (trip.status === "Delivered") return trip;
          
          let nextProgress = trip.progress + 0.5;
          let currentStatus: Trip["status"] = trip.status;
          
          if (nextProgress >= 100) {
            nextProgress = 100;
            currentStatus = "Delivered";
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
            status: currentStatus,
            currentPos
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Cmd+K Spotlight search hooks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const navItems = [
    { id: "control-tower", label: "Control Tower", icon: RadarIcon, badge: "Live" },
    { id: "order-intake", label: "Order Intake", icon: PackageIcon },
    { id: "route-optimization", label: "Route Planner", icon: RouteIcon },
    { id: "billing-settlements", label: "Settlements", icon: BillingIcon },
    { id: "fleet-management", label: "Fleet & Drivers", icon: TruckIcon },
    { id: "analytics-reports", label: "Analytics Dashboard", icon: AnalyticsIcon },
    { id: "master-config", label: "System Config", icon: SettingsIcon },
  ];

  const searchCommands = [
    { title: "Jump to Control Tower Operations", action: () => { setActiveTab("control-tower"); setSearchOpen(false); } },
    { title: "Intake New Shipment Manifest", action: () => { setActiveTab("order-intake"); setSearchOpen(false); } },
    { title: "Launch Route Optimization Solver", action: () => { setActiveTab("route-optimization"); setSearchOpen(false); } },
    { title: "Audit Pending Freight Claims", action: () => { setActiveTab("billing-settlements"); setSearchOpen(false); } },
    { title: "View Driver & Carrier Roster", action: () => { setActiveTab("fleet-management"); setSearchOpen(false); } },
    { title: "Generate Transporter OTP Reports", action: () => { setActiveTab("analytics-reports"); setSearchOpen(false); } },
    { title: "Configure SLAs & Branch Geofences", action: () => { setActiveTab("master-config"); setSearchOpen(false); } },
  ];

  const filteredCommands = searchCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none antialiased">
      
      {/* Top Header Shell */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-[#6366f1] flex items-center justify-center font-bold text-white shadow-sm">
              T
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase font-mono">
                Tame OS
              </h1>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Enterprise Execution OS</p>
            </div>
          </div>
          
          {/* Connection Health Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-[10px] font-mono text-slate-500 font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-emerald"></span>
            </span>
            <span>Ledger Online</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          
          {/* Search trigger button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100/60 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-mono transition-colors cursor-pointer"
          >
            <SearchIcon size={14} className="text-slate-400" />
            <span className="hidden md:inline">Quick search...</span>
            <kbd className="hidden md:inline-block bg-slate-200 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-600">⌘K</kbd>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors relative cursor-pointer"
            >
              <BellIcon size={16} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-brand-rose" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 flex flex-col gap-3 z-50 animate-slide-up">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">SLA Alerts Inbox</span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {notifications.map((n) => {
                    let dotColor = "bg-brand-cyan";
                    let alertBg = "bg-slate-50 border-slate-100";
                    if (n.type === "warning") {
                      dotColor = "bg-brand-amber";
                      alertBg = "bg-amber-50/50 border-amber-100";
                    }
                    if (n.type === "danger") {
                      dotColor = "bg-brand-rose";
                      alertBg = "bg-rose-50/50 border-rose-100";
                    }

                    return (
                      <div
                        key={n.id}
                        className={`border p-3 rounded-xl flex gap-2.5 items-start hover:opacity-90 transition-colors relative ${alertBg}`}
                      >
                        <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
                        <div className="flex-1 flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold text-slate-900">{n.title}</span>
                          <p className="text-[10px] text-slate-500 leading-normal font-sans">{n.message}</p>
                          <span className="text-[8px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="text-slate-400 hover:text-slate-600 absolute top-3 right-3 cursor-pointer"
                        >
                          <CloseIcon size={10} />
                        </button>
                      </div>
                    );
                  })}
                  {notifications.length === 0 && (
                    <div className="py-6 text-center text-slate-400 font-mono text-[10px]">
                      No active warnings in ledger queue
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      setNotifications([]);
                      setNotificationsOpen(false);
                    }}
                    className="w-full py-1.5 text-[10px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors font-mono cursor-pointer"
                  >
                    Dismiss All Alerts
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Console Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Sidebar Component */}
        <aside
          className={`border-r border-slate-200 bg-white p-4 flex flex-col gap-6 transition-all duration-200 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2 mb-2">
              {!sidebarCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Consoles</p>}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-6 w-6 rounded-md hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors ml-auto cursor-pointer"
              >
                {sidebarCollapsed ? <ChevronRightIcon size={12} /> : <ChevronDownIcon size={12} />}
              </button>
            </div>
            
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold font-sans transition-all group border ${
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    } ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
                  >
                    <IconComponent size={16} className={isActive ? "text-white" : "text-slate-450 group-hover:text-slate-800 transition-colors"} />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile section */}
          <div className="mt-auto border-t border-slate-100 pt-4">
            <div className={`flex items-center bg-slate-50 p-3 rounded-2xl border border-slate-200 ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
              <div className="h-8 w-8 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center font-bold text-brand-indigo text-xs">
                JD
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-900 truncate">John Doe</p>
                  <p className="text-[9px] text-slate-400 font-mono truncate">Operations Lead</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Dynamic Panel Workspace */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === "control-tower" && (
            <ControlTower trips={trips} setTrips={setTrips} events={events} setEvents={setEvents} />
          )}
          {activeTab === "order-intake" && (
            <OrderManagement orders={orders} setOrders={setOrders} setTrips={setTrips} />
          )}
          {activeTab === "route-optimization" && (
            <RouteOptimization orders={orders} />
          )}
          {activeTab === "billing-settlements" && (
            <BillingSettlements invoices={invoices} setInvoices={setInvoices} />
          )}
          {activeTab === "fleet-management" && (
            <FleetManagement />
          )}
          {activeTab === "analytics-reports" && (
            <AnalyticsDashboard />
          )}
          {activeTab === "master-config" && (
            <MasterConfig />
          )}
        </main>

      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-400 font-mono shadow-xs">
        <p>© 2026 TAME PLATFORM. B2B Enterprise Edition.</p>
        <div className="flex gap-4 font-semibold">
          <span className="text-brand-emerald">Telematics Core Connected</span>
          <span className="text-slate-300">•</span>
          <span>v1.2.0 Stable</span>
        </div>
      </footer>

      {/* Spotlight Command Modal Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={() => setSearchOpen(false)} />
          
          {/* Spotlight Card */}
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 animate-slide-up mx-4 text-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <SearchIcon size={14} className="text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type a command or module to jump..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-slate-800 text-xs placeholder-slate-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-mono cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {filteredCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={cmd.action}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{cmd.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Navigate</span>
                </button>
              ))}
              {filteredCommands.length === 0 && (
                <div className="py-8 text-center text-slate-400 font-mono">
                  No commands matching query
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[8px] text-slate-400 font-mono">
              <span>Use ↑↓ keys to select</span>
              <span>Press Enter to run command</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
