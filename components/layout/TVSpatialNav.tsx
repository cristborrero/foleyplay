'use client';

import { useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  '[tabindex="0"]',
  'input:not([disabled])',
  'select:not([disabled])',
].join(', ');

function isVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function center(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function findNext(dir: 'up' | 'down' | 'left' | 'right', from: HTMLElement): HTMLElement | null {
  const fromRect = from.getBoundingClientRect();
  const fromC = center(fromRect);

  const candidates = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el !== from && isVisible(el)
  );

  const inDirection = candidates.filter((el) => {
    const c = center(el.getBoundingClientRect());
    if (dir === 'up')    return c.y < fromC.y - 5;
    if (dir === 'down')  return c.y > fromC.y + 5;
    if (dir === 'left')  return c.x < fromC.x - 5;
    if (dir === 'right') return c.x > fromC.x + 5;
  });

  if (!inDirection.length) return null;

  const scored = inDirection.map((el) => {
    const c = center(el.getBoundingClientRect());
    const primary   = dir === 'up' || dir === 'down' ? Math.abs(c.y - fromC.y) : Math.abs(c.x - fromC.x);
    const secondary = dir === 'up' || dir === 'down' ? Math.abs(c.x - fromC.x) : Math.abs(c.y - fromC.y);
    return { el, score: primary + secondary * 0.3 };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored[0].el;
}

function focusFirst() {
  const el = document.querySelector<HTMLElement>(FOCUSABLE);
  el?.focus();
}

export default function TVSpatialNav() {
  useEffect(() => {
    const DIR: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    };

    const onKey = (e: KeyboardEvent) => {
      const dir = DIR[e.key];
      if (!dir) return;

      const active = document.activeElement as HTMLElement | null;

      if (!active || active === document.body || active === document.documentElement) {
        e.preventDefault();
        focusFirst();
        return;
      }

      const next = findNext(dir, active);
      if (next) {
        e.preventDefault();
        next.focus();
        next.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    };

    window.addEventListener('keydown', onKey);
    // Initial focus — small delay lets React finish rendering
    const t = setTimeout(focusFirst, 300);

    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, []);

  return null;
}
