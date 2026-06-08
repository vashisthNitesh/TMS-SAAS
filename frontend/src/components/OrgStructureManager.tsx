import React, { useState, useEffect } from "react";
import { PlusIcon, UsersIcon, CheckIcon, AlertIcon } from "./icons";

interface BU {
  id: string;
  name: string;
  code: string;
}

interface Branch {
  id: string;
  name: string;
  code: string;
  branch_type: string;
  address: string;
  latitude: number;
  longitude: number;
  geofence_radius_meters: number;
}

interface Dept {
  id: string;
  name: string;
  code: string;
}

interface UserRecord {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role_name?: string;
  business_unit_name?: string;
  branch_name?: string;
  department_name?: string;
}

export default function OrgStructureManager() {
  const [activeSubTab, setActiveSubTab] = useState<"bu" | "branch" | "dept" | "users">("users");

  const [bus, setBus] = useState<BU[]>([
    { id: "bu-1", name: "HQ Corporate Operations", code: "HQ-BU" },
    { id: "bu-2", name: "North America Distribution", code: "NA-DIST" },
    { id: "bu-3", name: "European Freight Logistics", code: "EU-LOG" }
  ]);

  const [branches, setBranches] = useState<Branch[]>([
    { id: "br-1", name: "Seattle Port Terminal", code: "HQ-HUB", branch_type: "HUB", address: "100 Port Rd, Seattle WA", latitude: 47.6062, longitude: -122.3321, geofence_radius_meters: 200 },
    { id: "br-2", name: "Chicago Logistics Depot", code: "CHI-DEPOT", branch_type: "DEPOT", address: "450 Expressway, Chicago IL", latitude: 41.8781, longitude: -87.6298, geofence_radius_meters: 150 },
    { id: "br-3", name: "Atlanta Freight Yard", code: "ATL-YARD", branch_type: "YARD", address: "88 Rail Ave, Atlanta GA", latitude: 33.7490, longitude: -84.3880, geofence_radius_meters: 150 }
  ]);

  const [depts, setDepts] = useState<Dept[]>([
    { id: "dp-1", name: "Operations Dispatch", code: "OPS" },
    { id: "dp-2", name: "Carrier Billing", code: "BILL" },
    { id: "dp-3", name: "Fleet Maintenance", code: "FLEET" }
  ]);

  const [users, setUsers] = useState<UserRecord[]>([
    { id: "u-1", username: "admin_tame", email: "admin@tameplatform.com", full_name: "John Doe", role_name: "Admin", business_unit_name: "HQ Corporate Operations", branch_name: "Seattle Port Terminal", department_name: "Operations Dispatch" },
    { id: "u-2", username: "dispatcher_chi", email: "sam.williams@tame.com", full_name: "Sam Williams", role_name: "Dispatcher", business_unit_name: "North America Distribution", branch_name: "Chicago Logistics Depot", department_name: "Operations Dispatch" },
    { id: "u-3", username: "billing_clerk", email: "lisa.c@tame.com", full_name: "Lisa Chang", role_name: "Billing Clerk", business_unit_name: "HQ Corporate Operations", branch_name: "Seattle Port Terminal", department_name: "Carrier Billing" }
  ]);

  // Form states
  const [showBUModal, setShowBUModal] = useState(false);
  const [buName, setBUName] = useState("");
  const [buCode, setBUCode] = useState("");

  const [showBranchModal, setShowBranchModal] = useState(false);
  const [brName, setBrName] = useState("");
  const [brCode, setBrCode] = useState("");
  const [brType, setBrType] = useState("HUB");
  const [brAddress, setBrAddress] = useState("");
  const [brLat, setBrLat] = useState("0.0");
  const [brLng, setBrLng] = useState("0.0");
  const [brGeo, setBrGeo] = useState("150");

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [dpName, setDpName] = useState("");
  const [dpCode, setDpCode] = useState("");

  const [showUserModal, setShowUserModal] = useState(false);
  const [uUsername, setUUsername] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uFullName, setUFullName] = useState("");
  const [uRole, setURole] = useState("Dispatcher");
  const [uBU, setUBU] = useState("");
  const [uBranch, setUBranch] = useState("");
  const [uDept, setUDept] = useState("");

  const handleAddBU = (e: React.FormEvent) => {
    e.preventDefault();
    const newBu: BU = {
      id: `bu-${Date.now()}`,
      name: buName,
      code: buCode.toUpperCase()
    };
    setBus([...bus, newBu]);
    setShowBUModal(false);
    setBUName("");
    setBUCode("");
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBr: Branch = {
      id: `br-${Date.now()}`,
      name: brName,
      code: brCode.toUpperCase(),
      branch_type: brType,
      address: brAddress,
      latitude: parseFloat(brLat),
      longitude: parseFloat(brLng),
      geofence_radius_meters: parseInt(brGeo)
    };
    setBranches([...branches, newBr]);
    setShowBranchModal(false);
    setBrName("");
    setBrCode("");
    setBrAddress("");
    setBrLat("0.0");
    setBrLng("0.0");
    setBrGeo("150");
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    const newDp: Dept = {
      id: `dp-${Date.now()}`,
      name: dpName,
      code: dpCode.toUpperCase()
    };
    setDepts([...depts, newDp]);
    setShowDeptModal(false);
    setDpName("");
    setDpCode("");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBU = bus.find(b => b.id === uBU)?.name || "HQ Corporate Operations";
    const selectedBranch = branches.find(b => b.id === uBranch)?.name || "Seattle Port Terminal";
    const selectedDept = depts.find(d => d.id === uDept)?.name || "Operations Dispatch";

    const newUser: UserRecord = {
      id: `u-${Date.now()}`,
      username: uUsername,
      email: uEmail,
      full_name: uFullName,
      role_name: uRole,
      business_unit_name: selectedBU,
      branch_name: selectedBranch,
      department_name: selectedDept
    };

    setUsers([...users, newUser]);
    setShowUserModal(false);
    setUUsername("");
    setUEmail("");
    setUFullName("");
    setURole("Dispatcher");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800 font-sans">
      
      {/* Tab Control */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: "users", label: "Team Directory" },
            { id: "bu", label: "Business Units" },
            { id: "branch", label: "Branches & Nodes" },
            { id: "dept", label: "Departments" }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${
                activeSubTab === sub.id
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/40"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {activeSubTab === "bu" && (
          <button
            onClick={() => setShowBUModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl shadow-sm cursor-pointer transition-colors"
          >
            <PlusIcon size={12} /> Add Business Unit
          </button>
        )}
        {activeSubTab === "branch" && (
          <button
            onClick={() => setShowBranchModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl shadow-sm cursor-pointer transition-colors"
          >
            <PlusIcon size={12} /> Add Branch Node
          </button>
        )}
        {activeSubTab === "dept" && (
          <button
            onClick={() => setShowDeptModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl shadow-sm cursor-pointer transition-colors"
          >
            <PlusIcon size={12} /> Add Department
          </button>
        )}
        {activeSubTab === "users" && (
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl shadow-sm cursor-pointer transition-colors"
          >
            <PlusIcon size={12} /> Add User Account
          </button>
        )}
      </div>

      {/* 1. Team Directory Subtab */}
      {activeSubTab === "users" && (
        <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">User Roster & Access Mapping</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Map corporate accounts to specific branches, departments, and roles.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              {users.length} Users Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/30 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Staff Member</th>
                  <th className="py-3 px-6">Business Unit</th>
                  <th className="py-3 px-6">Assigned Branch</th>
                  <th className="py-3 px-6">Department</th>
                  <th className="py-3 px-6">Access Role</th>
                  <th className="py-3 px-6 text-right">Scope Bounds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold flex items-center justify-center text-xs">
                          {u.full_name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{u.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">@{u.username} • {u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-slate-600">{u.business_unit_name}</td>
                    <td className="py-3 px-6">
                      <span className="inline-block text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                        {u.branch_name}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-slate-500 font-mono text-[10px]">{u.department_name}</td>
                    <td className="py-3 px-6 font-semibold text-slate-800">{u.role_name}</td>
                    <td className="py-3 px-6 text-right font-semibold text-[10px] text-brand-emerald font-mono">
                      {u.role_name === "Admin" ? "Tenant Global" : "Branch Local"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Business Units Subtab */}
      {activeSubTab === "bu" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bus.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-350 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono font-bold uppercase mb-3 border border-slate-200">
                  {b.code}
                </span>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{b.name}</h3>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Created BU</span>
                <span className="text-brand-indigo font-bold">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Branches Subtab */}
      {activeSubTab === "branch" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-350 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono font-bold uppercase border border-slate-200">
                    {b.branch_type} ({b.code})
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">GEOFENCE: {b.geofence_radius_meters}m</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{b.name}</h3>
                <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">{b.address}</p>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>GPS: {b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}</span>
                <span className="text-brand-emerald font-bold">Online</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Departments Subtab */}
      {activeSubTab === "dept" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {depts.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-350 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono font-bold uppercase mb-3 border border-slate-200">
                  {d.code}
                </span>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{d.name}</h3>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Functional Unit</span>
                <span className="text-brand-indigo font-bold">Mapped</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {/* BU Modal */}
      {showBUModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowBUModal(false)} />
          <form onSubmit={handleAddBU} className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">Add Business Unit</h3>
              <button type="button" onClick={() => setShowBUModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono">BUSINESS UNIT NAME</label>
              <input type="text" required placeholder="e.g. Asia-Pac Logistics" value={buName} onChange={(e) => setBUName(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono">IDENTIFIER CODE</label>
              <input type="text" required placeholder="e.g. APAC-BU" value={buCode} onChange={(e) => setBUCode(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
              <button type="button" onClick={() => setShowBUModal(false)} className="px-4 py-2 text-xs bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-brand-indigo text-white rounded-lg shadow-sm">Save Unit</button>
            </div>
          </form>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowBranchModal(false)} />
          <form onSubmit={handleAddBranch} className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">Add Branch Node</h3>
              <button type="button" onClick={() => setShowBranchModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">BRANCH NAME</label>
                <input type="text" required placeholder="e.g. Dallas CFA" value={brName} onChange={(e) => setBrName(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">IDENTIFIER CODE</label>
                <input type="text" required placeholder="e.g. DAL-CFA" value={brCode} onChange={(e) => setBrCode(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">NODE TYPE</label>
                <select value={brType} onChange={(e) => setBrType(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg">
                  <option value="HUB">Hub Terminal</option>
                  <option value="CFA">CFA Center</option>
                  <option value="PORT">Port Terminal</option>
                  <option value="DEPOT">Depot Store</option>
                  <option value="YARD">Fleet Yard</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">GEOFENCE RADIUS (M)</label>
                <input type="number" required value={brGeo} onChange={(e) => setBrGeo(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono">STREET ADDRESS</label>
              <input type="text" required placeholder="e.g. 500 Airport Rd, Dallas TX" value={brAddress} onChange={(e) => setBrAddress(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">LATITUDE</label>
                <input type="text" required value={brLat} onChange={(e) => setBrLat(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">LONGITUDE</label>
                <input type="text" required value={brLng} onChange={(e) => setBrLng(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
              <button type="button" onClick={() => setShowBranchModal(false)} className="px-4 py-2 text-xs bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-brand-indigo text-white rounded-lg shadow-sm">Save Branch</button>
            </div>
          </form>
        </div>
      )}

      {/* Dept Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowDeptModal(false)} />
          <form onSubmit={handleAddDept} className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">Add Department</h3>
              <button type="button" onClick={() => setShowDeptModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono">DEPARTMENT NAME</label>
              <input type="text" required placeholder="e.g. Fleet Billing" value={dpName} onChange={(e) => setDpName(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono">IDENTIFIER CODE</label>
              <input type="text" required placeholder="e.g. F-BILL" value={dpCode} onChange={(e) => setDpCode(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
              <button type="button" onClick={() => setShowDeptModal(false)} className="px-4 py-2 text-xs bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-brand-indigo text-white rounded-lg shadow-sm">Save Dept</button>
            </div>
          </form>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowUserModal(false)} />
          <form onSubmit={handleAddUser} className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">Add User Account</h3>
              <button type="button" onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">USERNAME</label>
                <input type="text" required placeholder="username" value={uUsername} onChange={(e) => setUUsername(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">FULL NAME</label>
                <input type="text" required placeholder="John Doe" value={uFullName} onChange={(e) => setUFullName(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">EMAIL ADDRESS</label>
                <input type="email" required placeholder="john.d@tame.com" value={uEmail} onChange={(e) => setUEmail(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">ACCESS ROLE</label>
                <select value={uRole} onChange={(e) => setURole(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg">
                  <option value="Admin">Administrator</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Billing Clerk">Billing Clerk</option>
                  <option value="Warehouse Admin">Warehouse Manager</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 font-mono">MAPPED BU</label>
                <select value={uBU} onChange={(e) => setUBU(e.target.value)} className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md">
                  {bus.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 font-mono">BRANCH BOUND</label>
                <select value={uBranch} onChange={(e) => setUBranch(e.target.value)} className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md">
                  {branches.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 font-mono">DEPT MAPPING</label>
                <select value={uDept} onChange={(e) => setUDept(e.target.value)} className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md">
                  {depts.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
              <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-xs bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-brand-indigo text-white rounded-lg shadow-sm">Save User</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
