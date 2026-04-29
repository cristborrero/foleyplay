'use client';

import { signOut } from 'next-auth/react';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <h1 className="text-white text-2xl font-bold mb-3">Acceso pendiente</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Tu cuenta fue registrada correctamente. El administrador revisará tu solicitud y te habilitará el acceso en breve.
        </p>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
