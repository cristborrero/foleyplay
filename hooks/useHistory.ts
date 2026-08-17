'use client';

import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  _id?: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  poster_path?: string;
  season?: number;
  episode?: number;
  watchedAt: string;
  progress: number;
}

export type LogPayload = Omit<HistoryItem, 'watchedAt' | '_id'>;

const HISTORY_STORAGE_KEY = 'foleyplay_history';
const HISTORY_EVENT = 'foleyplay_history_updated';

function getLocalHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading history from localStorage:', e);
    return [];
  }
}

function saveLocalHistory(items: HistoryItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch (e) {
    console.error('Error saving history to localStorage:', e);
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setHistory(getLocalHistory());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener(HISTORY_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(HISTORY_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const logView = useCallback(async (item: LogPayload) => {
    const current = getLocalHistory();
    const existingIndex = current.findIndex(
      (h) => h.tmdbId === item.tmdbId && h.mediaType === item.mediaType
    );

    let updated: HistoryItem[];

    if (existingIndex >= 0) {
      const existing = current[existingIndex];
      const updatedItem: HistoryItem = {
        ...existing,
        ...item,
        progress: item.progress !== undefined ? item.progress : existing.progress,
        season: item.season !== undefined ? item.season : existing.season,
        episode: item.episode !== undefined ? item.episode : existing.episode,
        watchedAt: new Date().toISOString(),
      };
      updated = [
        updatedItem,
        ...current.filter((_, idx) => idx !== existingIndex),
      ];
    } else {
      const newItem: HistoryItem = {
        ...item,
        _id: `${item.mediaType}-${item.tmdbId}`,
        posterPath: item.posterPath || item.poster_path,
        progress: item.progress ?? 5,
        watchedAt: new Date().toISOString(),
      };
      updated = [newItem, ...current.slice(0, 49)];
    }

    saveLocalHistory(updated);
    setHistory(updated);
  }, []);

  const updateProgress = useCallback(
    async (tmdbId: number, mediaType: 'movie' | 'tv', progress: number) => {
      const current = getLocalHistory();
      const updated = current.map((h) =>
        h.tmdbId === tmdbId && h.mediaType === mediaType ? { ...h, progress } : h
      );
      saveLocalHistory(updated);
      setHistory(updated);
    },
    []
  );

  return { history, isLoading, logView, updateProgress, refresh };
}
