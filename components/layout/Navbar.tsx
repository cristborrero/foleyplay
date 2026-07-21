'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { avatarBg, avatarInitials } from '@/lib/avatar';

const NAV_LINKS = [
  { href: '/browse', label: 'Inicio' },
  { href: '/tv', label: 'Series' },
  { href: '/movies', label: 'Películas' },
  { href: '/tv-en-vivo', label: 'TV en Vivo' },
  { href: '/watchlist', label: 'Mi Lista' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const avatarSeed = session?.user?.name || session?.user?.email || 'U';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (pathname === '/login' || pathname === '/register' || pathname === '/pending') return null;

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || menuOpen
          ? 'bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5 shadow-[0_1px_20px_rgba(0,0,0,0.6)]'
          : 'bg-linear-to-b from-black/80 to-transparent'
      }`}>
        <div className="flex items-center justify-between px-4 py-3 md:px-8 lg:px-12">
          {/* Left: Logo + desktop links */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/browse" className="shrink-0">
              <Image src="/logo.webp" alt="FoleyPlay" width={140} height={40} className="h-8 w-auto object-contain" priority />
            </Link>
            <div className="hidden md:flex space-x-4 text-sm">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className={`transition-colors ${pathname === l.href ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search + Avatar + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </Link>

            {/* Desktop avatar dropdown */}
            <div className="hidden md:block group relative">
              <div
                className="h-8 w-8 rounded-md flex items-center justify-center cursor-pointer ring-1 ring-white/10 group-hover:ring-white/25 transition-all text-white text-xs font-bold select-none"
                style={{ backgroundColor: avatarBg(avatarSeed) }}
              >
                {avatarInitials(avatarSeed)}
              </div>
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="w-48 bg-[#111]/95 backdrop-blur-sm border border-white/8 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] py-2">
                {session?.user?.name && (
                  <div className="px-4 py-2 text-xs text-white font-medium truncate">{session.user.name}</div>
                )}
                <div className="px-4 py-1 text-xs text-gray-500 uppercase tracking-wider mb-1">Mi Cuenta</div>
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                  Mi Perfil
                </Link>
                <Link href="/history" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                  Continuar Viendo
                </Link>
                {isAdmin && (
                  <>
                    <div className="border-t border-gray-800/60 my-2" />
                    <Link href="/admin/users" className="block px-4 py-2 text-sm text-fp-lime hover:text-fp-lime-bright hover:bg-white/5 transition-colors">
                      Administración
                    </Link>
                  </>
                )}
                <div className="border-t border-gray-800/60 my-2" />
                <button
                  onClick={() => import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/login' }))}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white p-1"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <motion.div animate={menuOpen ? 'open' : 'closed'} className="w-5 h-5 flex flex-col justify-center gap-1.5">
                <motion.span variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }} className="block h-0.5 w-5 bg-white origin-center transition-all" />
                <motion.span variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }} className="block h-0.5 w-5 bg-white" />
                <motion.span variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }} className="block h-0.5 w-5 bg-white origin-center transition-all" />
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="fixed top-14 left-0 right-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-sm border-b border-white/5 md:hidden"
            >
              <div className="flex flex-col py-4">
                {NAV_LINKS.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-6 py-3.5 text-base transition-colors ${pathname === l.href ? 'text-white font-medium' : 'text-gray-300'}`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="border-t border-white/5 my-3" />
                <Link href="/profile" className="px-6 py-3.5 text-base text-gray-300">
                  Mi Perfil
                </Link>
                <Link href="/history" className="px-6 py-3.5 text-base text-gray-300">
                  Continuar Viendo
                </Link>
                {isAdmin && (
                  <Link href="/admin/users" className="px-6 py-3.5 text-base text-fp-lime">
                    Administración
                  </Link>
                )}
                <button
                  onClick={() => import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/login' }))}
                  className="text-left px-6 py-3.5 text-base text-fp-lime"
                >
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
