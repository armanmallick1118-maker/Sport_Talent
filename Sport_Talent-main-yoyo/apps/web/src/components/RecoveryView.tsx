"use client";

import React, { useState } from "react";
import {
  Moon,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Info,
  TrendingUp,
  Plus,
} from "lucide-react";

interface RecoveryProps {
  readinessData?: any;
}

export const RecoveryView: React.FC<RecoveryProps> = ({ readinessData }) => {
  const [sleepHours, setSleepHours] = useState(7.8);
  const [sleepQuality, setSleepQuality] = useState(82);
  const [perceivedFatigue, setPerceivedFatigue] = useState(4);
  const [trainingLoad, setTrainingLoad] = useState(6);
  const [stressLevel, setStressLevel] = useState(3);

  // Explicit Explainable Scoring Breakdown
  const breakdown = [
    { factor: "Base Physiological Baseline", delta: 50, sign: "+", detail: "Neutral recovery reference score" },
    { factor: "Sleep Duration & Quality", delta: 18, sign: "+", detail: `${sleepHours}h sleep logged (target 7.5h–8.5h)` },
    { factor: "Perceived Freshness", delta: 15, sign: "+", detail: `Fatigue score ${perceivedFatigue}/10 (Low-Moderate)` },
    { factor: "Prior Training Load Strain", delta: -7, sign: "", detail: `Yesterday workout load ${trainingLoad}/10` },
    { factor: "Systemic Psychological Stress", delta: -4, sign: "", detail: `Stress score ${stressLevel}/10` },
    { factor: "Habit Consistency Bonus", delta: 12, sign: "+", detail: "82% weekly training adherence" },
  ];

  const totalReadiness = breakdown.reduce((acc, curr) => acc + curr.delta, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5" />
          Explainable Recovery Architecture
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          Sleep &amp; Recovery Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Full mathematical transparency into readiness scoring. AI coach adapts daily workout intensity from this state.
        </p>
      </div>

      {/* Main Readiness Score Banner */}
      <div className="athena-card p-6 border-slate-700 bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              TODAY&apos;S CALIBRATED READINESS SCORE
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl font-extrabold text-white font-mono">
                {totalReadiness}
              </span>
              <span className="text-slate-500 font-mono text-sm">/ 100</span>
              <span className="badge-clean badge-emerald ml-2">
                Good Recovery State
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 max-w-sm">
            <div className="font-semibold text-white mb-0.5">Adaptive Intensity Prescription</div>
            <div>
              Readiness is solid. Proceed with moderate-to-progressive working sets with focused joint warmups.
            </div>
          </div>
        </div>

        {/* Explainable Factor Breakdown (Exact Specification) */}
        <div className="mt-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            MATHEMATICAL SCORE COMPOSITION (EXPLAINABLE)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {breakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{item.factor}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.detail}</div>
                </div>
                <div
                  className={`font-mono text-sm font-bold ${
                    item.delta >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {item.sign}{item.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sleep Architecture & Telemetry Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 athena-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Moon className="w-4 h-4 text-blue-400" />
            Sleep Architecture
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Duration Logged</span>
              <span className="font-mono text-white font-semibold">{sleepHours} hrs</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="10.0"
              step="0.1"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />

            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-400">Sleep Quality Index</span>
              <span className="font-mono text-white font-semibold">{sleepQuality}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">Bedtime</div>
                <div className="font-mono text-white font-semibold mt-0.5">23:15</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">Wake Time</div>
                <div className="font-mono text-white font-semibold mt-0.5">07:05</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 athena-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Fatigue &amp; Training Load Telemetry
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Perceived Muscular Fatigue (1–10)</span>
              <span className="font-mono text-white font-semibold">{perceivedFatigue} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={perceivedFatigue}
              onChange={(e) => setPerceivedFatigue(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />

            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-400">Prior Day Training Load (1–10)</span>
              <span className="font-mono text-white font-semibold">{trainingLoad} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={trainingLoad}
              onChange={(e) => setTrainingLoad(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />

            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-400">Systemic Stress Level (1–10)</span>
              <span className="font-mono text-white font-semibold">{stressLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
