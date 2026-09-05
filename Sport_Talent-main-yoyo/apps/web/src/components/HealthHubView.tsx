"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Download,
  Activity,
  Heart,
  Droplet,
  Zap,
  Clock,
  ChevronRight,
} from "lucide-react";

interface BiomarkerItem {
  name: string;
  category: string;
  value: number;
  unit: string;
  range: string;
  status: "optimal" | "borderline" | "elevated" | "low";
}

export const HealthHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "add" | "ai_report">("overview");

  // Biomarkers State
  const [biomarkers, setBiomarkers] = useState<BiomarkerItem[]>([
    { name: "Fasting Blood Glucose", category: "Metabolic", value: 88, unit: "mg/dL", range: "70 - 99", status: "optimal" },
    { name: "Total Cholesterol", category: "Lipids", value: 175, unit: "mg/dL", range: "125 - 200", status: "optimal" },
    { name: "HDL Cholesterol", category: "Lipids", value: 62, unit: "mg/dL", range: "> 50", status: "optimal" },
    { name: "LDL Cholesterol", category: "Lipids", value: 98, unit: "mg/dL", range: "< 100", status: "optimal" },
    { name: "Cortisol (Morning)", category: "Endocrine", value: 16.4, unit: "ug/dL", range: "6.0 - 18.4", status: "optimal" },
    { name: "Total Testosterone", category: "Hormonal", value: 680, unit: "ng/dL", range: "300 - 1000", status: "optimal" },
    { name: "Vitamin D (25-OH)", category: "Micronutrient", value: 44, unit: "ng/mL", range: "30 - 80", status: "optimal" },
    { name: "hs-CRP (Inflammation)", category: "Immune", value: 0.8, unit: "mg/L", range: "< 1.0", status: "optimal" },
    { name: "Hemoglobin", category: "Hematology", value: 15.2, unit: "g/dL", range: "13.8 - 17.2", status: "optimal" },
  ]);

  // Form State for Adding New Report
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newPanel, setNewPanel] = useState("Comprehensive Athlete Panel");
  const [newBiomarkerName, setNewBiomarkerName] = useState("");
  const [newBiomarkerValue, setNewBiomarkerValue] = useState("");
  const [newBiomarkerUnit, setNewBiomarkerUnit] = useState("mg/dL");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleAddBiomarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBiomarkerName || !newBiomarkerValue) return;

    const val = parseFloat(newBiomarkerValue);
    const newEntry: BiomarkerItem = {
      name: newBiomarkerName,
      category: "Athlete Custom",
      value: val,
      unit: newBiomarkerUnit,
      range: "Standard Baseline",
      status: val > 140 ? "elevated" : "optimal",
    };

    setBiomarkers([newEntry, ...biomarkers]);
    setNewBiomarkerName("");
    setNewBiomarkerValue("");
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-semibold tracking-wider text-purple-400 uppercase flex items-center gap-1.5 font-mono">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            Physiological Diagnostics &bull; Lab Reports Hub
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Health &amp; Biomarker Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive blood panels, endocrine biomarkers, and AI health reports merged into your ATHENA Digital Twin.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              activeTab === "overview"
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Biomarker Matrix
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "add"
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Upload / Log Panel
          </button>
          <button
            onClick={() => setActiveTab("ai_report")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "ai_report"
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Health Summary
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Biomarker High-Level Summaries */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="athena-card p-4 border-slate-800 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>METABOLIC HEALTH</span>
                <Droplet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-1.5 font-mono">88 mg/dL</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Fasting Glucose In Optimal Zone
              </div>
            </div>

            <div className="athena-card p-4 border-slate-800 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>INFLAMMATION (hs-CRP)</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-1.5 font-mono">0.8 mg/L</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Low Systemic Joint Inflammation
              </div>
            </div>

            <div className="athena-card p-4 border-slate-800 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>VITAMIN D3</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-1.5 font-mono">44 ng/mL</div>
              <div className="text-[11px] text-blue-400 mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Sufficient Bone &amp; Muscle Density
              </div>
            </div>

            <div className="athena-card p-4 border-slate-800 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>TOTAL TESTOSTERONE</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-1.5 font-mono">680 ng/dL</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Anabolic Recovery Peak
              </div>
            </div>
          </div>

          {/* Full Biomarker Table */}
          <div className="athena-card p-5 border-slate-800 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Comprehensive Biomarker Directory ({biomarkers.length} Markers Logged)
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Latest Draw: {newDate}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80 font-mono">
                    <th className="pb-3 font-semibold">Biomarker</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Measured Value</th>
                    <th className="pb-3 font-semibold">Target Range</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {biomarkers.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 font-medium text-white">{b.name}</td>
                      <td className="py-3 text-slate-400 font-mono">{b.category}</td>
                      <td className="py-3 font-bold font-mono text-white">
                        {b.value} <span className="text-[10px] text-slate-400 font-normal">{b.unit}</span>
                      </td>
                      <td className="py-3 text-slate-400 font-mono">{b.range}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD TAB */}
      {activeTab === "add" && (
        <div className="max-w-2xl mx-auto athena-card p-6 border-slate-800 bg-slate-950 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Log Blood Panel or Custom Biomarker</h2>
            <p className="text-xs text-slate-400 mt-1">
              Add lab draw results to calibrate recovery scores and update Coach Jack&apos;s nutritional directives.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Biomarker successfully recorded into your ATHENA telemetry record!
            </div>
          )}

          <form onSubmit={handleAddBiomarker} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Collection Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Diagnostic Panel Type</label>
                <select
                  value={newPanel}
                  onChange={(e) => setNewPanel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                >
                  <option>Comprehensive Athlete Panel</option>
                  <option>Complete Blood Count (CBC)</option>
                  <option>Lipid &amp; Metabolic Panel</option>
                  <option>Hormonal &amp; Recovery Panel</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-white uppercase font-mono">Biomarker Entry</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] text-slate-400 mb-1">Marker Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ferritin, Zinc"
                    value={newBiomarkerName}
                    onChange={(e) => setNewBiomarkerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Measured Value</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 120"
                    value={newBiomarkerValue}
                    onChange={(e) => setNewBiomarkerValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. ng/mL, mg/dL"
                    value={newBiomarkerUnit}
                    onChange={(e) => setNewBiomarkerUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Save Biomarker Entry
            </button>
          </form>
        </div>
      )}

      {/* AI HEALTH REPORT TAB */}
      {activeTab === "ai_report" && (
        <div className="athena-card p-6 border-slate-800 bg-slate-950 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">ATHENA AI Biomechanical Health Report</h2>
                <div className="text-xs text-slate-400">Generated from latest blood draw &bull; Synthesized with Digital Twin</div>
              </div>
            </div>
            <button
              onClick={() => alert("Diagnostic PDF summary downloaded.")}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-purple-300 uppercase font-mono flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                Executive Physiological Summary
              </div>
              <p>
                All metabolic and inflammatory indicators are within optimal athletic thresholds. High-sensitivity CRP is low (0.8 mg/L), denoting exceptional systemic recovery and zero chronic inflammation. Morning cortisol is balanced (16.4 ug/dL), which correlates strongly with your 7.8 hours of deep restorative sleep.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase font-mono">
                  Nutritional Synergies
                </div>
                <p>
                  Vitamin D3 (44 ng/mL) and Fasting Glucose (88 mg/dL) demonstrate optimal insulin sensitivity. Coach Jack recommends preserving your current carbohydrate distribution strategy around high-intensity training intervals.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase font-mono">
                  Kinematic Risk Correlation
                </div>
                <p>
                  Because systemic inflammation is minimal, joint cartilage load during squat depth analysis on Athena CV (port 8002) is well within safety tolerances. Full depth squats remain completely cleared.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
