'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TMDBMedia } from '@/types/tmdb';
import { useModal } from '@/lib/modal-context';

interface MovieCardProps {
  media: TMDBMedia;
  isLargeRow?: boolean;
  mediaType?: 'movie' | 'tv';
}

export default function MovieCard({ media, isLargeRow = false, mediaType }: MovieCardProps) {
  const { openPlayer, openDetail } = useModal();
  const [hovered, setHovered] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const imagePath = isLargeRow ? media.poster_path : media.backdrop_path || media.poster_path;
  if (!imagePath) return null;

  const title = media.title || media.name || '';
  const year = media.release_date?.slice(0, 4) || media.first_air_date?.slice(0, 4) || '';
  const score = media.vote_average ? Math.round(media.vote_average * 10) : null;
  const scoreColor = !score ? 'text-gray-400' : score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const overview = media.overview
    ? media.overview.length > 110 ? media.overview.slice(0, 110) + '…' : media.overview
    : '';
  const resolvedMediaType = mediaType || media.media_type || 'movie';
  const typeLabel = resolvedMediaType === 'tv' ? 'Serie' : 'Película';

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 300);
  };
  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHovered(false);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPlayer({ tmdbId: media.id, mediaType: resolvedMediaType, title });
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openDetail({ tmdbId: media.id, mediaType: resolvedMediaType });
  };

  return (
    <div
      className="relative cursor-pointer"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={handleInfo}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); openDetail({ tmdbId: media.id, mediaType: resolvedMediaType }); }
      }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative w-full ${isLargeRow ? 'aspect-2/3' : 'aspect-video'} rounded-lg overflow-hidden bg-[#111]`}
      >
        {/* Image */}
        <Image
          src={`https://image.tmdb.org/t/p/w500${imagePath}`}
          alt={title}
          fill
          className={`object-cover transition-all duration-300 ${hovered ? 'brightness-75' : 'brightness-100'}`}
          sizes="(max-width: 768px) 40vw, (max-width: 1024px) 22vw, 16vw"
          loading="lazy"
        />

        {/* Permanent gradient + info */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6">
          <p className="text-white text-[11px] font-semibold leading-tight truncate">{title}</p>
          {score !== null && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[10px] font-bold ${scoreColor}`}>{score}%</span>
              <span className="text-gray-500 text-[9px]">·</span>
              <span className="text-gray-400 text-[9px]">{year}</span>
            </div>
          )}
        </div>

        {/* Hover panel — slides up from bottom */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 right-0 bg-netflix-black/97 backdrop-blur-sm px-2.5 pt-2.5 pb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title + badges */}
              <p className="text-white text-xs font-bold leading-tight truncate mb-1">{title}</p>
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                {score !== null && (
                  <span className={`text-[10px] font-bold ${scoreColor}`}>{score}%</span>
                )}
                {year && <span className="text-gray-500 text-[10px]">{year}</span>}
                <span className="text-[9px] text-gray-500 border border-gray-700 px-1 rounded-sm leading-tight">
                  {typeLabel}
                </span>
              </div>

              {/* Overview */}
              {overview && (
                <p className="text-gray-300 text-[10px] leading-relaxed line-clamp-2 mb-2">
                  {overview}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePlay}
                  className="flex items-center justify-center w-7 h-7 bg-white rounded-full text-black hover:bg-white/90 transition-all hover:scale-110 shrink-0"
                  title="Reproducir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={handleInfo}
                  className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-500 text-white hover:border-white transition-all hover:scale-110 shrink-0"
                  title="Más información"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className="ml-auto text-[9px] text-gray-600 truncate">
                  {resolvedMediaType === 'tv' ? 'Ver serie →' : 'Ver película →'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
