import React, { useState } from "react";
import { CheckIcon, SlidersIcon, AlertIcon } from "./icons";

interface OnboardingWizardProps {
  onOnboardComplete: (tenantId: string, companyName: string, adminUsername: string) => void;
  onCancel: () => void;
}

export default function OnboardingWizard({ onOnboardComplete, onCancel }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company_name: "",
    subdomain: "",
    timezone: "America/New_York",
    currency: "USD",
    language: "en",
    address: "",
    latitude: "40.7128",
    longitude: "-74.0060",
    admin_username: "",
    admin_email: "",
    admin_password: "",
    admin_full_name: "",
    theme_primary: "#1a5b6e",
    theme_secondary: "#6366f1"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1) {
      if (!formData.company_name || !formData.subdomain) {
        setError("Company name and subdomain are required");
        return;
      }
      setError("");
    } else if (step === 2) {
      if (!formData.address) {
        setError("Main branch address is required");
        return;
      }
      setError("");
    } else if (step === 3) {
      if (!formData.admin_username || !formData.admin_email || !formData.admin_password) {
        setError("Admin credentials are required");
        return;
      }
      setError("");
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/tenants/onboard/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Onboarding failed. Please try again.");
      }

      // Success
      setStep(5);
      setTimeout(() => {
        onOnboardComplete(resData.tenant_id, formData.company_name, formData.admin_username);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-slide-up text-slate-800 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gradient-to-tr from-brand-indigo to-brand-cyan opacity-10 blur-xl pointer-events-none" />
        <div>
          <h2 className="text-lg font-mono font-bold tracking-wider uppercase text-brand-cyan">Tenant Onboarding Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Initialize your enterprise organization space instantly</p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-mono bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Progress bar */}
      {step < 5 && (
        <div className="flex bg-slate-50 border-b border-slate-200 px-8 py-4 justify-between items-center text-xs font-mono text-slate-400">
          <div className="flex items-center gap-6">
            <span className={`pb-1 ${step >= 1 ? "text-brand-indigo border-b-2 border-brand-indigo font-bold" : ""}`}>1. PROFILE</span>
            <span className={`pb-1 ${step >= 2 ? "text-brand-indigo border-b-2 border-brand-indigo font-bold" : ""}`}>2. MAIN HUB</span>
            <span className={`pb-1 ${step >= 3 ? "text-brand-indigo border-b-2 border-brand-indigo font-bold" : ""}`}>3. ADMIN</span>
            <span className={`pb-1 ${step >= 4 ? "text-brand-indigo border-b-2 border-brand-indigo font-bold" : ""}`}>4. PREVIEW</span>
          </div>
          <span className="font-bold text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">STEP {step}/4</span>
        </div>
      )}

      {/* Body content */}
      <div className="p-8">
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex gap-3 text-xs">
            <AlertIcon size={16} className="flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Organization Identity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Setup the name, domain identifiers, and base configuration details.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono">COMPANY NAME</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Acme Shipping Corp"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl text-xs outline-none focus:border-brand-indigo transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">ORGANIZATION SUBDOMAIN</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    placeholder="acme"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-l-xl text-xs outline-none focus:border-brand-indigo transition-all"
                  />
                  <span className="bg-slate-100 border border-l-0 border-slate-200 px-3 py-2.5 text-xs text-slate-500 rounded-r-xl font-mono">
                    .tameos.com
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">BASE TIMEZONE</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo transition-all"
                >
                  <option value="America/New_York">Eastern Time (EST/EDT)</option>
                  <option value="America/Chicago">Central Time (CST/CDT)</option>
                  <option value="America/Denver">Mountain Time (MST/MDT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                  <option value="UTC">UTC Standard</option>
                  <option value="Asia/Kolkata">India Standard (IST)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">PRIMARY CURRENCY</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">PRIMARY LANGUAGE</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">PRIMARY BRAND HEX COLOR</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.theme_primary}
                    onChange={(e) => setFormData({ ...formData, theme_primary: e.target.value })}
                    className="h-9 w-9 bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme_primary}
                    onChange={(e) => setFormData({ ...formData, theme_primary: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">SECONDARY HEX COLOR</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.theme_secondary}
                    onChange={(e) => setFormData({ ...formData, theme_secondary: e.target.value })}
                    className="h-9 w-9 bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme_secondary}
                    onChange={(e) => setFormData({ ...formData, theme_secondary: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Headquarters Hub Branch</h3>
              <p className="text-xs text-slate-500 mt-0.5">Define your main physical depot or dispatch terminal. This initializes your first Branch Node.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono">PHYSICAL STREET ADDRESS</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 100 Industrial Pkwy, Seattle, WA 98101"
                rows={2}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">LATITUDE</label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="40.7128"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">LONGITUDE</label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="-74.0060"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3 mt-2">
              <SlidersIcon size={18} className="text-brand-indigo flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Branch Geofence Configured</h4>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                  A default geofence of 150 meters radius will be registered for coordinates. Telematics updates crossing this boundary automatically trigger Gate-in / Gate-out records.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Administrator Credentials</h3>
              <p className="text-xs text-slate-500 mt-0.5">Configure the root administration credential account for this organization workspace.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">LOGIN USERNAME</label>
                <input
                  type="text"
                  value={formData.admin_username}
                  onChange={(e) => setFormData({ ...formData, admin_username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                  placeholder="admin_acme"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">FULL NAME</label>
                <input
                  type="text"
                  value={formData.admin_full_name}
                  onChange={(e) => setFormData({ ...formData, admin_full_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">ADMIN EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={formData.admin_email}
                  onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                  placeholder="john.doe@company.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 font-mono">PASSWORD</label>
                <input
                  type="password"
                  value={formData.admin_password}
                  onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-indigo"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5 animate-fade-in text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Review Onboarding Configuration</h3>
              <p className="text-xs text-slate-500 mt-0.5">Please review before saving. The system will create and format all database tables atomically.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">ORGANIZATION:</span>
                <span className="font-bold text-slate-900">{formData.company_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">SUBDOMAIN:</span>
                <span className="font-bold text-slate-900">{formData.subdomain}.tameos.com</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">BASE CONFIG:</span>
                <span className="text-slate-700">{formData.currency} | {formData.timezone} | {formData.language}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">HEAD OFFICE:</span>
                <span className="text-slate-700 text-right truncate max-w-[300px]">{formData.address}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">ADMIN USER:</span>
                <span className="font-bold text-slate-900">{formData.admin_username} ({formData.admin_email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AUTOMATIC MODULES:</span>
                <span className="text-brand-indigo font-bold">CRM, TRANSPORT, INVENTORY</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              By proceeding, the database transaction will deploy default workspaces, seed initial role hierarchies (Admin), and enable execution engines.
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="py-8 text-center flex flex-col items-center gap-4 animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
              <CheckIcon size={32} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Deploying Organization Tenant</h3>
              <p className="text-xs text-slate-500 mt-1">Applying master records and seeding administration keys...</p>
            </div>
            
            {/* Simple CSS Loader */}
            <div className="h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-brand-indigo rounded-full animate-[loading-bar_3s_ease-out_infinite]" style={{ width: '40%' }}></div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        {step < 5 && (
          <div className="flex justify-between border-t border-slate-100 pt-6 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 text-xs font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-55"
              >
                {loading ? "Registering..." : "Onboard Organization"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
