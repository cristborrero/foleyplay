'use client';

import { useEffect, useState } from 'react';
import { TMDBMedia } from '@/types/tmdb';
import TVCard from './TVCard';

interface TVCarouselProps {
  title: string;
  fetchUrl: string;
  mediaType?: 'movie' | 'tv';
}

export default function TVCarousel({ title, fetchUrl, mediaType }: TVCarouselProps) {
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(fetchUrl)
      .then(r => r.json())
      .then(d => setItems(d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  if (!loading && !items.length) return null;

  return (
    <div data-tv-row className="mb-8">
      <h2 className="text-white text-lg font-bold mb-3 px-8 lg:px-12">{title}</h2>
      <div
        className="flex gap-3 overflow-x-auto pt-3 pb-4 px-8 lg:px-12 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-none w-[140px] aspect-[2/3] rounded-lg bg-[#1a1a1a] animate-pulse" />
            ))
          : items.map(item => (
              <div key={item.id} className="flex-none w-[140px]">
                <TVCard media={item} mediaType={mediaType} />
              </div>
            ))}
      </div>
    </div>
  );
}
