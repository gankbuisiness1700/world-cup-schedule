import Flag from "react-world-flags";
import { Match, Team } from "./types";

interface MatchCardProps {
  match: Match;
  teams: Team[];
  timeMode: "browser" | "venue";
  highlightTeamId?: string; // 特定のチームを強調表示したい場合
}

export default function MatchCard({ match, teams, timeMode, highlightTeamId }: MatchCardProps) {
  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || "不明";

  const formatDateTime = (utcString: string, timezone: string) => {
    const date = new Date(utcString);
    return new Intl.DateTimeFormat("ja-JP", {
      month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
      timeZone: timeMode === "venue" ? timezone : undefined,
    }).format(date);
  };

  const isTeamA = highlightTeamId === match.teamA.id;
  const isTeamB = highlightTeamId === match.teamB.id;

  return (
    <div className="bg-gray-800/50 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-800 transition-colors">
      <div className="text-gray-400 text-sm text-center md:text-left">
        <p className="text-white font-bold text-lg">{formatDateTime(match.utcDate, match.venueTimezone)}</p>
        <p className="text-xs mt-1">{timeMode === "browser" ? "端末時刻" : `現地 (${match.venueName})`}</p>
        {!highlightTeamId && <p className="mt-2 font-semibold text-gray-300">グループ {match.group}</p>}
      </div>
      <div className="flex items-center gap-2 md:gap-4 text-lg font-bold">
        <div className={`flex items-center gap-2 w-28 md:w-36 justify-end ${isTeamA ? "text-blue-300" : "text-white"}`}>
          <span>{getTeamName(match.teamA.id)}</span>
          <Flag code={match.teamA.id} className="w-8 h-5 object-cover border border-gray-700 rounded-sm shrink-0" />
        </div>
        <div className="px-3 py-1 bg-gray-900 rounded-lg text-xl min-w-[70px] text-center border border-gray-800 text-white">
          {match.status === "未試合" ? "vs" : `${match.teamA.score} - ${match.teamB.score}`}
        </div>
        <div className={`flex items-center gap-2 w-28 md:w-36 justify-start ${isTeamB ? "text-blue-300" : "text-white"}`}>
          <Flag code={match.teamB.id} className="w-8 h-5 object-cover border border-gray-700 rounded-sm shrink-0" />
          <span>{getTeamName(match.teamB.id)}</span>
        </div>
      </div>
      <div className="text-sm font-bold text-blue-400 w-20 text-center">{match.status}</div>
    </div>
  );
}