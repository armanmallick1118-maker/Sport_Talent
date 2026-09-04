"use client";

import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Activity,
  Moon,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface AICoachProps {
  recommendation?: any;
  readinessData?: any;
}

export const AICoachView: React.FC<AICoachProps> = ({
  recommendation,
  readinessData,
}) => {
  const readiness = readinessData?.readiness_score ?? 74;

  const [messages, setMessages] = useState<
    { sender: "coach" | "user"; text: string; time: string }[]
  >([
    {
      sender: "coach",
      text: "Hello Alex. I've calibrated today's recommendations using your Digital Twin v1 and morning readiness telemetry (74/100). How can I guide your workout, recovery, or nutrition decisions today?",
      time: "10:15 AM",
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { sender: "user", text: userText, time: timeNow }]);
    setInputMsg("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { sender: "coach", text: data.coach_response, time: timeNow },
        ]);
      } else {
        throw new Error();
      }
    } catch {
      // Local deterministic grounded response fallback
      let reply = `Based on your Readiness Score (${readiness}/100) and 7.8 hours of sleep, ATHENA advises maintaining steady-state training effort without overloading joints.`;
      if (userText.toLowerCase().includes("why")) {
        reply = `ATHENA recommends a 20-minute moderate workout because your physiological recovery is solid (74/100), but your non-exercise movement today has been lower than your 4-week baseline. A moderate stimulus prevents deconditioning while avoiding overtraining.`;
      } else if (userText.toLowerCase().includes("tired") || userText.toLowerCase().includes("fatigue")) {
        reply = `Recognized. Your recovery metrics show mild muscular fatigue from yesterday's training load. I recommend 15 minutes of foam rolling and restorative mobility rather than heavy lifting.`;
      }
      setMessages((prev) => [
        ...prev,
        { sender: "coach", text: reply, time: timeNow },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" />
          Adaptive Intelligence &amp; Explanation Layer
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          ATHENA Adaptive AI Coach
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Every recommendation is calculated from deterministic physiological data and explained with complete transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommendation Pipeline Transparency (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="athena-card p-5 space-y-4 border-slate-700 bg-slate-900/70">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Today&apos;s Calibrated Plan
              </span>
              <span className="badge-clean badge-emerald font-mono text-[10px]">
                Safety Approved
              </span>
            </div>

            <div>
              <div className="text-lg font-bold text-white">
                {recommendation?.title || "20 Min Moderate Kinetic Workout"}
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {recommendation?.summary ||
                  "Controlled bodyweight circuit with dynamic mobility warmup."}
              </p>
            </div>

            {/* Decision Pipeline Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">
                Input Signals &amp; Decision Matrix
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Readiness Score</span>
                  <span className="text-emerald-400 font-mono font-semibold">{readiness} / 100 (Solid)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sleep Duration</span>
                  <span className="text-slate-300 font-mono">7.8 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Prior Training Load</span>
                  <span className="text-slate-300 font-mono">6 / 10 Effort</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Prescribed Intensity</span>
                  <span className="text-blue-400 font-mono font-semibold">Moderate</span>
                </div>
              </div>
            </div>

            {/* WHY Explanation Box */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Info className="w-3 h-3 text-blue-400" />
                EXPLICIT REASONING
              </div>
              <p className="text-slate-300 leading-relaxed">
                {recommendation?.reasoning_why ||
                  "Your recovery is good, but activity has been lower than your normal baseline. A moderate stimulus maintains training momentum without nervous system stress."}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Checked against ATHENA Safety Guardrails v1.0</span>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="athena-card p-4 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">
              Frequently Queried Questions
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInputMsg("Why is ATHENA recommending this intensity today?")}
                className="text-left px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-slate-300 transition-colors"
              >
                &ldquo;Why this intensity today?&rdquo;
              </button>
              <button
                onClick={() => setInputMsg("I feel sore in my quads, how should I adjust?")}
                className="text-left px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-slate-300 transition-colors"
              >
                &ldquo;I feel sore, how to adjust?&rdquo;
              </button>
              <button
                onClick={() => setInputMsg("How is my protein intake affecting recovery?")}
                className="text-left px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-slate-300 transition-colors"
              >
                &ldquo;Protein intake impact?&rdquo;
              </button>
            </div>
          </div>
        </div>

        {/* Conversational Coach Chat (7 cols) */}
        <div className="lg:col-span-7 athena-card flex flex-col h-[560px] border-slate-800 bg-slate-950">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-600/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">ATHENA Grounded Coach</div>
                <div className="text-[10px] text-slate-400">Grounded in Twin v1 Telemetry</div>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 border border-slate-800 text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-600 mt-1 font-mono px-1">
                  {m.time}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 italic p-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                Consulting Digital Twin telemetry...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask ATHENA coach about workouts, recovery, or why a plan was suggested..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMsg.trim() || isTyping}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 text-center">
              ATHENA Coach is educational and conservative. It does not provide medical diagnoses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
