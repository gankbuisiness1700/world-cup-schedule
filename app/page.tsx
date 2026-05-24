"use client";

import { useState, useEffect } from "react";
import Flag from "react-world-flags";

import scheduleData from "../data/schedule.json";
import teamData from "../data/teams.json";
import broadcastersData from "../data/broadcasters.json";
import matchBroadcastersData from "../data/match_broadcasters.json";

// 分割したコンポーネントを読み込む（パスはフォルダ構成に合わせてください）
import GroupView from "../components/GroupView";
import TeamView from "../components/TeamView";
import MatchCard from "../components/MatchCard";
import { Match, Team, MatchBroadcaster } from "../types/types";

const groupMap: { [key: string]: string[] } = {
  A: ["mex", "kor", "zaf", "cze"],
  B: ["can", "che", "qat", "bih"],
  C: ["bra", "mar", "GB-SCT", "hti"],
  D: ["usa", "aus", "pry", "tur"],
  E: ["deu", "ecu", "civ", "cuw"],
  F: ["nld", "jpn", "tun", "swe"],
  G: ["bel", "irn", "egy", "nzl"],
  H: ["esp", "ury", "sau", "cpv"],
  I: ["fra", "sen", "nor", "irq"],
  J: ["arg", "aut", "dza", "jor"],
  K: ["prt", "col", "uzb", "cod"],
  L: ["GB-ENG", "hrv", "pan", "gha"],
};

