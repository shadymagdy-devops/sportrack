import React, { useEffect, useState } from 'react';
import { Match, CreateMatchDto } from '../types';
import { getMatches, createMatch } from '../services/api';
import MatchCard from '../components/MatchCard';

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<'all' | Match['status']>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateMatchDto>({ homeTeam: '', awayTeam: '', sport: 'Football', matchDate: '', venue: '' });

  const load = () =>
    getMatches()
      .then(setMatches)
      .catch(() => setMatches([
        { id: '1', homeTeam: 'Al Ahly', awayTeam: 'Zamalek', homeScore: 2, awayScore: 1, sport: 'Football', status: 'live', matchDate: new Date().toISOString(), venue: 'Cairo Stadium' },
        { id: '2', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 0, awayScore: 0, sport: 'Football', status: 'scheduled', matchDate: new Date(Date.now() + 86400000).toISOString(), venue: 'Bernabeu' },
        { id: '3', homeTeam: 'Lakers', awayTeam: 'Bulls', homeScore: 98, awayScore: 94, sport: 'Basketball', status: 'finished', matchDate: new Date(Date.now() - 86400000).toISOString(), venue: 'Staples Center' },
        { id: '4', homeTeam: 'Chelsea', awayTeam: 'Arsenal', homeScore: 1, awayScore: 1, sport: 'Football', status: 'finished', matchDate: new Date(Date.now() - 172800000).toISOString(), venue: 'Stamford Bridge' },
      ]));

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? matches : matches.filter(m => m.status === filter);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const m = await createMatch(form);
      setMatches(prev => [m, ...prev]);
    } catch {
      // Demo mode
      setMatches(prev => [{
        id: Date.now().toString(), ...form,
        homeScore: 0, awayScore: 0, status: 'scheduled',
      }, ...prev]);
    }
    setShowForm(false);
    setForm({ homeTeam: '', awayTeam: '', sport: 'Football', matchDate: '', venue: '' });
  };

  const filterBtns: Array<typeof filter> = ['all', 'live', 'scheduled', 'finished'];
  const filterColors = { all: 'var(--text)', live: '#ff4060', scheduled: '#40a9ff', finished: 'var(--muted)' };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: '3rem', letterSpacing: '2px' }}>MATCHES</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', letterSpacing: '1.5px' }}>{filtered.length} RESULTS</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: 'var(--accent)', color: '#000', border: 'none',
          padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700,
          fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '1px',
        }}>+ NEW MATCH</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {filterBtns.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.4rem 1rem', border: `1px solid ${filter === f ? filterColors[f] : 'var(--border)'}`,
            background: filter === f ? 'rgba(255,255,255,0.05)' : 'transparent',
            color: filter === f ? filterColors[f] : 'var(--muted)',
            borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s',
          }}>{f.toUpperCase()}</button>
        ))}
      </div>

      {/* New Match Form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
        }}>
          <h3 style={{ gridColumn: '1/-1', fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '2px' }}>CREATE MATCH</h3>
          {[
            { key: 'homeTeam', label: 'HOME TEAM' },
            { key: 'awayTeam', label: 'AWAY TEAM' },
            { key: 'venue', label: 'VENUE' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
              <input
                required
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{
                  width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '0.6rem 0.75rem', color: 'var(--text)',
                  fontSize: '0.85rem', outline: 'none',
                }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.35rem' }}>SPORT</label>
            <select value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}
              style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 0.75rem', color: 'var(--text)', fontSize: '0.85rem', outline: 'none' }}>
              {['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.35rem' }}>MATCH DATE</label>
            <input type="datetime-local" required value={form.matchDate} onChange={e => setForm(f => ({ ...f, matchDate: e.target.value }))}
              style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 0.75rem', color: 'var(--text)', fontSize: '0.85rem', outline: 'none' }} />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.8rem' }}>CANCEL</button>
            <button type="submit" style={{ padding: '0.5rem 1.25rem', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>CREATE</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filtered.map(m => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  );
};

export default Matches;
