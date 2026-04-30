'use client';

import { useEffect } from 'react';
import { useTVSidebar } from './TVSidebarContext';

export default function TVFocusManager() {
  const { open: openSidebar } = useTVSidebar();

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const row = target?.closest('[data-tv-row]') as HTMLElement | null;
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft') return;
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;
      const row = active.closest('[data-tv-row]') as HTMLElement | null;
      if (!row) return;
      const cards = Array.from(row.querySelectorAll<HTMLElement>('[tabindex="0"]'));
      if (cards[0] === active) {
        e.preventDefault();
        openSidebar();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [openSidebar]);

  return null;
}
