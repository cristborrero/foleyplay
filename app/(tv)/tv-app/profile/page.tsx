'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { avatarBg, avatarInitials } from '@/lib/avatar';

export default function TVProfilePage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') window.location.replace('/login');
  }, [sessionStatus]);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  if (sessionStatus === 'loading' || sessionStatus === 'unauthenticated') {
    return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const seed = name || session?.user?.email || 'U';

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error();
      await update({ name });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch { setSaveStatus('error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="overflow-y-auto h-full [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-sm mx-auto px-6 py-8">
        <h1 className="text-white text-xl font-bold mb-6">Mi Perfil</h1>
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold select-none ring-2 ring-white/10"
            style={{ backgroundColor: avatarBg(seed) }}>
            {avatarInitials(seed)}
          </div>
        </div>
        <div data-tv-row className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg border border-[#333] outline-none focus:border-red-500 transition-all" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Email</label>
            <input type="email" value={session?.user?.email ?? ''} readOnly
              className="w-full bg-[#111] text-gray-500 p-3 rounded-lg border border-[#222] cursor-not-allowed" />
          </div>
          <button data-tv-card tabIndex={0} onClick={handleSave} disabled={saving || !name.trim()}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 focus:bg-red-700 transition-colors disabled:opacity-60 outline-none focus:ring-2 focus:ring-red-400">
            {saving ? 'Guardando...' : saveStatus === 'saved' ? '¡Guardado!' : 'Guardar cambios'}
          </button>
          {saveStatus === 'error' && <p className="text-red-400 text-sm text-center">Error al guardar. Intentá de nuevo.</p>}
          <hr className="border-[#222]" />
          <button data-tv-card tabIndex={0} onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full bg-[#1a1a1a] text-red-400 font-semibold py-3 rounded-lg hover:bg-red-950/30 focus:bg-red-950/30 transition-colors outline-none focus:ring-2 focus:ring-red-500">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
