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

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-fp-surface border border-fp-border rounded-xl overflow-hidden">
      {children}
    </div>
  );
}

function SectionHeader({ title, description, badge }: {
  title: string;
  description?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between px-6 py-5 border-b border-fp-border">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-white text-sm font-semibold tracking-tight">{title}</h2>
          {badge}
        </div>
        {description && <p className="text-fp-muted text-xs mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}

function InputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  readOnly = false,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 py-5 border-b border-fp-border last:border-b-0">
      <label
        htmlFor={id}
        className="text-xs font-medium text-fp-muted uppercase tracking-wider shrink-0 sm:w-32 sm:pt-2.5"
      >
        {label}
      </label>
      <div className="flex-1 max-w-sm">
        <input
          id={id}
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
          className={[
            'w-full text-sm rounded-lg px-3.5 py-2.5 border transition-all duration-150 outline-none',
            readOnly
              ? 'bg-fp-black text-fp-muted border-fp-border cursor-not-allowed select-none'
              : 'bg-fp-elevated text-white border-fp-border hover:border-white/20 focus:border-white/40 focus:bg-fp-elevated',
          ].join(' ')}
        />
        {hint && <p className="text-fp-muted text-[11px] mt-1.5">{hint}</p>}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

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
    return (
      <div className="min-h-screen bg-fp-black flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-fp-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const seed = name || session?.user?.email || 'U';
  const roleLabel = session?.user?.role === 'superadmin'
    ? 'Superadmin'
    : session?.user?.role === 'admin'
    ? 'Admin'
    : 'Miembro';

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      await update({ name });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
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
    <div className="min-h-screen bg-fp-black">
      {/* ── Page header ── */}
      <div className="border-b border-fp-border bg-fp-surface/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-6">
          {/* Identity block */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0 flex items-center justify-center text-white text-xl sm:text-2xl font-bold select-none ring-1 ring-white/10"
              style={{ backgroundColor: avatarBg(seed) }}
            >
              {avatarInitials(seed)}
            </div>

            {/* Identity */}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-white text-lg sm:text-xl font-semibold tracking-tight truncate">
                  {name || session?.user?.email?.split('@')[0] || 'Mi cuenta'}
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-fp-lime/10 text-fp-lime border border-fp-lime/20 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-fp-lime" />
                    {roleLabel}
                  </span>
                )}
              </div>
              <p className="text-fp-muted text-sm mt-0.5 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-4 sm:space-y-5">

        {/* ── Profile settings card ── */}
        <SectionCard>
          <SectionHeader
            title="Información personal"
            description="Actualizá tu nombre visible en la plataforma."
          />
          <div className="px-6">
            <InputField
              id="profile-name"
              label="Nombre"
              value={name}
              onChange={setName}
              hint="Este nombre es visible para otros usuarios de la plataforma."
            />
            <InputField
              id="profile-email"
              label="Email"
              type="email"
              value={session?.user?.email ?? ''}
              readOnly
              hint="El email no se puede cambiar desde aquí."
            />
          </div>

          {/* Card footer with CTA */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-fp-border bg-fp-black/30">
            <p className="text-fp-muted text-xs">
              {saveStatus === 'saved' && (
                <span className="text-green-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Cambios guardados
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-400">Error al guardar. Intentá de nuevo.</span>
              )}
            </p>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim() || saveStatus === 'saved'}
              className="inline-flex items-center gap-2 bg-[#e50914] hover:bg-[#c2070f] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-150"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando
                </>
              ) : saveStatus === 'saved' ? (
                'Guardado'
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </SectionCard>

        {/* ── Admin: User Management ── */}
        {isAdmin && (
          <SectionCard>
            <SectionHeader
              title="Gestión de usuarios"
              description="Aprobá solicitudes de acceso y administrá los miembros de la plataforma."
              badge={
                pendingUsers.length > 0 ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/15 text-yellow-400 text-[10px] font-bold border border-yellow-500/30">
                    {pendingUsers.length}
                  </span>
                ) : undefined
              }
            />

            <div className="divide-y divide-fp-border">

              {/* ── Pending ── */}
              {loadingUsers ? (
                <div className="px-6 py-8 flex items-center justify-center gap-2 text-fp-muted text-sm">
                  <span className="w-4 h-4 border-2 border-fp-border border-t-white/40 rounded-full animate-spin" />
                  Cargando usuarios...
                </div>
              ) : pendingUsers.length === 0 && approvedUsers.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="w-10 h-10 rounded-full bg-fp-elevated border border-fp-border flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-fp-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium">Sin usuarios todavía</p>
                  <p className="text-fp-muted text-xs mt-1">Las solicitudes de acceso van a aparecer aquí.</p>
                </div>
              ) : (
                <>
                  {/* Column headers */}
                  <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-2.5 bg-fp-black/20">
                    <span className="text-[11px] uppercase tracking-wider text-fp-muted font-medium">Usuario</span>
                    <span className="text-[11px] uppercase tracking-wider text-fp-muted font-medium w-24 text-center">Estado</span>
                    <span className="text-[11px] uppercase tracking-wider text-fp-muted font-medium w-28 text-right">Acción</span>
                  </div>

                  {/* Pending rows */}
                  {pendingUsers.map(u => (
                    <div key={u.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 items-center px-6 py-4 hover:bg-fp-elevated/50 transition-colors duration-100">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{u.name || u.email.split('@')[0]}</p>
                        <p className="text-fp-muted text-xs truncate mt-0.5">{u.email}</p>
                        {u.createdAt && (
                          <p className="text-fp-muted text-[11px] mt-0.5">Solicitó acceso {formatDate(u.createdAt)}</p>
                        )}
                      </div>
                      <div className="sm:w-24 flex sm:justify-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                          Pendiente
                        </span>
                      </div>
                      <div className="sm:w-28 flex sm:justify-end">
                        <button
                          onClick={() => handleApprove(u.email, true)}
                          disabled={approvingId === u.email}
                          className="inline-flex items-center gap-1.5 bg-green-600/15 hover:bg-green-600/25 active:scale-[0.97] text-green-400 border border-green-600/25 hover:border-green-500/40 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
                        >
                          {approvingId === u.email ? (
                            <span className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                          ) : (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                          Aprobar
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Separator between pending and active */}
                  {pendingUsers.length > 0 && approvedUsers.length > 0 && (
                    <div className="px-6 py-2.5 bg-fp-black/20">
                      <span className="text-[11px] uppercase tracking-wider text-fp-muted font-medium">Con acceso ({approvedUsers.length})</span>
                    </div>
                  )}

                  {/* Approved rows */}
                  {approvedUsers.map(u => (
                    <div key={u.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 items-center px-6 py-4 hover:bg-fp-elevated/30 transition-colors duration-100">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{u.name || u.email.split('@')[0]}</p>
                        <p className="text-fp-muted text-xs truncate mt-0.5">{u.email}</p>
                      </div>
                      <div className="sm:w-24 flex sm:justify-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          Activo
                          {u.role === 'admin' && ' · Admin'}
                        </span>
                      </div>
                      <div className="sm:w-28 flex sm:justify-end">
                        <button
                          onClick={() => handleApprove(u.email, false)}
                          disabled={approvingId === u.email}
                          className="inline-flex items-center gap-1 text-fp-muted hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/5 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
                        >
                          {approvingId === u.email ? (
                            <span className="w-3 h-3 border-2 border-fp-muted/30 border-t-fp-muted rounded-full animate-spin" />
                          ) : null}
                          Revocar
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-fp-border bg-fp-black/30">
              <p className="text-fp-muted text-xs">
                {users.filter(u => u.role !== 'superadmin').length} usuario{users.filter(u => u.role !== 'superadmin').length !== 1 ? 's' : ''} en total
              </p>
              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="inline-flex items-center gap-1.5 text-fp-muted hover:text-white text-xs font-medium transition-colors duration-150 disabled:opacity-40"
              >
                <svg className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Actualizar
              </button>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
