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
import { Match, Team, MatchBroadcaster } from "../components/types";

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

    // マスターデータ（局名・TVかネットか）と、個別の実況・解説データを結合する
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
    <div className="flex h-screen bg-gray-950 text-white p-2 overflow-hidden">
      {/* --- 第1層サイドバー --- */}
      <div className="w-24 flex flex-col items-center py-6 gap-6 z-10 shrink-0">
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

      {/* --- 第2層サイドバー --- */}
      {openSidebar && (
        <div className="w-48 flex flex-col pt-6 pr-4 shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                  className={`w-full text-left p-2 rounded ${activeMenu2 === "all" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  全体日程
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    // ページ遷移をせず、開閉のみ行う
                    setIsGroupExpanded(!isGroupExpanded);
                  }}
                  className={`w-full text-left p-2 rounded flex justify-between items-center ${activeMenu2.startsWith("group-") ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  グループ別
                </button>

                {isGroupExpanded && (
                  <ul className="ml-4 mt-2 space-y-1 border-l border-gray-700 pl-2">
                    {Object.keys(groupMap).map((key) => (
                      <li key={key}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 親のボタンのクリックイベント発火を防ぐ
                            setActiveMenu1("schedule");
                            setActiveMenu2(`group-${key}`); // ここで初めてページが切り替わる
                            setOpenSidebar(null);
                          }}
                          className={`w-full text-left p-2 rounded text-sm ${activeMenu2 === `group-${key}` ? "bg-gray-700 text-white font-bold" : "text-gray-400 hover:bg-gray-700"}`}
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
                  className={`w-full text-left p-2 rounded ${activeMenu2 === "japan" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
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
                    className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeMenu2 === team.id ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
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

      {/* --- メイン画面 --- */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-900 text-white min-w-0 rounded-2xl shadow-2xl ml-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* ヘッダー部分 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">
            {activeMenu1 === "schedule" && activeMenu2 === "all" && "全体日程"}
            {activeMenu1 === "schedule" && activeMenu2 === "group" && "グループ別日程 (全グループ)"}
            {activeMenu1 === "schedule" &&
              activeMenu2.startsWith("group-") &&
              `グループ ${activeMenu2.split("-")[1]}`}
            {activeMenu1 === "schedule" && activeMenu2 === "japan" && "日本代表日程"}
          </h1>

          {!(
            activeMenu1 === "team" ||
            (activeMenu1 === "schedule" && activeMenu2.startsWith("group-"))
          ) && (
            <div className="flex gap-2 bg-gray-950 p-1 rounded-lg text-sm border border-gray-800">
              <button
                onClick={() => setTimeMode("browser")}
                className={`px-3 py-1 rounded ${timeMode === "browser" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800"}`}
              >
                端末時刻
              </button>
              <button
                onClick={() => setTimeMode("venue")}
                className={`px-3 py-1 rounded ${timeMode === "venue" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800"}`}
              >
                現地時間
              </button>
            </div>
          )}
        </div>

        {/* --- 日程系の表示 --- */}
        {activeMenu1 === "schedule" && (
          <div className="space-y-8">
            {activeMenu2.startsWith("group-") ? (
              // 選択された特定のグループ（順位表＋対戦表＋試合一覧）
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
              // グループ別の「全グループ」を選択した場合
              Object.keys(groupMap).map((key) => {
                const groupMatches = filteredMatches.filter((m) => m.group === key);
                return groupMatches.length > 0 ? (
                  <div key={key}>
                    <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-gray-800 pb-2">
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
              // 全体日程・日本代表
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
