"use client";

import React, { useState } from "react";
import {
  Target,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
} from "lucide-react";

export const GoalsView: React.FC = () => {
  const [activeGoal, setActiveGoal] = useState({
    title: "Improve 5km Run Time & Core Endurance",
    category: "ENDURANCE",
    target: "24.0 mins",
    current: "29.5 mins",
    baseline: "32.0 mins",
    timeline_weeks: 8,
    current_week: 4,
    progress_percentage: 68,
    milestones: [
      { week: 2, label: "Pacing Consistency & 3km Baseline", completed: true },
      { week: 4, label: "Sub-28 minute 5km continuous run", completed: true },
      { week: 6, label: "Interval Stamina: 4x800m at goal pace", completed: false },
      { week: 8, label: "Target 24.0 min 5km milestone achievement", completed: false },
    ],
    weekly_actions: [
      "Complete 3 aerobic cardio sessions per week (1 interval, 1 tempo, 1 recovery)",
      "Record sleep and recovery scores >=5 nights per week",
      "Perform weekly core plank & mobility routine twice per week",
    ],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          Systematic Goal Engineering
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          Fitness Goal Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Current State &rarr; Target &rarr; Milestones &rarr; Weekly Actions &rarr; Tracking &rarr; Adaptation.
        </p>
      </div>

      {/* Primary Active Goal Card */}
      <div className="athena-card p-6 space-y-5 border-slate-700 bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="badge-clean badge-blue text-[10px] uppercase font-mono">
              {activeGoal.category} • {activeGoal.timeline_weeks} Weeks Horizon
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {activeGoal.title}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Current Progress</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {activeGoal.progress_percentage}%
            </div>
          </div>
        </div>

        {/* Metric Progression Matrix */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Baseline</div>
            <div className="text-sm font-mono font-bold text-slate-300 mt-0.5">{activeGoal.baseline}</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Current State</div>
            <div className="text-sm font-mono font-bold text-blue-400 mt-0.5">{activeGoal.current}</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Target Goal</div>
            <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{activeGoal.target}</div>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-white uppercase tracking-wider">
            Sequential Milestones (Week {activeGoal.current_week} of {activeGoal.timeline_weeks})
          </div>
          <div className="space-y-2">
            {activeGoal.milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                  m.completed
                    ? "bg-slate-950/80 border-slate-800 text-slate-300"
                    : "bg-slate-900 border-slate-800/60 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      m.completed ? "text-emerald-400" : "text-slate-600"
                    }`}
                  />
                  <span>
                    <strong className="text-white">Week {m.week}:</strong> {m.label}
                  </span>
                </div>
                <span className="font-mono text-[10px]">
                  {m.completed ? (
                    <span className="text-emerald-400 font-semibold">ACHIEVED</span>
                  ) : (
                    <span className="text-slate-500">PENDING</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Actionable Habits */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-white uppercase tracking-wider">
            Prescribed Weekly Actions
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            {activeGoal.weekly_actions.map((act, i) => (
              <li key={i} className="leading-relaxed">{act}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
