import Flag from "react-world-flags";
import { Player } from "./types";

interface TeamPlayersProps {
  teamId: string;
  players: Player[];
}

export default function TeamPlayers({ teamId, players }: TeamPlayersProps) {
  const teamPlayers = players.filter(p => p.teamId === teamId);

  if (teamPlayers.length === 0) return null;

  return (
    <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-blue-400 mb-4">登録メンバー</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamPlayers.map(player => (
          <div key={player.id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full font-bold text-blue-400 text-sm">
              {player.number}
            </div>
            <div>
              <p className="font-bold text-white">{player.name}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
      {player.position} / {player.age}歳 / {player.club}
      <Flag 
        code={player.clubCountryId} 
        className="w-4 h-3 inline-block align-middle border border-gray-600 rounded-sm" 
      />
    </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}