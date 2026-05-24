import Flag from "react-world-flags";
import { Player } from "../types/types";

interface TeamPlayersProps {
  teamId: string;
  players: Player[];
}

export default function TeamPlayers({ teamId, players }: TeamPlayersProps) {
  const teamPlayers = players.filter((p) => p.teamId === teamId);
  const positions = ["GK", "DF", "MF", "FW"];

  if (teamPlayers.length === 0) return null; // タイトルが外にあるので、空なら何も表示しない

  return (
    <div className="bg-gray-800/50 border border-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        {positions.map((pos) => {
          const playersInPos = teamPlayers.filter((p) => p.position === pos);
          if (playersInPos.length === 0) return null;

          return (
            <div key={pos}>
              <h3 className="text-base md:text-lg font-bold text-gray-200 mb-3 md:mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                <span className="bg-gray-700 px-2 py-0.5 rounded text-xs md:text-sm text-blue-300">
                  {pos}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {playersInPos.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-gray-900/50 rounded-lg border border-gray-700/50"
                  >
                    {/* 背番号バッジ（スマホ時は少し小さく） */}
                    <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-800 rounded-full font-bold text-blue-400 text-xs md:text-sm shrink-0">
                      {player.number || "-"}
                    </div>

                    {/* 選手情報（min-w-0 がスマホでの横揺れ・はみ出しを防ぐ要） */}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-sm md:text-base truncate">
                        {player.name}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <span className="shrink-0">
                          {player.position} / {player.age ? `${player.age}歳` : "-"} /{" "}
                        </span>
                        <span className="truncate">{player.club}</span>
                        <Flag
                          code={player.clubCountryId}
                          className="w-3.5 h-2.5 md:w-4 md:h-3 inline-block align-middle border border-gray-600 rounded-sm shrink-0"
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
