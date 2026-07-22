import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden select-none">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105 animate-pulse-slow" 
        style={{ backgroundImage: 'url(/bg-login-foleyplay.webp)' }} 
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Image src="/logo.webp" alt="FoleyPlay" width={160} height={45} className="h-9 w-auto object-contain drop-shadow-md" priority />
        <Link
          href="/browse"
          className="bg-fp-lime text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-fp-lime-bright transition-all shadow-[0_0_15px_rgba(206,255,0,0.3)] hover:scale-105"
        >
          Entrar
        </Link>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto my-auto">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6 drop-shadow-lg">
          Películas, series y <span className="text-fp-lime">TV en vivo</span> sin límites
        </h1>
        <p className="text-base sm:text-xl text-gray-300 mb-8 max-w-2xl font-medium">
          Todo el entretenimiento en un solo lugar. Entra con un solo clic y disfruta al instante.
        </p>

        {/* Single Entrar Button */}
        <Link
          href="/browse"
          className="group relative inline-flex items-center gap-3 bg-fp-lime text-black font-black text-lg sm:text-xl px-10 py-5 rounded-2xl hover:bg-fp-lime-bright hover:[box-shadow:0_0_40px_rgba(206,255,0,0.7)] transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
        >
          <span>Entrar</span>
          <Play size={24} className="fill-black group-hover:translate-x-1 transition-transform" />
        </Link>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-gray-600 border-t border-white/5">
        &copy; {new Date().getFullYear()} FoleyPlay. Todos los derechos reservados.
      </footer>
    </div>
  );
}
