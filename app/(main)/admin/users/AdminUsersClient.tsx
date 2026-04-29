'use client';

import { useState, useEffect, useCallback } from 'react';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  approved: boolean;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: string;
}

interface Props {
  currentUserRole: string;
  currentUserEmail: string;
}

interface DesignateTarget {
  user: AdminUser;
  makeAdmin: boolean;
}

export default function AdminUsersClient({ currentUserRole, currentUserEmail }: Props) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [designateModal, setDesignateModal] = useState<DesignateTarget | null>(null);
  const [designateConfirm, setDesignateConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = currentUserRole === 'superadmin';

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      setError('No se pudo cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleApproval = async (email: string, currentApproved: boolean) => {
    const newApproved = !currentApproved;
    setActionLoading(email);
    setUsers(prev => prev.map(u => u.email === email ? { ...u, approved: newApproved } : u));

    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, approved: newApproved }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setUsers(prev => prev.map(u => u.email === email ? { ...u, approved: currentApproved } : u));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (email: string) => {
    setActionLoading(email);
    setConfirmDelete(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setUsers(prev => prev.filter(u => u.email !== email));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDesignate = async (email: string, makeAdmin: boolean) => {
    setActionLoading(email);
    setDesignateModal(null);
    setDesignateConfirm('');

    try {
      const res = await fetch('/api/admin/designate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, makeAdmin }),
      });
      if (!res.ok) throw new Error();
      setUsers(prev => prev.map(u =>
        u.email === email
          ? { ...u, role: makeAdmin ? 'admin' : 'user', approved: makeAdmin ? true : u.approved }
          : u
      ));
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

  const RoleBadge = ({ role }: { role: string }) => {
    if (role === 'superadmin') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/25">
        Superadmin
      </span>
    );
    if (role === 'admin') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/25">
        Admin
      </span>
    );
    return null;
  };

  const StatusBadge = ({ approved }: { approved: boolean }) => approved ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
      Aprobado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
      Pendiente
    </span>
  );

  const renderActions = (user: AdminUser) => {
    const isLoading = actionLoading === user.email;
    const isOwnAccount = user.email === currentUserEmail;
    const targetIsSuperAdmin = user.role === 'superadmin';
    const targetIsAdmin = user.role === 'admin';

    // Superadmin row is always protected — no actions
    if (targetIsSuperAdmin) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
          </svg>
          Protegido
        </span>
      );
    }

    // Admin row — only superadmin can act on them
    if (targetIsAdmin && !isSuperAdmin) {
      return <span className="text-xs text-gray-700">—</span>;
    }

    if (confirmDelete === user.email) {
      return (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-gray-400">¿Confirmás?</span>
          <button
            onClick={() => handleDelete(user.email)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/35 border border-red-600/30 transition-colors disabled:opacity-50"
          >
            {isLoading && <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
            Sí, eliminar
          </button>
          <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 transition-colors">
            No
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end gap-2">
        {/* Approve / Revoke — only for regular users */}
        {!targetIsAdmin && (
          <button
            onClick={() => handleToggleApproval(user.email, user.approved)}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
              user.approved
                ? 'bg-red-600/15 text-red-400 hover:bg-red-600/25 border border-red-600/20'
                : 'bg-green-600/15 text-green-400 hover:bg-green-600/25 border border-green-600/20'
            }`}
          >
            {isLoading && <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
            {user.approved ? 'Revocar' : 'Aprobar'}
          </button>
        )}

        {/* Designate / Remove admin — superadmin only */}
        {isSuperAdmin && (
          <button
            onClick={() => { setDesignateModal({ user, makeAdmin: !targetIsAdmin }); setDesignateConfirm(''); }}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-400/30 transition-colors disabled:opacity-50"
          >
            {targetIsAdmin ? 'Quitar Admin' : 'Dar Admin'}
          </button>
        )}

        {/* Delete — superadmin can delete anyone non-super; admin can delete regular users */}
        {!isOwnAccount && (isSuperAdmin || !targetIsAdmin) && (
          <button
            onClick={() => setConfirmDelete(user.email)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-400 border border-white/8 hover:border-red-600/20 transition-colors disabled:opacity-50"
          >
            Eliminar
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="pt-24 px-4 md:px-12 min-h-screen bg-fp-black">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm mb-8">
            {isSuperAdmin
              ? 'Aprobá, revocá, designá admins o eliminá usuarios. El superadmin está protegido.'
              : 'Aprobá, revocá o eliminá usuarios regulares.'}
          </p>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Nombre</th>
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Email</th>
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Rol</th>
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Estado</th>
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Registro</th>
                    <th className="text-right text-gray-400 font-medium px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user._id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/1'}`}>
                      <td className="px-4 py-3 text-white font-medium truncate max-w-[130px]">{user.name}</td>
                      <td className="px-4 py-3 text-gray-400 truncate max-w-[180px]">{user.email}</td>
                      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3"><StatusBadge approved={user.approved} /></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-right">{renderActions(user)}</td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-600 py-12">No hay usuarios registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Designate / Remove Admin Modal */}
      {designateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-1">
              {designateModal.makeAdmin ? 'Dar permisos de Admin' : 'Quitar permisos de Admin'}
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              {designateModal.makeAdmin
                ? `${designateModal.user.name} podrá gestionar usuarios pero no podrá modificarte a vos.`
                : `${designateModal.user.name} volverá a ser un usuario regular.`}
              <br />
              <span className="text-gray-500 mt-1 block">Escribí su email para confirmar.</span>
            </p>
            <input
              value={designateConfirm}
              onChange={e => setDesignateConfirm(e.target.value)}
              placeholder={designateModal.user.email}
              className="w-full bg-fp-elevated text-white p-3 rounded-lg border border-fp-border outline-none focus:border-blue-500/40 transition-all text-sm mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleDesignate(designateModal.user.email, designateModal.makeAdmin)}
                disabled={designateConfirm !== designateModal.user.email || actionLoading === designateModal.user.email}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
              <button
                onClick={() => { setDesignateModal(null); setDesignateConfirm(''); }}
                className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-lg text-sm hover:text-white hover:border-white/20 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
