import React, { useState } from "react";
import { SearchIcon, PlusIcon, UploadIcon, CheckIcon, AlertIcon, CloseIcon } from "./icons";

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

interface OrderManagementProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
}

const getCoords = (name: string) => {
  if (name.includes("Seattle")) return { x: 80, y: 80 };
  if (name.includes("Los Angeles")) return { x: 90, y: 320 };
  if (name.includes("Denver")) return { x: 190, y: 180 };
  if (name.includes("Chicago")) return { x: 500, y: 160 };
  if (name.includes("Houston")) return { x: 300, y: 380 };
  if (name.includes("Atlanta")) return { x: 560, y: 320 };
  if (name.includes("New York")) return { x: 680, y: 170 };
  return { x: 400, y: 240 };
};

export default function OrderManagement({ orders, setOrders, setTrips }: OrderManagementProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [csvConsoleLogs, setCsvConsoleLogs] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Form states (Multi-step manual intake)
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    customer: "",
    origin: "Seattle Port",
    destination: "Chicago Hub",
    weight: "",
    priority: "Standard" as "Standard" | "Express" | "Critical SLA",
    carrier: "Swift Express",
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customer: formData.customer || "Walk-in Carrier Inc.",
      origin: formData.origin,
      destination: formData.destination,
      weight: formData.weight ? `${formData.weight} lbs` : "20,000 lbs",
      status: "In Transit",
      priority: formData.priority,
      carrier: formData.carrier,
      createdDate: new Date().toISOString().split("T")[0],
    };
    
    // Create matching live trip
    const startPos = getCoords(formData.origin);
    const endPos = getCoords(formData.destination);
    
    const newTrip: Trip = {
      id: `TR-${Math.floor(8000 + Math.random() * 1999)}`,
      transporter: formData.carrier,
      vehicle: formData.carrier === "Swift Express" ? "TRK-7411 (LTL)" : "TRK-2090 (FTL)",
      driver: "Carlos Santana",
      phone: "+1 (555) 032-9011",
      origin: formData.origin,
      destination: formData.destination,
      progress: 0,
      status: "In Transit",
      eta: "18:30 (On Time)",
      cargo: "High-value Consumer Electronics",
      routePoints: [startPos, { x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2 }, endPos],
      currentPos: startPos
    };

    setOrders([newOrder, ...orders]);
    setTrips((prevTrips) => [newTrip, ...prevTrips]);
    setIsFormOpen(false);
    setFormStep(1);
    setFormData({
      customer: "",
      origin: "Seattle Port",
      destination: "Chicago Hub",
      weight: "",
      priority: "Standard",
      carrier: "Swift Express",
    });
  };

  // Simulate CSV Manifest parser
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileName = e.target.files[0].name;
    setIsParsing(true);
    setCsvConsoleLogs([`[0.0s] SYS: Reading manifest file: ${fileName}...`]);

    const steps = [
      { t: 800, log: "[0.8s] FILE: Header detection completed. Columns: Customer, Origin, Destination, Weight, Priority, Transporter." },
      { t: 1600, log: "[1.6s] PARSE: 3 records identified. Performing geofence waypoint validation..." },
      { t: 2400, log: "[2.4s] INTEGRITY: Match found for carriers Swift Express, Apex Freight. Weight verification checks passed." },
      { t: 3200, log: "[3.2s] SUCCESS: Loaded ORD-4089, ORD-4090, and ORD-4091 into core ledger database." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCsvConsoleLogs((prev) => [...prev, step.log]);
        if (idx === steps.length - 1) {
          setIsParsing(false);
          // Add parsed mock records
          const parsedOrders: Order[] = [
            { id: "ORD-4089", customer: "Intel Americas", origin: "Seattle Port", destination: "Denver CFA", weight: "14,500 lbs", status: "Pending", priority: "Express", carrier: "Swift Express", createdDate: "2026-06-05" },
            { id: "ORD-4090", customer: "Starlight Cargo", origin: "Los Angeles CFA", destination: "Austin Distribution", weight: "29,000 lbs", status: "Scheduled", priority: "Standard", carrier: "Apex Freight", createdDate: "2026-06-05" },
            { id: "ORD-4091", customer: "General Metals", origin: "Miami Port", destination: "Houston Terminal", weight: "62,300 lbs", status: "Pending", priority: "Critical SLA", carrier: "Apex Freight", createdDate: "2026-06-05" },
          ];
          setOrders((prevOrders) => [...parsedOrders, ...prevOrders]);
        }
      }, step.t);
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.carrier.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus =
      filterStatus === "all" || order.status.toLowerCase() === filterStatus;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Active Orders Grid Table */}
      <section className="xl:col-span-2 glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Order Intake</h2>
            <p className="text-xs text-slate-500 mt-0.5">Control sales contracts, allocation, and delivery schedule</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo transition-colors"
              />
            </div>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl shadow-sm transition-colors"
            >
              <PlusIcon size={12} />
              New Order
            </button>
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex border-b border-slate-100 pb-1 gap-4 text-xs font-mono">
          {["all", "pending", "scheduled", "in transit", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`pb-2.5 px-1 font-bold border-b-2 capitalize transition-colors ${
                status === filterStatus
                  ? "border-brand-indigo text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="py-2.5 px-4 rounded-tl-lg">Order ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Routing Lane</th>
                <th className="py-2.5 px-4">Payload weight</th>
                <th className="py-2.5 px-4">Carrier</th>
                <th className="py-2.5 px-4">Priority SLA</th>
                <th className="py-2.5 px-4 rounded-tr-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.map((order) => {
                let statusBadge = "text-purple-700 border-purple-200 bg-purple-50";
                if (order.status === "In Transit") statusBadge = "text-blue-700 border-blue-200 bg-blue-50";
                if (order.status === "Delivered") statusBadge = "text-emerald-700 border-emerald-200 bg-emerald-50";
                if (order.status === "Scheduled") statusBadge = "text-indigo-700 border-indigo-200 bg-indigo-50";
                
                let priorityBadge = "text-slate-600 bg-slate-50 border border-slate-200";
                if (order.priority === "Express") priorityBadge = "text-amber-700 bg-amber-50 border border-amber-200";
                if (order.priority === "Critical SLA") priorityBadge = "text-rose-700 bg-rose-50 border border-rose-200";

                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-indigo">{order.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{order.customer}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {order.origin} ➔ {order.destination}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{order.weight}</td>
                    <td className="py-3 px-4 text-slate-600">{order.carrier}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${priorityBadge}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${statusBadge}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CSV Importer Panel Card */}
      <section className="glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200 h-fit">
        <div>
          <h2 className="text-base font-bold text-slate-900">Bulk Manifest Upload</h2>
          <p className="text-xs text-slate-500 mt-0.5">Import batches of sales orders via spreadsheet CSV</p>
        </div>

        {/* Upload Dropzone */}
        <label className="border border-dashed border-slate-200 hover:border-brand-indigo bg-slate-50 hover:bg-slate-100/30 rounded-xl p-6 text-center flex flex-col items-center gap-3 cursor-pointer transition-all">
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
            disabled={isParsing}
          />
          <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <UploadIcon size={18} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-700">Select manifest CSV</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">UTF-8 formatted layout sheets</p>
          </div>
        </label>

        {/* Telematics Terminal Outputs */}
        {csvConsoleLogs.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 font-mono text-[10px] relative overflow-hidden min-h-[180px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-slate-400">
              <span>MANIFEST PARSE LOGGER</span>
              {isParsing && <span className="animate-pulse text-brand-indigo font-bold">PROCESSING...</span>}
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-slate-600 pr-1 select-all">
              {csvConsoleLogs.map((log, idx) => (
                <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-600 font-bold" : ""}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Slide-over manual order creator form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={() => setIsFormOpen(false)} />
          
          {/* Slider content */}
          <form
            onSubmit={handleCreateOrder}
            className="relative w-full max-w-md bg-white border-l border-slate-200 h-full shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto animate-slide-up text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-indigo tracking-wider">INTAKE WIZARD</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Manual Shipment Intake</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-[9px] font-bold text-slate-600">
              {["Route Profile", "Equipment & Payload", "SLA Priority"].map((step, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    formStep === idx + 1
                      ? "bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20"
                      : "text-slate-400"
                  }`}
                >
                  Step {idx + 1}
                </div>
              ))}
            </div>

            {/* Step 1: Routing */}
            {formStep === 1 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 text-xs font-mono">CUSTOMER NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter customer client name..."
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo transition-colors"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 text-xs font-mono">ORIGIN NODE</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-850 focus:outline-none focus:border-brand-indigo transition-colors"
                  >
                    <option value="Seattle Port">Seattle Port (SEA-HUB)</option>
                    <option value="Los Angeles CFA">Los Angeles CFA (LAX-CFA)</option>
                    <option value="Denver CFA">Denver CFA (DEN-HUB)</option>
                    <option value="Chicago Hub">Chicago Hub (ORD-HUB)</option>
                    <option value="Houston Terminal">Houston Terminal (IAH-TERM)</option>
                    <option value="Atlanta Yard">Atlanta Yard (ATL-YARD)</option>
                    <option value="New York Depot">New York Depot (NYC-DEPOT)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 text-xs font-mono">DESTINATION NODE</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-850 focus:outline-none focus:border-brand-indigo transition-colors"
                  >
                    <option value="Chicago Hub">Chicago Hub (ORD-HUB)</option>
                    <option value="New York Depot">New York Depot (NYC-DEPOT)</option>
                    <option value="Denver CFA">Denver CFA (DEN-HUB)</option>
                    <option value="Austin Distribution">Austin Distribution (AUS-DIST)</option>
                    <option value="Atlanta Yard">Atlanta Yard (ATL-YARD)</option>
                    <option value="Houston Terminal">Houston Terminal (IAH-TERM)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Equipment & Payload */}
            {formStep === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 text-xs font-mono">PAYLOAD WEIGHT (LBS)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 40000"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 text-xs font-mono">ALLOCATED CARRIER</label>
                  <select
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-850 focus:outline-none focus:border-brand-indigo transition-colors"
                  >
                    <option value="Swift Express">Swift Express (LTL)</option>
                    <option value="Allied Logistics">Allied Logistics (Reefer)</option>
                    <option value="Falcon Carrier">Falcon Carrier (Flatbed)</option>
                    <option value="Apex Freight">Apex Freight (FTL)</option>
                    <option value="Titan Heavy Haul">Titan Heavy Haul (Specialized)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: SLA Priority */}
            {formStep === 3 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 text-xs font-mono">PRIORITY TIER</label>
                  <div className="grid grid-cols-3 gap-3 font-sans">
                    {["Standard", "Express", "Critical SLA"].map((prio) => (
                      <button
                        key={prio}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: prio as any })}
                        className={`py-3 text-[10px] font-semibold rounded-xl border transition-colors ${
                          formData.priority === prio
                            ? "bg-brand-indigo/5 border-brand-indigo text-brand-indigo shadow-sm"
                            : "border-slate-200 text-slate-500 hover:text-slate-800 bg-white"
                        }`}
                      >
                        {prio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3 mt-4">
                  <AlertIcon size={16} className="text-brand-indigo flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    This order will default to an <strong>In Transit</strong> state. Upon submit, the routing engine will evaluate transporter lane contracts to generate live tracking coordinates.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="border-t border-slate-150 pt-4 mt-auto flex gap-3 font-sans">
              {formStep > 1 && (
                <button
                  type="button"
                  onClick={() => setFormStep(formStep - 1)}
                  className="px-4 py-2.5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                >
                  Back
                </button>
              )}
              {formStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(formStep + 1)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors text-center shadow-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl shadow-sm transition-colors"
                >
                  Submit Order Manifest
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
