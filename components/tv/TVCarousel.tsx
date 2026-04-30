'use client';

import { useEffect, useState, useRef } from 'react';
import { TMDBMedia } from '@/types/tmdb';
import TVCard from './TVCard';

interface TVCarouselProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
  mediaType?: 'movie' | 'tv';
}

export default function TVCarousel({ title, fetchUrl, isLargeRow = false, mediaType }: TVCarouselProps) {
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(fetchUrl)
      .then(r => r.json())
      .then(d => setItems(d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  if (!loading && !items.length) return null;

  return (
    <div ref={rowRef} data-tv-row className="mb-8">
      <h2 className="text-white text-lg font-bold mb-3 px-8 lg:px-12">{title}</h2>
      <div
        className="flex gap-3 overflow-x-auto pb-3 px-8 lg:px-12"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`flex-none rounded-lg bg-[#1a1a1a] animate-pulse ${isLargeRow ? 'w-[140px] aspect-[2/3]' : 'w-[220px] aspect-video'}`}
              />
            ))
          : items.map(item => (
              <div key={item.id} className={`flex-none ${isLargeRow ? 'w-[140px]' : 'w-[220px]'}`}>
                <TVCard media={item} isLargeRow={isLargeRow} mediaType={mediaType} />
              </div>
            ))}
      </div>
    </div>
  );
}
