'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WatchlistItem {
  _id?: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  poster_path?: string;
  addedAt: string;
}

export type TogglePayload = Omit<WatchlistItem, 'addedAt' | '_id'>;

const WATCHLIST_STORAGE_KEY = 'foleyplay_watchlist';
const WATCHLIST_EVENT = 'foleyplay_watchlist_updated';

function getLocalWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading watchlist from localStorage:', e);
    return [];
  }
}

function saveLocalWatchlist(items: WatchlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(WATCHLIST_EVENT));
  } catch (e) {
    console.error('Error saving watchlist to localStorage:', e);
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setWatchlist(getLocalWatchlist());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener(WATCHLIST_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const isInWatchlist = useCallback(
    (tmdbId: number, mediaType: 'movie' | 'tv') =>
      watchlist.some((i) => i.tmdbId === tmdbId && i.mediaType === mediaType),
    [watchlist]
  );

  const toggle = useCallback(
    async (item: TogglePayload): Promise<boolean> => {
      const current = getLocalWatchlist();
      const existsIndex = current.findIndex(
        (i) => i.tmdbId === item.tmdbId && i.mediaType === item.mediaType
      );

      let updated: WatchlistItem[];
      let isAdded: boolean;

      if (existsIndex >= 0) {
        updated = current.filter((_, idx) => idx !== existsIndex);
        isAdded = false;
      } else {
        const newItem: WatchlistItem = {
          ...item,
          _id: `${item.mediaType}-${item.tmdbId}`,
          posterPath: item.posterPath || item.poster_path,
          addedAt: new Date().toISOString(),
        };
        updated = [newItem, ...current];
        isAdded = true;
      }

      saveLocalWatchlist(updated);
      setWatchlist(updated);
      return isAdded;
    },
    []
  );

  return { watchlist, isLoading, isInWatchlist, toggle, refresh };
}
