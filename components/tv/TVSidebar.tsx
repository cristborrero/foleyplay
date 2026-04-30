'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Film, Tv2, Bookmark, User, LogOut } from 'lucide-react';
import { useTVSidebar } from './TVSidebarContext';

const NAV_ITEMS = [
  { icon: Home,     label: 'Inicio',    href: '/browse' },
  { icon: Search,   label: 'Buscador',  href: '/search' },
  { icon: Film,     label: 'Películas', href: '/browse' },
  { icon: Tv2,      label: 'Series',    href: '/browse' },
  { icon: Bookmark, label: 'Mi Lista',  href: '/watchlist' },
  { icon: User,     label: 'Perfil',    href: '/profile' },
];

interface TVSidebarProps {
  expanded: boolean;
  onClose: () => void;
}

export default function TVSidebar({ expanded, onClose }: TVSidebarProps) {
  const { open: onOpen } = useTVSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleNav = (href: string) => {
    onClose();
    router.push(href);
  };

  const goToContent = () => {
    onClose();
    setTimeout(() => {
      const firstCard = document.querySelector<HTMLElement>('[data-tv-card]');
      firstCard?.focus();
    }, 150);
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'Escape') {
      e.preventDefault();
      goToContent();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const items = Array.from(document.querySelectorAll<HTMLElement>('[data-sidebar-item]'));
      const idx = items.indexOf(e.currentTarget);
      items[Math.min(idx + 1, items.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const items = Array.from(document.querySelectorAll<HTMLElement>('[data-sidebar-item]'));
      const idx = items.indexOf(e.currentTarget);
      items[Math.max(idx - 1, 0)]?.focus();
    }
  };

  return (
    <motion.aside
      animate={{ width: expanded ? 240 : 72 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-none flex flex-col bg-[#080808] border-r border-[#1a1a1a] h-full overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center px-4 h-16 shrink-0 overflow-hidden">
        <Image src="/logo.webp" alt="FoleyPlay" width={110} height={32} className="h-7 w-auto object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 flex-1 pt-2">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <button
              key={label}
              data-sidebar-item
              tabIndex={expanded ? 0 : -1}
              onClick={() => handleNav(href)}
              onFocus={() => onOpen()}
              onKeyDown={handleItemKeyDown}
              className={`flex items-center gap-3 px-3 py-3.5 rounded-lg transition-colors duration-150 outline-none focus:ring-2 focus:ring-red-500 w-full ${
                active
                  ? 'bg-red-600/20 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white'
              }`}
            >
              <Icon size={22} className="shrink-0" />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 pb-4">
        <button
          data-sidebar-item
          tabIndex={expanded ? 0 : -1}
          onClick={() => signOut({ callbackUrl: '/login' })}
          onFocus={() => onOpen()}
          onKeyDown={handleItemKeyDown}
          className="flex items-center gap-3 px-3 py-3.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/20 focus:outline-none focus:ring-2 focus:ring-red-500 w-full transition-colors duration-150"
        >
          <LogOut size={22} className="shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Cerrar
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
