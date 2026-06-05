export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  status: 'scheduled' | 'live' | 'finished';
  matchDate: string;
  venue: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  sport: string;
  goals?: number;
  assists?: number;
  points?: number;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
}

export interface CreateMatchDto {
  homeTeam: string;
  awayTeam: string;
  sport: string;
  matchDate: string;
  venue: string;
}
