import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function PendingPage() {
  return (
    <div className="relative h-screen w-full flex flex-col bg-black overflow-hidden select-none">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-50" 
        style={{ backgroundImage: 'url(/bg-login-foleyplay.webp)' }} 
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-black/70" />

      <header className="absolute top-0 w-full p-6 md:p-8 z-50">
        <Link href="/">
          <Image src="/logo.webp" alt="FoleyPlay" width={150} height={42} className="h-8 w-auto object-contain" priority />
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-black/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-center flex flex-col items-center">
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Acceso Directo</h1>
          <p className="text-gray-400 text-sm mb-8">
            Haz clic abajo para ingresar al catálogo completo.
          </p>

          <Link
            href="/browse"
            className="w-full flex items-center justify-center gap-3 bg-fp-lime text-black font-extrabold text-lg py-4 rounded-xl hover:bg-fp-lime-bright hover:[box-shadow:0_0_30px_rgba(206,255,0,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Entrar</span>
            <Play size={20} className="fill-black ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
