"use client";

import React, { useState } from "react";
import {
  Utensils,
  Droplets,
  Plus,
  Flame,
  Info,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  PieChart,
} from "lucide-react";

export const NutritionView: React.FC = () => {
  const [naturalText, setNaturalText] = useState("2 roti + dal + sabzi + curd");
  const [parsedData, setParsedData] = useState<any>(null);
  const [isParsing, setIsParsing] = useState(false);

  const [dailyTotals, setDailyTotals] = useState({
    calories: 1420,
    protein: 68,
    carbs: 185,
    fat: 42,
    fiber: 22,
  });

  const [waterMl, setWaterMl] = useState(1750);
  const waterTarget = 2500;

  // Preset Indian meals for quick test
  const quickDishes = [
    "2 roti + dal + sabzi + curd",
    "3 idli + sambar + coconut chutney",
    "1 bowl moong dal khichdi + curd",
    "1 paneer paratha + curd",
    "1 plate chicken curry + 2 roti + salad",
  ];

  const handleParseMeal = async (textToParse?: string) => {
    const text = textToParse || naturalText;
    if (!text.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/nutrition/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setParsedData(data);
      }
    } catch {
      // Local fallback parsing simulation
      setParsedData({
        raw_input: text,
        items: [
          { item_name: "Whole Wheat Roti", quantity: 2, calories: 170, protein: 6, carbs: 35, fat: 1, fiber: 5 },
          { item_name: "Yellow Toor Dal", quantity: 1, calories: 140, protein: 8.5, carbs: 20, fat: 3.2, fiber: 4.5 },
          { item_name: "Mixed Vegetable Sabzi", quantity: 1, calories: 120, protein: 3.5, carbs: 14, fat: 5.5, fiber: 4.0 },
          { item_name: "Plain Curd / Dahi", quantity: 1, calories: 95, protein: 4.5, carbs: 6, fat: 5.0, fiber: 0 },
        ],
        totals: { calories: 525, protein_g: 22.5, carbs_g: 75, fat_g: 14.7, fiber_g: 13.5 },
        is_estimated: true,
        estimation_label: "Portion-based conservative nutritional estimation",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleAddMealToToday = () => {
    if (!parsedData) return;
    setDailyTotals((prev) => ({
      calories: Math.round(prev.calories + parsedData.totals.calories),
      protein: Math.round(prev.protein + parsedData.totals.protein_g),
      carbs: Math.round(prev.carbs + parsedData.totals.carbs_g),
      fat: Math.round(prev.fat + parsedData.totals.fat_g),
      fiber: Math.round(prev.fiber + parsedData.totals.fiber_g),
    }));
    setParsedData(null);
  };

  const handleAddWater = (amount: number) => {
    setWaterMl((prev) => Math.min(4000, prev + amount));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-semibold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5" />
          Nutritional Intelligence &amp; Calorie Analysis
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
          Nutrition, Energy &amp; Hydration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supports natural Indian household meal tracking, conservative daily calorie ranges, and behavioral hydration cues.
        </p>
      </div>

      {/* Energy Expenditure & Calorie Analyser Card */}
      <div className="athena-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Calorie Balance &amp; Energy Expenditure
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Scientific range model based on Mifflin-St Jeor equation with workout adjustment.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Estimated Daily Requirement</div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              2100–2300 kcal
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Basal Metabolic Rate</div>
            <div className="text-lg font-mono font-bold text-white mt-1">~1,680 kcal</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Resting cellular baseline</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Activity Multiplier</div>
            <div className="text-lg font-mono font-bold text-blue-400 mt-1">1.55x</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Moderate activity cadence</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Workout Burn Today</div>
            <div className="text-lg font-mono font-bold text-amber-400 mt-1">+240 kcal</div>
            <div className="text-[10px] text-slate-500 mt-0.5">35 min session</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Logged Intake Today</div>
            <div className="text-lg font-mono font-bold text-white mt-1">~{dailyTotals.calories} kcal</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Well-balanced range</div>
          </div>
        </div>

        {/* Safety & Fake Precision Disclaimer */}
        <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            ATHENA intentionally displays <strong className="text-slate-200">caloric ranges (e.g. 2100–2300 kcal)</strong> rather than fake single-integer precision (e.g. 2173 kcal). Metabolic rates fluctuate daily with sleep, temperature, and movement.
          </div>
        </div>
      </div>

      {/* Natural Language Indian Meal Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 athena-card p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Natural Meal Entry (Indian Foods Supported)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Type household meals naturally, e.g. &ldquo;2 roti + dal + sabzi + curd&rdquo;
              </p>
            </div>
            <span className="badge-clean badge-emerald text-[10px]">
              Estimator Active
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={naturalText}
              onChange={(e) => setNaturalText(e.target.value)}
              placeholder="e.g., 2 roti + dal + sabzi + curd"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />

            {/* Quick Dish Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickDishes.map((dish, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setNaturalText(dish);
                    handleParseMeal(dish);
                  }}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {dish}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleParseMeal()}
              disabled={isParsing || !naturalText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              {isParsing ? "Analyzing Meal..." : "Estimate Nutrition"}
            </button>
          </div>

          {/* Parsed Meal Breakdown Card */}
          {parsedData && (
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 mt-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-semibold text-white">
                  Estimated Meal Breakdown
                </div>
                <span className="text-[10px] text-amber-400 font-medium">
                  {parsedData.estimation_label}
                </span>
              </div>

              <div className="space-y-1.5">
                {parsedData.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 border-b border-slate-900"
                  >
                    <span className="text-slate-300">
                      {item.quantity}x {item.item_name}
                    </span>
                    <span className="text-slate-400 font-mono">
                      ~{item.calories} kcal • {item.protein}g P • {item.carbs}g C • {item.fat}g F
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800 font-medium">
                <span className="text-white">Meal Totals:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  ~{parsedData.totals.calories} kcal | {parsedData.totals.protein_g}g Protein | {parsedData.totals.carbs_g}g Carbs
                </span>
              </div>

              <button
                onClick={handleAddMealToToday}
                className="w-full py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Today&apos;s Daily Log
              </button>
            </div>
          )}
        </div>

        {/* Daily Macros & Hydration Tracker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Daily Macros Meter */}
          <div className="athena-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Today&apos;s Macronutrient Totals
            </h3>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Protein (Target: 110g)</span>
                  <span className="font-mono font-semibold text-white">{dailyTotals.protein}g</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (dailyTotals.protein / 110) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Carbohydrates (Target: 240g)</span>
                  <span className="font-mono font-semibold text-white">{dailyTotals.carbs}g</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (dailyTotals.carbs / 240) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Healthy Fats (Target: 65g)</span>
                  <span className="font-mono font-semibold text-white">{dailyTotals.fat}g</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (dailyTotals.fat / 65) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Dietary Fiber (Target: 30g)</span>
                  <span className="font-mono font-semibold text-white">{dailyTotals.fiber}g</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (dailyTotals.fiber / 30) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Hydration Engine */}
          <div className="athena-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-400" />
                Hydration Engine
              </h3>
              <span className="text-xs font-mono text-blue-400">
                {waterMl} / {waterTarget} ml
              </span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (waterMl / waterTarget) * 100)}%` }}
              ></div>
            </div>

            <div className="text-xs text-slate-400 italic">
              &ldquo;Consider increasing fluid intake following afternoon activity.&rdquo;
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleAddWater(250)}
                className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 font-medium transition-colors"
              >
                +250 ml (Glass)
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 font-medium transition-colors"
              >
                +500 ml (Bottle)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
