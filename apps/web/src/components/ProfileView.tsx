"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Download,
  Trash2,
  AlertCircle,
} from "lucide-react";

export const ProfileView: React.FC = () => {
  // Required fields
  const [fullName, setFullName] = useState("Alex Chen");
  const [age, setAge] = useState(28);
  const [fitnessLevel, setFitnessLevel] = useState("INTERMEDIATE");
  const [activityLevel, setActivityLevel] = useState("MODERATE");

  // Optional fields
  const [sex, setSex] = useState("MALE");
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(74.5);
  const [primarySport, setPrimarySport] = useState("Running / Functional Training");
  const [dietaryPref, setDietaryPref] = useState("INDIAN_STANDARD");
  const [equipment, setEquipment] = useState("Bodyweight, Dumbbells, Pull-up bar");

  // Sensitive fields (Guarded)
  const [limitations, setLimitations] = useState("Mild left ankle stiffness from past sprain");
  const [healthNotes, setHealthNotes] = useState("Focusing on aerobic base and core stability.");

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          Data Minimization &amp; Privacy Architecture
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          Personal Fitness Profile &amp; Privacy
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ATHENA strictly categorizes data into Required, Optional, and Sensitive fields. Identity is segregated from analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. REQUIRED INFORMATION (4 cols) */}
        <div className="lg:col-span-4 athena-card p-5 space-y-4 border-blue-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Required Information
            </h2>
            <span className="text-[10px] text-blue-400 font-mono">Mandatory</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white mt-1"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white mt-1 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium">Fitness Level</label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white mt-1"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ATHLETE">Athlete</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white mt-1"
              >
                <option value="SEDENTARY">Sedentary</option>
                <option value="LIGHT">Light Movement</option>
                <option value="MODERATE">Moderate Activity</option>
                <option value="VERY_ACTIVE">Very Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. OPTIONAL INFORMATION (4 cols) */}
        <div className="lg:col-span-4 athena-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Optional Information
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Skippable</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-1 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400">Primary Sport / Interest</label>
              <input
                type="text"
                value={primarySport}
                onChange={(e) => setPrimarySport(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white mt-1"
              />
            </div>

            <div>
              <label className="text-slate-400">Dietary Style</label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white mt-1"
              >
                <option value="INDIAN_STANDARD">Indian Standard (Balanced)</option>
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="VEGAN">Vegan</option>
                <option value="HIGH_PROTEIN">High Protein</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400">Available Equipment</label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white mt-1"
              />
            </div>
          </div>
        </div>

        {/* 3. SENSITIVE INFORMATION (4 cols) */}
        <div className="lg:col-span-4 athena-card p-5 space-y-4 border-amber-900/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Sensitive Information
            </h2>
            <span className="text-[10px] text-amber-500/80 font-mono">Encrypted</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium">Physical / Joint Limitations</label>
              <textarea
                rows={3}
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium">Private Health Notes</label>
              <textarea
                rows={3}
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400">
              Sensitive information is never exposed to public feeds or unapproved coaching aggregations.
            </div>
          </div>
        </div>
      </div>

      {/* Save Button & Privacy Governance Bar */}
      <div className="athena-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-white">Privacy &amp; Data Sovereignty</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Role: PLAYER • Audit Logging Active • RBAC Enforced
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
          >
            {isSaved ? "Saved Successfully!" : "Update Wellness Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};
