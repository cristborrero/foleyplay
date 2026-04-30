'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TMDBMedia } from '@/types/tmdb';

function SimilarCard({ item, mediaType }: { item: TMDBMedia; mediaType: 'movie' | 'tv' }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = () => router.push(`/${mediaType}/${item.id}`);

  return (
    <div
      ref={cardRef}
      data-tv-card
      tabIndex={0}
      onClick={navigate}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); navigate(); } }}
      onFocus={() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
      className="flex gap-3 items-center cursor-pointer rounded-lg p-2 hover:bg-white/5 focus:bg-white/5 outline-none focus:ring-2 focus:ring-red-500 transition-colors"
    >
      <div className="relative flex-none w-[52px] aspect-[2/3] rounded overflow-hidden bg-[#1a1a1a]">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
            alt={item.title || item.name || ''}
            fill
            className="object-cover"
            sizes="52px"
          />
        ) : (
          <div className="absolute inset-0 bg-[#222]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
          {item.title || item.name}
        </p>
        {item.vote_average ? (
          <p className="text-green-400 text-[10px] font-bold mt-1">
            ★ {item.vote_average.toFixed(1)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

interface TVSimilarPanelProps {
  items: TMDBMedia[];
  mediaType: 'movie' | 'tv';
}

export default function TVSimilarPanel({ items, mediaType }: TVSimilarPanelProps) {
  if (!items.length) return null;

  return (
    <div data-tv-row className="flex flex-col gap-0.5">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider px-2 pb-2 shrink-0">
        Títulos similares
      </h3>
      {items.map(item => (
        <SimilarCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
}
