'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { avatarBg, avatarInitials } from '@/lib/avatar';

export default function ProfilePage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') window.location.replace('/login');
  }, [sessionStatus]);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

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

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen bg-fp-black">
      <div className="max-w-md mx-auto">
        <h1 className="text-white text-2xl font-bold mb-8">Mi Perfil</h1>

        {/* Avatar */}
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
    </div>
  );
}
