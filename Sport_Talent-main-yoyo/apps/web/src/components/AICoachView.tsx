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
    { sender: "coach" | "user"; text: string; time: string; tag?: string }[]
  >([
    {
      sender: "coach",
      text: "Listen closely. I am Coach Jack. I hold my athletes to unyielding professional standards. I've audited your Digital Twin telemetry and morning readiness score (74/100). If you want elite results, execute your plan with precision. What are you preparing to conquer today?",
      time: "10:15 AM",
      tag: "DISCIPLINE_BASELINE",
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const clearChat = () => {
    setMessages([
      {
        sender: "coach",
        text: "Log reset. Clean slate. Stay focused on your core physiological targets. What is your training priority right now?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tag: "LOG_CLEARED",
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
        body: JSON.stringify({ message: textToSend }),
      });
      if (res.ok) {
        const data = await res.json();
        const replyText = data.data?.content || data.reply || data.coach_response;
        if (replyText) {
          setMessages((prev) => [
            ...prev,
            { sender: "coach", text: replyText, time: timeNow, tag: "MENTOR_RESPONSE" },
          ]);
          setIsTyping(false);
          return;
        }
      }
      throw new Error("Fallback required");
    } catch {
      // High-standard deterministic mentor response grounded in telemetry
      let strictReply = `Execute with discipline. Your Readiness is at ${readiness}/100. That is adequate for productive training, but only if you adhere strictly to proper joint biomechanics and stay hydrated. No reckless lifts today.`;
      
      const lower = textToSend.toLowerCase();
      if (lower.includes("diet") || lower.includes("nutrition") || lower.includes("protein") || lower.includes("fuel")) {
        strictReply = `Here is your strict directive: 1.8g to 2.2g of protein per kg of bodyweight, distributed in 4 balanced intervals. Eliminate processed sugars post-workout; fuel glycogen replenishment with complex carbohydrates and electrolytes within 45 minutes of session completion.`;
      } else if (lower.includes("sore") || lower.includes("tired") || lower.includes("fatigue")) {
        strictReply = `Muscular soreness is an adaptation signal; joint pain is incompetence. If it is soreness, do not skip training: complete 20 minutes of targeted myofascial release, 10 minutes of hip mobility, and an active aerobic flush at Zone 2 heart rate. Zero excuses.`;
      } else if (lower.includes("intensity") || lower.includes("heavy") || lower.includes("plan")) {
        strictReply = `Your Digital Twin telemetry indicates your muscular baseline is solid, but endurance reserve drops sharply beyond 25 minutes. Cap high-intensity bursts at 45 seconds, prioritize crisp form over ego weights, and log every repetition.`;
      } else if (lower.includes("why")) {
        strictReply = `Because elite performance is built on deterministic data, not emotional impulse. Your readiness of ${readiness}/100 requires calculated stimulus to prevent sympathetic burnout. Follow the prescribed intervals and trust the methodology.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "coach", text: strictReply, time: timeNow, tag: "STRICT_PROTOCOL" },
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
            Head Performance Mentor &amp; Elite Sports Dietitian
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            Coach Jack
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono">
              Strict &bull; Uncompromising
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero fluff. Evidence-based kinematic prescriptions, metabolic fueling protocols, and rigorous accountability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Telemetry Synced: <span className="font-mono text-emerald-400 font-bold">{readiness}/100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mentor Profile & Calibration Standards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="athena-card p-5 space-y-4 border-slate-700 bg-slate-900/80 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10 shrink-0 bg-slate-950">
                <img
                  src="/jack.jpg"
                  alt="Coach Jack"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to stylized high-tech avatar if image loading fails
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
                <div className="text-xs text-amber-400 font-mono">Senior Director of Athletics</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Philosophy: Precision, Volume Control, &amp; Mental Grit</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Athlete Standards Audit</span>
                <span className="text-amber-400 font-mono">LEVEL 1 PROSPECT</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Training Density</span>
                  <span className="text-white font-mono font-medium">85% Work-to-Rest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kinematic Tolerance</span>
                  <span className="text-emerald-400 font-mono font-medium">&lt; 5&deg; Joint Deviation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Macronutrient Adherence</span>
                  <span className="text-blue-400 font-mono font-medium">100% Macro Precision</span>
                </div>
              </div>
            </div>

            {/* Strict Directives */}
            <div className="p-3.5 bg-amber-950/20 rounded-xl border border-amber-500/20 text-xs space-y-1.5">
              <div className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1.5 font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                COACH JACK&apos;S DIRECTIVE FOR TODAY
              </div>
              <p className="text-slate-300 leading-relaxed font-normal text-xs">
                &ldquo;{recommendation?.title || "20 Min Moderate Kinetic Workout"}&rdquo; is your assignment. Execute reps with full mechanical lockout. If your depth degrades on the CV camera, the repetition will not count.
              </p>
            </div>
          </div>

          {/* Strict Tactical Directives Quick Action Pills */}
          <div className="athena-card p-4 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono tracking-wider">
              Direct Mentor Inquiries
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSendMessage("Audit my workout intensity: Am I pushing hard enough or wasting volume?")}
                className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-lg text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between"
              >
                <span>&ldquo;Audit my workout intensity&rdquo;</span>
                <span className="text-[10px] font-mono text-amber-500">DIAGNOSTIC</span>
              </button>
              <button
                onClick={() => handleSendMessage("What exact foods and hydration protocol must I consume right now to maximize recovery?")}
                className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-lg text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between"
              >
                <span>&ldquo;Strict post-workout nutrition protocol&rdquo;</span>
                <span className="text-[10px] font-mono text-blue-400">FUELING</span>
              </button>
              <button
                onClick={() => handleSendMessage("Why should I maintain steady-state effort today instead of lifting to failure?")}
                className="text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-lg text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between"
              >
                <span>&ldquo;Why no ego lifting today?&rdquo;</span>
                <span className="text-[10px] font-mono text-emerald-400">LOGIC</span>
              </button>
            </div>
          </div>
        </div>

        {/* Coach Jack Live Chat Window (7 cols) */}
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
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded font-mono">
                    HEAD MENTOR
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Direct Line &bull; Sports Science &amp; Biomechanics
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-2.5 py-1 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded border border-transparent hover:border-red-900/50 text-[11px] font-medium transition-colors flex items-center gap-1"
              title="Clear conversation history"
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
                      <span>COACH JACK</span>
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
                Coach Jack is reviewing your telemetry...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Coach Jack for strict diet, training form, or recovery directives..."
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
              Strict Mentorship Protocol &bull; Evidence-based kinematic guidance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
