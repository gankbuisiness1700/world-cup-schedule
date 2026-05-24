import { useState } from "react";
import Flag from "react-world-flags";
import { Match, Team, MatchBroadcaster } from "../types/types";

interface MatchCardProps {
  match: Match;
  teams: Team[];
  timeMode: "browser" | "venue";
  highlightTeamId?: string;
  broadcasters?: MatchBroadcaster[];
}

export default function MatchCard({
  match,
  teams,
  timeMode,
  highlightTeamId,
  broadcasters = [],
}: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || "不明";

  const formatDateTime = (utcString: string, timezone: string) => {
    const date = new Date(utcString);
    return new Intl.DateTimeFormat("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeMode === "venue" ? timezone : undefined,
    }).format(date);
  };

  const isTeamA = highlightTeamId === match.teamA.id;
  const isTeamB = highlightTeamId === match.teamB.id;

  const getBadgeStyle = (type: string, id: string) => {
    if (id === "abema" || id === "dazn")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-700/50";
    if (type === "tv") return "bg-blue-600/20 text-blue-400 border-blue-700/50";
    return "bg-gray-700/50 text-gray-300 border-gray-600";
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-gray-800/50 border border-gray-800 p-4 md:p-6 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer select-none"
    >
      {/* --- メインの試合情報 --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 w-full">
        {/* 左側：日時 */}
        <div className="text-gray-400 text-sm text-center md:text-left w-full md:w-auto shrink-0">
          <p className="text-white font-bold text-base md:text-lg">
            {formatDateTime(match.utcDate, match.venueTimezone)}
          </p>
          <p className="text-[11px] md:text-xs mt-0.5 md:mt-1">
            {timeMode === "browser" ? "端末時刻" : `現地時間(${match.venueName})`}
          </p>
          {!highlightTeamId && (
            <p className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-gray-300">
              グループ {match.group}
            </p>
          )}
        </div>

        {/* 中央：対戦カード ＋ 開催都市 */}
        <div className="flex flex-col items-center w-full md:flex-1">
          <div className="flex items-center justify-center gap-2 md:gap-4 text-sm md:text-lg font-bold w-full">
            {/* チームA (flex-1 と min-w-0 でスマホ時の押し出し崩れを防ぐ) */}
            <div
              className={`flex items-center gap-1.5 md:gap-2 flex-1 md:flex-none md:w-36 justify-end min-w-0 ${isTeamA ? "text-blue-300" : "text-white"}`}
            >
              <span className="truncate leading-tight text-right">
                {getTeamName(match.teamA.id)}
              </span>
              <Flag
                code={match.teamA.id}
                className="w-6 h-4 md:w-8 md:h-5 object-cover border border-gray-700 rounded-sm shrink-0"
              />
            </div>

            {/* スコア */}
            <div className="px-2 py-1 md:px-3 md:py-1 bg-gray-900 rounded-lg text-base md:text-xl min-w-[60px] md:min-w-[70px] text-center border border-gray-800 text-white shrink-0">
              {match.status === "未試合" ? "vs" : `${match.teamA.score} - ${match.teamB.score}`}
            </div>

            {/* チームB */}
            <div
              className={`flex items-center gap-1.5 md:gap-2 flex-1 md:flex-none md:w-36 justify-start min-w-0 ${isTeamB ? "text-blue-300" : "text-white"}`}
            >
              <Flag
                code={match.teamB.id}
                className="w-6 h-4 md:w-8 md:h-5 object-cover border border-gray-700 rounded-sm shrink-0"
              />
              <span className="truncate leading-tight text-left">
                {getTeamName(match.teamB.id)}
              </span>
            </div>
          </div>

          <div className="text-gray-400 text-[11px] md:text-xs mt-2 flex items-center gap-1 text-center">
            {match.venueName}
          </div>
        </div>

        {/* 右側：ステータス ＋ 開閉アイコン */}
        <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <div className="text-xs md:text-sm font-bold text-blue-400 w-auto md:w-16 text-center">
            {match.status}
          </div>
          <div className="text-gray-500 w-4 text-center">{isExpanded ? "▲" : "▼"}</div>
        </div>
      </div>

      {/* --- 展開される詳細部分（放送局・実況・解説） --- */}
      {isExpanded && (
        <div
          className="mt-4 pt-4 border-t border-gray-700 w-full cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xs md:text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
            放送・配信予定
          </h3>

          {broadcasters.length > 0 ? (
            <div className="space-y-3">
              {broadcasters.map((b, index) => (
                <div
                  key={`${b.id}-${index}`}
                  className="bg-gray-900/50 rounded-lg p-3 md:p-4 border border-gray-700 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                >
                  {/* 放送局バッジ */}
                  <div className="w-full md:w-24 shrink-0">
                    <span
                      className={`px-2 py-1 text-[11px] md:text-xs font-bold border rounded-md inline-block text-center md:w-full ${getBadgeStyle(b.type, b.id)}`}
                    >
                      {b.name}
                    </span>
                  </div>

                  {/* 実況・解説 */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2 text-[12px] md:text-sm text-gray-300">
                    <p className="truncate">
                      <span className="text-gray-500 mr-2 text-[11px] md:text-xs">実況:</span>
                      {b.playByPlay}
                    </p>
                    <p className="truncate">
                      <span className="text-gray-500 mr-2 text-[11px] md:text-xs">解説:</span>
                      {b.commentator}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs md:text-sm">現在、放送・配信の予定はありません。</p>
          )}
        </div>
      )}
    </div>
  );
}
