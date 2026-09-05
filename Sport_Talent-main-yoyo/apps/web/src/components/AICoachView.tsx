"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Activity,
  Moon,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Flame,
  Award,
  Utensils,
  Heart,
  Scale,
  Sliders,
  ChevronRight,
  Droplet,
  Search,
  Check,
  HelpCircle,
  Stethoscope,
  RefreshCw,
} from "lucide-react";

interface AICoachProps {
  recommendation?: any;
  readinessData?: any;
  twinData?: any;
}

export type CoachMode = "strict" | "professional" | "lenient" | "dietitian";

export const AICoachView: React.FC<AICoachProps> = ({
  recommendation,
  readinessData,
  twinData,
}) => {
  const readiness = readinessData?.readiness_score ?? 74;

  const [coachMode, setCoachMode] = useState<CoachMode>("strict");

  // Dietitian Interactive Macro Calculator State
  const [athleteWeight, setAthleteWeight] = useState(74.5);
  const [trainingGoal, setTrainingGoal] = useState<"hypertrophy" | "endurance" | "fat_loss" | "maintenance">("hypertrophy");
  const [customMacroTarget, setCustomMacroTarget] = useState<any>(null);

  // Unfitness Verdict Matching Studio State
  const [userVerdict, setUserVerdict] = useState("");
  const [showVerdictStudio, setShowVerdictStudio] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  // Initial messages based on mode
  const modeWelcomeMessages: Record<CoachMode, string> = {
    strict:
      "Listen closely. I am Coach Jack. I hold my athletes to unyielding professional standards. I've audited your Digital Twin telemetry and morning readiness score (74/100). If you want elite results, execute your plan with precision. Zero excuses.",
    professional:
      "Welcome. Coach Jack here operating in Sports Scientist mode. Your physiological recovery is indexed at 74/100, indicating adequate autonomic balance. We will calibrate training stimulus deterministically to avoid metabolic overreach.",
    lenient:
      "Hey there! Coach Jack here. Remember that fitness is a marathon, not a sprint. You are doing fantastic, and your body is in a good place today. Listen to your joints, take your time, and enjoy moving today!",
    dietitian:
      "Greetings! Coach Jack in Elite Sports Dietitian mode. Nutrient partitioning and metabolic timing dictate 80% of your performance ceiling. Let's calibrate your protein grams, glycogen replenishment, and hydration balance today.",
  };

  const [messages, setMessages] = useState<
    { sender: "coach" | "user"; text: string; time: string; tag?: string; mode?: CoachMode }[]
  >([
    {
      sender: "coach",
      text: modeWelcomeMessages.strict,
      time: "10:15 AM",
      tag: "DISCIPLINE_BASELINE",
      mode: "strict",
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Recalculate macro targets whenever weight or goal changes
  useEffect(() => {
    let proteinPerKg = 2.0;
    let carbMultiplier = 3.5;
    let fatMultiplier = 0.9;
    let calorieBase = athleteWeight * 32;

    if (trainingGoal === "hypertrophy") {
      proteinPerKg = 2.2;
      carbMultiplier = 4.0;
      calorieBase += 300;
    } else if (trainingGoal === "endurance") {
      proteinPerKg = 1.7;
      carbMultiplier = 5.0;
      calorieBase += 200;
    } else if (trainingGoal === "fat_loss") {
      proteinPerKg = 2.4;
      carbMultiplier = 2.2;
      calorieBase -= 400;
    }

    const proteinGrams = Math.round(athleteWeight * proteinPerKg);
    const fatGrams = Math.round(athleteWeight * fatMultiplier);
    const carbGrams = Math.round((calorieBase - proteinGrams * 4 - fatGrams * 9) / 4);

    setCustomMacroTarget({
      calories: Math.round(calorieBase),
      protein: proteinGrams,
      carbs: Math.max(80, carbGrams),
      fats: fatGrams,
      waterLiters: (athleteWeight * 0.04).toFixed(1),
    });
  }, [athleteWeight, trainingGoal]);

  // Comprehensive Telemetry Harvester across all webapp subsystems
  const gatherAllAppData = () => {
    let profileData = {
      name: "Alex",
      gender: "Male",
      age: "26",
      weight: athleteWeight,
      height: 178,
      sport: "Athletics / Sprinting",
      experience: "Intermediate (2-4 yrs)",
      goals: "Sub-11s 100m sprint, low body fat & VO2 max mastery",
    };

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("athena_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          profileData = { ...profileData, ...parsed };
        }
      } catch {}
    }

    return {
      profile: profileData,
      twinScores: twinData?.scores || {
        strength: 72,
        endurance: 70,
        cardio: 68,
        mobility: 64,
        flexibility: 62,
        balance: 74,
        agility: 66,
        consistency: 76,
      },
      readiness: {
        score: readiness,
        state: readinessData?.state ?? "Good",
        sleepHours: 7.8,
        sleepQuality: "82%",
        perceivedFatigue: "4/10 (Fresh)",
      },
      biomarkers: {
        crp: "0.8 mg/L (Optimal)",
        glucose: "88 mg/dL",
        vitD: "44 ng/mL",
        cortisol: "14 ug/dL",
      },
      cvKinematics: {
        lastExercise: "Squats / Pushups",
        reps: 18,
        peakDepth: "84° (Full Parallel)",
        consistency: "91%",
        formDeviations: "Slight knee valgus on late fatigue reps",
      },
    };
  };

  const handleModeChange = (newMode: CoachMode) => {
    setCoachMode(newMode);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      {
        sender: "coach",
        text: modeWelcomeMessages[newMode],
        time: timeNow,
        tag: `MODE_SWITCH_${newMode.toUpperCase()}`,
        mode: newMode,
      },
    ]);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "coach",
        text: `Log reset. Operating in [${coachMode.toUpperCase()}] mode. What is your training or nutritional inquiry right now?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tag: "LOG_CLEARED",
        mode: coachMode,
      },
    ]);
  };

  // Run Biometric & Unfitness Diagnostic Audit
  const handleRunDiagnosticAudit = async () => {
    setIsAuditing(true);
    setIsTyping(true);
    setShowVerdictStudio(true);

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: "⚡ [SYSTEM DIRECTIVE]: Execute full biometric & kinematic diagnostic audit on my telemetry data. Identify where I am most unfit and cross-examine me.",
        time: timeNow,
      },
    ]);

    try {
      const telemetry = gatherAllAppData();
      const token = typeof window !== "undefined" ? localStorage.getItem("athena_token") : null;

      const res = await fetch("http://127.0.0.1:8000/api/v1/ai-suggestions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: "audit_unfitness",
          mode: coachMode,
          telemetry,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.data?.content;
        if (replyText) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "coach",
              text: replyText,
              time: timeNow,
              tag: "DIAGNOSTIC_AUDIT",
              mode: coachMode,
            },
          ]);
          return;
        }
      }
      throw new Error("Audit failed");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          text: `[AUDIT RESULT]: Your Cardio score (${twinData?.scores?.cardio || 68}/100) and Mobility (${twinData?.scores?.mobility || 64}/100) are trailing your strength baseline. Why are you lagging here? Enter your verdict below so we can formulate your corrective protocol.`,
          time: timeNow,
          tag: "LOCAL_AUDIT_FALLBACK",
          mode: coachMode,
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsAuditing(false);
    }
  };

  // Submit User Verdict & Synthesize Action Plan
  const handleSubmitVerdict = async () => {
    if (!userVerdict.trim()) return;
    const verdictToSubmit = userVerdict;
    setUserVerdict("");
    setShowVerdictStudio(false);

    const promptText = `Here is my verdict on why I have been struggling or feel unfit: "${verdictToSubmit}". Match this with your analysis and give me my exact corrective protocol.`;
    await handleSendMessage(promptText, verdictToSubmit);
  };

  const handleSendMessage = async (customPrompt?: string, explicitVerdict?: string) => {
    const textToSend = customPrompt || inputMsg;
    if (!textToSend.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { sender: "user", text: textToSend, time: timeNow }]);
    if (!customPrompt) setInputMsg("");
    setIsTyping(true);

    try {
      const telemetry = gatherAllAppData();
      const token = typeof window !== "undefined" ? localStorage.getItem("athena_token") : null;

      const res = await fetch("http://127.0.0.1:8000/api/v1/ai-suggestions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: textToSend,
          mode: coachMode,
          telemetry,
          userVerdict: explicitVerdict || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.data?.content || data.reply || data.coach_response;
        if (replyText) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "coach",
              text: replyText,
              time: timeNow,
              tag: explicitVerdict ? "VERDICT_SYNTHESIS" : `${coachMode.toUpperCase()}_REPLY`,
              mode: coachMode,
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
      throw new Error("Fallback needed");
    } catch {
      // Deterministic Persona-Specific Responses
      let responseText = "";
      const lower = textToSend.toLowerCase();

      if (coachMode === "strict") {
        if (explicitVerdict) {
          responseText = `Your verdict ("${explicitVerdict}") is noted. But your biometric reality shows lagging cardio and sleep inconsistency. We cut the excuses today: 1) 40 mins low-impact aerobic flush, 2) Strict 22:00 sleep curfew, 3) 2.2g/kg protein intake. Execute without question.`;
        } else if (lower.includes("sore") || lower.includes("fatigue") || lower.includes("tired")) {
          responseText = "Soreness is muscular adaptation; joint pain is technical failure. Do not skip training. Execute 20 minutes of targeted foam rolling, dynamic hip mobility, and complete Zone 2 aerobic flush. Zero excuses.";
        } else {
          responseText = `Readiness is ${readiness}/100. That gives you no excuse for sloppy mechanics. Lock out every repetition with precision or don't count the set.`;
        }
      } else if (coachMode === "professional") {
        if (explicitVerdict) {
          responseText = `Synthesizing your verdict with physiological indicators: your reported fatigue correlates with elevated hs-CRP and a 5.5h sleep window, blunting growth hormone release. Immediate prescription: Zone 2 cardiac recovery (HR 125-140 bpm) and magnesium glycinate pre-sleep.`;
        } else {
          responseText = `Your Digital Twin telemetry reflects autonomic equilibrium with Readiness at ${readiness}/100. Heart rate variability and musculoskeletal tolerance recommend steady-state moderate stimulus today.`;
        }
      } else if (coachMode === "lenient") {
        responseText = "You're making steady, awesome progress. Don't beat yourself up for having off-days. Listen to your body, prioritize restorative rest, and we'll hit your goals sustainably together!";
      } else if (coachMode === "dietitian") {
        responseText = `Dietitian Protocol for ${athleteWeight}kg athlete (${trainingGoal.toUpperCase()}): Target ${customMacroTarget?.calories} kcal/day. Distribution: ${customMacroTarget?.protein}g Protein, ${customMacroTarget?.carbs}g Complex Carbs, ${customMacroTarget?.fats}g Healthy Fats, and ${customMacroTarget?.waterLiters}L Hydration.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "coach", text: responseText, time: timeNow, tag: `${coachMode.toUpperCase()}_PROTOCOL`, mode: coachMode },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Head Performance Mentor &bull; Adaptive AI Intelligence
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            Coach Jack
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border font-mono uppercase ${
                coachMode === "strict"
                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                  : coachMode === "professional"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  : coachMode === "dietitian"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-purple-500/20 text-purple-300 border-purple-500/40"
              }`}
            >
              Mode: {coachMode}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Groq Engine (120B / 27B)
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Collects holistic telemetry from all app subsystems, audits weaknesses, interrogates your unfitness verdict, and synthesizes bespoke protocols.
          </p>
        </div>

        {/* MODE SELECTOR PILLS */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleModeChange("strict")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              coachMode === "strict"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Strict
          </button>
          <button
            onClick={() => handleModeChange("professional")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              coachMode === "professional"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Professional
          </button>
          <button
            onClick={() => handleModeChange("dietitian")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              coachMode === "dietitian"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Dietitian
          </button>
          <button
            onClick={() => handleModeChange("lenient")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              coachMode === "lenient"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Supportive
          </button>
        </div>
      </div>

      {/* HOLISTIC DIAGNOSTIC & UNFITNESS VERDICT BANNER */}
      <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Cross-App Biometric Audit &amp; Verdict Matching
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Active Telemetry Harvest
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Coach Jack cross-examines your Digital Twin, Readiness (74), hs-CRP, and CV Kinematics against your own verdict.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleRunDiagnosticAudit}
            disabled={isAuditing}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 shrink-0 w-full md:w-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
            Run Unfitness Diagnostic Audit
          </button>
          <button
            onClick={() => setShowVerdictStudio(!showVerdictStudio)}
            className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            {showVerdictStudio ? "Close Verdict Studio" : "Open Verdict Studio"}
          </button>
        </div>
      </div>

      {/* EXPANDABLE UNFITNESS VERDICT STUDIO */}
      {showVerdictStudio && (
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-amber-500/40 space-y-4 animate-in fade-in slide-in-from-top duration-300 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Athlete Verdict Submission: Why Are You Unfit / Struggling?
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              Matched against: Twin v1 &bull; Sleep: 7.8h &bull; hs-CRP: 0.8
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tell Coach Jack in your own words why you think your cardio, stamina, or flexibility is lagging. Are you battling sleep deficits, work stress, knee/joint pain, or poor nutrition? Coach Jack will match your self-assessment against the physical numbers.
          </p>

          {/* Quick Preset Verdict Chips */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="text-slate-400 self-center font-mono text-[10px]">Quick Presets:</span>
            {[
              "Late work shifts and sleep deprivation (under 6h)",
              "Knee/joint soreness when running on hard surfaces",
              "Skipping cardio intervals due to breathing fatigue",
              "Dietary inconsistency & high-sugar stress snacking",
            ].map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => setUserVerdict(preset)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-lg text-slate-300 transition-all text-[11px]"
              >
                &ldquo;{preset}&rdquo;
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              rows={2}
              value={userVerdict}
              onChange={(e) => setUserVerdict(e.target.value)}
              placeholder="State your verdict here (e.g. 'I’ve been working 12-hour shifts, sleeping only 5.5 hours, and my knees flare up on pavement...')"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
            <button
              onClick={handleSubmitVerdict}
              disabled={!userVerdict.trim() || isTyping}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 self-end sm:self-stretch"
            >
              <Check className="w-4 h-4" />
              Submit Verdict &amp; Match
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Mode Tools & Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Coach Jack Persona Card */}
          <div className="athena-card p-5 space-y-4 border-slate-700 bg-slate-900/80 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10 shrink-0 bg-slate-950">
                <img
                  src="/jack.jpg"
                  alt="Coach Jack"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
              </div>
              <div>
                <div className="text-base font-bold text-white flex items-center gap-1.5">
                  Coach Jack
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs text-amber-400 font-mono">
                  {coachMode === "strict" && "Strict High-Performance Mentor"}
                  {coachMode === "professional" && "Sports Scientist & Physiologist"}
                  {coachMode === "dietitian" && "Elite Athletic Dietitian"}
                  {coachMode === "lenient" && "Holistic Wellness & Mindset Coach"}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {coachMode === "strict" && "Zero excuses. High standards. Form precision."}
                  {coachMode === "professional" && "Deterministic bio-telemetry and VO2 analysis."}
                  {coachMode === "dietitian" && "Macronutrient timing, glycogen resynthesis, and fueling."}
                  {coachMode === "lenient" && "Compassionate progression, sustainable habits, recovery."}
                </div>
              </div>
            </div>

            {/* DYNAMIC INTERACTIVE MODE TOOL */}
            {coachMode === "dietitian" && customMacroTarget && (
              <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    Macro &amp; Calorie Fueling Target
                  </span>
                  <span className="text-[10px] text-slate-400">{trainingGoal.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="text-slate-400 block mb-1">Bodyweight (kg)</label>
                    <input
                      type="number"
                      value={athleteWeight}
                      onChange={(e) => setAthleteWeight(parseFloat(e.target.value) || 70)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Training Objective</label>
                    <select
                      value={trainingGoal}
                      onChange={(e: any) => setTrainingGoal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    >
                      <option value="hypertrophy">Muscle Hypertrophy</option>
                      <option value="endurance">Endurance &amp; Stamina</option>
                      <option value="fat_loss">Athletic Leaning</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Macro Distribution Cards */}
                <div className="grid grid-cols-4 gap-1.5 text-center pt-1 font-mono">
                  <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Calories</div>
                    <div className="text-xs font-bold text-white mt-0.5">{customMacroTarget.calories}</div>
                  </div>
                  <div className="p-2 bg-blue-950/40 rounded-lg border border-blue-500/30">
                    <div className="text-[10px] text-blue-400">Protein</div>
                    <div className="text-xs font-bold text-blue-300 mt-0.5">{customMacroTarget.protein}g</div>
                  </div>
                  <div className="p-2 bg-amber-950/40 rounded-lg border border-amber-500/30">
                    <div className="text-[10px] text-amber-400">Carbs</div>
                    <div className="text-xs font-bold text-amber-300 mt-0.5">{customMacroTarget.carbs}g</div>
                  </div>
                  <div className="p-2 bg-purple-950/40 rounded-lg border border-purple-500/30">
                    <div className="text-[10px] text-purple-400">Fats</div>
                    <div className="text-xs font-bold text-purple-300 mt-0.5">{customMacroTarget.fats}g</div>
                  </div>
                </div>
              </div>
            )}

            {coachMode === "strict" && (
              <div className="p-3.5 bg-red-950/30 rounded-xl border border-red-500/30 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs font-bold text-red-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Form &amp; Biomechanics Audit
                  </span>
                  <span className="text-[10px] text-red-400">ZERO EXCUSES</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  &ldquo;Squat depth must break parallel (&lt;90°). Any knee collapse or pelvic wink invalidates the repetition immediately.&rdquo;
                </div>
              </div>
            )}

            {/* Quick Action Prompt Chips */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Suggested Interrogations ({coachMode.toUpperCase()})
              </div>

              {coachMode === "strict" && (
                <>
                  <button
                    onClick={() => handleSendMessage("Audit my workout intensity today and tell me if I am slacking.")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Audit my workout intensity&rdquo;</span>
                    <span className="text-[10px] font-mono text-red-400">DISCIPLINE</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("What form deviations am I most prone to when lifting under fatigue?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Call out my form deviations&rdquo;</span>
                    <span className="text-[10px] font-mono text-red-400">CRITIQUE</span>
                  </button>
                </>
              )}

              {coachMode === "professional" && (
                <>
                  <button
                    onClick={() => handleSendMessage("What is the scientific correlation between my readiness score and peak power output?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Readiness vs Peak Power Science&rdquo;</span>
                    <span className="text-[10px] font-mono text-blue-400">METRIC</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("How does Zone 2 cardiovascular volume affect my lactate clearance threshold?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Lactate threshold &amp; aerobic base&rdquo;</span>
                    <span className="text-[10px] font-mono text-blue-400">PHYSIO</span>
                  </button>
                </>
              )}

              {coachMode === "dietitian" && (
                <>
                  <button
                    onClick={() => handleSendMessage(`Calculate my exact pre-workout and post-workout carbohydrate grams for my ${athleteWeight}kg bodyweight.`)}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Exact carb &amp; protein grams for workout&rdquo;</span>
                    <span className="text-[10px] font-mono text-emerald-400">NUTRITION</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("What is the best hydration and electrolyte protocol during hot weather training?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Electrolyte &amp; sodium balance protocol&rdquo;</span>
                    <span className="text-[10px] font-mono text-emerald-400">HYDRATION</span>
                  </button>
                </>
              )}

              {coachMode === "lenient" && (
                <>
                  <button
                    onClick={() => handleSendMessage("I am feeling mentally exhausted today. How can I stay active without stressing out?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Gentle restorative workout today&rdquo;</span>
                    <span className="text-[10px] font-mono text-purple-400">WELLNESS</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("How can I build a healthier relationship with food and fitness consistency?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between w-full"
                  >
                    <span>&ldquo;Sustainable lifestyle habits&rdquo;</span>
                    <span className="text-[10px] font-mono text-purple-400">MINDSET</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Coach Jack Conversational Window (7 cols) */}
        <div className="lg:col-span-7 athena-card flex flex-col h-[640px] border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-amber-500/50 bg-slate-900 shrink-0">
                <img src="/jack.jpg" alt="Jack" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Coach Jack
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase ${
                      coachMode === "strict"
                        ? "bg-red-500/20 text-red-300"
                        : coachMode === "professional"
                        ? "bg-blue-500/20 text-blue-300"
                        : coachMode === "dietitian"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {coachMode}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Groq 120B &bull; Full Biometric Grounding
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVerdictStudio(!showVerdictStudio)}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                Verdict Studio
              </button>
              <button
                onClick={clearChat}
                className="px-2.5 py-1 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded border border-transparent hover:border-red-900/50 text-[11px] font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-900 border border-slate-800/80 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {m.sender === "coach" && (
                    <div className="text-[10px] font-mono text-amber-400 font-bold mb-1 tracking-wider uppercase flex items-center gap-1">
                      <span>COACH JACK ({m.mode?.toUpperCase() || coachMode.toUpperCase()})</span>
                      {m.tag && (
                        <span className="text-[9px] text-slate-500 font-normal">
                          [{m.tag}]
                        </span>
                      )}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-600 mt-1 font-mono px-1">
                  {m.time}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono italic p-2 bg-slate-900/40 rounded-lg w-fit border border-slate-800/50">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150"></span>
                Coach Jack is analyzing all telemetry &amp; calculating {coachMode} protocol...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask Coach Jack (${coachMode} advice, why you're unfit, nutrition)...`}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMsg.trim() || isTyping}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 text-center font-mono">
              Current Persona: <strong className="text-slate-300 uppercase">{coachMode}</strong> &bull; Biometric Telemetry Linked &bull; Groq Ultra-Fast Inference
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
