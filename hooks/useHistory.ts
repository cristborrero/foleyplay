'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface HistoryItem {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  season?: number;
  episode?: number;
  watchedAt: string;
  progress: number;
}

type LogPayload = Omit<HistoryItem, 'watchedAt'>;

export function useHistory() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session?.user) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) setHistory(await res.json());
    } catch (e) {
      console.error('useHistory fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logView = useCallback(
    async (item: LogPayload) => {
      if (!session?.user) return;
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch (e) {
        console.error('useHistory logView error:', e);
      }
    },
    [session]
  );

  const updateProgress = useCallback(
    async (tmdbId: number, mediaType: 'movie' | 'tv', progress: number) => {
      if (!session?.user) return;
      try {
        await fetch('/api/history', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tmdbId, mediaType, progress }),
        });
        setHistory((prev) =>
          prev.map((h) =>
            h.tmdbId === tmdbId && h.mediaType === mediaType ? { ...h, progress } : h
          )
        );
      } catch (e) {
        console.error('useHistory updateProgress error:', e);
      }
    },
    [session]
  );

  return { history, isLoading, logView, updateProgress, refresh };
}
