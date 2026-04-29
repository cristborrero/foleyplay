'use client';

import { useEffect, useCallback } from 'react';

type TVKey = 'up' | 'down' | 'left' | 'right' | 'enter' | 'back' | 'play' | 'pause';

interface UseTVNavigationOptions {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onBack?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  enabled?: boolean;
}

const KEY_MAP: Record<string, TVKey> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'enter',
  Escape: 'back',
  Backspace: 'back',
  GoBack: 'back',
  MediaPlay: 'play',
  MediaPause: 'pause',
  MediaPlayPause: 'play',
};

export function useTVNavigation(options: UseTVNavigationOptions = {}) {
  const { onUp, onDown, onLeft, onRight, onEnter, onBack, onPlay, onPause, enabled = true } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;

      const key = KEY_MAP[e.key];
      if (!key) return;

      if (['up', 'down', 'left', 'right'].includes(key)) {
        e.preventDefault();
      }

      switch (key) {
        case 'up': onUp?.(); break;
        case 'down': onDown?.(); break;
        case 'left': onLeft?.(); break;
        case 'right': onRight?.(); break;
        case 'enter': onEnter?.(); break;
        case 'back': onBack?.(); break;
        case 'play': onPlay?.(); break;
        case 'pause': onPause?.(); break;
      }
    },
    [onUp, onDown, onLeft, onRight, onEnter, onBack, onPlay, onPause]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}

export function useIsTVMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

export function focusNext(selector = '[tabindex], a, button, input, select') {
  const focusable = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex >= 0
  );
  const idx = focusable.indexOf(document.activeElement as HTMLElement);
  focusable[idx + 1]?.focus();
}

export function focusPrev(selector = '[tabindex], a, button, input, select') {
  const focusable = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex >= 0
  );
  const idx = focusable.indexOf(document.activeElement as HTMLElement);
  focusable[idx - 1]?.focus();
}
