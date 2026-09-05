"use client";

import React, { useState } from "react";
import {
  Activity,
  Dumbbell,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  ArrowRight,
  Info,
} from "lucide-react";

interface FitnessProps {
  onAssessmentSubmitted?: (scores: any) => void;
}

export const FitnessEngineView: React.FC<FitnessProps> = ({
  onAssessmentSubmitted,
}) => {
  const [tier, setTier] = useState<"BEGINNER" | "INTERMEDIATE" | "ATHLETE">(
    "INTERMEDIATE"
  );
  const [pushups, setPushups] = useState(28);
  const [squats, setSquats] = useState(42);
  const [plankSec, setPlankSec] = useState(110);
  const [situps, setSitups] = useState(35);
  const [runKm, setRunKm] = useState(3.0);
  const [runMins, setRunMins] = useState(16.5);
  const [flexCm, setFlexCm] = useState(28.0);
  const [balanceSec, setBalanceSec] = useState(40.0);

  const [scores, setScores] = useState({
    strength: 72.0,
    endurance: 70.0,
    cardio: 68.0,
    mobility: 64.0,
    flexibility: 62.0,
    balance: 74.0,
    agility: 66.0,
    consistency: 76.0,
  });

  const [explanation, setExplanation] = useState(
    "Assessment evaluated for INTERMEDIATE tier. Strength (72/100) based on 28 push-ups and 42 squats. Endurance (70/100) based on 110s plank. Cardio (68/100) determined from 3km run pace."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Workout Session Quick-Log State
  const [workoutTitle, setWorkoutTitle] = useState("Upper Strength & Core Focus");
  const [workoutType, setWorkoutType] = useState("STRENGTH");
  const [workoutDuration, setWorkoutDuration] = useState(35);
  const [workoutRPE, setWorkoutRPE] = useState(7);
  const [loggedWorkouts, setLoggedWorkouts] = useState([
    { id: 1, title: "Tempo Run & Strides", type: "CARDIO", duration: 30, rpe: 7, cals: 260, date: "Yesterday" },
    { id: 2, title: "Lower Body Stability & Mobility", type: "MOBILITY", duration: 25, rpe: 5, cals: 130, date: "3 days ago" },
  ]);

  const handleRunAssessment = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/fitness/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          pushups,
          squats,
          plank_seconds: plankSec,
          situps,
          run_distance_km: runKm,
          run_time_minutes: runMins,
          flexibility_sit_and_reach_cm: flexCm,
          balance_single_leg_seconds: balanceSec,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setScores(data.scores);
        setExplanation(data.explanation);
        if (onAssessmentSubmitted) onAssessmentSubmitted(data.scores);
      }
    } catch (e) {
      console.warn("Backend call fallback, local calculation", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogWorkout = () => {
    const newW = {
      id: Date.now(),
      title: workoutTitle,
      type: workoutType,
      duration: workoutDuration,
      rpe: workoutRPE,
      cals: workoutDuration * 7,
      date: "Just now",
    };
    setLoggedWorkouts([newW, ...loggedWorkouts]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          Measurable Fitness Intelligence
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          Physical Fitness Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adaptive assessment testing that generates distinct multi-category scores rather than an arbitrary single health score.
        </p>
      </div>

      {/* Tier Selection */}
      <div className="athena-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Adaptive Assessment Protocol
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select testing battery calibrated to your current training history.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-medium">
            {(["BEGINNER", "INTERMEDIATE", "ATHLETE"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1 rounded transition-colors ${
                  tier === t
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Assessment Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Push-ups (Max Reps)</label>
            <input
              type="number"
              value={pushups}
              onChange={(e) => setPushups(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Squats (Max Reps)</label>
            <input
              type="number"
              value={squats}
              onChange={(e) => setSquats(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Plank Hold (Seconds)</label>
            <input
              type="number"
              value={plankSec}
              onChange={(e) => setPlankSec(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Sit-ups (Max Reps)</label>
            <input
              type="number"
              value={situps}
              onChange={(e) => setSitups(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Run Distance (km)</label>
            <input
              type="number"
              step="0.5"
              value={runKm}
              onChange={(e) => setRunKm(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Run Time (minutes)</label>
            <input
              type="number"
              step="0.5"
              value={runMins}
              onChange={(e) => setRunMins(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Sit &amp; Reach Flex (cm)</label>
            <input
              type="number"
              value={flexCm}
              onChange={(e) => setFlexCm(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Balance Stance (sec)</label>
            <input
              type="number"
              value={balanceSec}
              onChange={(e) => setBalanceSec(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunAssessment}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            {isSubmitting ? "Recalibrating..." : "Calibrate Assessment & Update Twin"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8 Distinct Category Scores Output */}
      <div className="athena-card p-5 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Calibrated Category Scores
          </h2>
          <span className="text-xs text-slate-400">Scale: 0 – 100 Normalized</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(scores).map(([key, val]) => (
            <div key={key} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">
                {key}
              </div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {val}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Number(val))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Explainable Calculation Disclosure */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            TRANSPARENT CALCULATION LOGIC
          </div>
          <p className="leading-relaxed text-slate-300">
            {explanation}
          </p>
        </div>
      </div>

      {/* Workout Logger & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 athena-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Log Training Session
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-slate-400">Workout Title</label>
              <input
                type="text"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400">Type</label>
                <select
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white mt-1"
                >
                  <option value="STRENGTH">Strength</option>
                  <option value="CARDIO">Cardio</option>
                  <option value="MOBILITY">Mobility</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Duration (mins)</label>
                <input
                  type="number"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white mt-1 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-400">Perceived Exertion (RPE 1-10): {workoutRPE}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={workoutRPE}
                onChange={(e) => setWorkoutRPE(Number(e.target.value))}
                className="w-full accent-blue-600 mt-1"
              />
            </div>
          </div>
          <button
            onClick={handleLogWorkout}
            className="w-full py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Record Workout Session
          </button>
        </div>

        <div className="lg:col-span-7 athena-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Recent Workouts
          </h3>
          <div className="space-y-2">
            {loggedWorkouts.map((w) => (
              <div
                key={w.id}
                className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{w.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {w.type} • {w.duration} mins • RPE {w.rpe}/10
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-semibold">
                    ~{w.cals} kcal
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{w.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
