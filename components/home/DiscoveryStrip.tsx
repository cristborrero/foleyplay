'use client';

import Link from 'next/link';
import { Flame, Film, Tv, Sparkles, Popcorn, Compass, Heart, Zap, Ghost, Laugh } from 'lucide-react';

const CATEGORIES = [
  { label: 'Tendencias', href: '/browse#tendencias', icon: Flame },
  { label: 'Películas', href: '/movies', icon: Film },
  { label: 'Series', href: '/tv', icon: Tv },
  { label: 'Acción', href: '/movies?genre=28', icon: Zap },
  { label: 'Comedia', href: '/movies?genre=35', icon: Laugh },
  { label: 'Ciencia Ficción', href: '/movies?genre=878', icon: Sparkles },
  { label: 'Terror', href: '/movies?genre=27', icon: Ghost },
  { label: 'Drama', href: '/movies?genre=18', icon: Heart },
  { label: 'Animación', href: '/movies?genre=16', icon: Popcorn },
  { label: 'Explorar Todo', href: '/search', icon: Compass },
];

export default function DiscoveryStrip() {
  return (
    <section className="container-editorial py-6 sm:py-8" aria-label="Categorías y descubrimiento">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#151815] hover:bg-[#1C201C] active:scale-95 text-[#9CA39D] hover:text-[#F4F6F4] text-xs sm:text-sm font-medium border border-white/[0.08] hover:border-white/20 transition-all duration-200 shrink-0 select-none cursor-pointer"
            >
              <Icon size={15} className="text-fp-lime shrink-0" />
              <span>{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
