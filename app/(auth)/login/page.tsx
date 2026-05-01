'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        setError('Credenciales inválidas');
      } else {
        router.push('/browse');
        router.refresh();
      }
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/browse' });
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-black">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: 'url(/bg-login-foleyplay.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5
        }} 
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      <div className="absolute inset-0 z-0 bg-black/40" />

      <header className="absolute top-0 w-full p-4 md:p-8 z-50">
        <Link href="/">
          <Image src="/logo.webp" alt="FoleyPlay" width={140} height={40} className="h-8 w-auto object-contain" />
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-0">
        <div className="w-full max-w-md bg-black/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Iniciar sesión</h1>

          {error && (
            <p className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </p>
          )}

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold p-3 sm:p-3.5 rounded-lg mb-4 hover:bg-gray-100 transition-all disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-gray-600 text-xs">o</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="bg-fp-elevated text-white p-3.5 sm:p-4 rounded-lg border border-fp-border outline-none focus:border-red-600/60 focus:bg-[#1f1f1f] focus:[box-shadow:0_0_0_1px_rgba(229,9,20,0.3)] transition-all placeholder:text-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="bg-fp-elevated text-white p-3.5 sm:p-4 rounded-lg border border-fp-border outline-none focus:border-red-600/60 focus:bg-[#1f1f1f] focus:[box-shadow:0_0_0_1px_rgba(229,9,20,0.3)] transition-all placeholder:text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 text-white font-bold p-3.5 sm:p-4 rounded-lg mt-2 hover:bg-red-500 hover:[box-shadow:0_0_20px_rgba(229,9,20,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-10 text-gray-500 text-sm">
            ¿Primera vez en FoleyPlay?{' '}
            <Link href="/register" className="text-gray-200 hover:text-red-400 transition-colors">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
