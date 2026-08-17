'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Clock, Film, Tv, Radio, Sparkles } from 'lucide-react';
import HeaderSearch from './HeaderSearch';

const NAV_LINKS = [
  { href: '/browse', label: 'Inicio', icon: Sparkles },
  { href: '/movies', label: 'Películas', icon: Film },
  { href: '/tv', label: 'Series', icon: Tv },
  { href: '/tv-en-vivo', label: 'TV en Vivo', icon: Radio },
  { href: '/watchlist', label: 'Mi Lista', icon: Bookmark },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || menuOpen
            ? 'h-[72px] bg-[#080A09]/92 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'h-[80px] bg-gradient-to-b from-black/80 via-black/30 to-transparent'
        }`}
      >
        <div className="container-editorial h-full flex items-center justify-between gap-4 sm:gap-6">
          {/* Left: Brand + Navigation */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/browse" className="shrink-0 group flex items-center" aria-label="FoleyPlay Inicio">
              <Image
                src="/logo.webp"
                alt="FoleyPlay"
                width={140}
                height={40}
                className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Navegación principal">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-[#F4F6F4] bg-white/[0.08] font-semibold'
                        : 'text-[#9CA39D] hover:text-[#F4F6F4] hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-fp-lime rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search & Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block">
              <HeaderSearch />
            </div>

            {/* Mobile search button */}
            <Link
              href="/search"
              className="sm:hidden p-2 text-[#9CA39D] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Buscar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </Link>

            {/* Mobile hamburger menu */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <motion.div animate={menuOpen ? 'open' : 'closed'} className="w-5 h-5 flex flex-col justify-center gap-1.5">
                <motion.span variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }} className="block h-0.5 w-5 bg-white origin-center" />
                <motion.span variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }} className="block h-0.5 w-5 bg-white" />
                <motion.span variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }} className="block h-0.5 w-5 bg-white origin-center" />
              </motion.div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[72px] left-0 right-0 z-40 bg-[#101310] border-b border-white/10 shadow-2xl p-4 md:hidden"
              aria-label="Menú móvil"
            >
              <div className="mb-4">
                <HeaderSearch />
              </div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'text-fp-lime bg-white/[0.06]' : 'text-[#9CA39D] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-white/5 my-2" />
                <Link
                  href="/history"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/history' ? 'text-fp-lime bg-white/[0.06]' : 'text-[#9CA39D] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Clock size={18} />
                  <span>Continuar Viendo</span>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
