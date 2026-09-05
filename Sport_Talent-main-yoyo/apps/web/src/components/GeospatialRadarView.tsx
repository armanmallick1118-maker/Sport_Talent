"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Users,
  Target,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Trophy,
  ArrowUpRight,
  ChevronRight,
  Layers,
  X,
  Radio,
  Sliders,
} from "lucide-react";

interface TalentPing {
  id: string;
  name: string;
  role: "athlete" | "scout";
  sport: string;
  region: "North" | "South" | "East" | "West";
  distanceKm: number;
  twinScore: number;
  keyMetric: string;
  verified: boolean;
  x: number; // radar % from center (-100 to 100)
  y: number; // radar % from center (-100 to 100)
  avatarInitials: string;
}

export const GeospatialRadarView: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>("ALL");
  const [targetRole, setTargetRole] = useState<"athlete" | "scout">("athlete");
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(300);
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedPing, setSelectedPing] = useState<TalentPing | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [backendHubsCount, setBackendHubsCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/plugins/geospatial/heatmap")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBackendHubsCount(data.length);
        }
      })
      .catch(() => {});
  }, []);

  // Mock national talent database
  const pingsData: TalentPing[] = [
    {
      id: "ath-1",
      name: "Rohit Sharma",
      role: "athlete",
      sport: "Sprinting",
      region: "North",
      distanceKm: 48,
      twinScore: 92,
      keyMetric: "100m Sprint: 10.42s (Verified)",
      verified: true,
      x: 25,
      y: -35,
      avatarInitials: "RS",
    },
    {
      id: "ath-2",
      name: "Ananya Iyer",
      role: "athlete",
      sport: "High Jump",
      region: "South",
      distanceKm: 120,
      twinScore: 88,
      keyMetric: "Vertical Jump: 74 cm",
      verified: true,
      x: -45,
      y: 50,
      avatarInitials: "AI",
    },
    {
      id: "ath-3",
      name: "Devendra Patel",
      role: "athlete",
      sport: "Cricket",
      region: "West",
      distanceKm: 85,
      twinScore: 86,
      keyMetric: "Bowling Velocity: 142 km/h",
      verified: true,
      x: -60,
      y: -15,
      avatarInitials: "DP",
    },
    {
      id: "ath-4",
      name: "Meera Das",
      role: "athlete",
      sport: "Badminton",
      region: "East",
      distanceKm: 190,
      twinScore: 84,
      keyMetric: "Shuttle Smash: 310 km/h",
      verified: false,
      x: 70,
      y: 20,
      avatarInitials: "MD",
    },
    {
      id: "ath-5",
      name: "Karan Johar",
      role: "athlete",
      sport: "Football",
      region: "North",
      distanceKm: 240,
      twinScore: 89,
      keyMetric: "Aerobic Yo-Yo Level: 21.4",
      verified: true,
      x: 35,
      y: -75,
      avatarInitials: "KJ",
    },
    {
      id: "ath-6",
      name: "Pooja Reddy",
      role: "athlete",
      sport: "Sprinting",
      region: "South",
      distanceKm: 75,
      twinScore: 91,
      keyMetric: "200m Sprint: 21.68s",
      verified: true,
      x: 20,
      y: 55,
      avatarInitials: "PR",
    },
    {
      id: "scout-1",
      name: "Coach Rajesh Sen",
      role: "scout",
      sport: "Sprinting",
      region: "North",
      distanceKm: 35,
      twinScore: 95,
      keyMetric: "National Athletics Federation Scout",
      verified: true,
      x: 15,
      y: -20,
      avatarInitials: "RS",
    },
    {
      id: "scout-2",
      name: "Dr. Vikram Seth",
      role: "scout",
      sport: "Football",
      region: "West",
      distanceKm: 110,
      twinScore: 90,
      keyMetric: "Youth League Talent Scout",
      verified: true,
      x: -35,
      y: -40,
      avatarInitials: "VS",
    },
  ];

  // Filtering Logic
  const filteredPings = pingsData.filter((ping) => {
    if (ping.role !== targetRole) return false;
    if (selectedSport !== "ALL" && ping.sport !== selectedSport) return false;
    if (selectedRegion !== "ALL" && ping.region !== selectedRegion) return false;
    if (ping.distanceKm > maxRadiusKm) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            National Talent Scouting &bull; Geospatial Intelligence
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            Interactive Talent Geo Radar
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {filteredPings.length} Blips Detected
            </span>
            {backendHubsCount !== null && (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Backend Live ({backendHubsCount} Hubs)
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial radar sweeping across national athletic academies, clubs, and scout networks.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
          <button
            onClick={() => setTargetRole("athlete")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              targetRole === "athlete"
                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Find Athletes
          </button>
          <button
            onClick={() => setTargetRole("scout")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              targetRole === "scout"
                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Find Scouts &amp; Coaches
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="athena-card p-4 border-slate-800 bg-slate-950 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Sport Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px] mr-1">Sport:</span>
            {["ALL", "Sprinting", "High Jump", "Cricket", "Football", "Badminton"].map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSport === sport
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px] mr-1">Region:</span>
            {["ALL", "North", "South", "East", "West"].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedRegion === region
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Radius Slider */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Scan Radius Limit:</span>
            <strong className="text-indigo-400">{maxRadiusKm} km</strong>
          </div>
          <input
            type="range"
            min={30}
            max={500}
            step={10}
            value={maxRadiusKm}
            onChange={(e) => setMaxRadiusKm(parseInt(e.target.value))}
            className="w-48 sm:w-64 accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Radar Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Sweep Canvas (7 cols) */}
        <div className="lg:col-span-7 athena-card p-6 border-slate-800 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
          {/* Background Grid Crosshairs */}
          <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full border border-indigo-500/30 bg-[#050811] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.15)]">
            {/* Range Rings */}
            <div className="absolute w-[75%] h-[75%] rounded-full border border-indigo-500/20"></div>
            <div className="absolute w-[50%] h-[50%] rounded-full border border-indigo-500/20"></div>
            <div className="absolute w-[25%] h-[25%] rounded-full border border-indigo-500/20"></div>

            {/* Radar Center Crosshair */}
            <div className="absolute w-full h-[1px] bg-indigo-500/20"></div>
            <div className="absolute h-full w-[1px] bg-indigo-500/20"></div>

            {/* Center Origin Node (Athlete Location) */}
            <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse ring-4 ring-indigo-500/30 z-10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </div>

            {/* Rotating Radar Sweep Line */}
            {isScanning && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none origin-center"
                style={{
                  background:
                    "conic-gradient(from 0deg at 50% 50%, rgba(99, 102, 241, 0.35) 0deg, transparent 60deg, transparent 360deg)",
                  animation: "spin 4s linear infinite",
                }}
              ></div>
            )}

            {/* Plotted Interactive Pings */}
            {filteredPings.map((ping) => {
              // Convert % position to pixels inside radius
              const leftPos = 50 + ping.x * 0.42;
              const topPos = 50 + ping.y * 0.42;
              const isSelected = selectedPing?.id === ping.id;

              return (
                <div
                  key={ping.id}
                  onClick={() => setSelectedPing(ping)}
                  style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group`}
                  title={`${ping.name} (${ping.sport})`}
                >
                  <div className="relative">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-amber-400 ring-4 ring-amber-400/40 scale-125"
                          : ping.role === "scout"
                          ? "bg-purple-500 ring-2 ring-purple-400/40"
                          : "bg-emerald-400 ring-2 ring-emerald-400/40 animate-pulse"
                      }`}
                    >
                      <span className="w-1 h-1 bg-black rounded-full"></span>
                    </span>

                    {/* Tooltip Tag */}
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-white rounded whitespace-nowrap shadow-lg">
                      {ping.name} ({ping.distanceKm}km)
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Cardinal Direction Indicators */}
            <span className="absolute top-2 font-mono text-[10px] text-indigo-400/80 font-bold">N</span>
            <span className="absolute bottom-2 font-mono text-[10px] text-indigo-400/80 font-bold">S</span>
            <span className="absolute left-2 font-mono text-[10px] text-indigo-400/80 font-bold">W</span>
            <span className="absolute right-2 font-mono text-[10px] text-indigo-400/80 font-bold">E</span>
          </div>

          {/* Sweep Status Footer */}
          <div className="mt-4 flex items-center justify-between w-full text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Geodetic Radar Active
            </span>
            <button
              onClick={() => setIsScanning(!isScanning)}
              className="text-indigo-400 hover:underline"
            >
              {isScanning ? "Pause Sweep" : "Resume Sweep"}
            </button>
          </div>
        </div>

        {/* Selected Athlete / Scout Dossier Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPing ? (
            <div className="athena-card p-5 border-indigo-500/40 bg-slate-900/90 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-bold text-base text-indigo-300 font-mono">
                    {selectedPing.avatarInitials}
                  </div>
                  <div>
                    <div className="text-base font-bold text-white flex items-center gap-1.5">
                      {selectedPing.name}
                      {selectedPing.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="text-xs text-indigo-300 font-mono">
                      {selectedPing.sport} &bull; {selectedPing.region} Sector
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPing(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Verified Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Distance</div>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedPing.distanceKm} km away</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Digital Twin Rating</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedPing.twinScore} / 100</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                  Verified Performance Benchmark
                </div>
                <div className="text-xs text-slate-200 font-mono font-medium">
                  {selectedPing.keyMetric}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => alert(`Connecting with ${selectedPing.name}... Invitation sent via secure talent protocol.`)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Connect / Request Assessment
                </button>
                <button
                  onClick={() => alert(`Exported ${selectedPing.name}'s verified Digital Twin dossier.`)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Inspect Complete Twin Metrics
                </button>
              </div>
            </div>
          ) : (
            <div className="athena-card p-6 border-slate-800 bg-slate-900/40 text-center space-y-3 flex flex-col items-center justify-center min-h-[340px]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Select Any Blip on Radar</div>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Click on any green or purple radar node to inspect athlete speed metrics, Digital Twin scores, and scouting dossiers.
                </p>
              </div>
            </div>
          )}

          {/* Regional Index Summary */}
          <div className="athena-card p-4 space-y-2 border-slate-800 bg-slate-900/60 text-xs">
            <div className="text-[11px] font-bold text-white uppercase font-mono tracking-wider">
              Regional Talent Density Index
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500">North:</span> <strong>34% (Sprint)</strong>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500">South:</span> <strong>28% (Jump)</strong>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500">West:</span> <strong>22% (Cricket)</strong>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500">East:</span> <strong>16% (Badminton)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
