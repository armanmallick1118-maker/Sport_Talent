"use client";

import React from "react";
import {
  Activity,
  Moon,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Info,
  Clock,
  Target,
  Sparkles,
  FileText,
} from "lucide-react";
import { ViewType } from "./Sidebar";

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
  twinData?: any;
  recommendation?: any;
  readinessData?: any;
  todayNutrition?: any;
}

export const DashboardView: React.FC<DashboardProps> = ({
  onNavigate,
  twinData,
  recommendation,
  readinessData,
  todayNutrition,
}) => {
  const readiness = readinessData?.readiness_score ?? 74;
  const fitness = 78;
  const activity = 82;
  const consistency = 71;

  const rec = recommendation || {
    title: "20 Min Moderate Kinetic Workout",
    summary: "Controlled bodyweight circuit with dynamic mobility warmup.",
    reasoning_why:
      "Your recovery is good, but activity has been lower than your normal baseline.",
    duration_minutes: 20,
    intensity: "MODERATE",
  };

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase">
            Personal Intelligence System
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
            Good evening, Alex
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System status calibrated from longitudinal baseline. Twin v1 active.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("twin")}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Twin v1 Active
          </button>
          <button
            onClick={() => onNavigate("simulator")}
            className="px-3 py-1.5 rounded-lg border border-blue-600/30 bg-blue-950/40 text-xs font-medium text-blue-400 hover:bg-blue-900/40 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            What-If Simulator
          </button>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="athena-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>FITNESS</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 font-mono">{fitness}</div>
          <div className="text-[11px] text-emerald-500 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +2.4 pts vs 30d baseline
          </div>
        </div>

        <div className="athena-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>READINESS</span>
            <Moon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 font-mono">{readiness}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            State: <span className="text-emerald-400 font-medium">Good</span> (7.8h sleep)
          </div>
        </div>

        <div className="athena-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>ACTIVITY</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 font-mono">{activity}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Today: <span className="text-slate-300 font-medium">42 mins</span> / 50 target
          </div>
        </div>

        <div className="athena-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>CONSISTENCY</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 font-mono">{consistency}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            4-week rolling adherence
          </div>
        </div>
      </div>

      {/* Main Grid: Today's State & ATHENA Suggests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Today's State (4 cols) */}
        <div className="lg:col-span-4 athena-card p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Today&apos;s State
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Live Telemetry</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-400">Recovery Status</span>
              <span className="badge-clean badge-emerald">Good</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-400">Sleep Architecture</span>
              <span className="badge-clean badge-blue">7.8h • 82% Quality</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-400">Daily Activity Level</span>
              <span className="badge-clean badge-amber">Low (Below Normal)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-400">Hydration Intake</span>
              <span className="text-slate-300 font-mono">1,750 / 2,500 ml</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-400">Perceived Exertion Fatigue</span>
              <span className="text-slate-300 font-mono">4 / 10 (Fresh)</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate("recovery")}
              className="w-full py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              Inspect Readiness Breakdown
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ATHENA Suggests Recommendation Card (8 cols) */}
        <div className="lg:col-span-8 athena-card p-6 flex flex-col justify-between border-slate-700 bg-slate-900/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">
                  ATHENA SUGGESTS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-clean badge-blue">
                  {rec.duration_minutes} min • {rec.intensity}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {rec.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {rec.summary}
              </p>
            </div>

            {/* WHY Section - Required Core Athena Element */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                WHY IS ATHENA RECOMMENDING THIS?
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {rec.reasoning_why}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("fitness")}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              Start Session ({rec.duration_minutes} min)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("coach")}
              className="px-4 py-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/40 text-amber-300 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              Consult Coach Jack (Mentor)
            </button>
            <button
              onClick={() => onNavigate("cv")}
              className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Athena CV Kinematics (Port 8002)
            </button>
            <button
              onClick={() => onNavigate("health")}
              className="px-4 py-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/40 text-purple-300 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              Lab Biomarkers Hub
            </button>
          </div>
        </div>
      </div>

      {/* Answers to Core Questions + Lab Biomarker Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="athena-card p-4 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            WHAT CHANGED?
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            Your cardiovascular output improved by <span className="text-emerald-400 font-semibold">+4.2%</span> over 8 weeks, while resting heart rate lowered by 2 bpm.
          </div>
        </div>

        <div className="athena-card p-4 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            WHAT CAN I IMPROVE?
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            Coach Jack Directive: Shift 15g protein to breakfast to stabilize day-long muscle protein synthesis.
          </div>
        </div>

        <div className="athena-card p-4 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            GOAL MILESTONE
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            Target: 5km Pace & Core Mastery. Currently at <span className="text-blue-400 font-semibold">68% completion</span> (Week 4 of 8).
          </div>
        </div>

        <div className="athena-card p-4 space-y-2 border-purple-500/20 bg-purple-950/10">
          <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider flex items-center justify-between">
            <span>LAB BIOMARKERS</span>
            <span className="text-[10px] text-emerald-400 font-mono">OPTIMAL</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            hs-CRP: 0.8 mg/L (Low), Fasting Glucose: 88 mg/dL, Vit D: 44 ng/mL. Cleared for high-volume CV tracking.
          </div>
        </div>
      </div>
    </div>
  );
};

