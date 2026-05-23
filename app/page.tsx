"use client";

import { useState, useEffect } from "react";
import Flag from "react-world-flags";

import scheduleData from "../data/schedule.json";
import teamData from "../data/teams.json";

interface Match {
  id: number;
  utcDate: string;
  venueTimezone: string;
  venueName: string;
  teamA: string;
  teamB: string;
  status: string;
  score: string;
  group: string;
}

interface Team {
  id: string;
  name: string;
  group: string;
}

export default function Home() {
  const matches: Match[] = scheduleData;
  const teams: Team[] = teamData;

  const [activeMenu1, setActiveMenu1] = useState<string>("schedule");
  const [activeMenu2, setActiveMenu2] = useState<string>("all");
  const [openSidebar, setOpenSidebar] = useState<string | null>(null);

  const [timeMode, setTimeMode] = useState<"browser" | "venue">("browser");

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : "不明なチーム";
  };

  const filteredMatches = matches.filter((match) => {
    if (activeMenu1 !== "schedule") return false;
    if (activeMenu2 === "all") return true;
    if (activeMenu2 === "japan") return match.teamA === "jpn" || match.teamB === "jpn";
    if (activeMenu2 === "group") return match.group === "グループE";
    return true;
  });

  const formatDateTime = (utcString: string, timezone: string) => {
    if (!isMounted) return ""; 

    const date = new Date(utcString);
    
    const options: Intl.DateTimeFormatOptions = {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeMode === "venue" ? timezone : undefined,
    };

    return new Intl.DateTimeFormat("ja-JP", options).format(date);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white p-2 overflow-hidden">
      
      {/* --- 第1層サイドバー --- */}
      <div className="w-24 flex flex-col items-center py-6 gap-6 z-10 shrink-0">
        <button 
          onClick={() => { setOpenSidebar(openSidebar === "schedule" ? null : "schedule"); }}
          className={`p-2 rounded w-16 text-sm ${activeMenu1 === "schedule" || openSidebar === "schedule" ? "bg-gray-800 font-bold text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
        >
        日程
        </button>
        <button 
          onClick={() => { setOpenSidebar(openSidebar === "team" ? null : "team"); }}
          className={`p-2 rounded w-16 text-sm ${activeMenu1 === "team" || openSidebar === "team" ? "bg-gray-800 font-bold text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
        >
        チーム
        </button>
      </div>

      {/* --- 第2層サイドバー --- */}
      {openSidebar && (
        // 【変更】一番後ろにスクロールバーを隠すためのクラスを3つ追加しました
        <div className="w-48 flex flex-col pt-6 pr-4 shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {openSidebar === "schedule" && (
            <ul className="space-y-2">
              <li className="font-bold text-gray-500 mb-2 pl-2">日程</li>
              <li>
                <button onClick={() => { setActiveMenu1("schedule"); setActiveMenu2("all"); setOpenSidebar(null); }} className={`w-full text-left p-2 rounded ${activeMenu2 === "all" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>全体日程</button>
              </li>
              <li>
                <button onClick={() => { setActiveMenu1("schedule"); setActiveMenu2("group"); setOpenSidebar(null); }} className={`w-full text-left p-2 rounded ${activeMenu2 === "group" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>グループ別</button>
              </li>
              <li>
                <button onClick={() => { setActiveMenu1("schedule"); setActiveMenu2("japan"); setOpenSidebar(null); }} className={`w-full text-left p-2 rounded ${activeMenu2 === "japan" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>日本代表</button>
              </li>
            </ul>
          )}

          {openSidebar === "team" && (
            <ul className="space-y-2">
              <li className="font-bold text-gray-500 mb-2 pl-2">チーム紹介</li>
              {teams.map((team) => (
                <li key={team.id}>
                  <button onClick={() => { setActiveMenu1("team"); setActiveMenu2(team.id); setOpenSidebar(null); }} className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeMenu2 === team.id ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
                    <Flag code={team.id} className="w-6 h-4 object-cover border border-gray-700 shrink-0" />
                    {team.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* --- 右メイン画面 --- */}
      {/* 【変更】こちらにも同様にスクロールバーを隠すためのクラスを追加しました */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-900 text-white min-w-0 rounded-2xl shadow-2xl ml-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">
            {activeMenu1 === "schedule" && activeMenu2 === "all" && "全体日程"}
            {activeMenu1 === "schedule" && activeMenu2 === "group" && "グループ別日程"}
            {activeMenu1 === "schedule" && activeMenu2 === "japan" && "日本代表日程"}
            {activeMenu1 === "team" && (
              <div className="flex items-center gap-3">
                <span>{teams.find(t => t.id === activeMenu2)?.name}</span>
                <Flag code={activeMenu2} className="w-10 h-7 object-cover border border-gray-700" />
              </div>
            )}
          </h1>

          {activeMenu1 === "schedule" && (
            <div className="flex gap-2 bg-gray-950 p-1 rounded-lg text-sm border border-gray-800">
              <button 
                onClick={() => setTimeMode("browser")}
                className={`px-3 py-1 rounded ${timeMode === "browser" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                ブラウザ時刻
              </button>
              <button 
                onClick={() => setTimeMode("venue")}
                className={`px-3 py-1 rounded ${timeMode === "venue" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                現地時間
              </button>
            </div>
          )}
        </div>
        
        {activeMenu1 === "schedule" && (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-gray-800/50 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-800 transition-colors">
                
                <div className="text-gray-400 text-sm text-center md:text-left">
                  <p className="text-white font-bold text-lg">
                    {formatDateTime(match.utcDate, match.venueTimezone)}
                  </p>
                  <p className="text-xs mt-1">
                    {timeMode === "browser" ? "お使いの端末の時刻" : `現地時間 (${match.venueName})`}
                  </p>
                  <p className="mt-2 font-semibold text-gray-300">グループ：{match.group}</p>
                </div>

                <div className="flex items-center gap-2 md:gap-4 text-lg font-bold">
                  <div className="flex items-center gap-2 w-28 md:w-36 justify-end whitespace-nowrap text-white">
                    <span>{getTeamName(match.teamA)}</span>
                    <Flag code={match.teamA} className="w-8 h-5 object-cover border border-gray-700 shrink-0 rounded-sm" />
                  </div>

                  <div className="px-3 py-1 bg-gray-900 rounded-lg text-xl min-w-[70px] text-center text-white border border-gray-800">
                    {match.score ? match.score : "vs"}
                  </div>

                  <div className="flex items-center gap-2 w-28 md:w-36 justify-start whitespace-nowrap text-white">
                    <Flag code={match.teamB} className="w-8 h-5 object-cover border border-gray-700 shrink-0 rounded-sm" />
                    <span>{getTeamName(match.teamB)}</span>
                  </div>
                </div>

                <div className="text-sm font-bold text-blue-400 w-20 text-center">
                  {match.status}
                </div>

              </div>
            ))}
          </div>
        )}

        {activeMenu1 === "team" && (
          <p className="text-gray-400">
            ここに {activeMenu2} の詳細な説明や選手リストが入ります。
          </p>
        )}
      </div>

    </div>
  );
}