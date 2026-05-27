'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { avatarBg, avatarInitials } from '@/lib/avatar';

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  approved: boolean | null;
  role: string | null;
  createdAt: string | null;
}

export default function ProfilePage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  // Admin panel state
  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'superadmin';
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') window.location.replace('/login');
  }, [sessionStatus]);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setUsers(await res.json());
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  if (sessionStatus === 'loading' || sessionStatus === 'unauthenticated') {
    return <div className="pt-24 flex justify-center"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const seed = name || session?.user?.email || 'U';

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      await update({ name });
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (email: string, approved: boolean) => {
    setApprovingId(email);
    try {
      await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, approved }),
      });
      await fetchUsers();
    } finally {
      setApprovingId(null);
    }
  };

  const pendingUsers = users.filter(u => !u.approved && u.role !== 'superadmin');
  const approvedUsers = users.filter(u => u.approved && u.role !== 'superadmin');

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-12 min-h-screen bg-fp-black pb-16">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* ── Perfil ── */}
        <div className="max-w-md mx-auto">
          <h1 className="text-white text-xl sm:text-2xl font-bold mb-5 sm:mb-8">Mi Perfil</h1>

          <div className="flex justify-center mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold select-none ring-2 ring-white/10"
              style={{ backgroundColor: avatarBg(seed) }}
            >
              {avatarInitials(seed)}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-fp-elevated text-white p-3 rounded-lg border border-fp-border outline-none focus:border-red-600/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={session?.user?.email ?? ''}
                readOnly
                className="w-full bg-fp-surface text-gray-500 p-3 rounded-lg border border-fp-border cursor-not-allowed"
              />
            </div>

            {isAdmin && (
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Rol</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                  {session?.user?.role === 'superadmin' ? '⭐ Superadmin' : '🛡 Admin'}
                </span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="w-full bg-[#e50914] text-white font-semibold py-3 rounded-lg hover:bg-[#c2070f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : status === 'saved' ? '¡Guardado!' : 'Guardar cambios'}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">Error al guardar. Intentá de nuevo.</p>
            )}
          </div>
        </div>

        {/* ── Panel de Admin ── */}
        {isAdmin && (
          <div className="border-t border-fp-border pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-bold">Gestión de usuarios</h2>
              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="text-xs text-gray-400 hover:text-white transition-colors border border-fp-border rounded px-3 py-1.5"
              >
                {loadingUsers ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>

            {/* Pendientes */}
            {pendingUsers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  Pendientes de aprobación ({pendingUsers.length})
                </h3>
                <div className="space-y-2">
                  {pendingUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between bg-fp-elevated rounded-lg px-4 py-3 border border-fp-border">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{u.name || '—'}</p>
                        <p className="text-gray-400 text-xs truncate">{u.email}</p>
                      </div>
                      <button
                        onClick={() => handleApprove(u.email, true)}
                        disabled={approvingId === u.email}
                        className="ml-4 shrink-0 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {approvingId === u.email ? '...' : 'Aprobar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingUsers.length === 0 && !loadingUsers && (
              <p className="text-gray-500 text-sm mb-8">No hay usuarios pendientes de aprobación.</p>
            )}

            {/* Aprobados */}
            {approvedUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                  Usuarios con acceso ({approvedUsers.length})
                </h3>
                <div className="space-y-2">
                  {approvedUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between bg-fp-surface rounded-lg px-4 py-3 border border-fp-border">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{u.name || '—'}</p>
                        <p className="text-gray-400 text-xs truncate">{u.email}</p>
                        {u.role === 'admin' && (
                          <span className="text-xs text-blue-400">Admin</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleApprove(u.email, false)}
                        disabled={approvingId === u.email}
                        className="ml-4 shrink-0 text-xs text-gray-500 hover:text-red-400 transition-colors border border-fp-border hover:border-red-500/40 px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {approvingId === u.email ? '...' : 'Revocar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
