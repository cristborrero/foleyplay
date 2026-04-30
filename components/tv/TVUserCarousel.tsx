'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserItem {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  progress?: number;
  season?: number;
  episode?: number;
}

interface TVUserCarouselProps {
  title: string;
  fetchUrl: string;
}

function UserCard({ item }: { item: UserItem }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = () => router.push(`/${item.mediaType}/${item.tmdbId}`);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      onClick={navigate}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); navigate(); } }}
      onFocus={() => cardRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })}
      className="relative cursor-pointer rounded-lg overflow-hidden bg-[#111] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-black focus:scale-[1.06] transition-transform duration-150 aspect-video"
    >
      {item.posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w300${item.posterPath}`}
          alt={item.title}
          fill
          className="object-cover"
          sizes="220px"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
          <span className="text-gray-600 text-xs text-center px-2">{item.title}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
        <p className="text-white text-[11px] font-semibold leading-tight truncate">{item.title}</p>
        {item.season && item.episode && (
          <p className="text-gray-400 text-[10px]">T{item.season} E{item.episode}</p>
        )}
        {item.progress !== undefined && item.progress > 0 && (
          <div className="mt-1 h-0.5 bg-gray-700 rounded-full">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(item.progress, 100)}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TVUserCarousel({ title, fetchUrl }: TVUserCarouselProps) {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(fetchUrl)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  if (!loading && !items.length) return null;

  return (
    <div ref={rowRef} data-tv-row className="mb-8">
      <h2 className="text-white text-lg font-bold mb-3 px-8 lg:px-12">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 px-8 lg:px-12" style={{ scrollbarWidth: 'none' }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-none w-[220px] aspect-video rounded-lg bg-[#1a1a1a] animate-pulse" />
            ))
          : items.map(item => (
              <div key={`${item.tmdbId}-${item.mediaType}`} className="flex-none w-[220px]">
                <UserCard item={item} />
              </div>
            ))}
      </div>
    </div>
  );
}
