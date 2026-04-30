'use client';

import { useEffect } from 'react';
import { useTVSidebar } from './TVSidebarContext';

export default function TVFocusManager() {
  const { open: openSidebar } = useTVSidebar();

  useEffect(() => {
    // Auto-focus first card after initial render
    const timer = setTimeout(() => {
      const firstCard = document.querySelector<HTMLElement>('[data-tv-card]');
      firstCard?.focus();
    }, 400);

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const row = target?.closest('[data-tv-row]') as HTMLElement | null;
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      const row = active.closest('[data-tv-row]') as HTMLElement | null;
      if (!row) return;

      const cards = Array.from(row.querySelectorAll<HTMLElement>('[data-tv-card]'));
      const currentIndex = cards.indexOf(active);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < cards.length - 1) {
          cards[currentIndex + 1].focus();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          cards[currentIndex - 1].focus();
        } else {
          openSidebar();
          setTimeout(() => {
            const firstItem = document.querySelector<HTMLElement>('[data-sidebar-item]');
            firstItem?.focus();
          }, 50);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-tv-row]'));
        const rowIndex = rows.indexOf(row);
        if (rowIndex < rows.length - 1) {
          const nextRow = rows[rowIndex + 1];
          const nextCards = Array.from(nextRow.querySelectorAll<HTMLElement>('[data-tv-card]'));
          const target = Math.min(currentIndex, nextCards.length - 1);
          nextCards[target]?.focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-tv-row]'));
        const rowIndex = rows.indexOf(row);
        if (rowIndex > 0) {
          const prevRow = rows[rowIndex - 1];
          const prevCards = Array.from(prevRow.querySelectorAll<HTMLElement>('[data-tv-card]'));
          const target = Math.min(currentIndex, prevCards.length - 1);
          prevCards[target]?.focus();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [openSidebar]);

  return null;
}
