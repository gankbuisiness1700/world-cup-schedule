import Flag from "react-world-flags";
import MatchCard from "./MatchCard";
import { Match, Team, MatchBroadcaster } from "../types/types";

interface GroupViewProps {
  groupKey: string;
  teams: Team[];
  matches: Match[];
  groupMap: { [key: string]: string[] };
  timeMode: "browser" | "venue";
  setTimeMode: (mode: "browser" | "venue") => void;
  getMatchBroadcasters: (matchId: number) => MatchBroadcaster[];
}

export default function GroupView({
  groupKey,
  teams,
  matches,
  groupMap,
  timeMode,
  setTimeMode,
  getMatchBroadcasters,
}: GroupViewProps) {
  const groupTeamIds = groupMap[groupKey] || [];
  const groupMatches = matches.filter((m) => m.group === groupKey);
  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || "不明";

  // 順位計算ロジック
  const teamStats = groupTeamIds
    .map((id) => {
      let played = 0,
        won = 0,
        drawn = 0,
        lost = 0,
        points = 0,
        gf = 0,
        ga = 0;
      groupMatches.forEach((m) => {
        if (m.status !== "未試合") {
          if (m.teamA.id === id) {
            played++;
            if (m.teamA.result === "win") {
              won++;
              points += 3;
            } else if (m.teamA.result === "draw") {
              drawn++;
              points += 1;
            } else {
              lost++;
            }
            gf += m.teamA.score || 0;
            ga += m.teamB.score || 0;
          } else if (m.teamB.id === id) {
            played++;
            if (m.teamB.result === "win") {
              won++;
              points += 3;
            } else if (m.teamB.result === "draw") {
              drawn++;
              points += 1;
            } else {
              lost++;
            }
            gf += m.teamB.score || 0;
            ga += m.teamA.score || 0;
          }
        }
      });
      return { id, played, won, drawn, lost, points, gf, ga, gd: gf - ga };
    })
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);

  // マトリクス計算ロジック
  const matrix = groupTeamIds.map((rowId) =>
    groupTeamIds.map((colId) => {
      if (rowId === colId) return { type: "self" };
      const match = groupMatches.find(
        (m) =>
          (m.teamA.id === rowId && m.teamB.id === colId) ||
          (m.teamA.id === colId && m.teamB.id === rowId)
      );
      return { type: "match", match };
    })
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* 順位表と対戦表のグリッド */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 min-w-0">
        {/* --- 順位表 --- */}
        <div className="bg-gray-800/50 border border-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-3 md:mb-4">
            グループ {groupKey} 順位表
          </h2>
          {/* overflow-x-auto でスマホ時の横スクロールを許可 */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left min-w-[300px]">
              <thead className="text-gray-400 border-b border-gray-700 whitespace-nowrap">
                <tr>
                  <th className="pb-2 px-1">順位</th>
                  <th className="pb-2 px-2">チーム</th>
                  <th className="pb-2 text-center w-8">試</th>
                  <th className="pb-2 text-center w-8">勝</th>
                  <th className="pb-2 text-center w-8">分</th>
                  <th className="pb-2 text-center w-8">負</th>
                  <th className="pb-2 text-center w-8">差</th>
                  <th className="pb-2 text-center text-white font-bold w-8">点</th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((stat, i) => (
                  <tr key={stat.id} className="border-b border-gray-800/50">
                    <td className="py-2 md:py-3 px-1 font-bold text-gray-300">{i + 1}</td>
                    <td className="py-2 md:py-3 px-2 flex items-center gap-1.5 md:gap-2">
                      <Flag
                        code={stat.id}
                        className="w-5 h-3 md:w-6 md:h-4 border border-gray-600 rounded-sm shrink-0"
                      />
                      <span className="truncate max-w-[80px] md:max-w-none">
                        {getTeamName(stat.id)}
                      </span>
                    </td>
                    <td className="py-2 md:py-3 text-center text-gray-300">{stat.played}</td>
                    <td className="py-2 md:py-3 text-center text-gray-300">{stat.won}</td>
                    <td className="py-2 md:py-3 text-center text-gray-300">{stat.drawn}</td>
                    <td className="py-2 md:py-3 text-center text-gray-300">{stat.lost}</td>
                    <td className="py-2 md:py-3 text-center text-gray-300">
                      {stat.gd > 0 ? `+${stat.gd}` : stat.gd}
                    </td>
                    <td className="py-2 md:py-3 text-center font-bold text-blue-400 text-base md:text-lg">
                      {stat.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- 対戦マトリクス --- */}
        <div className="bg-gray-800/50 border border-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-3 md:mb-4">対戦表</h2>
          {/* 確実な横スクロール制御 */}
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-center text-xs md:text-sm min-w-[320px]">
              <thead>
                <tr>
                  <th className="p-1 md:p-2 w-1/5 min-w-[80px]"></th>
                  {groupTeamIds.map((id) => (
                    <th key={id} className="p-1 md:p-2">
                      <Flag
                        code={id}
                        className="w-6 h-4 md:w-8 md:h-5 mx-auto border border-gray-600 rounded-sm"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupTeamIds.map((rowId, i) => (
                  <tr key={rowId} className="border-t border-gray-700">
                    {/* 左側のチーム名 */}
                    <td className="p-1 md:p-2 text-left font-bold flex items-center h-full min-h-[36px] md:min-h-[44px]">
                      <Flag
                        code={rowId}
                        className="w-5 h-3 md:w-6 md:h-4 inline-block mr-1.5 md:mr-2 border border-gray-600 rounded-sm shrink-0"
                      />
                      <span className="truncate max-w-[60px] md:max-w-none">
                        {getTeamName(rowId)}
                      </span>
                    </td>

                    {/* セル */}
                    {matrix[i].map((cell, j) => (
                      <td
                        key={j}
                        className="p-1 md:p-2 border-l border-gray-700 font-bold bg-gray-900/50 min-w-[40px] md:min-w-[60px]"
                      >
                        {cell.type === "self" ? (
                          <span className="text-gray-600">-</span>
                        ) : cell.match?.status !== "未試合" ? (
                          <span className="text-white whitespace-nowrap">
                            {cell.match?.teamA.id === rowId
                              ? cell.match.teamA.score
                              : cell.match?.teamB.score}{" "}
                            -{" "}
                            {cell.match?.teamA.id === rowId
                              ? cell.match.teamB.score
                              : cell.match?.teamA.score}
                          </span>
                        ) : (
                          <span className="text-gray-500 font-normal">vs</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- グループの日程 --- */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-3 md:pb-2 mb-4 gap-3 md:gap-4">
          <h2 className="text-lg md:text-xl font-bold text-blue-400">グループ日程</h2>

          {/* ヘッダーにあるので、グループ画面内での切替は隠すかシンプルにする */}
          <div className="flex gap-2 bg-gray-950 p-1 rounded-lg text-sm border border-gray-800 w-fit">
            <button
              onClick={() => setTimeMode("browser")}
              className={`px-3 py-1.5 md:py-1 rounded ${timeMode === "browser" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800 transition-colors"}`}
            >
              端末時刻
            </button>
            <button
              onClick={() => setTimeMode("venue")}
              className={`px-3 py-1.5 md:py-1 rounded ${timeMode === "venue" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800 transition-colors"}`}
            >
              現地時間
            </button>
          </div>
        </div>

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
    </div>
  );
}
