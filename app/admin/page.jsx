'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Mot de passe incorrect.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#f0f9ff' }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl p-8 shadow-lg"
        style={{ background: '#ffffff', border: '1px solid #bae6fd' }}
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: '#e0f2fe', color: '#0e7490' }}
          >
            <LockIcon />
          </div>
          <p className="text-xl font-bold" style={{ color: '#0c3547' }}>Duro Pronostic</p>
          <p className="text-sm mt-1 font-medium" style={{ color: '#0e7490' }}>Panel Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: '#f0f9ff',
              color: '#0c3547',
              border: '1px solid #bae6fd',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#0e7490'; e.target.style.boxShadow = '0 0 0 2px rgba(14,116,144,0.15)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#bae6fd'; e.target.style.boxShadow = 'none'; }}
          />
          {error && <p className="text-xs text-center" style={{ color: '#e11d48' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#0e7490' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
