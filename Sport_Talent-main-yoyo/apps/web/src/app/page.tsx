"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, ViewType } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { DigitalTwinView } from "@/components/DigitalTwinView";
import { FitnessEngineView } from "@/components/FitnessEngineView";
import { AICoachView } from "@/components/AICoachView";
import { NutritionView } from "@/components/NutritionView";
import { RecoveryView } from "@/components/RecoveryView";
import { MentalWellnessView } from "@/components/MentalWellnessView";
import { ProgressView } from "@/components/ProgressView";
import { GoalsView } from "@/components/GoalsView";
import { SimulatorView } from "@/components/SimulatorView";
import { CVExerciseView } from "@/components/CVExerciseView";
import { HealthHubView } from "@/components/HealthHubView";
import { SpecializedHubView } from "@/components/SpecializedHubView";
import { ProfileView } from "@/components/ProfileView";
import { GeospatialRadarView } from "@/components/GeospatialRadarView";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live state synchronized from FastAPI backend (with immediate mock fallback)
  const [twinData, setTwinData] = useState<any>({
    version: "Twin v1",
    version_number: 1,
    scores: {
      strength: 72,
      endurance: 70,
      cardio: 68,
      mobility: 64,
      flexibility: 62,
      balance: 74,
      agility: 66,
      consistency: 76,
    },
  });

  const [recommendation, setRecommendation] = useState<any>({
    title: "20 Min Moderate Kinetic Workout",
    summary: "Controlled bodyweight circuit with dynamic mobility warmup.",
    reasoning_why:
      "Your recovery is good, but activity has been lower than your normal baseline.",
    duration_minutes: 20,
    intensity: "MODERATE",
  });

  const [readinessData, setReadinessData] = useState<any>({
    readiness_score: 74,
    state: "GOOD",
    recommended_intensity: "MODERATE",
  });

  // Fetch telemetry on load
  useEffect(() => {
    async function loadBackendData() {
      try {
        const twinRes = await fetch("http://127.0.0.1:8000/api/v1/twin");
        if (twinRes.ok) setTwinData(await twinRes.json());
      } catch (e) {
        // Fallback already pre-set
      }

      try {
        const recRes = await fetch("http://127.0.0.1:8000/api/v1/coach/recommendation");
        if (recRes.ok) setRecommendation(await recRes.json());
      } catch (e) {}

      try {
        const readRes = await fetch("http://127.0.0.1:8000/api/v1/recovery/readiness");
        if (readRes.ok) setReadinessData(await readRes.json());
      } catch (e) {}
    }
    loadBackendData();
  }, []);

  const handleAssessmentSubmitted = (scores: any) => {
    setTwinData((prev: any) => ({
      ...prev,
      version: "Twin v2",
      scores: scores,
    }));
  };

  const renderActiveView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView
            onNavigate={(v) => setCurrentView(v)}
            twinData={twinData}
            recommendation={recommendation}
            readinessData={readinessData}
          />
        );
      case "twin":
        return <DigitalTwinView twinData={twinData} />;
      case "fitness":
        return <FitnessEngineView onAssessmentSubmitted={handleAssessmentSubmitted} />;
      case "coach":
        return (
          <AICoachView
            recommendation={recommendation}
            readinessData={readinessData}
            twinData={twinData}
          />
        );
      case "nutrition":
        return <NutritionView />;
      case "recovery":
        return <RecoveryView readinessData={readinessData} />;
      case "mental":
        return <MentalWellnessView />;
      case "progress":
        return <ProgressView />;
      case "goals":
        return <GoalsView />;
      case "simulator":
        return <SimulatorView />;
      case "cv":
        return <CVExerciseView />;
      case "health":
        return <HealthHubView />;
      case "specialized":
        return <SpecializedHubView />;
      case "profile":
        return <ProfileView />;
      case "georadar":
        return <GeospatialRadarView />;
      default:
        return <DashboardView onNavigate={(v) => setCurrentView(v)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 antialiased font-sans">
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => setCurrentView(v)}
          twinVersion={twinData?.version}
          readinessScore={readinessData?.readiness_score}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative z-10 w-64 bg-slate-950">
            <Sidebar
              currentView={currentView}
              onSelectView={(v) => {
                setCurrentView(v);
                setMobileMenuOpen(false);
              }}
              twinVersion={twinData?.version}
              readinessScore={readinessData?.readiness_score}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navigation Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-30">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            ATHENA
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
