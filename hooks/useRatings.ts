'use client';

import { useState, useEffect, useCallback } from 'react';

export type UserRating = 'like' | 'dislike' | null;

const RATINGS_STORAGE_KEY = 'foleyplay_ratings';
const RATINGS_EVENT = 'foleyplay_ratings_updated';

function getLocalRatings(): Record<string, UserRating> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(RATINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading ratings from localStorage:', e);
    return {};
  }
}

function saveLocalRatings(ratings: Record<string, UserRating>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    window.dispatchEvent(new Event(RATINGS_EVENT));
  } catch (e) {
    console.error('Error saving ratings to localStorage:', e);
  }
}

export function useRating(tmdbId?: number, mediaType?: 'movie' | 'tv') {
  const [rating, setRating] = useState<UserRating>(null);

  const cacheKey = tmdbId && mediaType ? `${mediaType}-${tmdbId}` : null;

  const refresh = useCallback(() => {
    if (!cacheKey) {
      setRating(null);
      return;
    }
    const all = getLocalRatings();
    setRating(all[cacheKey] ?? null);
  }, [cacheKey]);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener(RATINGS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(RATINGS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const setRatingValue = useCallback(
    (newRating: UserRating) => {
      if (!cacheKey) return;
      const all = getLocalRatings();
      if (newRating === null) {
        delete all[cacheKey];
      } else {
        all[cacheKey] = newRating;
      }
      saveLocalRatings(all);
      setRating(newRating);
    },
    [cacheKey]
  );

  return { rating, setRating: setRatingValue };
}
