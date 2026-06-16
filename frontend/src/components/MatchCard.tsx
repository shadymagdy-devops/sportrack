import React from 'react';
import { Match } from '../types';

interface Props {
  match: Match;
  onUpdateScore?: (id: string) => void;
}

const statusColors: Record<Match['status'], string> = {
  live: '#ff4060',
  scheduled: '#40a9ff',
  finished: '#5a5a7a',
};

const sportEmoji: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  rugby: '🏉',
  cricket: '🏏',
};

const MatchCard: React.FC<Props> = ({ match, onUpdateScore }) => {
  const isLive = match.status === 'live';

  return (
    <div style={{
      background: 'var(--card)',
      border: `1px solid ${isLive ? 'rgba(255,64,96,0.3)' : 'var(--border)'}`,
      borderRadius: '12px',
      padding: '1.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = isLive ? '#ff4060' : 'var(--muted)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = isLive ? 'rgba(255,64,96,0.3)' : 'var(--border)')}
    >
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #ff4060, transparent)',
          animation: 'shimmer 2s infinite',
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.1rem' }}>{sportEmoji[match.sport.toLowerCase()] || '🏆'}</span>
        <span style={{
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px',
          color: statusColors[match.status],
          border: `1px solid ${statusColors[match.status]}`,
          padding: '2px 8px', borderRadius: '20px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          {isLive && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff4060', display: 'inline-block', animation: 'pulse 1s infinite' }} />}
          {match.status.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.35rem', letterSpacing: '0.5px' }}>HOME</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{match.homeTeam}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2rem',
            letterSpacing: '4px',
            color: isLive ? 'var(--accent)' : 'var(--text)',
            lineHeight: 1,
          }}>
            {match.status === 'scheduled' ? 'VS' : `${match.homeScore} - ${match.awayScore}`}
          </div>
          {match.status === 'scheduled' && (
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem', fontFamily: 'JetBrains Mono' }}>
              {new Date(match.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.35rem', letterSpacing: '0.5px' }}>AWAY</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{match.awayTeam}</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>📍 {match.venue}</span>
        {isLive && onUpdateScore && (
          <button
            onClick={() => onUpdateScore(match.id)}
            style={{
              background: 'var(--accent)', color: '#000',
              border: 'none', padding: '4px 12px',
              borderRadius: '6px', fontSize: '0.7rem',
              fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px',
            }}
          >UPDATE SCORE</button>
        )}
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200%} 100%{background-position:200%} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
};

export default MatchCard;
