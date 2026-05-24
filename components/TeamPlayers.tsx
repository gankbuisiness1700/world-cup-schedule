import Flag from "react-world-flags";
import { Player } from "./types";

interface TeamPlayersProps {
  teamId: string;
  players: Player[];
}

export default function TeamPlayers({ teamId, players }: TeamPlayersProps) {
  const teamPlayers = players.filter(p => p.teamId === teamId);
  const positions = ["GK", "DF", "MF", "FW"];

  if (teamPlayers.length === 0) return null; // タイトルが外にあるので、空なら何も表示しない

  return (
    <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-6">
      <div className="space-y-8">
        {positions.map(pos => {
          const playersInPos = teamPlayers.filter(p => p.position === pos);
          if (playersInPos.length === 0) return null;

          return (
            <div key={pos}>
              <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                <span className="bg-gray-700 px-2 py-0.5 rounded text-sm text-blue-300">{pos}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playersInPos.map(player => (
                  <div key={player.id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full font-bold text-blue-400 text-sm shrink-0">
                      {player.number || "-"}
                    </div>
                    <div>
                      <p className="font-bold text-white">{player.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                        {player.position} / {player.age}歳 / {player.club}
                        <Flag 
                          code={player.clubCountryId} 
                          className="w-4 h-3 inline-block align-middle border border-gray-600 rounded-sm shrink-0" 
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