import React, { useEffect, useState } from 'react';
import { Team } from '../types';
import { getStandings } from '../services/api';

const Standings: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [sport, setSport] = useState<string>('Football');

  useEffect(() => {
    getStandings(sport)
      .then(setTeams)
      .catch(() => setTeams([
        { id: '1', name: 'Al Ahly', sport: 'Football', wins: 18, losses: 2, draws: 4, points: 58 },
        { id: '2', name: 'Zamalek', sport: 'Football', wins: 15, losses: 4, draws: 5, points: 50 },
        { id: '3', name: 'Pyramids FC', sport: 'Football', wins: 13, losses: 6, draws: 5, points: 44 },
        { id: '4', name: 'Smouha', sport: 'Football', wins: 11, losses: 8, draws: 5, points: 38 },
        { id: '5', name: 'Ismaily', sport: 'Football', wins: 9, losses: 10, draws: 5, points: 32 },
        { id: '6', name: 'El Gouna', sport: 'Football', wins: 7, losses: 12, draws: 5, points: 26 },
      ]));
  }, [sport]);

  const sports = ['Football', 'Basketball', 'Tennis'];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: '3rem', letterSpacing: '2px' }}>STANDINGS</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', letterSpacing: '1.5px' }}>LEAGUE TABLE</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {sports.map(s => (
          <button key={s} onClick={() => setSport(s)} style={{
            padding: '0.4rem 1.25rem',
            border: `1px solid ${sport === s ? 'var(--accent)' : 'var(--border)'}`,
            background: sport === s ? 'rgba(232,255,0,0.08)' : 'transparent',
            color: sport === s ? 'var(--accent)' : 'var(--muted)',
            borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s',
          }}>{s.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              {['#', 'TEAM', 'P', 'W', 'D', 'L', 'GD', 'PTS'].map(h => (
                <th key={h} style={{
                  padding: '1rem',
                  textAlign: h === 'TEAM' ? 'left' : 'center',
                  color: 'var(--muted)', letterSpacing: '1.5px',
                  fontWeight: 600, fontSize: '0.68rem',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((t, i) => {
              const played = t.wins + t.losses + t.draws;
              const gd = (t.wins * 2) - t.losses;
              const isTop3 = i < 3;
              return (
                <tr key={t.id}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.85rem',
                      color: i === 0 ? 'var(--accent)' : i < 3 ? 'var(--green)' : 'var(--muted)',
                    }}>{i + 1}</span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isTop3 && (
                        <span style={{
                          width: 3, height: '1.4rem', borderRadius: '2px',
                          background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--green)' : '#40a9ff',
                          display: 'inline-block',
                        }} />
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center', color: 'var(--muted)' }}>{played}</td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center', color: 'var(--green)', fontWeight: 600 }}>{t.wins}</td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center', color: 'var(--muted)' }}>{t.draws}</td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center', color: 'var(--accent2)', fontWeight: 600 }}>{t.losses}</td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center', color: gd >= 0 ? 'var(--green)' : 'var(--accent2)', fontFamily: 'JetBrains Mono' }}>
                    {gd >= 0 ? `+${gd}` : gd}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1rem',
                      color: i === 0 ? 'var(--accent)' : 'var(--text)',
                    }}>{t.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.7rem', color: 'var(--muted)' }}>
        {[
          { color: 'var(--accent)', label: 'Champion' },
          { color: 'var(--green)', label: 'Champions League' },
          { color: '#40a9ff', label: 'Europa League' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '2px', background: color, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Standings;
