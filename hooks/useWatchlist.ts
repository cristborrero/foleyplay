'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface WatchlistItem {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  addedAt: string;
}

type TogglePayload = Omit<WatchlistItem, 'addedAt'>;

export function useWatchlist() {
  const { data: session } = useSession();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session?.user) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) setWatchlist(await res.json());
    } catch (e) {
      console.error('useWatchlist fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isInWatchlist = useCallback(
    (tmdbId: number, mediaType: 'movie' | 'tv') =>
      watchlist.some((i) => i.tmdbId === tmdbId && i.mediaType === mediaType),
    [watchlist]
  );

  const toggle = useCallback(
    async (item: TogglePayload): Promise<boolean> => {
      if (!session?.user) return false;
      try {
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!res.ok) return false;
        const data = await res.json();
        setWatchlist((prev) =>
          data.added
            ? [...prev, { ...item, addedAt: new Date().toISOString() }]
            : prev.filter((w) => !(w.tmdbId === item.tmdbId && w.mediaType === item.mediaType))
        );
        return data.added;
      } catch (e) {
        console.error('useWatchlist toggle error:', e);
        return false;
      }
    },
    [session]
  );

  return { watchlist, isLoading, isInWatchlist, toggle, refresh };
}
