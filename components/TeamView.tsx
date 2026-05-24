import Flag from "react-world-flags";
import MatchCard from "./MatchCard";
import TeamPlayers from "./TeamPlayers";
import playersData from "../data/players.json";
import { Match, Team, MatchBroadcaster,Player } from "./types";

interface TeamViewProps {
  teamId: string;
  teams: Team[];
  matches: Match[];
  timeMode: "browser" | "venue";
  setTimeMode: (mode: "browser" | "venue") => void; 
  // 【追加】放送局データを取得する関数を受け取る
  getMatchBroadcasters: (matchId: number) => MatchBroadcaster[];
}

export default function TeamView({ teamId, teams, matches, timeMode, setTimeMode, getMatchBroadcasters }: TeamViewProps) {
  const targetTeam = teams.find((t) => t.id === teamId);
  const myMatches = matches.filter(m => m.teamA.id === teamId || m.teamB.id === teamId);
  const players = playersData as Player[];

  if (!targetTeam) return <p className="text-gray-400">チームが見つかりません。</p>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* チーム情報ヘッダー */}
      <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-8 flex items-center gap-6">
        <Flag code={targetTeam.id} className="w-24 h-16 object-cover border border-gray-600 rounded-md shadow-lg" />
        <div>
          <h2 className="text-3xl font-bold text-white">{targetTeam.name}</h2>
        </div>
      </div>
   <div>
        <h2 className="text-xl font-bold text-blue-400 mb-4">登録メンバー</h2>
        <TeamPlayers teamId={teamId} players={players} />
      </div>
      {/* 試合日程セクション */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-2 mb-4 gap-4">
          <h2 className="text-xl font-bold text-blue-400">試合日程</h2>
          
          <div className="flex gap-2 bg-gray-950 p-1 rounded-lg text-sm border border-gray-800">
            <button 
              onClick={() => setTimeMode("browser")} 
              className={`px-3 py-1 rounded ${timeMode === "browser" ? "bg-gray-800 shadow font-bold text-white" : "text-gray-400 hover:bg-gray-800 transition-colors"}`}
            >
              端末時刻
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
          {myMatches.length > 0 ? (
            myMatches.map(m => (
              <MatchCard 
                key={m.id} 
                match={m} 
                teams={teams} 
                timeMode={timeMode} 
                highlightTeamId={teamId} 
                broadcasters={getMatchBroadcasters(m.id)} 
              />
            ))
          ) : (
            <p className="text-gray-400">試合データがありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}