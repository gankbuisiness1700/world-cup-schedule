// C:\world-cup-schedule\app\page.tsx
"use client";

import { useState } from "react";
import scheduleData from "../data/schedule.json";
import teamData from "../data/teams.json";
import broadcastersData from "../data/broadcasters.json";
import matchBroadcastersData from "../data/match_broadcasters.json";

import MatchCard from "../components/MatchCard";
import { Match, Team, MatchBroadcaster } from "../types/types";

export default function Home() {
  const matches: Match[] = scheduleData as Match[];
  const teams: Team[] = teamData as Team[];
  const [timeMode, setTimeMode] = useState<"browser" | "venue">("browser");

  const getMatchBroadcasters = (matchId: number) => {
    const relation = matchBroadcastersData.find((mb) => mb.matchId === matchId);
    if (!relation) return [];
    return relation.broadcasters
      .map((bInfo) => {
        const masterInfo = broadcastersData.find((b) => b.id === bInfo.id);
        if (!masterInfo) return null;
        return { ...masterInfo, playByPlay: bInfo.playByPlay, commentator: bInfo.commentator };
      })
      .filter((b) => b !== null) as MatchBroadcaster[];
  };

  return (
    <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto overscroll-y-none bg-gray-900 text-white min-w-0 md:rounded-2xl shadow-2xl md:ml-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* ヘッダー部分 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-800 pb-4 mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-white">全体日程</h1>
        <div className="flex gap-2 bg-gray-950 p-1 rounded-lg text-sm border border-gray-800 w-fit">
          <button
            onClick={() => setTimeMode("browser")}
            className={`px-3 py-1.5 md:py-1 rounded ${timeMode === "browser" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800"}`}
          >
            端末時刻
          </button>
          <button
            onClick={() => setTimeMode("venue")}
            className={`px-3 py-1.5 md:py-1 rounded ${timeMode === "venue" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800"}`}
          >
            現地時間
          </button>
        </div>
      </div>

      {/* 試合日程のリスト表示 */}
      <div className="space-y-4">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            teams={teams}
            timeMode={timeMode}
            broadcasters={getMatchBroadcasters(m.id)}
          />
        ))}
      </div>
    </div>
  );
}
