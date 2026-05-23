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