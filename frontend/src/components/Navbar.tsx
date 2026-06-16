import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'DASHBOARD' },
    { to: '/matches', label: 'MATCHES' },
    { to: '/standings', label: 'STANDINGS' },
    { to: '/players', label: 'PLAYERS' },
  ];

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '3rem' }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          color: 'var(--accent)',
          letterSpacing: '2px',
        }}>SPOR</span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          color: 'var(--text)',
          letterSpacing: '2px',
        }}>TRACK</span>
        <span style={{
          background: 'var(--accent2)',
          color: '#fff',
          fontSize: '0.55rem',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: '3px',
          letterSpacing: '1px',
          alignSelf: 'flex-start',
          marginTop: '8px',
        }}>LIVE</span>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              padding: '0.5rem 1rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textDecoration: 'none',
              color: pathname === to ? 'var(--accent)' : 'var(--muted)',
              borderBottom: pathname === to ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 8px var(--green)',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>API CONNECTED</span>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </nav>
  );
};

export default Navbar;
