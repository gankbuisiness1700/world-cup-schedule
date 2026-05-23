export interface MatchTeam {
  id: string;
  score: number | null;
  result: string;
}

export interface Match {
  id: number;
  utcDate: string;
  venueTimezone: string;
  venueName: string;
  teamA: MatchTeam;
  teamB: MatchTeam;
  status: string;
  group: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Broadcaster {
  id: string;
  name: string;
  type: string; 
}

export interface MatchBroadcaster extends Broadcaster {
  playByPlay: string | null;
  commentator: string | null;
}

export interface Player {
  id: string;
  teamId: string;
  number: number; // 【追加】
  name: string;
  position: string;
  age: number;
  club: string;
  clubCountryId: string;
}