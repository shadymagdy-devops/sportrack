import React, { useEffect, useState } from 'react';
import { Match, Team } from '../types';
import { getMatches, getStandings } from '../services/api';
import MatchCard from '../components/MatchCard';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMatches(), getStandings()])
      .then(([m, t]) => { setMatches(m); setTeams(t); })
      .catch(() => {
        // Demo data when API is not running
        setMatches([
          { id: '1', homeTeam: 'Al Ahly', awayTeam: 'Zamalek', homeScore: 2, awayScore: 1, sport: 'Football', status: 'live', matchDate: new Date().toISOString(), venue: 'Cairo Stadium' },
          { id: '2', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 0, awayScore: 0, sport: 'Football', status: 'scheduled', matchDate: new Date(Date.now() + 86400000).toISOString(), venue: 'Santiago Bernabeu' },
          { id: '3', homeTeam: 'Lakers', awayTeam: 'Bulls', homeScore: 98, awayScore: 94, sport: 'Basketball', status: 'finished', matchDate: new Date(Date.now() - 86400000).toISOString(), venue: 'Staples Center' },
        ]);
        setTeams([
          { id: '1', name: 'Al Ahly', sport: 'Football', wins: 18, losses: 2, draws: 4, points: 58 },
          { id: '2', name: 'Zamalek', sport: 'Football', wins: 15, losses: 4, draws: 5, points: 50 },
          { id: '3', name: 'Pyramids FC', sport: 'Football', wins: 13, losses: 6, draws: 5, points: 44 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled').slice(0, 3);

  const stats = [
    { label: 'LIVE NOW', value: liveMatches.length, color: '#ff4060' },
    { label: 'TOTAL MATCHES', value: matches.length, color: 'var(--accent)' },
    { label: 'TEAMS', value: teams.length, color: '#40a9ff' },
    { label: 'FINISHED', value: matches.filter(m => m.status === 'finished').length, color: 'var(--green)' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'var(--muted)', letterSpacing: '4px' }}>
        LOADING...
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          lineHeight: 0.9,
          letterSpacing: '-1px',
          marginBottom: '0.75rem',
        }}>
          <span style={{ color: 'var(--text)' }}>SPORT</span><br />
          <span style={{ color: 'var(--accent)', WebkitTextStroke: '1px var(--accent)' }}>DASHBOARD</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', letterSpacing: '2px' }}>
          REAL-TIME SCORES · STANDINGS · STATS
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {stats.map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.5rem', color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '2px', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Live Matches */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4060', boxShadow: '0 0 8px #ff4060', display: 'inline-block', animation: 'pulse 1s infinite' }} />
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '2px', color: 'var(--text)' }}>LIVE MATCHES</h2>
          </div>
          {liveMatches.length === 0 ? (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
              No live matches right now
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '2px', marginBottom: '1rem', color: 'var(--text)' }}>
            UPCOMING
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      </div>

      {/* Top Teams */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '2px', marginBottom: '1rem', color: 'var(--text)' }}>TOP STANDINGS</h2>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['#', 'TEAM', 'SPORT', 'W', 'D', 'L', 'PTS'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: h === 'TEAM' ? 'left' : 'center', color: 'var(--muted)', letterSpacing: '1px', fontWeight: 600, fontSize: '0.7rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.slice(0, 5).map((t, i) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: i === 0 ? 'var(--accent)' : 'var(--muted)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{t.name}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.7rem' }}>{t.sport}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--green)' }}>{t.wins}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--muted)' }}>{t.draws}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--accent2)' }}>{t.losses}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--accent)' }}>{t.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
};

export default Dashboard;
