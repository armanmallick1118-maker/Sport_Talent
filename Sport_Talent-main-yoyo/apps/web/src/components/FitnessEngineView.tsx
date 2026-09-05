"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Dumbbell,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  ArrowRight,
  Info,
  RefreshCw,
  Sliders,
  TrendingUp,
  Cpu,
  Sparkles,
} from "lucide-react";

interface FitnessProps {
  onAssessmentSubmitted?: (scores: any) => void;
}

export const FitnessEngineView: React.FC<FitnessProps> = ({
  onAssessmentSubmitted,
}) => {
  const [tier, setTier] = useState<"BEGINNER" | "INTERMEDIATE" | "ATHLETE">("INTERMEDIATE");

  // User input parameters (Sliders & inputs)
  const [pushups, setPushups] = useState(28);
  const [squats, setSquats] = useState(42);
  const [plankSec, setPlankSec] = useState(110);
  const [situps, setSitups] = useState(35);
  const [runKm, setRunKm] = useState(3.0);
  const [runMins, setRunMins] = useState(16.5);
  const [flexCm, setFlexCm] = useState(28.0);
  const [balanceSec, setBalanceSec] = useState(40.0);

  // Dynamic Calculated Twin Scores
  const [scores, setScores] = useState({
    strength: 72,
    endurance: 70,
    cardio: 68,
    mobility: 64,
    flexibility: 62,
    balance: 74,
    agility: 66,
    consistency: 76,
  });

  const [isSynced, setIsSynced] = useState(false);
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

  // Real-Time Dynamic Calculation whenever parameters change
  useEffect(() => {
    // Tier multipliers
    const tierDiv = tier === "BEGINNER" ? 0.8 : tier === "INTERMEDIATE" ? 1.0 : 1.3;

    // Strength: Pushups (50%) + Squats (50%)
    const rawStrength = (pushups * 1.3 + squats * 0.8) / tierDiv;
    const calcStrength = Math.round(Math.min(99, Math.max(35, rawStrength)));

    // Endurance: Plank duration (60%) + Situps (40%)
    const rawEndurance = (plankSec * 0.4 + situps * 0.9) / tierDiv;
    const calcEndurance = Math.round(Math.min(99, Math.max(35, rawEndurance)));

    // Cardio: Speed in km/h = (km / (mins/60))
    const paceSpeed = runKm / Math.max(0.1, runMins / 60); // e.g. 3km in 16.5m = 10.9 km/h
    const rawCardio = (paceSpeed * 6.8) / tierDiv;
    const calcCardio = Math.round(Math.min(99, Math.max(35, rawCardio)));

    // Flexibility & Mobility: Sit & reach
    const rawFlex = (flexCm * 2.2) / tierDiv;
    const calcFlex = Math.round(Math.min(99, Math.max(35, rawFlex)));
    const calcMobility = Math.round(Math.min(99, Math.max(35, rawFlex + 4)));

    // Balance & Agility
    const rawBalance = (balanceSec * 1.8) / tierDiv;
    const calcBalance = Math.round(Math.min(99, Math.max(35, rawBalance)));
    const calcAgility = Math.round(Math.min(99, Math.max(35, rawBalance - 6)));

    // Consistency based on logged workouts
    const calcConsistency = Math.min(98, 70 + loggedWorkouts.length * 4);

    const newScores = {
      strength: calcStrength,
      endurance: calcEndurance,
      cardio: calcCardio,
      mobility: calcMobility,
      flexibility: calcFlex,
      balance: calcBalance,
      agility: calcAgility,
      consistency: calcConsistency,
    };

    setScores(newScores);

    // Automatically synchronize with My Twin in real-time
    if (onAssessmentSubmitted) {
      onAssessmentSubmitted(newScores);
    }
  }, [pushups, squats, plankSec, situps, runKm, runMins, flexCm, balanceSec, tier, loggedWorkouts.length]);

  const handleSyncTwin = async () => {
    setIsSubmitting(true);
    try {
      if (onAssessmentSubmitted) {
        onAssessmentSubmitted(scores);
      }
      localStorage.setItem("athena_twin_scores", JSON.stringify(scores));
      setIsSynced(true);
      setTimeout(() => setIsSynced(false), 3000);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5 font-mono">
            <Activity className="w-3.5 h-3.5" />
            Biomechanical Assessment &bull; Real-Time Twin Calibration
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Dynamic Fitness Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Adjust any physical parameter below. Scores, charts, and your Digital Twin update in real time.
          </p>
        </div>

        <button
          onClick={handleSyncTwin}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 w-fit"
        >
          {isSynced ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <RefreshCw className="w-4 h-4" />}
          {isSynced ? "My Twin Calibrated!" : "Sync & Recalibrate My Twin"}
        </button>
      </div>

      {/* LIVE TWIN SCORES PREVIEW BANNER */}
      <div className="athena-card p-5 border-blue-500/30 bg-blue-950/20">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Live Digital Twin Vector Output (Real-Time Reactive)
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            ● Actively Synchronized to Dashboard
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center font-mono">
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Strength</div>
            <div className="text-xl font-bold text-blue-400 mt-1">{scores.strength}</div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Endurance</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{scores.endurance}</div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Cardio</div>
            <div className="text-xl font-bold text-indigo-400 mt-1">{scores.cardio}</div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Mobility</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{scores.mobility}</div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Flexibility</div>
            <div className="text-xl font-bold text-purple-400 mt-1">{scores.flexibility}</div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Balance</div>
            <div className="text-xl font-bold text-teal-400 mt-1">{scores.balance}</div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Agility</div>
            <div className="text-xl font-bold text-pink-400 mt-1">{scores.agility}</div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Consistency</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{scores.consistency}</div>
          </div>
        </div>
      </div>

      {/* TIER SELECTOR */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2">Evaluation Tier:</span>
        {(["BEGINNER", "INTERMEDIATE", "ATHLETE"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono uppercase transition-all ${
              tier === t
                ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* INTERACTIVE PARAMETERS SLIDERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Strength Block */}
        <div className="athena-card p-5 space-y-4 border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-blue-400 uppercase font-mono flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              Upper &amp; Lower Strength
            </span>
            <span className="text-xs font-mono text-white font-bold">{scores.strength} PTS</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Max Push-Ups (1-Min)</span>
                <span className="font-mono text-white font-bold">{pushups} reps</span>
              </div>
              <input
                type="range"
                min={5}
                max={70}
                value={pushups}
                onChange={(e) => setPushups(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Bodyweight Squats (2-Min)</span>
                <span className="font-mono text-white font-bold">{squats} reps</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                value={squats}
                onChange={(e) => setSquats(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Endurance Block */}
        <div className="athena-card p-5 space-y-4 border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Core &amp; Muscular Endurance
            </span>
            <span className="text-xs font-mono text-white font-bold">{scores.endurance} PTS</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Isometric Plank Hold</span>
                <span className="font-mono text-white font-bold">{plankSec} sec</span>
              </div>
              <input
                type="range"
                min={20}
                max={240}
                step={5}
                value={plankSec}
                onChange={(e) => setPlankSec(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Controlled Sit-Ups (1-Min)</span>
                <span className="font-mono text-white font-bold">{situps} reps</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={situps}
                onChange={(e) => setSitups(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Cardio Block */}
        <div className="athena-card p-5 space-y-4 border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-indigo-400 uppercase font-mono flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              Aerobic Output &amp; Pace
            </span>
            <span className="text-xs font-mono text-white font-bold">{scores.cardio} PTS</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Run Distance</span>
                <span className="font-mono text-white font-bold">{runKm.toFixed(1)} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={runKm}
                onChange={(e) => setRunKm(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Completion Time</span>
                <span className="font-mono text-white font-bold">{runMins.toFixed(1)} mins</span>
              </div>
              <input
                type="range"
                min={5}
                max={75}
                step={0.5}
                value={runMins}
                onChange={(e) => setRunMins(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Mobility & Flexibility */}
        <div className="athena-card p-5 space-y-4 border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-amber-400 uppercase font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Flexibility &amp; Joint Range
            </span>
            <span className="text-xs font-mono text-white font-bold">{scores.flexibility} PTS</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Sit &amp; Reach Reach Distance</span>
              <span className="font-mono text-white font-bold">{flexCm} cm</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={flexCm}
              onChange={(e) => setFlexCm(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Balance & Stability */}
        <div className="athena-card p-5 space-y-4 border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-teal-400 uppercase font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Proprioception &amp; Balance
            </span>
            <span className="text-xs font-mono text-white font-bold">{scores.balance} PTS</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Single Leg Stance (Eyes Closed)</span>
              <span className="font-mono text-white font-bold">{balanceSec} sec</span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              value={balanceSec}
              onChange={(e) => setBalanceSec(parseFloat(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Workout Log */}
        <div className="athena-card p-5 space-y-3 border-slate-800 bg-slate-950">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Log Training Session</span>
            <Plus className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-2 text-xs">
            <input
              type="text"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(parseInt(e.target.value))}
                placeholder="Duration (m)"
                className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
              <button
                type="button"
                onClick={handleLogWorkout}
                className="w-1/2 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
