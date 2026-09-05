"use client";

import React from "react";
import {
  LayoutDashboard,
  Cpu,
  Activity,
  Bot,
  Utensils,
  Moon,
  Brain,
  TrendingUp,
  Target,
  Sparkles,
  Camera,
  Layers,
  User,
  ShieldCheck,
  FileText,
  Compass,
} from "lucide-react";

export type ViewType =
  | "dashboard"
  | "twin"
  | "fitness"
  | "coach"
  | "health"
  | "cv"
  | "georadar"
  | "nutrition"
  | "recovery"
  | "mental"
  | "progress"
  | "goals"
  | "simulator"
  | "specialized"
  | "profile";

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  twinVersion?: string;
  readinessScore?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  twinVersion = "Twin v1",
  readinessScore = 74,
}) => {
  const [profileCompletion, setProfileCompletion] = React.useState<number>(100);

  React.useEffect(() => {
    const updateCompletion = () => {
      try {
        const saved = localStorage.getItem("athena_profile_completion");
        if (saved !== null) {
          setProfileCompletion(parseInt(saved));
        }
      } catch {}
    };
    updateCompletion();
    window.addEventListener("athena_profile_updated", updateCompletion);
    return () => window.removeEventListener("athena_profile_updated", updateCompletion);
  }, []);

  const navItems: { id: ViewType; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "twin", label: "My Twin", icon: Cpu, badge: twinVersion },
    { id: "fitness", label: "Fitness Engine", icon: Activity },
    { id: "coach", label: "Coach Jack", icon: Bot, badge: "Mentor" },
    { id: "health", label: "Health & Lab Reports", icon: FileText, badge: "Biomarkers" },
    { id: "cv", label: "Exercise CV Coach", icon: Camera, badge: "8002 AI" },
    { id: "georadar", label: "Talent Geo Radar", icon: Compass, badge: "Radar Scan" },
    { id: "nutrition", label: "Nutrition & Calorie", icon: Utensils },
    { id: "recovery", label: "Recovery & Sleep", icon: Moon, badge: `${readinessScore}` },
    { id: "mental", label: "Mental Wellness", icon: Brain },
    { id: "progress", label: "Longitudinal Progress", icon: TrendingUp },
    { id: "goals", label: "Goals Engine", icon: Target },
    { id: "simulator", label: "What-If Simulator", icon: Sparkles },
    { id: "specialized", label: "Specialized Hub", icon: Layers, badge: "Women/Age+" },
    {
      id: "profile",
      label: "Profile & Privacy",
      icon: User,
      badge: profileCompletion === 100 ? "Verified" : `${profileCompletion}%`,
    },
  ];



  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              ATHENA
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Personal Wellness & Fitness Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-900 text-white border border-slate-700 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-blue-500" : "text-slate-500"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? "bg-blue-950 text-blue-400 border border-blue-800"
                      : "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Platform & Safety Tag */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="leading-tight">
            <div className="font-semibold text-slate-300">ATHENA Guardrails Active</div>
            <div className="text-[10px] text-slate-500">Non-Diagnostic • Conservative</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
