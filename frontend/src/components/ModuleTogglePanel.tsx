import React, { useState } from "react";
import { PLATFORM_MODULES, ModuleConfig } from "./ModuleRegistry";
import { SlidersIcon, PlusIcon, CheckIcon, AlertIcon } from "./icons";

interface CustomField {
  id: string;
  targetModel: string;
  fieldName: string;
  fieldType: "TEXT" | "NUMBER" | "SELECT" | "DATE" | "BOOLEAN";
  isRequired: boolean;
}

export default function ModuleTogglePanel() {
  const [activeModules, setActiveModules] = useState<string[]>(["CRM", "TRANSPORTATION", "INVENTORY", "REPORTING"]);
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(PLATFORM_MODULES[2]); // Default Transportation

  // Dynamic Custom Fields State
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: "cf-1", targetModel: "Order", fieldName: "corporate_tax_id", fieldType: "TEXT", isRequired: true },
    { id: "cf-2", targetModel: "Vehicle", fieldName: "last_emission_test", fieldType: "DATE", isRequired: false },
    { id: "cf-3", targetModel: "Trip", fieldName: "hazardous_class", fieldType: "SELECT", isRequired: true }
  ]);

  // Form state for adding custom fields
  const [targetModel, setTargetModel] = useState("Order");
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<CustomField["fieldType"]>("TEXT");
  const [isRequired, setIsRequired] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleModule = (key: string) => {
    if (activeModules.includes(key)) {
      setActiveModules(activeModules.filter(m => m !== key));
    } else {
      setActiveModules([...activeModules, key]);
    }
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName) return;
    
    const formattedFieldName = fieldName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const newField: CustomField = {
      id: `cf-${Date.now()}`,
      targetModel,
      fieldName: formattedFieldName,
      fieldType,
      isRequired
    };

    setCustomFields([...customFields, newField]);
    setFieldName("");
    setIsRequired(false);
  };

  const handleSaveConfigs = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Dynamic Module Roster */}
      <section className="xl:col-span-2 glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-xs h-fit">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold text-slate-900">Dynamic Module toggles</h2>
          <p className="text-xs text-slate-500 mt-0.5">Toggle platform features on/off instantly. Changes affect navigation routing immediately.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {PLATFORM_MODULES.map((mod) => {
            const isEnabled = activeModules.includes(mod.key);
            const IconComponent = mod.icon;
            
            return (
              <div
                key={mod.key}
                onClick={() => setSelectedModule(mod)}
                className={`border p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-40 ${
                  selectedModule?.key === mod.key
                    ? "border-brand-indigo ring-1 ring-brand-indigo/35 bg-indigo-50/10"
                    : "border-slate-200 hover:border-slate-350 bg-white"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                      isEnabled ? "bg-brand-indigo/10 text-brand-indigo" : "bg-slate-100 text-slate-400"
                    }`}>
                      <IconComponent size={18} />
                    </div>
                    
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleModule(mod.key);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? "bg-brand-indigo" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-3">{mod.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">{mod.description}</p>
                </div>

                <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 border-t border-slate-100/60 pt-2 mt-2">
                  <span>Category: {mod.category.toUpperCase()}</span>
                  <span className={isEnabled ? "text-brand-emerald font-bold" : "text-slate-400"}>
                    {isEnabled ? "SUBSCRIPTION ACTIVE" : "DISABLED"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Module Configuration Override Panel */}
      <section className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-xs flex flex-col gap-6">
        {selectedModule ? (
          <div className="flex flex-col gap-5">
            <div>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold uppercase mb-2">
                {selectedModule.key} Config
              </span>
              <h2 className="text-sm font-bold text-slate-900">Custom Metadata Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Define metadata fields, validation constraints, and business rules for the {selectedModule.name} module.</p>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Feature Toggles */}
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase font-mono">Feature overrides</h4>
                <div className="flex items-center justify-between py-1 border-b border-slate-150">
                  <span className="text-slate-700">Enable advanced tracking</span>
                  <input type="checkbox" defaultChecked className="accent-brand-indigo" />
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-150">
                  <span className="text-slate-700">Allow third-party audits</span>
                  <input type="checkbox" defaultChecked={selectedModule.key === "BILLING"} className="accent-brand-indigo" />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-700">Restrict access to HQ IP</span>
                  <input type="checkbox" className="accent-brand-indigo" />
                </div>
              </div>

              {/* Dynamic Field Builder (Metadata Driven Development) */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 mt-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase font-mono">Model Field Schema Builder</h4>
                
                {/* Active Fields List */}
                <div className="flex flex-col gap-1.5 max-h-[150px] overflow-y-auto pr-1">
                  {customFields
                    .filter(cf => 
                      selectedModule.key === "TRANSPORTATION" ? ["Order", "Trip", "Vehicle"].includes(cf.targetModel) : cf.targetModel === "Customer"
                    )
                    .map((cf) => (
                      <div key={cf.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 font-bold">[{cf.targetModel}]</span>
                          <span className="text-slate-800 ml-1.5">{cf.fieldName}</span>
                        </div>
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded uppercase">
                          {cf.fieldType} {cf.isRequired && "*"}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Form to add fields */}
                <form onSubmit={handleAddCustomField} className="flex flex-col gap-2 bg-slate-50/50 border border-slate-200 p-3 rounded-xl">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-500">TARGET MODEL</span>
                      <select
                        value={targetModel}
                        onChange={(e) => setTargetModel(e.target.value)}
                        className="bg-white border border-slate-200 px-2 py-1.5 rounded-lg outline-none"
                      >
                        {selectedModule.key === "TRANSPORTATION" ? (
                          <>
                            <option value="Order">Order</option>
                            <option value="Trip">Trip</option>
                            <option value="Vehicle">Vehicle</option>
                            <option value="Driver">Driver</option>
                          </>
                        ) : (
                          <option value="Customer">Customer</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-500">FIELD TYPE</span>
                      <select
                        value={fieldType}
                        onChange={(e) => setFieldType(e.target.value as any)}
                        className="bg-white border border-slate-200 px-2 py-1.5 rounded-lg outline-none"
                      >
                        <option value="TEXT">Text</option>
                        <option value="NUMBER">Number</option>
                        <option value="DATE">Date</option>
                        <option value="SELECT">Select Choice</option>
                        <option value="BOOLEAN">Checkbox</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500">FIELD KEY NAME</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. tracking_hash"
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                      className="bg-white border border-slate-200 px-2 py-1.5 rounded-lg outline-none text-[10px]"
                    />
                  </div>

                  <div className="flex items-center justify-between px-1 text-[10px]">
                    <span className="text-slate-600">Mark as Mandatory (*):</span>
                    <input
                      type="checkbox"
                      checked={isRequired}
                      onChange={(e) => setIsRequired(e.target.checked)}
                      className="accent-brand-indigo"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-1.5 py-1.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Add Custom Metadata Field
                  </button>
                </form>
              </div>
            </div>

            <button
              onClick={handleSaveConfigs}
              className="w-full mt-2 py-2.5 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {isSaved ? "Module Configs Locked ✓" : "Save Module Override"}
            </button>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 font-mono text-xs">
            Select a module to adjust metadata
          </div>
        )}
      </section>

    </div>
  );
}
