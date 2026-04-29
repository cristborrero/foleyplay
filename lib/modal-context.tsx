'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface PlayerConfig {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
  imdbId?: string;
}

export interface DetailConfig {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
}

interface ModalContextValue {
  player: PlayerConfig | null;
  detail: DetailConfig | null;
  openPlayer: (config: PlayerConfig) => void;
  openDetail: (config: DetailConfig) => void;
  closePlayer: () => void;
  closeDetail: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerConfig | null>(null);
  const [detail, setDetail] = useState<DetailConfig | null>(null);

  return (
    <ModalContext.Provider value={{
      player,
      detail,
      openPlayer: (config) => setPlayer(config),
      openDetail: (config) => setDetail(config),
      closePlayer: () => setPlayer(null),
      closeDetail: () => setDetail(null),
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside ModalProvider');
  return ctx;
}
