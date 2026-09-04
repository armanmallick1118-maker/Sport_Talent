"use client";

import React, { useState } from "react";
import {
  Brain,
  Smile,
  Zap,
  AlertTriangle,
  Info,
  CheckCircle2,
  Heart,
  ShieldAlert,
} from "lucide-react";

export const MentalWellnessView: React.FC = () => {
  const [mood, setMood] = useState(8);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(7);
  const [motivation, setMotivation] = useState(8);
  const [focus, setFocus] = useState(7);
  const [burnout, setBurnout] = useState(2);
  const [notes, setNotes] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveLog = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5" />
          Non-Diagnostic Psychological Freshness
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          Mental Wellness Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supportive, non-clinical tracking of mood, psychological stress, perceived burnout, and focus to assist holistic recovery.
        </p>
      </div>

      {/* Non-Diagnostic Clinical Guardrail Banner */}
      <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white font-semibold">Important Non-Diagnostic Notice:</strong> ATHENA tracks wellness signals to adapt daily training volume. ATHENA is not a psychiatric diagnostic tool and does not diagnose depression or anxiety disorders. If you experience persistent distress or mental health challenges, please connect with a licensed healthcare professional or call your local crisis helpline.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Tracking Sliders (7 cols) */}
        <div className="lg:col-span-7 athena-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Log Daily Somatic &amp; Mental State
            </h2>
            <span className="text-[11px] text-slate-400">All fields optional</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Overall Mood &amp; Well-being</span>
                <span className="font-mono text-white font-semibold">{mood} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Psychological Stress</span>
                <span className="font-mono text-white font-semibold">{stress} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Subjective Energy</span>
                <span className="font-mono text-white font-semibold">{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Training Motivation</span>
                <span className="font-mono text-white font-semibold">{motivation} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={motivation}
                onChange={(e) => setMotivation(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Perceived Burnout Level</span>
                <span className="font-mono text-white font-semibold">{burnout} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={burnout}
                onChange={(e) => setBurnout(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleSaveLog}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Record Mental Wellness Telemetry
            </button>
            {isSaved && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Logged to Digital Twin
              </span>
            )}
          </div>
        </div>

        {/* Supportive Insights & Adaptive Prompts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="athena-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Pattern Observations
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-200 font-semibold">Energy &amp; Readiness Alignment</div>
                <p className="text-slate-400 leading-relaxed">
                  Your reported energy (7/10) closely reflects nocturnal sleep restoration (7.8h). Psychological state is balanced for today&apos;s moderate training session.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-200 font-semibold">Burnout Resistance</div>
                <p className="text-slate-400 leading-relaxed">
                  Low burnout score (2/10) correlates with your consistent weekly rest days. Keep protecting your recovery windows.
                </p>
              </div>
            </div>
          </div>

          {/* Supportive Lifestyle Guidance */}
          <div className="athena-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Restorative Guidance
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>10 minutes of screen-free breathwork before sleep lowers sympathetic tone.</li>
              <li>Spend 15 minutes outdoors in natural morning sunlight to reinforce circadian rhythm.</li>
              <li>Engage in non-competitive recreation to balance athletic focus.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
