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
} from "lucide-react";

interface AICoachProps {
  recommendation?: any;
  readinessData?: any;
}

export type CoachMode = "strict" | "professional" | "lenient" | "dietitian";

export const AICoachView: React.FC<AICoachProps> = ({
  recommendation,
  readinessData,
}) => {
  const readiness = readinessData?.readiness_score ?? 74;

  const [coachMode, setCoachMode] = useState<CoachMode>("strict");

  // Dietitian Interactive Macro Calculator State
  const [athleteWeight, setAthleteWeight] = useState(74.5);
  const [trainingGoal, setTrainingGoal] = useState<"hypertrophy" | "endurance" | "fat_loss" | "maintenance">("hypertrophy");
  const [customMacroTarget, setCustomMacroTarget] = useState<any>(null);

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

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMsg;
    if (!textToSend.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { sender: "user", text: textToSend, time: timeNow }]);
    if (!customPrompt) setInputMsg("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/ai-suggestions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[Persona Mode: ${coachMode}] ${textToSend}`,
          mode: coachMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.data?.content || data.reply || data.coach_response;
        if (replyText) {
          setMessages((prev) => [
            ...prev,
            { sender: "coach", text: replyText, time: timeNow, tag: `${coachMode.toUpperCase()}_REPLY`, mode: coachMode },
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
        if (lower.includes("sore") || lower.includes("fatigue") || lower.includes("tired")) {
          responseText = "Soreness is muscular adaptation; joint pain is technical failure. Do not skip training. Execute 20 minutes of targeted foam rolling, dynamic hip mobility, and complete Zone 2 aerobic flush. Zero excuses.";
        } else if (lower.includes("diet") || lower.includes("food") || lower.includes("protein")) {
          responseText = "Hit 2.2g protein per kg of bodyweight. Cut out ultra-processed snacks and liquid sugars immediately. Rehydrate with 700ml electrolyte water within 30 minutes of training.";
        } else {
          responseText = `Readiness is ${readiness}/100. That gives you no excuse for sloppy mechanics. Lock out every repetition with precision or don't count the set.`;
        }
      } else if (coachMode === "professional") {
        if (lower.includes("diet") || lower.includes("nutrition")) {
          responseText = `Based on your metabolic expenditure and current bodyweight (${athleteWeight}kg), optimal glycogen resynthesis occurs with 1.2g/kg carbohydrates co-ingested with 0.4g/kg rapid-absorbing protein post-exercise.`;
        } else {
          responseText = `Your Digital Twin telemetry reflects an autonomic equilibrium with Readiness at ${readiness}/100. Heart rate variability and musculoskeletal tolerance recommend steady-state moderate stimulus today.`;
        }
      } else if (coachMode === "lenient") {
        if (lower.includes("tired") || lower.includes("sore")) {
          responseText = "Take it easy today! You've been working hard. If your body is feeling heavy, a gentle walk, some stretching, and an extra hour of sleep will do wonders. Recovery is where growth happens.";
        } else {
          responseText = "You're making steady, awesome progress. Don't worry about hitting personal records every single day. Consistency and enjoying the journey are what truly build lifelong health!";
        }
      } else if (coachMode === "dietitian") {
        responseText = `Dietitian Protocol for ${athleteWeight}kg athlete (${trainingGoal.toUpperCase()}): Target ${customMacroTarget?.calories} kcal/day. Distribution: ${customMacroTarget?.protein}g Protein (4x intervals), ${customMacroTarget?.carbs}g Complex Carbs, ${customMacroTarget?.fats}g Healthy Fats, and ${customMacroTarget?.waterLiters}L Hydration minimum.`;
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
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Toggle between strict discipline, evidence-based sports science, compassionate coaching, or elite sports dietetics.
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

                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Droplet className="w-3 h-3" />
                  Hydration Target: {customMacroTarget.waterLiters} Liters/day (Electrolytes recommended)
                </div>
              </div>
            )}

            {coachMode === "strict" && (
              <div className="p-3.5 bg-red-950/30 rounded-xl border border-red-500/30 space-y-2 text-xs animate-in fade-in duration-300">
                <div className="text-xs font-bold text-red-400 uppercase font-mono flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Strict Discipline &amp; Form Penalties
                </div>
                <div className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <div>&bull; <strong>Rep Invalidation</strong>: Any squat shallower than 90&deg; knee angle on the CV camera will be discounted.</div>
                  <div>&bull; <strong>Rest Adherence</strong>: Do not exceed 90 seconds between sets; keep density high.</div>
                </div>
              </div>
            )}

            {coachMode === "professional" && (
              <div className="p-3.5 bg-blue-950/30 rounded-xl border border-blue-500/30 space-y-2 text-xs animate-in fade-in duration-300">
                <div className="text-xs font-bold text-blue-400 uppercase font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Physiological Index Matrix
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Autonomic Readiness</span>
                    <span className="text-emerald-400 font-mono font-bold">{readiness}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Glycogen Resynthesis Capacity</span>
                    <span className="text-blue-300 font-mono">HIGH (Post-Prandial)</span>
                  </div>
                </div>
              </div>
            )}

            {coachMode === "lenient" && (
              <div className="p-3.5 bg-purple-950/30 rounded-xl border border-purple-500/30 space-y-2 text-xs animate-in fade-in duration-300">
                <div className="text-xs font-bold text-purple-400 uppercase font-mono flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  Gentle Mindset &amp; Body Check-In
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Celebrate showing up today. Whether you complete 10 minutes or 30 minutes, consistency and honoring your body is what creates true longevity.
                </p>
              </div>
            )}
          </div>

          {/* Mode-Specific Suggested Inquiries */}
          <div className="athena-card p-4 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono tracking-wider">
              Suggested {coachMode.toUpperCase()} Inquiries
            </div>
            <div className="flex flex-col gap-2">
              {coachMode === "strict" && (
                <>
                  <button
                    onClick={() => handleSendMessage("Audit my workout intensity: Am I pushing hard enough or wasting volume?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
                  >
                    <span>&ldquo;Audit my workout intensity&rdquo;</span>
                    <span className="text-[10px] font-mono text-red-400">STRICT</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("What form deviations am I most prone to when lifting under fatigue?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
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
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
                  >
                    <span>&ldquo;Readiness vs Peak Power Science&rdquo;</span>
                    <span className="text-[10px] font-mono text-blue-400">METRIC</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("How does Zone 2 cardiovascular volume affect my lactate clearance threshold?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
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
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
                  >
                    <span>&ldquo;Exact carb &amp; protein grams for workout&rdquo;</span>
                    <span className="text-[10px] font-mono text-emerald-400">NUTRITION</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("What is the best hydration and electrolyte protocol during hot weather training?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
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
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
                  >
                    <span>&ldquo;Gentle restorative workout today&rdquo;</span>
                    <span className="text-[10px] font-mono text-purple-400">WELLNESS</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("How can I build a healthier relationship with food and fitness consistency?")}
                    className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center justify-between"
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
        <div className="lg:col-span-7 athena-card flex flex-col h-[580px] border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
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
                  Adaptive Intelligence &bull; Live Telemetry Linked
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-2.5 py-1 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded border border-transparent hover:border-red-900/50 text-[11px] font-medium transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Reset Log
            </button>
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
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg ${
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
                Coach Jack is calculating {coachMode} recommendations...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask Coach Jack (${coachMode} advice, nutrition plans, recovery)...`}
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
              Current Persona: <strong className="text-slate-300 uppercase">{coachMode}</strong> &bull; Personalized to your Digital Twin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
