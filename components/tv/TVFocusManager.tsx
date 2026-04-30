'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTVSidebar } from './TVSidebarContext';

export default function TVFocusManager() {
  const { open: openSidebar } = useTVSidebar();
  const pathname = usePathname();

  // Key handlers — stable because openSidebar is memoized with useCallback
  useEffect(() => {
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

      const tag = active.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

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
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [openSidebar]);

  // Auto-focus first card on route change — retries up to 10 times if cards haven't rendered yet
  useEffect(() => {
    let attempts = 0;
    let timerId: ReturnType<typeof setTimeout>;

    const tryFocus = () => {
      const active = document.activeElement;
      if (!active || active === document.body) {
        const firstCard = document.querySelector<HTMLElement>('[data-tv-card]');
        if (firstCard) {
          firstCard.focus();
        } else if (attempts < 10) {
          attempts++;
          timerId = setTimeout(tryFocus, 300);
        }
      }
    };

    timerId = setTimeout(tryFocus, 400);
    return () => clearTimeout(timerId);
  }, [pathname]);

  return null;
}
