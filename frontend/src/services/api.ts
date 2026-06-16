import axios from 'axios';
import { Match, Player, Team, CreateMatchDto } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Matches
export const getMatches = () => api.get<Match[]>('/matches').then(r => r.data);
export const getMatch = (id: string) => api.get<Match>(`/matches/${id}`).then(r => r.data);
export const createMatch = (dto: CreateMatchDto) => api.post<Match>('/matches', dto).then(r => r.data);
export const updateScore = (id: string, homeScore: number, awayScore: number) =>
  api.patch<Match>(`/matches/${id}/score`, { homeScore, awayScore }).then(r => r.data);
export const updateStatus = (id: string, status: Match['status']) =>
  api.patch<Match>(`/matches/${id}/status`, { status }).then(r => r.data);
export const deleteMatch = (id: string) => api.delete(`/matches/${id}`);

// Players
export const getPlayers = () => api.get<Player[]>('/players').then(r => r.data);
export const getPlayer = (id: string) => api.get<Player>(`/players/${id}`).then(r => r.data);
export const createPlayer = (dto: Omit<Player, 'id'>) => api.post<Player>('/players', dto).then(r => r.data);

// Teams / Standings
export const getStandings = (sport?: string) =>
  api.get<Team[]>('/teams/standings', { params: { sport } }).then(r => r.data);

export default api;
