import React, { useState } from "react";
import {
  CheckIcon,
  PlusIcon,
  AlertIcon,
  TrashIcon,
  ClockIcon,
  DownloadIcon,
  UploadIcon,
  MapPinIcon,
  UserIcon,
  RadarIcon,
  AmbulanceIcon,
  SearchIcon,
  CoinsIcon,
  FlagIcon,
  GridIcon
} from "./icons";

interface SpecializedModulesProps {
  tab: string;
}

export default function SpecializedModules({ tab }: SpecializedModulesProps) {
  // --- STATE HOOKS FOR INTERACTIVE SUB-MODULES ---

  // 1. Customers
  const [customers, setCustomers] = useState([
    { id: "CUST-901", name: "Alpha Distributing", contact: "Alice Vance", credit: "$150,000", status: "Active", activeShipments: 12 },
    { id: "CUST-902", name: "Beta Industrial", contact: "Bob Reynolds", credit: "$75,000", status: "Active", activeShipments: 4 },
    { id: "CUST-903", name: "Gamma Logistics", contact: "Gail Hughes", credit: "$200,000", status: "On Hold", activeShipments: 0 },
    { id: "CUST-904", name: "Delta Healthcare", contact: "Daniel Chen", credit: "$500,000", status: "Active", activeShipments: 19 }
  ]);
  const [newCust, setNewCust] = useState({ name: "", contact: "", credit: "$50,000" });
  const [isAddingCust, setIsAddingCust] = useState(false);

  const handleAddCust = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomers([...customers, {
      id: `CUST-${Math.floor(905 + Math.random() * 90)}`,
      name: newCust.name,
      contact: newCust.contact,
      credit: newCust.credit,
      status: "Active",
      activeShipments: 0
    }]);
    setNewCust({ name: "", contact: "", credit: "$50,000" });
    setIsAddingCust(false);
  };

  // 2. Addresses & Address Update geocoding workflow
  const [addresses, setAddresses] = useState([
    { id: "ADD-101", raw: "1200 Terminal Way, Seattle, WA", lat: "47.6062", lng: "-122.3321", verified: true, type: "Origin" },
    { id: "ADD-102", raw: "550 Expressway Blvd, Chicago, IL", lat: "41.8781", lng: "-87.6298", verified: true, type: "Destination" },
    { id: "ADD-103", raw: "88 Port Blvd, Miami, FL", lat: "25.7617", lng: "-80.1918", verified: false, type: "Port Terminal" }
  ]);
  const [pendingResolves, setPendingResolves] = useState([
    { id: "PEND-01", input: "100 Peachtree Lane, Atlanta, GA", suggested: "100 Peachtree St NW, Atlanta, GA 30303", confidence: "92%" },
    { id: "PEND-02", input: "980 Industrial Park, Houston", suggested: "980 Industrial Rd, Houston, TX 77002", confidence: "85%" }
  ]);

  const handleVerifyAddress = (id: string, suggested: string) => {
    setAddresses([...addresses, {
      id: `ADD-${Math.floor(104 + Math.random() * 90)}`,
      raw: suggested,
      lat: "33.7490",
      lng: "-84.3880",
      verified: true,
      type: "Waypoint"
    }]);
    setPendingResolves(pendingResolves.filter(p => p.id !== id));
  };

  // 3. Storage Types
  const [storages] = useState([
    { code: "ST-REF", name: "Cold Storage (Reefer)", tempRange: "2°C to 8°C", zones: 4, capacity: "80%" },
    { code: "ST-DRY", name: "Dry Pallet Racks", tempRange: "Ambient", zones: 12, capacity: "65%" },
    { code: "ST-HAZ", name: "Hazmat Bunker", tempRange: "Ventilated", zones: 2, capacity: "18%" }
  ]);

  // 4. Milestones
  const [milestones, setMilestones] = useState([
    { id: "MS-01", event: "Gate In", defaultCode: "GT-IN", trigger: "Automated (Geofence)", status: "Active" },
    { id: "MS-02", event: "Loading Started", defaultCode: "LD-ST", trigger: "Manual Scan", status: "Active" },
    { id: "MS-03", event: "POD Signed", defaultCode: "POD-SG", trigger: "Driver Mobile App", status: "Active" }
  ]);
  const [newMilestone, setNewMilestone] = useState("");
  const handleAddMilestone = () => {
    if (!newMilestone) return;
    setMilestones([...milestones, {
      id: `MS-${Math.floor(10 + Math.random() * 90)}`,
      event: newMilestone,
      defaultCode: newMilestone.toUpperCase().replace(/\s+/g, "-").slice(0, 5),
      trigger: "Dispatcher Action",
      status: "Active"
    }]);
    setNewMilestone("");
  };

  // 5. Charges
  const [charges, setCharges] = useState([
    { id: "CHG-001", type: "Fuel Surcharge (FSC)", basis: "DOE National Diesel Average", rate: "$0.42 / mile" },
    { id: "CHG-002", type: "Demurrage (Waiting)", basis: "Hourly after 2hr Free allowance", rate: "$85.00 / hr" },
    { id: "CHG-003", type: "Oversized Escort Fee", basis: "Flat Rate per State Line transit", rate: "$1,200.00" }
  ]);

  // 6. Patient Transport
  const [patientLoads, setPatientLoads] = useState([
    { id: "PT-7711", patient: "Arthur Dent", type: "Wheelchair Van", credentials: "Basic First Aid", oxygenRequired: true, scheduler: "St. Jude Hospital", status: "Active Dispatch" },
    { id: "PT-7712", patient: "Tricia McMillan", type: "BLS Ambulance", credentials: "Certified EMT", oxygenRequired: false, scheduler: "County Hospice Center", status: "Dispatched" }
  ]);

  // 7. Active Telematics Assets
  const [assets] = useState([
    { name: "TRK-2090", battery: "13.6 V (Good)", fuel: "88% Capacity", coolantTemp: "82°C", voltage: "Normal", pings: "Samsara Active" },
    { name: "TRK-7411", battery: "12.2 V (Warn)", fuel: "42% Capacity", coolantTemp: "94°C", voltage: "Normal", pings: "Geotab Active" },
    { name: "TRK-1022", battery: "14.1 V (Good)", fuel: "15% Capacity (Low)", coolantTemp: "104°C (High)", voltage: "Warning", pings: "Samsara Critical" }
  ]);

  // 8. Download APK Mobile Driver Interface
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDownloading(false);
          alert("TAME-Driver-v1.8.4.apk downloaded successfully to your local machine.");
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  // --- RENDER DYNAMIC COMPONENT BASED ON ACTIVE TAB ---

  switch (tab) {
    case "customers":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">B2B Customers Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage customer billing accounts, credit terms, and active loads</p>
            </div>
            <button
              onClick={() => setIsAddingCust(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-brand-indigo hover:bg-[#4338ca] text-white rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <PlusIcon size={12} />
              New Customer Account
            </button>
          </div>

          {isAddingCust && (
            <form onSubmit={handleAddCust} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase font-mono">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={newCust.name}
                    onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase font-mono">Primary Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={newCust.contact}
                    onChange={(e) => setNewCust({ ...newCust, contact: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase font-mono">Credit Limit</label>
                  <input
                    type="text"
                    placeholder="e.g. $100,000"
                    value={newCust.credit}
                    onChange={(e) => setNewCust({ ...newCust, credit: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCust(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-brand-indigo hover:bg-[#4338ca] text-white rounded-lg transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-5">Customer Account</th>
                    <th className="py-3 px-5">Primary Contact</th>
                    <th className="py-3 px-5">Credit Line</th>
                    <th className="py-3 px-5">Loads In Transit</th>
                    <th className="py-3 px-5 text-right">Ledger Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-5 font-mono text-slate-400">{c.id}</td>
                      <td className="py-3 px-5 font-semibold text-slate-900">{c.name}</td>
                      <td className="py-3 px-5 text-slate-650">{c.contact}</td>
                      <td className="py-3 px-5 font-mono text-slate-800 font-semibold">{c.credit}</td>
                      <td className="py-3 px-5 font-semibold text-slate-700">{c.activeShipments} loads</td>
                      <td className="py-3 px-5 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          c.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case "addresses":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Enterprise Address Directory</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage geocoded coordinate center points for warehouse dock locations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                    <th className="py-3 px-5">Address</th>
                    <th className="py-3 px-5">Coordinates (Lat, Lng)</th>
                    <th className="py-3 px-5">Node Category</th>
                    <th className="py-3 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {addresses.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-5 font-semibold text-slate-800">{a.raw}</td>
                      <td className="py-3 px-5 font-mono text-slate-600">{a.lat}, {a.lng}</td>
                      <td className="py-3 px-5 font-mono text-slate-500 uppercase text-[9px] font-bold">{a.type}</td>
                      <td className="py-3 px-5 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <CheckIcon size={12} /> Geocoded
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Geocoding Logic</h3>
                <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                  Address entries mapped through standard APIs resolve to spatial decimal coordinates. Waypoints match with geofence radars.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">API Provider Connection</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Google Maps Geocoding</span>
                  <span className="text-emerald-600 font-bold">Online</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">OpenStreetMap Fallback</span>
                  <span className="text-slate-450">Standby</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "storage-types":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Warehouse Storage Profiles</h2>
            <p className="text-xs text-slate-500 mt-0.5">Define racking configurations, hazmat rules, and temp zones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storages.map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <div>
                  <span className="inline-block text-[9px] font-mono font-bold bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full mb-3">
                    {s.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                  <div className="flex flex-col gap-1.5 mt-4 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                      <span>Temp Threshold</span>
                      <span className="font-semibold font-mono text-slate-800">{s.tempRange}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                      <span>Active Bay Zones</span>
                      <span className="font-semibold font-mono text-slate-800">{s.zones} zones</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-450 uppercase font-mono font-bold">Total Space Utilization</span>
                  <span className="text-xs font-bold text-brand-indigo font-mono">{s.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "order-config":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Routing & Order Rules</h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure parameters for automatic dispatching and vehicle allocation rules</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 shadow-xs max-w-2xl">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">Automation Workflows</h3>
              
              <div className="flex items-start gap-4">
                <input type="checkbox" defaultChecked className="mt-1 accent-brand-indigo h-4 w-4" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Auto-Assign Multi-Stop Hubs</span>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Orders with shared destination postal grids automatically bundle into LTL routing optimization schedules.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <input type="checkbox" defaultChecked className="mt-1 accent-brand-indigo h-4 w-4" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Cross-Dock Consolidation Threshold</span>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Delay dispatcher load creation for up to 6 hours if weight threshold sits under 15,000 lbs, allowing consolidation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <input type="checkbox" className="mt-1 accent-brand-indigo h-4 w-4" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Strict Carrier Tender SLA Roster</span>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Reject tenders automatically if target carrier fleet does not report a safety score higher than 92% FMCSA rating.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "zones":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Regional Delivery Zones</h2>
            <p className="text-xs text-slate-500 mt-0.5">Define local drayage grids and regional linehaul tariff boundaries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                    <th className="py-3 px-5">Zone Name</th>
                    <th className="py-3 px-5 font-mono">Geo Grid Boundary</th>
                    <th className="py-3 px-5 text-right">Coverage Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">PNW-Core-01</td>
                    <td className="py-3 px-5 font-mono text-slate-600">WA, OR, ID (Border Radii)</td>
                    <td className="py-3 px-5 text-right"><span className="text-emerald-600 font-semibold">Active Drayage</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">Midwest-Hub-02</td>
                    <td className="py-3 px-5 font-mono text-slate-600">IL, IN, WI, MI (Terminal Yards)</td>
                    <td className="py-3 px-5 text-right"><span className="text-emerald-600 font-semibold">Active Drayage</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">TX-Terminal-04</td>
                    <td className="py-3 px-5 font-mono text-slate-600">Harris County & Port Areas</td>
                    <td className="py-3 px-5 text-right"><span className="text-amber-600 font-semibold">Limited Carriers</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case "categories":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Freight Classification Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">Establish standard categories for dispatching rules and invoice parameters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-brand-indigo">CAT-01</span>
              <h3 className="text-xs font-bold text-slate-900">Cold Chain Critical</h3>
              <p className="text-[10px] text-slate-450 leading-relaxed">Vaccines, fresh foods requiring continuous telemetry monitoring.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-brand-indigo">CAT-02</span>
              <h3 className="text-xs font-bold text-slate-900">Dry Van Standard</h3>
              <p className="text-[10px] text-slate-450 leading-relaxed">Box van pallet loads, non-perishable consumer package goods.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-brand-indigo">CAT-03</span>
              <h3 className="text-xs font-bold text-slate-900">Hazmat Class A</h3>
              <p className="text-[10px] text-slate-450 leading-relaxed">Combustible, gas canister loads requiring UN placard permits.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-brand-indigo">CAT-04</span>
              <h3 className="text-xs font-bold text-slate-900">Industrial Superload</h3>
              <p className="text-[10px] text-slate-450 leading-relaxed">Flatbeds carrying multi-axle machinery and crane components.</p>
            </div>
          </div>
        </div>
      );

    case "channels":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Order Intake Channels</h2>
            <p className="text-xs text-slate-500 mt-0.5">Inspect real-time API integrations and EDI ledger pipelines</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                    <th className="py-3 px-5">Intake Mode</th>
                    <th className="py-3 px-5">Active Volume (24h)</th>
                    <th className="py-3 px-5">Last Transaction Log</th>
                    <th className="py-3 px-5 text-right">Integrations Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">ANSI EDI 204 (Tender)</td>
                    <td className="py-3 px-5 font-mono text-slate-800 font-semibold">142 Tenders</td>
                    <td className="py-3 px-5 font-mono text-slate-500">12:54:10 (Success)</td>
                    <td className="py-3 px-5 text-right"><span className="text-emerald-600 font-semibold">Connected</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">Shopify Custom App API</td>
                    <td className="py-3 px-5 font-mono text-slate-800 font-semibold">89 Orders</td>
                    <td className="py-3 px-5 font-mono text-slate-500">12:51:30 (Success)</td>
                    <td className="py-3 px-5 text-right"><span className="text-emerald-600 font-semibold">Connected</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">Dispatch Portal Form</td>
                    <td className="py-3 px-5 font-mono text-slate-800 font-semibold">12 Orders</td>
                    <td className="py-3 px-5 font-mono text-slate-500">12:12:05 (Manual)</td>
                    <td className="py-3 px-5 text-right"><span className="text-slate-450">Active Session</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">API Connection Keys</h3>
              <p className="text-[10px] text-slate-550 leading-relaxed">
                Connect external systems directly to TAME-OS via clean REST endpoints or SFTP directories.
              </p>
              <div className="flex flex-col gap-2.5 font-mono text-[9px] bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span>POSTAL WEBHOOK</span>
                  <span className="text-slate-500">Active</span>
                </div>
                <div className="text-brand-indigo truncate font-semibold">https://api.tame.io/v1/intake</div>
              </div>
            </div>
          </div>
        </div>
      );

    case "address-update":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Address Geocoding Validator</h2>
            <p className="text-xs text-slate-500 mt-0.5">Resolve coordinate differences between customer inputs and maps database suggestions</p>
          </div>

          {pendingResolves.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingResolves.map((p) => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        {p.id} • UNRESOLVED COORDINATE
                      </span>
                      <span className="text-[10px] text-slate-450 font-mono">Confidence: {p.confidence}</span>
                    </div>

                    <div className="flex flex-col gap-3 my-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Customer Raw Input</span>
                        <p className="text-xs text-slate-850 font-medium mt-0.5">{p.input}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[9px] font-bold text-brand-indigo uppercase tracking-widest font-mono block">Suggested Geocoded Match</span>
                        <p className="text-xs text-slate-900 font-bold mt-1">{p.suggested}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-slate-100 pt-4 mt-2">
                    <button
                      onClick={() => setPendingResolves(pendingResolves.filter(item => item.id !== p.id))}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                    >
                      Reject Custom
                    </button>
                    <button
                      onClick={() => handleVerifyAddress(p.id, p.suggested)}
                      className="px-3 py-1.5 text-xs font-semibold bg-brand-indigo hover:bg-[#4338ca] text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      Verify & Geocode ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm">
              <span className="inline-flex h-12 w-12 rounded-full bg-emerald-50 items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
                <CheckIcon size={24} />
              </span>
              <h3 className="text-sm font-bold text-slate-900">Address Queue Clear</h3>
              <p className="text-xs text-slate-500 mt-1">
                All shipment origins and destinations have successfully geocoded to accurate GPS coordinates.
              </p>
            </div>
          )}
        </div>
      );

    case "locations":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Active GPS Coordinates Ledger</h2>
            <p className="text-xs text-slate-500 mt-0.5">Inspect live terminal GPS coordinates and geofences</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Terminal waypoint</th>
                  <th className="py-3 px-5">Active Lat / Lng Coordinates</th>
                  <th className="py-3 px-5">Geofence Range</th>
                  <th className="py-3 px-5 text-right">Tracking Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5 font-semibold text-slate-900">Seattle Port CFA (SEA-HUB)</td>
                  <td className="py-3 px-5 font-mono text-slate-600">47.6062, -122.3321</td>
                  <td className="py-3 px-5 font-mono text-slate-600">150 meters</td>
                  <td className="py-3 px-5 text-right text-emerald-600 font-semibold">Active Geofence Pings</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5 font-semibold text-slate-900">Chicago Hub (ORD-HUB)</td>
                  <td className="py-3 px-5 font-mono text-slate-600">41.8781, -87.6298</td>
                  <td className="py-3 px-5 font-mono text-slate-600">200 meters</td>
                  <td className="py-3 px-5 text-right text-emerald-600 font-semibold">Active Geofence Pings</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "milestones":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Shipment Milestones</h2>
              <p className="text-xs text-slate-500 mt-0.5">Define milestones and event codes recorded during transit execution</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Customs Cleared"
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-indigo"
              />
              <button
                onClick={handleAddMilestone}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-[#4338ca] text-white rounded-xl transition-colors cursor-pointer"
              >
                <PlusIcon size={12} /> Add Milestone
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Milestone Event</th>
                  <th className="py-3 px-5 font-mono">Status Event Code</th>
                  <th className="py-3 px-5">System Trigger Mode</th>
                  <th className="py-3 px-5 text-right">Log Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {milestones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">{m.event}</td>
                    <td className="py-3 px-5 font-mono text-brand-indigo font-bold">{m.defaultCode}</td>
                    <td className="py-3 px-5 text-slate-600">{m.trigger}</td>
                    <td className="py-3 px-5 text-right"><span className="text-emerald-600 font-semibold">{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "milestone-templates":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Milestone Lifecycle Templates</h2>
            <p className="text-xs text-slate-500 mt-0.5">Apply standard milestone sets to specific freight and transport categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">FTL Cold Chain Standard</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">5-step verification lifecycle for pharmaceutical and vaccine loads.</p>
                <div className="flex flex-col gap-2 mt-4 text-[10px] font-mono text-slate-600">
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> GT-IN (Gate In)</div>
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> TP-OK (Temp Checked)</div>
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> DISP (Dispatched)</div>
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> POD-SG (POD Signed)</div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-brand-indigo uppercase font-mono tracking-wider mt-5 block">Default for Cold-chain CAT</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">LTL Multi-Stop Routing</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Multi-stop milestone checklists with waypoint gate logs.</p>
                <div className="flex flex-col gap-2 mt-4 text-[10px] font-mono text-slate-600">
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> GT-IN (Gate In)</div>
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> WP-DE (Waypoint Departed)</div>
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-indigo" /> COMP (Completed)</div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-brand-indigo uppercase font-mono tracking-wider mt-5 block">Default for Drayage/LTL</span>
            </div>
          </div>
        </div>
      );

    case "charges":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Accessorial Charges & Tariffs</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage fuel surcharges, detention penalties, and ancillary fee tariffs</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Charge Type</th>
                  <th className="py-3 px-5">Billing Calculation Basis</th>
                  <th className="py-3 px-5 text-right font-mono">Standard Tariff Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {charges.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-slate-900">{c.type}</td>
                    <td className="py-3 px-5 text-slate-600">{c.basis}</td>
                    <td className="py-3 px-5 text-right font-mono font-bold text-slate-800">{c.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "contracts":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Customer Contract Agreements</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track B2B shipping service agreements, credit lines, and lane allocations</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Acme Global Master Service SLA</h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Agreement ID: <span className="font-mono">MSA-2026-9081</span> | Expires: 2027-12-31</p>
              </div>
              <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest font-mono">
                Active Agreement
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs my-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">Minimum Load Commit</span>
                <p className="text-sm font-bold text-slate-800 mt-1">45 Loads / Month</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">Base Surcharge Cap</span>
                <p className="text-sm font-bold text-slate-800 mt-1">±12% Fuel Limit</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">Detention Penalty Grace</span>
                <p className="text-sm font-bold text-slate-800 mt-1">120 Free Waiting Mins</p>
              </div>
            </div>
          </div>
        </div>
      );

    case "patient":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Patient Non-Emergency Transport Roster</h2>
            <p className="text-xs text-slate-500 mt-0.5">Specialized dispatching ledger for healthcare non-emergency transport routing</p>
          </div>

          <div className="bg-white border border-slate-200 overflow-hidden rounded-2xl shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Booking ID</th>
                  <th className="py-3 px-5">Patient Name</th>
                  <th className="py-3 px-5">Vehicle Category</th>
                  <th className="py-3 px-5 font-mono">O2 Requirement</th>
                  <th className="py-3 px-5">Driver Qualifications</th>
                  <th className="py-3 px-5 text-right">Dispatch Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {patientLoads.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-mono text-brand-indigo font-bold">{p.id}</td>
                    <td className="py-3 px-5 font-semibold text-slate-900">{p.patient}</td>
                    <td className="py-3 px-5 text-slate-700">{p.type}</td>
                    <td className="py-3 px-5 font-mono">
                      {p.oxygenRequired ? (
                        <span className="text-rose-600 font-bold">O2 Supply Required</span>
                      ) : (
                        <span className="text-slate-400">Not Needed</span>
                      )}
                    </td>
                    <td className="py-3 px-5 font-semibold text-slate-650">{p.credentials}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-100 text-[9px] font-bold uppercase tracking-wider rounded-full">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "users":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Enterprise User Directory</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage operator, dispatcher, and carrier portal accounts and roles</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Staff Member</th>
                  <th className="py-3 px-5">System Role</th>
                  <th className="py-3 px-5">Last Login Session</th>
                  <th className="py-3 px-5 text-right">Authorization Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[10px]">JD</div>
                      <span className="font-semibold text-slate-900">John Doe</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-semibold text-slate-700">Operations Lead</td>
                  <td className="py-3 px-5 font-mono text-slate-500">12:20 (Active Now)</td>
                  <td className="py-3 px-5 text-right"><span className="text-brand-indigo font-bold">Admin Console</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[10px]">SC</div>
                      <span className="font-semibold text-slate-900">Sarah Chen</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-semibold text-slate-700">Fleet Dispatcher</td>
                  <td className="py-3 px-5 font-mono text-slate-500">11:45 (Inactive)</td>
                  <td className="py-3 px-5 text-right"><span className="text-slate-600">Standard Dispatch</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "assets":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Fleet Assets Telematics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Monitor real-time vehicle battery voltage, fuel levels, and telematics hardware logs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.map((a, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <h3 className="text-xs font-bold text-slate-900 font-mono uppercase">{a.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{a.pings}</span>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Battery Level</span>
                      <span className="font-semibold font-mono text-slate-800">{a.battery}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Fuel Level</span>
                      <span className="font-semibold font-mono text-slate-800">{a.fuel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Coolant Temp</span>
                      <span className="font-semibold font-mono text-slate-800">{a.coolantTemp}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    a.voltage === "Normal" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}>
                    {a.voltage} VOLTAGE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "projects":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Dedicated Shipping Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">Organize freight movements under specific projects or bidding events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="inline-block text-[9px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-brand-indigo px-2 py-0.5 rounded-full mb-3">
                  PROJ-2026-A
                </span>
                <h3 className="text-sm font-bold text-slate-900">Midwest Distribution Campaign</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Dedicated lane campaign allocating dry van loads from Chicago CFA across Illinois regional depots.
                </p>
              </div>
              <div className="flex justify-between items-center mt-5 border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-slate-600">Active Allocations</span>
                <span className="text-xs font-bold text-slate-900 font-mono">14 Active Lanes</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "vehicle-types":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Vehicle Categories Specifications</h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure tare weights, axle layouts, and clearance heights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">Class 8 Semi Tractor</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Dual axle linehaul pull truck, max pull 80,000 lbs gross weight.</p>
                <div className="flex flex-col gap-2 mt-4 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between border-b border-slate-100 pb-1"><span>Tare Weight</span><span className="font-mono text-slate-800 font-bold">19,000 lbs</span></div>
                  <div className="flex justify-between"><span>Max Payload</span><span className="font-mono text-slate-800 font-bold">48,000 lbs</span></div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">Class 6 Box Van</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">26ft local drayage delivery vehicle with hydraulic liftgate.</p>
                <div className="flex flex-col gap-2 mt-4 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between border-b border-slate-100 pb-1"><span>Tare Weight</span><span className="font-mono text-slate-800 font-bold">11,000 lbs</span></div>
                  <div className="flex justify-between"><span>Max Payload</span><span className="font-mono text-slate-800 font-bold">14,000 lbs</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "exceptions":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Service Failure Exceptions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Register codes and override logs for weather delays and maintenance failures</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Exception Code</th>
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5">SLA Recalculation Impact</th>
                  <th className="py-3 px-5 text-right">Logged Cases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5 font-mono text-rose-600 font-bold">EXC-MECH-01</td>
                  <td className="py-3 px-5 font-semibold text-slate-900">Tractor Engine/Coolant Failure</td>
                  <td className="py-3 px-5 text-slate-600">Dispatches alternate tractor, holds ETA timers</td>
                  <td className="py-3 px-5 text-right font-mono text-slate-700">4 times</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5 font-mono text-rose-600 font-bold">EXC-WEATH-02</td>
                  <td className="py-3 px-5 font-semibold text-slate-900">Severe Storm / Flooding Reroute</td>
                  <td className="py-3 px-5 text-slate-600">Applies automatic 90-minute ETA buffer</td>
                  <td className="py-3 px-5 text-right font-mono text-slate-700">12 times</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "package-types":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Packaging Specifications</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage dimensions and weight constants for crates, pallets, and drums</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">Standard GMA Pallet</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Standard 4-way entry wooden shipping pallet.</p>
                <div className="flex flex-col gap-2 mt-4 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between border-b border-slate-100 pb-1"><span>Dimensions</span><span className="font-mono text-slate-800 font-bold">48" x 40" x 5.5"</span></div>
                  <div className="flex justify-between"><span>Max Load capacity</span><span className="font-mono text-slate-800 font-bold">4,600 lbs</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "doc-types":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Document Type Definitions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure validation settings for bill of ladings (BOL) and proof of delivery (POD) docs</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xs max-w-2xl">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">Mandatory Driver Documentation</h3>
            <div className="flex flex-col gap-3 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold">Proof of Delivery (POD)</span>
                <span className="text-brand-indigo font-bold">Driver upload required at gate-out</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold">Bill of Lading (BOL)</span>
                <span className="text-brand-indigo font-bold">Carrier portal upload required for tender</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Hazmat Transport Placard Cert</span>
                <span className="text-amber-600 font-bold">Only for HAZ-CAT loads</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "expense-types":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Driver Expense Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">Define standard codes for driver scale tickets, tolls, and per-diem claims</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs max-w-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Expense Code</th>
                  <th className="py-3 px-5">Category Name</th>
                  <th className="py-3 px-5 text-right">Reimbursement Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="py-3 px-5 font-mono text-slate-500">EXP-TOLL</td>
                  <td className="py-3 px-5 font-semibold text-slate-900">Highway Toll Receipts</td>
                  <td className="py-3 px-5 text-right font-semibold text-slate-700">Actual (No limit)</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-mono text-slate-500">EXP-DIEM</td>
                  <td className="py-3 px-5 font-semibold text-slate-900">Driver Per-Diem Meal Allowance</td>
                  <td className="py-3 px-5 text-right font-mono text-slate-850 font-bold">$65.00 / day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "vendors":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Third-Party Carrier Vendors</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track external carrier DOT compliance, safety rankings, and cargo insurance</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase font-mono">
                  <th className="py-3 px-5">Vendor Carrier</th>
                  <th className="py-3 px-5 font-mono">US DOT Number</th>
                  <th className="py-3 px-5">FMCSA Safety Rating</th>
                  <th className="py-3 px-5 font-mono">Insurance Expiry</th>
                  <th className="py-3 px-5 text-right">Tender Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5 font-semibold text-slate-900">Allied Logistics Corp</td>
                  <td className="py-3 px-5 font-mono text-slate-600">DOT-102298</td>
                  <td className="py-3 px-5 font-semibold text-slate-700">96% (Satisfactory)</td>
                  <td className="py-3 px-5 font-mono text-slate-600">2027-04-12</td>
                  <td className="py-3 px-5 text-right"><span className="text-emerald-600 font-semibold">Authorized</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-5 font-semibold text-slate-900">Swift Express Freight</td>
                  <td className="py-3 px-5 font-mono text-slate-600">DOT-330411</td>
                  <td className="py-3 px-5 font-semibold text-slate-700">92% (Satisfactory)</td>
                  <td className="py-3 px-5 font-mono text-slate-600">2026-11-20</td>
                  <td className="py-3 px-5 text-right"><span className="text-emerald-600 font-semibold">Authorized</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "reports":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Analytics & Report Generator</h2>
            <p className="text-xs text-slate-500 mt-0.5">Export custom operational spreadsheets and PDF logs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">Weekly Carrier Scorecard</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Generates tender acceptance ratios and SLA compliance rankings.</p>
              </div>
              <button className="w-full mt-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <DownloadIcon size={12} /> Download CSV
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">Fuel Surcharge (FSC) Summary</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Generates linehaul fuel expenses against DOE index constants.</p>
              </div>
              <button className="w-full mt-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <DownloadIcon size={12} /> Download CSV
              </button>
            </div>
          </div>
        </div>
      );

    case "integrations":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">External ERP & ELD Connectors</h2>
            <p className="text-xs text-slate-500 mt-0.5">Sync fleet telematics hardware and B2B corporate software engines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h3 className="text-xs font-bold text-slate-900 font-mono uppercase">Samsara Fleet ELD</h3>
                  <span className="text-[10px] text-emerald-600 font-bold">Online</span>
                </div>
                <p className="text-[10px] text-slate-550 leading-relaxed">
                  Imports engine voltage, GPS coordinate path progress, and coolant telemetry warning states.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h3 className="text-xs font-bold text-slate-900 font-mono uppercase">SAP ERP Connector</h3>
                  <span className="text-[10px] text-emerald-600 font-bold">Online</span>
                </div>
                <p className="text-[10px] text-slate-550 leading-relaxed">
                  Pushes audited invoice data and resolved waiting charge ledgers to corporate accounts payable.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case "support":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Helpdesk & Support Console</h2>
            <p className="text-xs text-slate-500 mt-0.5">Contact operators and review system updates log</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xs max-w-2xl">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">Technical Release Registry</h3>
            <div className="flex flex-col gap-3 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold">TAME Core Telematics Server</span>
                <span className="text-slate-500">v1.3.0 Stable</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Driver Mobile App Integration</span>
                <span className="text-slate-500">v1.8.4</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "download-apk":
      return (
        <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Driver Mobile App Portal</h2>
            <p className="text-xs text-slate-500 mt-0.5">Download the direct Android application for fleet delivery execution and POD sign-off</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">TAME Driver Application (.APK)</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Install this APK directly on driver Android terminals to enable real-time telemetry coordination, dispatch schedules, and digital Proof of Delivery uploads.
                </p>
              </div>

              <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>STABLE VERSION</span>
                  <span className="font-bold text-slate-800">v1.8.4-Release</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>FILE SIZE</span>
                  <span className="font-bold text-slate-800">38.2 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>MINIMUM REQUIREMENTS</span>
                  <span className="font-bold text-slate-800">Android 9.0+ / GPS Enabled</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full py-2.5 text-xs font-semibold bg-brand-indigo hover:bg-[#4338ca] text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <DownloadIcon size={14} />
                  {downloading ? `Downloading (${downloadProgress}%)` : "Download APK Installer"}
                </button>
                {downloading && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-brand-indigo h-full transition-all duration-150" style={{ width: `${downloadProgress}%` }} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xs">
              <span className="inline-flex h-12 w-12 rounded-full bg-indigo-50 text-brand-indigo items-center justify-center mb-4 border border-indigo-100">
                <RadarIcon size={24} />
              </span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Scan QR Code to Install</h3>
              <p className="text-[10px] text-slate-500 mt-2 max-w-xs leading-normal">
                Scan this placeholder code with a driver terminal mobile camera to trigger the direct download to their local storage path.
              </p>
              
              {/* Simple Mock QR Code */}
              <div className="h-28 w-28 border border-slate-200 p-2 rounded-xl bg-slate-50 flex flex-wrap gap-1 items-center justify-center mt-4 shadow-sm">
                <div className="h-full w-full bg-gradient-to-tr from-slate-300 to-slate-400 rounded-lg flex items-center justify-center text-slate-600 font-mono text-[9px] font-bold">
                  [ QR STACK ]
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 font-mono">
          <AlertIcon size={32} className="text-slate-300 mb-3 animate-pulse" />
          <p className="text-xs">Operational ledger module target not matched: {tab}</p>
        </div>
      );
  }
}
