"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// 3階層深くなるため、インポートのパスを「../../../」に調整しています
import scheduleData from "../../../data/schedule.json";
import teamData from "../../../data/teams.json";
import broadcastersData from "../../../data/broadcasters.json";
import matchBroadcastersData from "../../../data/match_broadcasters.json";

import TeamView from "../../../components/TeamView";
import { Match, Team, MatchBroadcaster } from "../../../types/types";

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

export default function TeamDetailPage() {
  // URLの「[teamId]」の部分（jpn や deu など）を自動的に取得します
  const params = useParams();
  const teamId = params.teamId as string;

  const matches: Match[] = scheduleData as Match[];
  const teams: Team[] = teamData as Team[];

  const [timeMode, setTimeMode] = useState<"browser" | "venue">("browser");

  const targetTeam = teams.find((t) => t.id === teamId);

  // 【SEO対策】ページが表示されたら、ブラウザのタイトルをチーム名に合わせて動的に書き換える
  useEffect(() => {
    if (targetTeam) {
      document.title = `${targetTeam.name}代表 登録選手名鑑・試合日程 | ワールドカップ2026`;
    }
  }, [targetTeam]);

  // 放送局データの結合ロジック
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

  // 不正なチームID（例: /team/xyz など）でアクセスされた場合の防衛策
  if (!targetTeam) {
    return (
      <div className="p-8 bg-gray-900 text-white min-h-screen">
        <p className="text-gray-400">指定されたチームが見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto bg-gray-900 text-white min-w-0 md:rounded-2xl shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* 既にスマホ対応化・機能改修を済ませた TeamView をそのまま再利用 */}
      <TeamView
        teamId={teamId}
        teams={teams}
        matches={matches}
        timeMode={timeMode}
        setTimeMode={setTimeMode}
        getMatchBroadcasters={getMatchBroadcasters}
      />
    </div>
  );
}
