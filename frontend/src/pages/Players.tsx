import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { getPlayers } from '../services/api';

const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPlayers().then(setPlayers).catch(() => setPlayers([
      { id: '1', name: 'Mohamed Salah', team: 'Liverpool', position: 'Forward', sport: 'Football', goals: 28, assists: 11, points: 0 },
      { id: '2', name: 'Karim Benzema', team: 'Al Ittihad', position: 'Forward', sport: 'Football', goals: 24, assists: 8, points: 0 },
      { id: '3', name: 'Amr Warda', team: 'PAOK', position: 'Midfielder', sport: 'Football', goals: 12, assists: 15, points: 0 },
      { id: '4', name: 'LeBron James', team: 'Lakers', position: 'Forward', sport: 'Basketball', goals: 0, assists: 8, points: 27 },
      { id: '5', name: 'Stephen Curry', team: 'Warriors', position: 'Guard', sport: 'Basketball', goals: 0, assists: 6, points: 31 },
      { id: '6', name: 'Carlos Alcaraz', team: 'Spain', position: 'Singles', sport: 'Tennis', goals: 0, assists: 0, points: 9000 },
    ]));
  }, []);

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase())
  );

  const positionColor: Record<string, string> = {
    Forward: 'var(--accent2)',
    Midfielder: '#40a9ff',
    Guard: '#40a9ff',
    Defender: 'var(--green)',
    Goalkeeper: 'var(--muted)',
    Singles: 'var(--accent)',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: '3rem', letterSpacing: '2px' }}>PLAYERS</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', letterSpacing: '1.5px' }}>ATHLETE STATS & PROFILES</p>
        </div>
        <input
          placeholder="Search player or team..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '0.6rem 1rem',
            color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
            width: '250px',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((p, i) => (
          <div key={p.id} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.25rem',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '10px',
                background: `hsl(${(i * 47) % 360}, 60%, 35%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: '#fff',
                letterSpacing: '1px',
              }}>
                {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span style={{
                fontSize: '0.65rem', letterSpacing: '1px', fontWeight: 600,
                color: positionColor[p.position] || 'var(--muted)',
                border: `1px solid ${positionColor[p.position] || 'var(--muted)'}`,
                padding: '2px 8px', borderRadius: '20px',
              }}>{p.position.toUpperCase()}</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.team} · {p.sport}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {p.sport === 'Basketball' ? (
                <>
                  <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'var(--accent)', lineHeight: 1 }}>{p.points}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: '2px' }}>PPG</div>
                  </div>
                  <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'var(--green)', lineHeight: 1 }}>{p.assists}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: '2px' }}>APG</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'var(--accent2)', lineHeight: 1 }}>{p.goals}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: '2px' }}>GOALS</div>
                  </div>
                  <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'var(--blue)', lineHeight: 1 }}>{p.assists}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: '2px' }}>ASSISTS</div>
                  </div>
                </>
              )}
              <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'var(--accent)', lineHeight: 1 }}>
                  {p.sport === 'Tennis' ? p.points : ((p.goals || 0) + (p.assists || 0))}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: '2px' }}>
                  {p.sport === 'Tennis' ? 'RANKING' : 'CONTRIB'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Players;
