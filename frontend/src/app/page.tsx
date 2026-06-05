"use client";

import React, { useState, useEffect, useRef } from "react";
import ControlTower from "@/components/ControlTower";
import OrderManagement from "@/components/OrderManagement";
import BillingSettlements from "@/components/BillingSettlements";
import RouteOptimization from "@/components/RouteOptimization";
import FleetManagement from "@/components/FleetManagement";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

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
  ChevronRightIcon
} from "@/components/icons";

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

  // Cmd+K Spotlight search hook
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

  // Focus search input when opened
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
  ];

  const searchCommands = [
    { title: "Jump to Control Tower Operations", action: () => { setActiveTab("control-tower"); setSearchOpen(false); } },
    { title: "Intake New Shipment Manifest", action: () => { setActiveTab("order-intake"); setSearchOpen(false); } },
    { title: "Launch Route Optimization Solver", action: () => { setActiveTab("route-optimization"); setSearchOpen(false); } },
    { title: "Audit Pending Freight Claims", action: () => { setActiveTab("billing-settlements"); setSearchOpen(false); } },
    { title: "View Driver & Carrier Roster", action: () => { setActiveTab("fleet-management"); setSearchOpen(false); } },
    { title: "Generate Transporter OTP Reports", action: () => { setActiveTab("analytics-reports"); setSearchOpen(false); } },
  ];

  const filteredCommands = searchCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* Top Header Shell */}
      <header className="border-b border-white/[0.04] bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center font-bold text-white shadow-md shadow-brand-indigo/10">
              T
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase font-mono">
                Tame OS
              </h1>
              <p className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Logistics Execution OS</p>
            </div>
          </div>
          
          {/* Connection Health Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.04] text-[10px] font-mono text-slate-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Ledger Online (Live feed)</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          
          {/* Search trigger button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] px-3 py-2 rounded-xl text-slate-400 text-xs font-mono transition-colors"
          >
            <SearchIcon size={14} />
            <span className="hidden md:inline">Quick search...</span>
            <kbd className="hidden md:inline-block bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-[9px] font-semibold">⌘K</kbd>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="h-9 w-9 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
            >
              <BellIcon size={16} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-50 animate-slide-up">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-white">SLA Alerts Inbox</span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-500 hover:text-white"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {notifications.map((n) => {
                    let dotColor = "bg-cyan-500";
                    if (n.type === "warning") dotColor = "bg-amber-500";
                    if (n.type === "danger") dotColor = "bg-rose-500";

                    return (
                      <div
                        key={n.id}
                        className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex gap-2.5 items-start hover:bg-white/[0.02] transition-colors relative"
                      >
                        <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
                        <div className="flex-1 flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold text-white">{n.title}</span>
                          <p className="text-[10px] text-slate-400 leading-normal font-sans">{n.message}</p>
                          <span className="text-[8px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="text-slate-500 hover:text-slate-300 absolute top-3 right-3"
                        >
                          <CloseIcon size={10} />
                        </button>
                      </div>
                    );
                  })}
                  {notifications.length === 0 && (
                    <div className="py-6 text-center text-slate-500 font-mono text-[10px]">
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
                    className="w-full py-1.5 text-[10px] text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/5 transition-colors font-mono"
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
          className={`border-r border-white/[0.04] bg-[#0c0c0e]/30 p-4 flex flex-col gap-6 transition-all duration-300 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2 mb-2">
              {!sidebarCollapsed && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Consoles</p>}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-6 w-6 rounded-md hover:bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors ml-auto"
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
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold font-sans transition-all group ${
                      isActive
                        ? "bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo"
                        : "text-slate-400 hover:bg-white/[0.02] border border-transparent hover:text-white"
                    } ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
                  >
                    <IconComponent size={16} className={isActive ? "text-brand-indigo" : "text-slate-400 group-hover:text-white transition-colors"} />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile section */}
          <div className="mt-auto border-t border-white/[0.04] pt-4">
            <div className={`flex items-center bg-white/[0.01] p-3 rounded-2xl border border-white/[0.03] ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
              <div className="h-8 w-8 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center font-bold text-brand-indigo text-xs">
                JD
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">John Doe</p>
                  <p className="text-[9px] text-slate-500 font-mono truncate">Operations Lead</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Dynamic Panel Workspace */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === "control-tower" && <ControlTower />}
          {activeTab === "order-intake" && <OrderManagement />}
          {activeTab === "route-optimization" && <RouteOptimization />}
          {activeTab === "billing-settlements" && <BillingSettlements />}
          {activeTab === "fleet-management" && <FleetManagement />}
          {activeTab === "analytics-reports" && <AnalyticsDashboard />}
        </main>

      </div>

      {/* Global Footer */}
      <footer className="border-t border-white/[0.04] bg-[#030303]/90 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-500 font-mono">
        <p>© 2026 TAME PLATFORM. Advanced Logistics Execution OS.</p>
        <div className="flex gap-4">
          <span className="text-emerald-400 font-bold">Telematics Core Connected</span>
          <span>•</span>
          <span>SaaS Edition v1.1.0 Stable</span>
        </div>
      </footer>

      {/* Spotlight Command Modal Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-200 flex items-start justify-center pt-[15vh]">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          
          {/* Spotlight Card */}
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-4 flex flex-col gap-3 animate-slide-up mx-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <SearchIcon size={14} className="text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type a command or module to jump..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder-slate-500"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-500 hover:text-white bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono"
              >
                ESC
              </button>
            </div>

            <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {filteredCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={cmd.action}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-brand-indigo/10 hover:text-brand-indigo text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span>{cmd.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Navigate</span>
                </button>
              ))}
              {filteredCommands.length === 0 && (
                <div className="py-8 text-center text-slate-500 font-mono">
                  No commands matching query
                </div>
              )}
            </div>
            
            <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[8px] text-slate-500 font-mono">
              <span>Use ↑↓ keys to select</span>
              <span>Press Enter to run command</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
