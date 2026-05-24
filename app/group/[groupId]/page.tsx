"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

// 前のHome.tsxから見て2階層深くなるため、パスを「../../../」に調整しています
import scheduleData from "../../../data/schedule.json";
import teamData from "../../../data/teams.json";
import broadcastersData from "../../../data/broadcasters.json";
import matchBroadcastersData from "../../../data/match_broadcasters.json";

import GroupView from "../../../components/GroupView";
import Breadcrumbs from "../../../components/Breadcrumbs";
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

export default function GroupPage() {
  // Next.jsの機能で、URLの「[groupId]」の部分（AやBなど）を自動取得します
  const params = useParams();
  const groupId = params.groupId as string;

  const matches: Match[] = scheduleData as Match[];
  const teams: Team[] = teamData as Team[];

  const [timeMode, setTimeMode] = useState<"browser" | "venue">("browser");

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

  // URLに入力されたグループ名が不正（例: /group/Z など）な場合の防衛策
  if (!groupMap[groupId]) {
    return (
      <div className="p-8 bg-gray-900 text-white min-h-screen">
        <p className="text-gray-400">指定されたグループが見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto bg-gray-900 text-white min-w-0 md:rounded-2xl shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* 【追加】ここにパンくずリストを配置 */}
      <Breadcrumbs
        items={[
          { name: "日程", href: "/" },
          { name: `グループ ${groupId}`, href: `/group/${groupId}` },
        ]}
      />
      {/* ヘッダー部分 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-800 pb-4 mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-white">グループ {groupId}</h1>
      </div>

      {/* すでにスマホ対応化させた既存の GroupView をそのまま呼び出します */}
      <GroupView
        groupKey={groupId}
        teams={teams}
        matches={matches}
        groupMap={groupMap}
        timeMode={timeMode}
        setTimeMode={setTimeMode}
        getMatchBroadcasters={getMatchBroadcasters}
      />
    </div>
  );
}
