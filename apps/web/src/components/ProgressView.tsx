"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  Calendar,
  Activity,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ProgressView: React.FC = () => {
  const [period, setPeriod] = useState<"7_DAYS" | "30_DAYS" | "90_DAYS" | "6_MONTHS" | "1_YEAR">("30_DAYS");

  const chartData = [
    { date: "Day 1", fitness: 68, readiness: 70, consistency: 60 },
    { date: "Day 6", fitness: 70, readiness: 74, consistency: 66 },
    { date: "Day 12", fitness: 71, readiness: 72, consistency: 72 },
    { date: "Day 18", fitness: 73, readiness: 78, consistency: 75 },
    { date: "Day 24", fitness: 75, readiness: 76, consistency: 79 },
    { date: "Day 30", fitness: 78, readiness: 74, consistency: 82 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          Longitudinal Analytics
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          Progress &amp; Trend Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Multi-horizon tracking across 7 days, 30 days, 90 days, 6 months, and 1 year. Classifies physiological trends as Improving, Stable, or Declining.
        </p>
      </div>

      {/* Timeframe Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {(["7_DAYS", "30_DAYS", "90_DAYS", "6_MONTHS", "1_YEAR"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              period === p
                ? "bg-blue-950 border-blue-600 text-blue-300 font-semibold"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {p.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Trend Status Tags Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="athena-card p-4">
          <div className="text-[11px] text-slate-400 uppercase font-medium">Cardiovascular Stamina</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="badge-clean badge-emerald font-semibold">IMPROVING</span>
            <span className="text-xs font-mono text-white">+4.2%</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Steady pace gain over 8 weeks</div>
        </div>

        <div className="athena-card p-4">
          <div className="text-[11px] text-slate-400 uppercase font-medium">Functional Strength</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="badge-clean badge-emerald font-semibold">IMPROVING</span>
            <span className="text-xs font-mono text-white">+5.8%</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Upper &amp; core stamina</div>
        </div>

        <div className="athena-card p-4">
          <div className="text-[11px] text-slate-400 uppercase font-medium">Recovery &amp; Sleep</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="badge-clean badge-blue font-semibold">STABLE</span>
            <span className="text-xs font-mono text-white">7.8h avg</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Solid nocturnal stability</div>
        </div>

        <div className="athena-card p-4">
          <div className="text-[11px] text-slate-400 uppercase font-medium">Habit Consistency</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="badge-clean badge-emerald font-semibold">IMPROVING</span>
            <span className="text-xs font-mono text-white">54% &rarr; 78%</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">4-week adherence trend</div>
        </div>
      </div>

      {/* Longitudinal Graph */}
      <div className="athena-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Longitudinal Trajectory ({period.replace("_", " ")})
          </h2>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Fitness Score
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Readiness
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Consistency %
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#090d16", borderColor: "#334155", fontSize: 12 }}
              />
              <Line type="monotone" dataKey="fitness" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="consistency" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
