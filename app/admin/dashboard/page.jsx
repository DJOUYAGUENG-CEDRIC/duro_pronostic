'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function StatCard({ label, value, sub }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: '#ffffff', border: '1px solid #bae6fd' }}
    >
      <p className="text-[10px] uppercase tracking-widest mb-1 font-bold" style={{ color: '#0e7490' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: '#0c3547' }}>{value ?? '—'}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{sub}</p>}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [dbError, setDbError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [page, setPage] = useState(0);
  const PER_PAGE = 20;

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      if (data.error) { setDbError(data.error); return; }
      setStats(data);
    } catch (e) {
      setDbError(e.message);
    }
  };

  const fetchConversations = async (offset = 0) => {
    try {
      const res = await fetch(`/api/admin/conversations?limit=${PER_PAGE}&offset=${offset}`);
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      if (data.error) return;
      setConversations(data.conversations ?? []);
      setTotal(data.total ?? 0);
    } catch { /* silent */ }
  };

  const openConversation = async (id) => {
    setSelected(id);
    setLoadingMsgs(true);
    const res = await fetch(`/api/admin/conversations/${id}`);
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoadingMsgs(false);
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  useEffect(() => { fetchStats(); fetchConversations(0); }, []);

  const totalPages = Math.ceil(total / PER_PAGE);
  const goPage = (n) => { setPage(n); fetchConversations(n * PER_PAGE); setSelected(null); };

  return (
    <div className="min-h-screen" style={{ background: '#f0f9ff', color: '#0c3547' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 shadow-sm"
        style={{ background: '#ffffff', borderBottom: '1px solid #bae6fd', borderTop: '3px solid #0e7490' }}
      >
        <p className="font-bold text-base" style={{ color: '#0c3547' }}>Duro Pronostic — Admin</p>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
          style={{ color: '#0e7490', background: '#e0f2fe', border: '1px solid #bae6fd' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#bae6fd'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#e0f2fe'; }}
        >
          Déconnexion
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Conversations" value={stats?.totalSessions} />
          <StatCard label="Messages" value={stats?.totalMessages} />
          <StatCard label="Aujourd'hui" value={stats?.todaySessions} sub="conversations" />
          <StatCard label="Aujourd'hui" value={stats?.todayMessages} sub="messages" />
        </div>

        {dbError && (
          <div
            className="rounded-xl px-4 py-3 text-xs font-mono break-all"
            style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48' }}
          >
            Erreur DB : {dbError}
          </div>
        )}

        <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>

          {/* Liste conversations */}
          <div
            className="flex-1 min-w-0 rounded-2xl overflow-hidden"
            style={{ background: '#ffffff', border: '1px solid #bae6fd' }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid #bae6fd' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#0e7490' }}>Conversations récentes</p>
              <p className="text-xs" style={{ color: '#94a3b8' }}>{total} total</p>
            </div>

            {conversations.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: '#94a3b8' }}>Aucune conversation pour l'instant.</p>
            ) : conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className="w-full text-left px-4 py-3 transition-colors"
                style={{
                  borderBottom: '1px solid #f0f9ff',
                  background: selected === c.id ? 'rgba(14,116,144,0.06)' : 'transparent',
                  borderLeft: selected === c.id ? '3px solid #0e7490' : '3px solid transparent',
                }}
                onMouseEnter={(e) => { if (selected !== c.id) e.currentTarget.style.background = '#f0f9ff'; }}
                onMouseLeave={(e) => { if (selected !== c.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-semibold" style={{ color: '#0e7490' }}>{c.id.slice(0, 8)}…</span>
                  <span className="text-[11px]" style={{ color: '#94a3b8' }}>{formatDate(c.updated_at)}</span>
                </div>
                <p className="text-sm truncate" style={{ color: '#0c3547' }}>{c.first_message ?? '(vide)'}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{c.message_count} messages</p>
              </button>
            ))}

            {totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-2 px-4 py-3"
                style={{ borderTop: '1px solid #bae6fd' }}
              >
                <button
                  onClick={() => goPage(page - 1)}
                  disabled={page === 0}
                  className="text-xs px-3 py-1 rounded-lg disabled:opacity-30 font-medium transition-colors"
                  style={{ color: '#0e7490', background: '#e0f2fe' }}
                >
                  ← Préc.
                </button>
                <span className="text-xs" style={{ color: '#94a3b8' }}>{page + 1} / {totalPages}</span>
                <button
                  onClick={() => goPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="text-xs px-3 py-1 rounded-lg disabled:opacity-30 font-medium transition-colors"
                  style={{ color: '#0e7490', background: '#e0f2fe' }}
                >
                  Suiv. →
                </button>
              </div>
            )}
          </div>

          {/* Détail conversation */}
          {selected && (
            <div
              className="w-80 shrink-0 rounded-2xl overflow-hidden"
              style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #bae6fd' }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between shrink-0"
                style={{ borderBottom: '1px solid #bae6fd' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#0e7490' }}>Conversation</p>
                <button
                  onClick={() => setSelected(null)}
                  className="text-lg leading-none transition-colors"
                  style={{ color: '#94a3b8' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0c3547'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: '#f0f9ff' }}>
                {loadingMsgs ? (
                  <p className="text-sm text-center py-6" style={{ color: '#94a3b8' }}>Chargement…</p>
                ) : messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                      style={m.role === 'user' ? {
                        background: 'linear-gradient(135deg, #0e7490, #0891b2)',
                        color: '#ffffff',
                      } : {
                        background: '#ffffff',
                        border: '1px solid #bae6fd',
                        color: '#0c3547',
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
