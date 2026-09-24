'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROFILE_IMAGE, ASSISTANT_NAME } from '@/lib/config';

function BurgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect y="2" width="18" height="2" rx="1" fill="currentColor"/>
      <rect y="8" width="18" height="2" rx="1" fill="currentColor"/>
      <rect y="14" width="18" height="2" rx="1" fill="currentColor"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header
      className="shrink-0 flex items-center gap-3 px-4 py-3 z-10 relative shadow-sm"
      style={{
        background: '#121212',
        borderBottom: '1px solid #2a2a2a',
        borderTop: '3px solid #3b82f6',
      }}
    >
      <div className="relative shrink-0">
        <img
          src={PROFILE_IMAGE}
          alt={ASSISTANT_NAME}
          className="w-11 h-11 rounded-full object-cover"
          style={{ boxShadow: '0 0 0 2px #3b82f6' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='24' fill='%230e7490'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-size='16' font-family='sans-serif' font-weight='bold'%3EDP%3C/text%3E%3C/svg%3E";
          }}
        />
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
          style={{ background: '#3b82f6', boxShadow: '0 0 0 2px #121212' }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate leading-tight" style={{ color: '#ededed' }}>
          {ASSISTANT_NAME}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#3b82f6' }} />
          <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>En ligne</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
        style={{
          color: '#a3a3a3',
          background: menuOpen ? 'rgba(59,130,246,0.1)' : 'transparent',
        }}
        aria-label="Menu"
      >
        {menuOpen ? <CloseIcon /> : <BurgerIcon />}
      </button>

      {menuOpen && (
        <div
          className="absolute top-full right-3 mt-2 w-52 rounded-xl overflow-hidden z-50 shadow-lg"
          style={{ background: '#121212', border: '1px solid #2a2a2a' }}
        >
          <button
            type="button"
            onClick={() => { setMenuOpen(false); router.push('/admin'); }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors"
            style={{ color: '#a3a3a3' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.color = '#3b82f6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a3a3a3'; }}
          >
            <span style={{ color: '#3b82f6' }}><LockIcon /></span>{' '}
            Connexion Admin
          </button>
        </div>
      )}

      {menuOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 cursor-default"
          style={{ background: 'transparent', border: 'none' }}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setMenuOpen(false); }}
        />
      )}
    </header>
  );
}
