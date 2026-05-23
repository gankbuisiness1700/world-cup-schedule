import Flag from "react-world-flags";
import MatchCard from "./MatchCard";

import { Match, Team } from "../types";

interface GroupViewProps {
  groupKey: string;
  teams: Team[];
  matches: Match[];
  groupMap: { [key: string]: string[] };
  timeMode: "browser" | "venue";
  // 【追加】時間を切り替えるための関数を受け取るようにします
  setTimeMode: (mode: "browser" | "venue") => void;
}

export default function GroupView({ groupKey, teams, matches, groupMap, timeMode, setTimeMode }: GroupViewProps) {
  const groupTeamIds = groupMap[groupKey] || [];
  const groupMatches = matches.filter((m) => m.group === groupKey);
  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || "不明";

  // 順位計算
  const teamStats = groupTeamIds.map((id) => {
    let played = 0, won = 0, drawn = 0, lost = 0, points = 0, gf = 0, ga = 0;
    groupMatches.forEach((m) => {
      if (m.status !== "未試合") {
        if (m.teamA.id === id) {
          played++;
          if (m.teamA.result === "win") { won++; points += 3; }
          else if (m.teamA.result === "draw") { drawn++; points += 1; }
          else { lost++; }
          gf += m.teamA.score || 0; ga += m.teamB.score || 0;
        } else if (m.teamB.id === id) {
          played++;
          if (m.teamB.result === "win") { won++; points += 3; }
          else if (m.teamB.result === "draw") { drawn++; points += 1; }
          else { lost++; }
          gf += m.teamB.score || 0; ga += m.teamA.score || 0;
        }
      }
    });
    return { id, played, won, drawn, lost, points, gf, ga, gd: gf - ga };
  }).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);

  // 対戦マトリクス作成
  const matrix = groupTeamIds.map(rowId => 
    groupTeamIds.map(colId => {
      if (rowId === colId) return { type: "self" };
      const match = groupMatches.find(m => (m.teamA.id === rowId && m.teamB.id === colId) || (m.teamA.id === colId && m.teamB.id === rowId));
      return { type: "match", match };
    })
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 順位表 */}
        <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">グループ {groupKey} 順位表</h2>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr><th className="pb-2">順位</th><th className="pb-2">チーム</th><th className="pb-2">試</th><th className="pb-2">勝</th><th className="pb-2">分</th><th className="pb-2">負</th><th className="pb-2">差</th><th className="pb-2 text-white font-bold">点</th></tr>
            </thead>
            <tbody>
              {teamStats.map((stat, i) => (
                <tr key={stat.id} className="border-b border-gray-800/50">
                  <td className="py-3 font-bold text-gray-300">{i + 1}</td>
                  <td className="py-3 flex items-center gap-2"><Flag code={stat.id} className="w-6 h-4 border border-gray-600 rounded-sm" />{getTeamName(stat.id)}</td>
                  <td className="py-3 text-center">{stat.played}</td>
                  <td className="py-3 text-center">{stat.won}</td>
                  <td className="py-3 text-center">{stat.drawn}</td>
                  <td className="py-3 text-center">{stat.lost}</td>
                  <td className="py-3 text-center">{stat.gd > 0 ? `+${stat.gd}` : stat.gd}</td>
                  <td className="py-3 text-center font-bold text-blue-400 text-lg">{stat.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 対戦マトリクス */}
        <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">対戦表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr><th className="p-2"></th>{groupTeamIds.map(id => <th key={id} className="p-2"><Flag code={id} className="w-8 h-5 mx-auto border border-gray-600 rounded-sm" /></th>)}</tr>
              </thead>
              <tbody>
                {groupTeamIds.map((rowId, i) => (
                  <tr key={rowId} className="border-t border-gray-700">
                    <td className="p-2 text-left font-bold"><Flag code={rowId} className="w-8 h-5 inline-block mr-2 border border-gray-600 rounded-sm" />{getTeamName(rowId)}</td>
                    {matrix[i].map((cell, j) => (
                      <td key={j} className="p-2 border-l border-gray-700 text-sm font-bold bg-gray-900/50">
                        {cell.type === "self" ? <span className="text-gray-600">-</span> : (cell.match?.status !== "未試合" ? <span className="text-white">{cell.match?.teamA.id === rowId ? cell.match.teamA.score : cell.match?.teamB.score} - {cell.match?.teamA.id === rowId ? cell.match.teamB.score : cell.match?.teamA.score}</span> : <span className="text-gray-500 font-normal">vs</span>)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* グループの日程 */}
      <div>
        {/* 【変更】見出しとボタンを flex で横並びに配置 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-2 mb-4 gap-4">
          <h2 className="text-xl font-bold text-blue-400">グループ日程</h2>
          
          <div className="flex gap-2 bg-gray-950 p-1 rounded-lg text-sm border border-gray-800">
            <button 
              onClick={() => setTimeMode("browser")} 
              className={`px-3 py-1 rounded ${timeMode === "browser" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800 transition-colors"}`}
            >
              ブラウザ時刻
            </button>
            <button 
              onClick={() => setTimeMode("venue")} 
              className={`px-3 py-1 rounded ${timeMode === "venue" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800 transition-colors"}`}
            >
              現地時間
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {groupMatches.map(m => <MatchCard key={m.id} match={m} teams={teams} timeMode={timeMode} />)}
        </div>
      </div>
    </div>
  );
}