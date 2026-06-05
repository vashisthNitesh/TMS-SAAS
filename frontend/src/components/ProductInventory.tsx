import React, { useState } from "react";
import { CheckIcon, PlusIcon, AlertIcon } from "./icons";

interface Product {
  id: string;
  code: string;
  description: string;
  weight: string;
  packaging: string;
  volume: string;
  hazard: string;
  tempControl: string;
}

export default function ProductInventory() {
  const [products, setProducts] = useState<Product[]>([
    { id: "PRD-101", code: "MPC-90", description: "Micro-Processor Chipsets", weight: "420 lbs", packaging: "Standard Pallet", volume: "1.2 CBM", hazard: "Non-Hazardous", tempControl: "Ambient" },
    { id: "PRD-102", code: "PH-INS", description: "Cold-Chain Insulin Vials", weight: "1,200 lbs", packaging: "Insulated Container", volume: "0.8 CBM", hazard: "Non-Hazardous", tempControl: "2.0°C - 8.0°C" },
    { id: "PRD-103", code: "BAT-LITH", description: "Lithium-Ion Battery Modules", weight: "18,400 lbs", packaging: "Wooden Crate", volume: "14.5 CBM", hazard: "Class 9 - Hazmat", tempControl: "Ambient" },
    { id: "PRD-104", code: "IND-STEEL", description: "Structural Steel Girders", weight: "38,000 lbs", packaging: "Open Bundle", volume: "22.0 CBM", hazard: "Non-Hazardous", tempControl: "Ambient" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: "",
    description: "",
    weight: "",
    packaging: "Standard Pallet",
    volume: "",
    hazard: "Non-Hazardous",
    tempControl: "Ambient"
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Product = {
      id: `PRD-${Math.floor(200 + Math.random() * 800)}`,
      code: newProduct.code.toUpperCase(),
      description: newProduct.description,
      weight: newProduct.weight ? `${newProduct.weight} lbs` : "1,000 lbs",
      packaging: newProduct.packaging,
      volume: newProduct.volume ? `${newProduct.volume} CBM` : "1.0 CBM",
      hazard: newProduct.hazard,
      tempControl: newProduct.tempControl,
    };
    setProducts([...products, item]);
    setIsAdding(false);
    setNewProduct({
      code: "",
      description: "",
      weight: "",
      packaging: "Standard Pallet",
      volume: "",
      hazard: "Non-Hazardous",
      tempControl: "Ambient"
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800 font-sans">
      
      {/* Product master list header */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Shipment Product Master</h2>
            <p className="text-xs text-slate-500 mt-0.5">Maintain physical cargo configurations, safety classes, and dimensional indexes</p>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors shadow-sm"
          >
            <PlusIcon size={12} />
            Register Product
          </button>
        </div>

        {/* Inventory Data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="py-2.5 px-4 rounded-tl-lg">Product ID</th>
                <th className="py-2.5 px-4">Item Code</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 font-mono">Gross Weight</th>
                <th className="py-2.5 px-4">CBM Volume</th>
                <th className="py-2.5 px-4">Packaging Type</th>
                <th className="py-2.5 px-4 font-mono">Temperature Control</th>
                <th className="py-2.5 px-4 rounded-tr-lg text-right">Hazard Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((p) => {
                let hazBadge = "text-slate-600 bg-slate-100 border border-slate-200";
                if (p.hazard.includes("Hazmat")) hazBadge = "text-rose-700 border-rose-200 bg-rose-50";
                
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-indigo">{p.id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{p.description}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{p.weight}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{p.volume}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.packaging}</td>
                    <td className={`py-3.5 px-4 font-mono font-bold ${p.tempControl !== "Ambient" ? "text-brand-cyan" : "text-slate-505"}`}>{p.tempControl}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${hazBadge}`}>
                        {p.hazard}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          
          <form
            onSubmit={handleAdd}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-slide-up text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Register New Product Profile</h2>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">ITEM CODE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PH-INS"
                  value={newProduct.code}
                  onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">PACKAGING PROFILE</label>
                <select
                  value={newProduct.packaging}
                  onChange={(e) => setNewProduct({ ...newProduct, packaging: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                >
                  <option value="Standard Pallet">Standard Pallet</option>
                  <option value="Insulated Container">Insulated Container</option>
                  <option value="Wooden Crate">Wooden Crate</option>
                  <option value="Open Bundle">Open Bundle</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono">ITEM DESCRIPTION</label>
              <input
                type="text"
                required
                placeholder="Product descriptive name..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">GROSS WEIGHT (LBS)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1200"
                  value={newProduct.weight}
                  onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">VOLUME (CBM)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 1.2"
                  value={newProduct.volume}
                  onChange={(e) => setNewProduct({ ...newProduct, volume: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">HAZARDOUS STATUS</label>
                <select
                  value={newProduct.hazard}
                  onChange={(e) => setNewProduct({ ...newProduct, hazard: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-indigo"
                >
                  <option value="Non-Hazardous">Non-Hazardous</option>
                  <option value="Class 9 - Hazmat">Class 9 - Hazmat</option>
                  <option value="Class 3 - Flammable">Class 3 - Flammable</option>
                  <option value="Class 6 - Toxic">Class 6 - Toxic</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-mono">TEMP MANAGEMENT</label>
                <input
                  type="text"
                  placeholder="e.g. Ambient, 2-8°C"
                  value={newProduct.tempControl}
                  onChange={(e) => setNewProduct({ ...newProduct, tempControl: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-indigo"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-lg shadow-sm"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
