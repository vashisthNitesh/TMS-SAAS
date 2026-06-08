"use client";

import React, { useState, useEffect, useRef } from "react";
import Dashboard from "@/components/Dashboard";
import ControlTower from "@/components/ControlTower";
import OrderManagement from "@/components/OrderManagement";
import RouteOptimization from "@/components/RouteOptimization";
import BillingSettlements from "@/components/BillingSettlements";
import FleetManagement from "@/components/FleetManagement";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import MasterConfig from "@/components/MasterConfig";
import ProductInventory from "@/components/ProductInventory";
import EquipmentRegistry from "@/components/EquipmentRegistry";
import DocPermits from "@/components/DocPermits";
import SpecializedModules from "@/components/SpecializedModules";
import OnboardingWizard from "@/components/OnboardingWizard";
import OrgStructureManager from "@/components/OrgStructureManager";
import ModuleTogglePanel from "@/components/ModuleTogglePanel";

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
  SettingsIcon,
  CheckIcon,
  PlusIcon,
  UploadIcon,
  ClockIcon,
  MapPinIcon,
  GaugeIcon,
  BroadcastIcon,
  ForkliftIcon,
  SlidersIcon,
  SplitIcon,
  PinCircleIcon,
  UserCircleIcon,
  MapPinsIcon,
  ShelvesIcon,
  GearIcon,
  CompassIcon,
  ListIcon,
  ForkIcon,
  ClockArrowIcon,
  TableCheckIcon,
  PinIcon,
  LanesIcon,
  FlagIcon,
  DocListIcon,
  CoinsIcon,
  InvoiceIcon,
  CarrierTruckIcon,
  TrailerGearIcon,
  TrailerIcon,
  DocPenIcon,
  RadarSweepIcon,
  AmbulanceIcon,
  UsersIcon,
  GridIcon,
  TreeIcon,
  CalendarIcon,
  TruckBusIcon,
  MinusCircleIcon,
  PalletBoxIcon,
  PageIcon,
  FolderIcon,
  CreditCardIcon,
  StoreIcon,
  BarChartIcon,
  LinkIcon,
  IdCardIcon,
  DownloadCloudIcon
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Multi-Tenant enabled modules context state
  const [enabledModules, setEnabledModules] = useState<string[]>(["CRM", "TRANSPORTATION", "INVENTORY", "REPORTING", "BILLING", "DMS"]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentTenantName, setCurrentTenantName] = useState("Tame OS");
  
  // Accordion toggle states
  const [opsExpanded, setOpsExpanded] = useState(true);
  const [distExpanded, setDistExpanded] = useState(true);
  const [transExpanded, setTransExpanded] = useState(true);
  const [configExpanded, setConfigExpanded] = useState(true);

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

  // Telemetry Coordinate Progression Loop
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

  const searchCommands = [
    { title: "Jump to Executive Dashboard", action: () => { setActiveTab("dashboard"); setSearchOpen(false); } },
    { title: "Jump to Control Tower Operations", action: () => { setActiveTab("control-tower"); setSearchOpen(false); } },
    { title: "Jump to Analytics & Reports", action: () => { setActiveTab("analytics-reports"); setSearchOpen(false); } },
    
    // Distribution
    { title: "Distribution: Intake Shipment Orders", action: () => { setActiveTab("dist-orders"); setSearchOpen(false); } },
    { title: "Distribution: Roster Active Trips", action: () => { setActiveTab("dist-trips"); setSearchOpen(false); } },
    { title: "Distribution: Route Optimization Planner", action: () => { setActiveTab("dist-trip-planning"); setSearchOpen(false); } },
    { title: "Distribution: B2B Customers Roster", action: () => { setActiveTab("dist-customers"); setSearchOpen(false); } },
    { title: "Distribution: Geocoded Address Directory", action: () => { setActiveTab("dist-addresses"); setSearchOpen(false); } },
    { title: "Distribution: Products & Items Master", action: () => { setActiveTab("dist-items"); setSearchOpen(false); } },
    { title: "Distribution: Warehouse Storage Profiles", action: () => { setActiveTab("dist-storage-types"); setSearchOpen(false); } },
    { title: "Distribution: Routing & SLA Configs", action: () => { setActiveTab("dist-order-config"); setSearchOpen(false); } },
    { title: "Distribution: Regional Transit Zones", action: () => { setActiveTab("dist-zones"); setSearchOpen(false); } },
    { title: "Distribution: Freight Class Categories", action: () => { setActiveTab("dist-categories"); setSearchOpen(false); } },
    { title: "Distribution: Integration Intake Channels", action: () => { setActiveTab("dist-channels"); setSearchOpen(false); } },
    { title: "Distribution: Geocode Address Validator", action: () => { setActiveTab("dist-address-update"); setSearchOpen(false); } },
    { title: "Distribution: Sales Reconciliation Billing", action: () => { setActiveTab("dist-reconciliation"); setSearchOpen(false); } },

    // Transport
    { title: "Transport: Dispatch Booked Orders", action: () => { setActiveTab("trans-orders"); setSearchOpen(false); } },
    { title: "Transport: Track Active Hauls", action: () => { setActiveTab("trans-trips"); setSearchOpen(false); } },
    { title: "Transport: Consignor & Consignee Registry", action: () => { setActiveTab("trans-customers"); setSearchOpen(false); } },
    { title: "Transport: Waypoints & Shipping Points", action: () => { setActiveTab("trans-addresses"); setSearchOpen(false); } },
    { title: "Transport: Active Terminals GPS Maps", action: () => { setActiveTab("trans-locations"); setSearchOpen(false); } },
    { title: "Transport: Lane Contracts & Tariff Cards", action: () => { setActiveTab("trans-lanes"); setSearchOpen(false); } },
    { title: "Transport: Active Status Milestones", action: () => { setActiveTab("trans-milestones"); setSearchOpen(false); } },
    { title: "Transport: Milestone Lifecycle Templates", action: () => { setActiveTab("trans-milestone-templates"); setSearchOpen(false); } },
    { title: "Transport: Accessorial Detention Tariffs", action: () => { setActiveTab("trans-charges"); setSearchOpen(false); } },
    { title: "Transport: Freight Invoices Audit Center", action: () => { setActiveTab("trans-invoices"); setSearchOpen(false); } },
    { title: "Transport: Container ISO Roster", action: () => { setActiveTab("trans-container-types"); setSearchOpen(false); } },
    { title: "Transport: Trailer Specifications Roster", action: () => { setActiveTab("trans-trailer-types"); setSearchOpen(false); } },
    { title: "Transport: Physical Trailers Directory", action: () => { setActiveTab("trans-trailers"); setSearchOpen(false); } },
    { title: "Transport: Hazmat Packaging Products", action: () => { setActiveTab("trans-products"); setSearchOpen(false); } },
    { title: "Transport: Service Contract SLA Agreements", action: () => { setActiveTab("trans-contracts"); setSearchOpen(false); } },
    { title: "Transport: Radar Geofence Boundaries", action: () => { setActiveTab("trans-geofences"); setSearchOpen(false); } },
    { title: "Transport: Patient Transport Ambulance dispatch", action: () => { setActiveTab("trans-patient"); setSearchOpen(false); } },
    { title: "Transport: Carrier Portal User Accounts", action: () => { setActiveTab("trans-users"); setSearchOpen(false); } },
    { title: "Transport: Fleet Assets SAM ELD Telematics", action: () => { setActiveTab("trans-assets"); setSearchOpen(false); } },

    // Configurations
    { title: "Configurations: Branch Depot Setup", action: () => { setActiveTab("config-branches"); setSearchOpen(false); } },
    { title: "Configurations: Dedicated Shipping Projects", action: () => { setActiveTab("config-projects"); setSearchOpen(false); } },
    { title: "Configurations: Truck Pull Specifications", action: () => { setActiveTab("config-vehicle-types"); setSearchOpen(false); } },
    { title: "Configurations: Delayed Overrides Log", action: () => { setActiveTab("config-exceptions"); setSearchOpen(false); } },
    { title: "Configurations: Pallet Dimensions Registry", action: () => { setActiveTab("config-package-types"); setSearchOpen(false); } },
    { title: "Configurations: Mandatory Document Forms", action: () => { setActiveTab("config-doc-types"); setSearchOpen(false); } },
    { title: "Configurations: Carrier Permits Verification", action: () => { setActiveTab("config-permits"); setSearchOpen(false); } },
    { title: "Configurations: Scale Expense Code Tariffs", action: () => { setActiveTab("config-expense-types"); setSearchOpen(false); } },
    { title: "Configurations: Broker Directory FMCSA Safety", action: () => { setActiveTab("config-vendors"); setSearchOpen(false); } },
    { title: "Configurations: Operational Reports Exporter", action: () => { setActiveTab("config-reports"); setSearchOpen(false); } },
    { title: "Configurations: EDI & API Webhooks Integration", action: () => { setActiveTab("config-integrations"); setSearchOpen(false); } },
    { title: "Configurations: Tech Support Release Notes", action: () => { setActiveTab("config-support"); setSearchOpen(false); } },
    { title: "Configurations: Download Driver Mobile App", action: () => { setActiveTab("config-download-apk"); setSearchOpen(false); } },
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
              {currentTenantName[0]}
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase font-mono">
                {currentTenantName}
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
          
          {/* Onboard Client Button */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 px-3 py-2 rounded-xl text-brand-cyan text-xs font-mono transition-colors cursor-pointer"
          >
            + Onboard Org
          </button>
          
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
        {/* Collapsible B2B Sidebar Category Accordion */}
        <aside
          className={`border-r border-slate-200 bg-white p-4 flex flex-col gap-5 transition-all duration-200 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Header Toggle */}
          <div className="flex items-center justify-between px-2">
            {!sidebarCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Operations OS</p>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-6 w-6 rounded-md hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors ml-auto cursor-pointer"
            >
              {sidebarCollapsed ? <ChevronRightIcon size={12} /> : <ChevronDownIcon size={12} />}
            </button>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-0.5">
            {[
              {
                id: "ops",
                title: "Operations Tower",
                expanded: opsExpanded,
                setExpanded: setOpsExpanded,
                items: [
                  { id: "dashboard", label: "Dashboard", icon: GaugeIcon, color: "text-emerald-600" },
                  { id: "control-tower", label: "Control Tower", icon: BroadcastIcon, color: "text-amber-600", module: "TRANSPORTATION" },
                  { id: "analytics-reports", label: "Analytics", icon: BarChartIcon, color: "text-blue-500", module: "REPORTING" }
                ]
              },
              {
                id: "dist",
                title: "Distribution",
                expanded: distExpanded,
                setExpanded: setDistExpanded,
                items: [
                  { id: "dist-orders", label: "Orders", icon: PackageIcon, color: "text-blue-500", module: "TRANSPORTATION" },
                  { id: "dist-trips", label: "Trips", icon: SplitIcon, color: "text-red-500", module: "TRANSPORTATION" },
                  { id: "dist-trip-planning", label: "Trip Planning", icon: PinCircleIcon, color: "text-yellow-500", module: "TRANSPORTATION" },
                  { id: "dist-customers", label: "Customers", icon: UserCircleIcon, color: "text-emerald-500", module: "CRM" },
                  { id: "dist-addresses", label: "Addresses", icon: MapPinsIcon, color: "text-purple-500" },
                  { id: "dist-items", label: "Items", icon: PackageIcon, color: "text-pink-500", module: "INVENTORY" },
                  { id: "dist-storage-types", label: "Storage Types", icon: ShelvesIcon, color: "text-blue-500", module: "INVENTORY" },
                  { id: "dist-order-config", label: "Order Config", icon: GearIcon, color: "text-blue-600", module: "TRANSPORTATION" },
                  { id: "dist-zones", label: "Zones", icon: CompassIcon, color: "text-blue-500", module: "TRANSPORTATION" },
                  { id: "dist-categories", label: "Categories", icon: ListIcon, color: "text-blue-500", module: "TRANSPORTATION" },
                  { id: "dist-channels", label: "Channels", icon: ForkIcon, color: "text-blue-500", module: "CRM" },
                  { id: "dist-address-update", label: "Address Update", icon: ClockArrowIcon, color: "text-amber-800" },
                  { id: "dist-reconciliation", label: "Order Reconciliation", icon: TableCheckIcon, color: "text-emerald-600", module: "BILLING" }
                ]
              },
              {
                id: "trans",
                title: "Transport",
                expanded: transExpanded,
                setExpanded: setTransExpanded,
                items: [
                  { id: "trans-orders", label: "Orders", icon: PackageIcon, color: "text-blue-500", module: "TRANSPORTATION" },
                  { id: "trans-trips", label: "Trips", icon: SplitIcon, color: "text-red-500", module: "TRANSPORTATION" },
                  { id: "trans-customers", label: "Customers", icon: UserCircleIcon, color: "text-emerald-500", module: "CRM" },
                  { id: "trans-addresses", label: "Addresses", icon: MapPinsIcon, color: "text-purple-500" },
                  { id: "trans-locations", label: "Locations", icon: PinIcon, color: "text-emerald-500", module: "TRANSPORTATION" },
                  { id: "trans-lanes", label: "Lanes", icon: LanesIcon, color: "text-amber-800", module: "TRANSPORTATION" },
                  { id: "trans-milestones", label: "Milestones", icon: FlagIcon, color: "text-purple-500", module: "TRANSPORTATION" },
                  { id: "trans-milestone-templates", label: "Milestone Templates", icon: DocListIcon, color: "text-purple-650", module: "TRANSPORTATION" },
                  { id: "trans-charges", label: "Charges", icon: CoinsIcon, color: "text-teal-600", module: "BILLING" },
                  { id: "trans-invoices", label: "Invoices", icon: InvoiceIcon, color: "text-blue-500", module: "BILLING" },
                  { id: "trans-container-types", label: "Container Types", icon: CarrierTruckIcon, color: "text-blue-500", module: "INVENTORY" },
                  { id: "trans-trailer-types", label: "Trailer Types", icon: TrailerGearIcon, color: "text-blue-500", module: "INVENTORY" },
                  { id: "trans-trailers", label: "Trailers", icon: TrailerIcon, color: "text-blue-500", module: "INVENTORY" },
                  { id: "trans-products", label: "Products", icon: PackageIcon, color: "text-blue-500", module: "INVENTORY" },
                  { id: "trans-contracts", label: "Customer Contracts", icon: DocPenIcon, color: "text-blue-500", module: "CRM" },
                  { id: "trans-geofences", label: "Geofences", icon: RadarSweepIcon, color: "text-blue-500", module: "TRANSPORTATION" },
                  { id: "trans-patient", label: "Patient Transport", icon: AmbulanceIcon, color: "text-blue-500", module: "TRANSPORTATION" },
                  { id: "trans-users", label: "Users", icon: UsersIcon, color: "text-blue-500" },
                  { id: "trans-assets", label: "Assets", icon: GridIcon, color: "text-blue-500", module: "TRANSPORTATION" }
                ]
              },
              {
                id: "config",
                title: "Configurations",
                expanded: configExpanded,
                setExpanded: setConfigExpanded,
                items: [
                  { id: "config-org-structure", label: "Org Structure", icon: TreeIcon, color: "text-indigo-600" },
                  { id: "config-modules", label: "Modules & Metadata", icon: GearIcon, color: "text-indigo-650" },
                  { id: "config-branches", label: "Branches", icon: TreeIcon, color: "text-emerald-600" },
                  { id: "config-projects", label: "Projects", icon: CalendarIcon, color: "text-pink-500" },
                  { id: "config-vehicle-types", label: "Vehicle Types", icon: TruckBusIcon, color: "text-amber-600", module: "TRANSPORTATION" },
                  { id: "config-exceptions", label: "Exceptions", icon: MinusCircleIcon, color: "text-slate-400", module: "TRANSPORTATION" },
                  { id: "config-package-types", label: "Package Types", icon: PalletBoxIcon, color: "text-slate-500", module: "INVENTORY" },
                  { id: "config-doc-types", label: "Document Type", icon: PageIcon, color: "text-slate-900", module: "DMS" },
                  { id: "config-permits", label: "Permits", icon: FolderIcon, color: "text-blue-500", module: "DMS" },
                  { id: "config-expense-types", label: "Expense Types", icon: CreditCardIcon, color: "text-blue-500", module: "BILLING" },
                  { id: "config-vendors", label: "Vendors", icon: StoreIcon, color: "text-blue-500", module: "CRM" },
                  { id: "config-reports", label: "Reports", icon: BarChartIcon, color: "text-blue-500", module: "REPORTING" },
                  { id: "config-integrations", label: "Integrations", icon: LinkIcon, color: "text-blue-500" },
                  { id: "config-support", label: "Support", icon: IdCardIcon, color: "text-emerald-600" },
                  { id: "config-download-apk", label: "Download APK", icon: DownloadCloudIcon, color: "text-emerald-600" }
                ]
              }
            ].map((cat) => (
              <div key={cat.id} className="flex flex-col gap-1">
                {!sidebarCollapsed && (
                  <button
                    onClick={() => cat.setExpanded(!cat.expanded)}
                    className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider cursor-pointer hover:text-slate-650"
                  >
                    <span>{cat.title}</span>
                    {cat.expanded ? <ChevronDownIcon size={10} /> : <ChevronRightIcon size={10} />}
                  </button>
                )}
                {(cat.expanded || sidebarCollapsed) && (
                  <div className="flex flex-col gap-0.5">
                    {cat.items
                      .filter((item: any) => !item.module || enabledModules.includes(item.module))
                      .map((item) => {
                        const isActive = activeTab === item.id;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all border ${
                              isActive
                                ? "bg-[#1a5b6e] border-[#1a5b6e] text-white shadow-xs"
                                : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            } ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
                          >
                            <IconComponent size={16} className={isActive ? "text-white" : item.color} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
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
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "control-tower" && (
            <ControlTower trips={trips} setTrips={setTrips} events={events} setEvents={setEvents} />
          )}
          {activeTab === "analytics-reports" && <AnalyticsDashboard />}
          
          {/* Distribution */}
          {activeTab === "dist-orders" && (
            <OrderManagement orders={orders} setOrders={setOrders} setTrips={setTrips} />
          )}
          {activeTab === "dist-trips" && (
            <FleetManagement />
          )}
          {activeTab === "dist-trip-planning" && (
            <RouteOptimization orders={orders} />
          )}
          {activeTab === "dist-items" && <ProductInventory />}
          {activeTab === "dist-reconciliation" && (
            <BillingSettlements invoices={invoices} setInvoices={setInvoices} />
          )}

          {/* Transport */}
          {activeTab === "trans-orders" && (
            <OrderManagement orders={orders} setOrders={setOrders} setTrips={setTrips} />
          )}
          {activeTab === "trans-trips" && (
            <FleetManagement />
          )}
          {activeTab === "trans-lanes" && <MasterConfig />}
          {activeTab === "trans-invoices" && (
            <BillingSettlements invoices={invoices} setInvoices={setInvoices} />
          )}
          {activeTab === "trans-container-types" && <EquipmentRegistry />}
          {activeTab === "trans-trailer-types" && <EquipmentRegistry />}
          {activeTab === "trans-trailers" && <EquipmentRegistry />}
          {activeTab === "trans-products" && <ProductInventory />}
          {activeTab === "trans-geofences" && <MasterConfig />}

          {/* Configurations */}
          {activeTab === "config-branches" && <MasterConfig />}
          {activeTab === "config-permits" && <DocPermits />}
          {activeTab === "config-org-structure" && <OrgStructureManager />}
          {activeTab === "config-modules" && (
            <ModuleTogglePanel />
          )}

          {/* Specialized Custom Modules Fallback */}
          {[
            "dist-customers", "dist-addresses", "dist-storage-types", "dist-order-config",
            "dist-zones", "dist-categories", "dist-channels", "dist-address-update",
            "trans-customers", "trans-addresses", "trans-locations", "trans-milestones",
            "trans-milestone-templates", "trans-charges", "trans-contracts", "trans-patient",
            "trans-users", "trans-assets", "config-projects", "config-vehicle-types",
            "config-exceptions", "config-package-types", "config-doc-types", "config-expense-types",
            "config-vendors", "config-reports", "config-integrations", "config-support",
            "config-download-apk"
          ].includes(activeTab) && (
            <SpecializedModules tab={activeTab.split("-").slice(1).join("-")} />
          )}
        </main>
      </div>

      {/* Dynamic Overlay Modal for Tenant Onboarding Wizard */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOnboardingOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl">
            <OnboardingWizard
              onOnboardComplete={(tenantId, companyName, adminUsername) => {
                setCurrentTenantName(companyName);
                setIsOnboardingOpen(false);
              }}
              onCancel={() => setIsOnboardingOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-400 font-mono shadow-xs">
        <p>© 2026 TAME PLATFORM. Grouped B2B Enterprise Console.</p>
        <div className="flex gap-4 font-semibold">
          <span className="text-brand-emerald">Telematics Core Connected</span>
          <span className="text-slate-300">•</span>
          <span>v1.3.0 Stable</span>
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
