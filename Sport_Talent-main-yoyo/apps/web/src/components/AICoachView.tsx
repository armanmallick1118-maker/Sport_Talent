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
  Target,
  ArrowRight,
} from "lucide-react";

export interface MilestoneItem {
  id: string;
  week: number;
  label: string;
  targetMetric?: string;
  completed: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  category: "ENDURANCE" | "STRENGTH" | "MOBILITY" | "BODY_COMP" | "AGILITY" | "RECOVERY";
  target: string;
  current: string;
  baseline: string;
  unit: string;
  timeline_weeks: number;
  current_week: number;
  progress_percentage: number;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  milestones: MilestoneItem[];
  weekly_actions: string[];
  notes?: string;
  createdAt: string;
}

interface AICoachProps {
  recommendation?: any;
  readinessData?: any;
  twinData?: any;
  onNavigate?: (view: any) => void;
}

export type CoachMode = "strict" | "professional" | "lenient" | "dietitian";

export const AICoachView: React.FC<AICoachProps> = ({
  recommendation,
  readinessData,
  twinData,
  onNavigate,
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

  // Goal Engine Formulation & Sync State
  const [showGoalSynthesizer, setShowGoalSynthesizer] = useState(false);
  const [goalCustomPrompt, setGoalCustomPrompt] = useState("");
  const [goalNotification, setGoalNotification] = useState<string | null>(null);

  // Navigate to Goal Engine helper
  const handleNavigateToGoals = () => {
    try {
      localStorage.setItem("prana_initial_view", "goals");
    } catch {}
    if (onNavigate) {
      onNavigate("goals");
    } else {
      window.location.href = "/dashboard?view=goals";
    }
  };

  // Helper to persist goals into prana_user_goals
  const transferGoalToEngine = (goal: GoalItem): boolean => {
    try {
      const raw = localStorage.getItem("prana_user_goals");
      let currentGoals: GoalItem[] = [];
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) currentGoals = parsed;
        } catch {}
      }
      currentGoals = currentGoals.filter((g) => g.id !== goal.id && g.title !== goal.title);
      currentGoals.unshift(goal);
      localStorage.setItem("prana_user_goals", JSON.stringify(currentGoals));
      window.dispatchEvent(new Event("prana_goals_updated"));
      return true;
    } catch (err) {
      console.error("Failed to sync goal to PRANA Goal Engine:", err);
      return false;
    }
  };

  // Helper to generate a structured GoalItem from natural language intent
  const generateGoalFromIntent = (prompt: string, mode: CoachMode): GoalItem => {
    const lower = prompt.toLowerCase();
    const nowStr = new Date().toISOString().split("T")[0];
    const id = "coach_goal_" + Date.now();

    if (
      lower.includes("5k") ||
      lower.includes("run") ||
      lower.includes("cardio") ||
      lower.includes("endurance") ||
      lower.includes("marathon")
    ) {
      return {
        id,
        title: "Sub-24 Min 5km Aerobic Engine Progression",
        category: "ENDURANCE",
        baseline: "32.0",
        current: "27.5",
        target: "24.0",
        unit: "mins",
        timeline_weeks: 8,
        current_week: 1,
        progress_percentage: 45,
        status: "ACTIVE",
        milestones: [
          { id: "m1", week: 2, label: "Aerobic Base: Complete 4km non-stop at 5:45/km", completed: true },
          { id: "m2", week: 4, label: "Tempo Integration: 3x1.5km at 5:10/km pace", completed: false },
          { id: "m3", week: 6, label: "VO2 Max Intervals: 6x400m at 4:35/km", completed: false },
          { id: "m4", week: 8, label: "Race Day Assessment: Sub-24:00 5km Continuous", completed: false },
        ],
        weekly_actions: [
          "3 weekly aerobic sessions (1 Long Run, 1 Interval, 1 Recovery)",
          "Post-run hip mobility and calf eccentrics for 12 mins",
          "Target 7.5h minimum restorative sleep window",
        ],
        notes: `Formulated by Coach Jack in [${mode.toUpperCase()}] mode. Grounded in PRANA Cardio telemetry.`,
        createdAt: nowStr,
      };
    } else if (lower.includes("pull") || lower.includes("calisthenic") || lower.includes("reps")) {
      return {
        id,
        title: "Upper Body Calisthenics: 20 Strict Pull-Ups",
        category: "STRENGTH",
        baseline: "6",
        current: "12",
        target: "20",
        unit: "reps",
        timeline_weeks: 10,
        current_week: 1,
        progress_percentage: 42,
        status: "ACTIVE",
        milestones: [
          { id: "m1", week: 2, label: "Scapular retraction holds & 3x8 clean dead-hang reps", completed: true },
          { id: "m2", week: 5, label: "Weighted pull-up overload: 5 reps with +10kg belt", completed: false },
          { id: "m3", week: 8, label: "Volume ladder: 3 unbroken sets of 15 strict reps", completed: false },
          { id: "m4", week: 10, label: "Test day: 20 consecutive full-range strict pull-ups", completed: false },
        ],
        weekly_actions: [
          "3 weekly pulling sessions (Weighted, Eccentric, Volume)",
          "Forearm and grip endurance dead hangs 3x60s",
          "Daily 2.0g/kg protein target for myofibrillar repair",
        ],
        notes: `Formulated by Coach Jack in [${mode.toUpperCase()}] mode.`,
        createdAt: nowStr,
      };
    } else if (
      lower.includes("bench") ||
      lower.includes("strength") ||
      lower.includes("squat") ||
      lower.includes("deadlift") ||
      lower.includes("press")
    ) {
      return {
        id,
        title: "Century Bench Press: 100kg 1RM Protocol",
        category: "STRENGTH",
        baseline: "75.0",
        current: "85.0",
        target: "100.0",
        unit: "kg",
        timeline_weeks: 8,
        current_week: 1,
        progress_percentage: 40,
        status: "ACTIVE",
        milestones: [
          { id: "m1", week: 2, label: "Solidify arch & 5x5 at 80kg with 1-second pause", completed: true },
          { id: "m2", week: 4, label: "Clean 90kg single with zero elbow flare", completed: false },
          { id: "m3", week: 6, label: "Overload drill: 95kg for 2 clean reps with spotter", completed: false },
          { id: "m4", week: 8, label: "Official PR Test: 100kg 1-Rep Max lockout", completed: false },
        ],
        weekly_actions: [
          "2 heavy bench sessions + 1 tricep & front delt accessory day",
          "Band face-pulls & external shoulder rotations before pressing",
          "5g daily creatine monohydrate adherence",
        ],
        notes: `Formulated by Coach Jack in [${mode.toUpperCase()}] mode.`,
        createdAt: nowStr,
      };
    } else if (
      lower.includes("fat") ||
      lower.includes("weight") ||
      lower.includes("diet") ||
      lower.includes("lean") ||
      lower.includes("cut")
    ) {
      return {
        id,
        title: "Sub-15% Body Fat & Metabolic Partitioning",
        category: "BODY_COMP",
        baseline: "21.5",
        current: "18.5",
        target: "14.5",
        unit: "% body fat",
        timeline_weeks: 12,
        current_week: 1,
        progress_percentage: 42,
        status: "ACTIVE",
        milestones: [
          { id: "m1", week: 3, label: "Establish 350 kcal deficit with 10k daily step baseline", completed: true },
          { id: "m2", week: 6, label: "Cross under 17% mark with preserved lean tissue mass", completed: false },
          { id: "m3", week: 9, label: "Refeed protocol & metabolic rate stabilization", completed: false },
          { id: "m4", week: 12, label: "Target 14.5% body composition achievement", completed: false },
        ],
        weekly_actions: [
          "4 resistance training workouts + 2 low-intensity cardio sessions",
          "Log all meals inside PRANA Nutrition Hub with 2.2g/kg protein",
          "Daily morning fasted weigh-in and hydration logging",
        ],
        notes: `Formulated by Coach Jack in [${mode.toUpperCase()}] mode.`,
        createdAt: nowStr,
      };
    } else if (
      lower.includes("mobility") ||
      lower.includes("flexib") ||
      lower.includes("posture") ||
      lower.includes("stretch")
    ) {
      return {
        id,
        title: "Full Thoracic & Hip Mobility Restoration",
        category: "MOBILITY",
        baseline: "50",
        current: "65",
        target: "100",
        unit: "index",
        timeline_weeks: 6,
        current_week: 1,
        progress_percentage: 30,
        status: "ACTIVE",
        milestones: [
          { id: "m1", week: 2, label: "Palms to floor straight-leg forward fold hold", completed: true },
          { id: "m2", week: 4, label: "Full 2-minute unassisted deep Asian squat hold", completed: false },
          { id: "m3", week: 6, label: "Overhead squat with straight thoracic spine lock", completed: false },
        ],
        weekly_actions: [
          "Daily 10-minute morning dynamic hip opener routine",
          "Foam roll thoracic spine and adductors prior to workouts",
          "Evening restorative pigeon and couch stretch holds",
        ],
        notes: `Formulated by Coach Jack in [${mode.toUpperCase()}] mode.`,
        createdAt: nowStr,
      };
    } else {
      return {
        id,
        title: prompt.length > 5 && prompt.length < 50 ? prompt : "Comprehensive Athletic Peak Conditioning",
        category: "ENDURANCE",
        baseline: "60.0",
        current: "72.0",
        target: "90.0",
        unit: "pts",
        timeline_weeks: 8,
        current_week: 1,
        progress_percentage: 40,
        status: "ACTIVE",
        milestones: [
          { id: "m1", week: 2, label: "Foundation & movement pattern optimization", completed: true },
          { id: "m2", week: 4, label: "Progressive intensity overload threshold", completed: false },
          { id: "m3", week: 6, label: "High-output endurance stamina test", completed: false },
          { id: "m4", week: 8, label: "Target peak performance assessment", completed: false },
        ],
        weekly_actions: [
          "4 structured workouts weekly aligned with PRANA Twin telemetry",
          "Active post-exercise recovery and hydration tracking",
          "Weekly metric check-in and milestone verification",
        ],
        notes: `Formulated by Coach Jack in [${mode.toUpperCase()}] mode.`,
        createdAt: nowStr,
      };
    }
  };

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
    { sender: "coach" | "user"; text: string; time: string; tag?: string; mode?: CoachMode; goalData?: GoalItem }[]
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

  const handleSendMessage = async (customPrompt?: string, explicitVerdict?: string, isGoalFormulation?: boolean) => {
    const textToSend = customPrompt || inputMsg;
    if (!textToSend.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { sender: "user", text: textToSend, time: timeNow }]);
    if (!customPrompt) setInputMsg("");
    setIsTyping(true);

    const lower = textToSend.toLowerCase();
    const isGoal =
      Boolean(isGoalFormulation) ||
      lower.includes("goal") ||
      lower.includes("plan for") ||
      lower.includes("plan to") ||
      lower.includes("target of") ||
      lower.includes("sub-2") ||
      lower.includes("sub-1") ||
      lower.includes("pull-up") ||
      lower.includes("pull up") ||
      lower.includes("bench press") ||
      lower.includes("body fat") ||
      lower.includes("weight loss goal") ||
      lower.includes("mobility goal");

    let synthesizedGoal: GoalItem | undefined;
    if (isGoal) {
      synthesizedGoal = generateGoalFromIntent(textToSend, coachMode);
      transferGoalToEngine(synthesizedGoal);
      setGoalNotification(`🎯 Goal "${synthesizedGoal.title}" automatically transferred to PRANA Goal Engine!`);
      setTimeout(() => setGoalNotification(null), 5000);
    }

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
        let replyText = data.data?.content || data.reply || data.coach_response;
        if (replyText) {
          if (synthesizedGoal) {
            replyText = `🎯 PROTOCOL SYNCHRONIZED & TRANSFERRED TO PRANA GOAL ENGINE.\n\n${replyText}`;
          }
          setMessages((prev) => [
            ...prev,
            {
              sender: "coach",
              text: replyText,
              time: timeNow,
              tag: synthesizedGoal ? "GOAL_ENGINE_SYNCED" : (explicitVerdict ? "VERDICT_SYNTHESIS" : `${coachMode.toUpperCase()}_REPLY`),
              mode: coachMode,
              goalData: synthesizedGoal,
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

      if (synthesizedGoal) {
        if (coachMode === "strict") {
          responseText = `🎯 TARGET LOCKED & TRANSFERRED TO PRANA GOAL ENGINE.\n\nI have formulated your "${synthesizedGoal.title}" protocol into a strict ${synthesizedGoal.timeline_weeks}-week progression. Baseline: ${synthesizedGoal.baseline} ${synthesizedGoal.unit} ➔ Target: ${synthesizedGoal.target} ${synthesizedGoal.unit}.\n\nYour 4 phase milestones and weekly disciplines have been synchronized into your Goal Engine. Stop talking and start executing.`;
        } else if (coachMode === "professional") {
          responseText = `🎯 PROTOCOL SYNCHRONIZED WITH PRANA GOAL ENGINE.\n\nDeterministic ${synthesizedGoal.timeline_weeks}-week trajectory established for "${synthesizedGoal.title}". Calibrated for target ${synthesizedGoal.target} ${synthesizedGoal.unit} with baseline ${synthesizedGoal.baseline} ${synthesizedGoal.unit}. Milestones and weekly neuromuscular actions have been saved directly to your Goal Engine.`;
        } else if (coachMode === "dietitian") {
          responseText = `🎯 NUTRITION & METABOLIC TARGET SYNCED.\n\nYour "${synthesizedGoal.title}" protocol is registered. Progressive weekly actions and body composition thresholds have been committed to your PRANA Goal Engine.`;
        } else {
          responseText = `🎯 EXCELLENT GOAL! TRANSFERRED TO GOAL ENGINE.\n\nI've mapped out a motivating ${synthesizedGoal.timeline_weeks}-week plan for "${synthesizedGoal.title}". We're targeting ${synthesizedGoal.target} ${synthesizedGoal.unit}. Your milestones are ready in your Goal Engine!`;
        }
      } else if (coachMode === "strict") {
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
        {
          sender: "coach",
          text: responseText,
          time: timeNow,
          tag: synthesizedGoal ? "GOAL_ENGINE_SYNCED" : `${coachMode.toUpperCase()}_PROTOCOL`,
          mode: coachMode,
          goalData: synthesizedGoal,
        },
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
            onClick={() => setShowGoalSynthesizer(!showGoalSynthesizer)}
            className="px-3.5 py-2.5 bg-[#111815] hover:bg-[#1A231F] border border-[#B7F34A]/50 text-[#B7F34A] hover:text-[#c9ff5e] font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <Target className="w-3.5 h-3.5 text-[#B7F34A]" />
            {showGoalSynthesizer ? "Close Goal Studio" : "Formulate Goal Protocol"}
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

      {/* REAL-TIME GOAL TRANSFER NOTIFICATION */}
      {goalNotification && (
        <div className="p-3.5 bg-[#111815] border border-[#B7F34A]/60 rounded-xl flex items-center justify-between gap-3 text-xs text-[#B7F34A] animate-in fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#B7F34A] shrink-0" />
            <span className="font-semibold text-white">{goalNotification}</span>
          </div>
          <button
            onClick={handleNavigateToGoals}
            className="px-3 py-1.5 bg-[#B7F34A] text-[#0B100E] font-bold text-xs rounded-lg hover:bg-[#c9ff5e] transition-colors flex items-center gap-1 shrink-0"
          >
            <span>Open Goal Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* EXPANDABLE GOAL PROTOCOL SYNTHESIZER STUDIO */}
      {showGoalSynthesizer && (
        <div className="p-5 bg-[#0B100E] rounded-2xl border border-[#B7F34A]/40 space-y-4 animate-in fade-in slide-in-from-top duration-300 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#27332D] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B7F34A] animate-pulse"></span>
              <h4 className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Coach Jack Goal Engine Auto-Transfer Studio
              </h4>
            </div>
            <span className="text-[11px] font-mono text-[#A4AEA8]">
              Direct Sync to PRANA Goal Engine
            </span>
          </div>

          <p className="text-xs text-[#A4AEA8] leading-relaxed">
            Select an athletic preset or enter your target. Coach Jack will calibrate the progressive overload milestones according to your Digital Twin telemetry and morning readiness score, then automatically lock and transfer it straight into your <strong className="text-white">PRANA Goal Engine</strong>.
          </p>

          {/* Athletic Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              {
                title: "Sub-24 Min 5km Aerobic Engine",
                category: "ENDURANCE",
                metric: "24.0 mins",
                prompt: "Synthesize an 8-week Sub-24 Min 5km Aerobic Engine progression protocol for me and transfer to Goal Engine.",
              },
              {
                title: "Upper Body: 20 Strict Pull-Ups",
                category: "STRENGTH",
                metric: "20 reps",
                prompt: "Formulate a 10-week protocol to reach 20 strict full-range pull-ups and sync it with Goal Engine.",
              },
              {
                title: "Century Bench Press (100kg 1RM)",
                category: "STRENGTH",
                metric: "100.0 kg",
                prompt: "Create an 8-week progressive overload protocol to hit a 100kg 1-Rep Max bench press.",
              },
              {
                title: "Sub-15% Body Fat Definition",
                category: "BODY_COMP",
                metric: "14.5% BF",
                prompt: "Synthesize a 12-week nutritional deficit and metabolic partitioning goal to achieve 14.5% body fat.",
              },
              {
                title: "Deep Squat & Hip Mobility Restore",
                category: "MOBILITY",
                metric: "100/100 index",
                prompt: "Formulate a 6-week mobility restoration goal to master full-depth unassisted squats and thoracic extension.",
              },
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setShowGoalSynthesizer(false);
                  handleSendMessage(preset.prompt, undefined, true);
                }}
                className="text-left p-3 rounded-xl bg-[#111815] hover:bg-[#1A231F] border border-[#27332D] hover:border-[#B7F34A]/60 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#A4AEA8] mb-1">
                  <span className="text-[#B7F34A]">{preset.category}</span>
                  <span className="text-white font-bold">{preset.metric}</span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-[#B7F34A] transition-colors">
                  {preset.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <span>Synthesize &amp; Sync</span>
                  <ArrowRight className="w-3 h-3 text-[#B7F34A] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Custom Goal Prompt */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#27332D]">
            <input
              type="text"
              placeholder="Or type custom athletic goal (e.g. Run 10km under 50 mins, 140kg Deadlift)..."
              value={goalCustomPrompt}
              onChange={(e) => setGoalCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && goalCustomPrompt.trim()) {
                  const p = goalCustomPrompt;
                  setGoalCustomPrompt("");
                  setShowGoalSynthesizer(false);
                  handleSendMessage(p, undefined, true);
                }
              }}
              className="flex-1 bg-[#111815] border border-[#27332D] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B7F34A]"
            />
            <button
              onClick={() => {
                if (goalCustomPrompt.trim()) {
                  const p = goalCustomPrompt;
                  setGoalCustomPrompt("");
                  setShowGoalSynthesizer(false);
                  handleSendMessage(p, undefined, true);
                }
              }}
              disabled={!goalCustomPrompt.trim()}
              className="px-4 py-2 bg-[#B7F34A] hover:bg-[#c9ff5e] disabled:opacity-30 text-[#0B100E] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Lock &amp; Transfer to Goal Engine</span>
            </button>
          </div>
        </div>
      )}

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

                  {/* RICH GOAL ENGINE INTEGRATION CARD */}
                  {m.goalData && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#0B100E] border border-[#B7F34A]/40 text-[#F3F5F0] space-y-2.5">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#27332D]">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#B7F34A] font-mono">
                          <Target className="w-3.5 h-3.5 text-[#B7F34A]" />
                          <span>SYNCHRONIZED TO GOAL ENGINE</span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#B7F34A]/10 text-[#B7F34A] border border-[#B7F34A]/30">
                          {m.goalData.category}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-white leading-snug">
                        {m.goalData.title}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 py-1 text-[10px] font-mono">
                        <div className="bg-[#111815] p-2 rounded-lg border border-[#27332D]">
                          <div className="text-[8px] uppercase text-slate-400">Baseline</div>
                          <div className="text-white font-bold">{m.goalData.baseline} {m.goalData.unit}</div>
                        </div>
                        <div className="bg-[#111815] p-2 rounded-lg border border-[#27332D]">
                          <div className="text-[8px] uppercase text-slate-400">Target</div>
                          <div className="text-[#B7F34A] font-bold">{m.goalData.target} {m.goalData.unit}</div>
                        </div>
                        <div className="bg-[#111815] p-2 rounded-lg border border-[#27332D]">
                          <div className="text-[8px] uppercase text-slate-400">Duration</div>
                          <div className="text-[#25D9D0] font-bold">{m.goalData.timeline_weeks} Wks</div>
                        </div>
                      </div>

                      <div className="text-[10px] space-y-1">
                        <div className="font-mono text-slate-400 uppercase text-[9px]">Weekly Disciplines:</div>
                        <ul className="space-y-0.5 text-slate-300">
                          {m.goalData.weekly_actions.slice(0, 3).map((act, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-[#B7F34A] font-bold">&bull;</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={handleNavigateToGoals}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-[#B7F34A] hover:bg-[#c9ff5e] text-[#0B100E] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>View in PRANA Goal Engine</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
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
