'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';

export default function TVHero() {
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const playBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch('/api/tmdb/trending/all/day')
      .then(r => r.json())
      .then(d => setItems(d.results?.slice(0, 6) || []));
  }, []);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setIndex(i => (i + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items.length]);

  const media = items[index];
  if (!media) {
    return <div className="w-full h-[42vh] bg-[#0a0a0a] shrink-0" />;
  }

  const title = media.title || media.name || '';
  const type = (media.media_type as 'movie' | 'tv') || 'movie';
  const score = media.vote_average ? Math.round(media.vote_average * 10) : null;

  const navigate = () => router.push(`/${type}/${media.id}`);

  return (
    <div data-tv-row className="relative w-full h-[42vh] shrink-0 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <Image
          key={media.id}
          src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
          alt={title}
          fill
          className="object-cover transition-opacity duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 px-8 lg:px-12 pb-8 max-w-2xl">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2 leading-tight drop-shadow">{title}</h1>
        <div className="flex items-center gap-3 mb-3 text-sm">
          {score !== null && (
            <span className={`font-bold text-sm ${score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score}%
            </span>
          )}
          <span className="uppercase text-[11px] text-gray-400 tracking-wider">
            {type === 'movie' ? 'Película' : 'Serie'}
          </span>
        </div>
        {media.overview && (
          <p className="text-gray-300 text-sm line-clamp-2 mb-5 leading-relaxed">{media.overview}</p>
        )}
        <button
          ref={playBtnRef}
          data-tv-card
          tabIndex={0}
          onClick={navigate}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); navigate(); } }}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black focus:scale-105 transition-transform duration-150"
        >
          <Play size={16} fill="black" />
          Reproducir
        </button>
      </div>

      {/* Rotation dots */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-8 lg:right-12 flex gap-1.5 items-center">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 outline-none ${i === index ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