export default function Home() {
  // データの読み込み
  const matches: Match[] = scheduleData as Match[];
  const teams: Team[] = teamData as Team[];

  // 状態管理
  const [activeMenu1, setActiveMenu1] = useState<string>("schedule");
  const [activeMenu2, setActiveMenu2] = useState<string>("all");
  const [openSidebar, setOpenSidebar] = useState<string | null>(null);

  const [isGroupExpanded, setIsGroupExpanded] = useState<boolean>(false);
  const [timeMode, setTimeMode] = useState<"browser" | "venue">("browser");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 試合のフィルタリング
  const filteredMatches = matches.filter((match) => {
    if (activeMenu1 !== "schedule") return false;
    if (activeMenu2 === "all") return true;
    if (activeMenu2 === "japan") return match.teamA.id === "jpn" || match.teamB.id === "jpn";
    if (activeMenu2.startsWith("group")) {
      if (activeMenu2 === "group") return true;
      return match.group === activeMenu2.split("-")[1];
    }
    return true;
  });

  const getMatchBroadcasters = (matchId: number) => {
    const relation = matchBroadcastersData.find((mb) => mb.matchId === matchId);
    if (!relation) return [];

    return relation.broadcasters
      .map((bInfo) => {
        const masterInfo = broadcastersData.find((b) => b.id === bInfo.id);
        if (!masterInfo) return null;
        return {
          ...masterInfo,
          playByPlay: bInfo.playByPlay,
          commentator: bInfo.commentator,
        };
      })
      .filter((b) => b !== null) as MatchBroadcaster[];
  };

  return (
    <div className="flex h-[100dvh] bg-gray-950 text-white md:p-2 overflow-hidden relative overscroll-none">
      {/* =========================================
          第1層ナビゲーション (PCは左サイド、スマホはボトム)
      ========================================= */}
      {/* スマホ用ボトムナビ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-3 z-50 pb-safe">
        <button
          onClick={() => setOpenSidebar(openSidebar === "schedule" ? null : "schedule")}
          className={`flex-1 py-2 text-sm rounded-lg mx-1 font-bold ${activeMenu1 === "schedule" || openSidebar === "schedule" ? "bg-gray-800 text-blue-400" : "text-gray-400"}`}
        >
          日程
        </button>
        <button
          onClick={() => {
            setIsGroupExpanded(false);
            setOpenSidebar(openSidebar === "team" ? null : "team");
          }}
          className={`flex-1 py-2 text-sm rounded-lg mx-1 font-bold ${activeMenu1 === "team" || openSidebar === "team" ? "bg-gray-800 text-blue-400" : "text-gray-400"}`}
        >
          チーム
        </button>
      </div>

      {/* PC用サイドナビ */}
      <div className="hidden md:flex w-24 flex-col items-center py-6 gap-6 z-10 shrink-0">
        <button
          onClick={() => setOpenSidebar(openSidebar === "schedule" ? null : "schedule")}
          className={`p-2 rounded w-16 text-sm ${activeMenu1 === "schedule" || openSidebar === "schedule" ? "bg-gray-800 font-bold" : "text-gray-400 hover:bg-gray-800"}`}
        >
          日程
        </button>
        <button
          onClick={() => {
            setIsGroupExpanded(false);
            setOpenSidebar(openSidebar === "team" ? null : "team");
          }}
          className={`p-2 rounded w-16 text-sm ${activeMenu1 === "team" || openSidebar === "team" ? "bg-gray-800 font-bold" : "text-gray-400 hover:bg-gray-800"}`}
        >
          チーム
        </button>
      </div>

      {/* =========================================
          第2層メニュー (PCは横並び、スマホは全画面オーバーレイ)
      ========================================= */}
      {openSidebar && (
        <div
          className="
          fixed inset-0 z-40 bg-gray-950 p-6 pt-12 overflow-y-auto
          md:relative md:inset-auto md:w-56 md:p-0 md:pt-6 md:pr-4 md:bg-transparent md:z-10
          shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
        >
          {/* スマホ用の閉じるボタン */}
          <button
            className="md:hidden absolute top-4 right-4 text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm"
            onClick={() => setOpenSidebar(null)}
          >
            ✕ 閉じる
          </button>

          {openSidebar === "schedule" && (
            <ul className="space-y-2">
              <li className="font-bold text-gray-500 mb-2 pl-2">日程</li>
              <li>
                <button
                  onClick={() => {
                    setActiveMenu1("schedule");
                    setActiveMenu2("all");
                    setIsGroupExpanded(false);
                    setOpenSidebar(null);
                  }}
                  className={`w-full text-left p-3 md:p-2 rounded-lg ${activeMenu2 === "all" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  全体日程
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsGroupExpanded(!isGroupExpanded)}
                  className={`w-full text-left p-3 md:p-2 rounded-lg flex justify-between items-center ${activeMenu2.startsWith("group-") ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  グループ別
                  <span className="text-xs">{isGroupExpanded ? "▼" : "▶"}</span>
                </button>

                {isGroupExpanded && (
                  <ul className="ml-4 mt-2 space-y-1 border-l border-gray-700 pl-2">
                    {Object.keys(groupMap).map((key) => (
                      <li key={key}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu1("schedule");
                            setActiveMenu2(`group-${key}`);
                            setOpenSidebar(null);
                          }}
                          className={`w-full text-left p-3 md:p-2 rounded-lg text-sm ${activeMenu2 === `group-${key}` ? "bg-gray-700 text-white font-bold" : "text-gray-400 hover:bg-gray-700"}`}
                        >
                          グループ {key}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveMenu1("schedule");
                    setActiveMenu2("japan");
                    setIsGroupExpanded(false);
                    setOpenSidebar(null);
                  }}
                  className={`w-full text-left p-3 md:p-2 rounded-lg ${activeMenu2 === "japan" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  日本代表
                </button>
              </li>
            </ul>
          )}
          {openSidebar === "team" && (
            <ul className="space-y-2">
              <li className="font-bold text-gray-500 mb-2 pl-2">チーム紹介</li>
              {teams.map((team) => (
                <li key={team.id}>
                  <button
                    onClick={() => {
                      setActiveMenu1("team");
                      setActiveMenu2(team.id);
                      setOpenSidebar(null);
                    }}
                    className={`w-full text-left p-3 md:p-2 rounded-lg flex items-center gap-3 md:gap-2 ${activeMenu2 === team.id ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                  >
                    <Flag
                      code={team.id}
                      className="w-6 h-4 object-cover border border-gray-700 shrink-0"
                    />
                    {team.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* =========================================
          メイン画面
      ========================================= */}
      {/* スマホ時はボトムナビの分だけ下部に余白(pb-20)を空ける */}
      <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto overscroll-y-none bg-gray-900 text-white min-w-0 md:rounded-2xl shadow-2xl md:ml-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* ヘッダー部分 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-800 pb-4 mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {activeMenu1 === "schedule" && activeMenu2 === "all" && "全体日程"}
            {activeMenu1 === "schedule" && activeMenu2 === "group" && "グループ別日程"}
            {activeMenu1 === "schedule" &&
              activeMenu2.startsWith("group-") &&
              `グループ ${activeMenu2.split("-")[1]}`}
            {activeMenu1 === "schedule" && activeMenu2 === "japan" && "日本代表日程"}
          </h1>

          {!(
            activeMenu1 === "team" ||
            (activeMenu1 === "schedule" && activeMenu2.startsWith("group-"))
          ) && (
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
          )}
        </div>

        {/* --- 日程系の表示 --- */}
        {activeMenu1 === "schedule" && (
          <div className="space-y-6 md:space-y-8">
            {activeMenu2.startsWith("group-") ? (
              <GroupView
                groupKey={activeMenu2.split("-")[1]}
                teams={teams}
                matches={matches}
                groupMap={groupMap}
                timeMode={timeMode}
                setTimeMode={setTimeMode}
                getMatchBroadcasters={getMatchBroadcasters}
              />
            ) : activeMenu2 === "group" ? (
              Object.keys(groupMap).map((key) => {
                const groupMatches = filteredMatches.filter((m) => m.group === key);
                return groupMatches.length > 0 ? (
                  <div key={key}>
                    <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-4 border-b border-gray-800 pb-2">
                      グループ {key}
                    </h2>
                    <div className="space-y-4">
                      {groupMatches.map((m) => (
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
                ) : null;
              })
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    teams={teams}
                    timeMode={timeMode}
                    broadcasters={getMatchBroadcasters(m.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- チーム詳細の表示 --- */}
        {activeMenu1 === "team" && (
          <TeamView
            teamId={activeMenu2}
            teams={teams}
            matches={matches}
            timeMode={timeMode}
            setTimeMode={setTimeMode}
            getMatchBroadcasters={getMatchBroadcasters}
          />
        )}
      </div>
    </div>
  );
}
