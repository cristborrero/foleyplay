'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { TMDBMedia } from '@/types/tmdb';

interface TVCardProps {
  media: TMDBMedia;
  isLargeRow?: boolean;
  mediaType?: 'movie' | 'tv';
}

export default function TVCard({ media, isLargeRow = false, mediaType }: TVCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const imagePath = isLargeRow ? media.poster_path : media.backdrop_path || media.poster_path;
  if (!imagePath) return null;

  const title = media.title || media.name || '';
  const score = media.vote_average ? Math.round(media.vote_average * 10) : null;
  const scoreColor = !score ? 'text-gray-400' : score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const resolvedType = mediaType || (media.media_type as 'movie' | 'tv') || 'movie';

  const navigate = () => router.push(`/${resolvedType}/${media.id}`);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      onClick={navigate}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); navigate(); } }}
      onFocus={() => cardRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })}
      className={`relative cursor-pointer rounded-lg overflow-hidden bg-[#111] outline-none transition-transform duration-150 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-black focus:scale-[1.06] ${isLargeRow ? 'aspect-[2/3]' : 'aspect-video'}`}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${imagePath}`}
        alt={title}
        fill
        className="object-cover"
        sizes="220px"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
        <p className="text-white text-[11px] font-semibold leading-tight truncate">{title}</p>
        {score !== null && (
          <span className={`text-[10px] font-bold ${scoreColor}`}>{score}%</span>
        )}
      </div>
    </div>
  );
}
