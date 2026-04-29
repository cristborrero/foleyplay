'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #110505 50%, #0a0a0a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.12) 0%, transparent 60%)' }} />

      <header className="absolute top-0 w-full p-4 md:p-8 z-50">
        <Link href="/">
          <Image src="/logo.webp" alt="FoleyPlay" width={140} height={40} className="h-8 w-auto object-contain" />
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md bg-black/70 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <h1 className="text-3xl font-bold text-white mb-8">Crear cuenta</h1>

          {error && (
            <p className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Nombre"
              className="bg-fp-elevated text-white p-4 rounded-lg border border-fp-border outline-none focus:border-red-600/60 focus:bg-[#1f1f1f] focus:[box-shadow:0_0_0_1px_rgba(229,9,20,0.3)] transition-all placeholder:text-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-fp-elevated text-white p-4 rounded-lg border border-fp-border outline-none focus:border-red-600/60 focus:bg-[#1f1f1f] focus:[box-shadow:0_0_0_1px_rgba(229,9,20,0.3)] transition-all placeholder:text-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="bg-fp-elevated text-white p-4 rounded-lg border border-fp-border outline-none focus:border-red-600/60 focus:bg-[#1f1f1f] focus:[box-shadow:0_0_0_1px_rgba(229,9,20,0.3)] transition-all placeholder:text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 text-white font-bold p-4 rounded-lg mt-2 hover:bg-red-500 hover:[box-shadow:0_0_20px_rgba(229,9,20,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-10 text-gray-500 text-sm">
            ¿Ya tenés una cuenta?{' '}
            <Link href="/login" className="text-gray-200 hover:text-red-400 transition-colors">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
