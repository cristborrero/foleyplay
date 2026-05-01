'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TMDBMedia } from '@/types/tmdb';
import { useModal } from '@/lib/modal-context';

import MediaRating from '@/components/cards/MediaRating';

const ROTATION_INTERVAL = 8000;

export default function HeroBanner() {
  const { openPlayer } = useModal();
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/tmdb/trending/all/day');
        const data = await res.json();
        const results: TMDBMedia[] = (data.results || [])
          .filter((m: TMDBMedia) => m.backdrop_path)
          .slice(0, 5);
        setItems(results);
      } catch (e) {
        console.error('HeroBanner fetch error:', e);
      }
    }
    fetchTrending();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [items.length]);

  const movie = items[currentIndex];

  if (!movie) {
    return <div className="h-[55vh] sm:h-[70vh] md:h-[85vh] bg-[#111] animate-pulse" />;
  }

  const title = movie.title || movie.name || movie.original_name || '';
  const overview =
    movie.overview?.length > 150
      ? `${movie.overview.substring(0, 150)}...`
      : movie.overview;
  
  const score = movie.vote_average ? Math.round(movie.vote_average * 10) : null;
  const scoreColor = !score ? 'text-gray-400' : score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-fp-lime';

  return (
    <div className="relative h-[55vh] sm:h-[70vh] md:h-[85vh] w-full overflow-hidden">

      {/* background cross-fade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={title || 'Banner'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-lime-950/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* content slide-fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute bottom-[8%] sm:bottom-[15%] md:bottom-[20%] left-4 md:left-8 lg:left-12 max-w-[calc(100%-2rem)] sm:max-w-lg md:max-w-2xl"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg leading-tight">
            {title}
          </h1>
          
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <MediaRating id={movie.id} mediaType={movie.media_type || 'movie'} className="text-[10px] sm:text-xs text-gray-200 border border-gray-500 px-1.5 py-0.5 rounded-sm font-semibold" />
            {score !== null && (
              <>
                <span className={`text-[12px] sm:text-sm font-bold ${scoreColor}`}>★ {score}%</span>
              </>
            )}
            {movie.release_date && <span className="text-gray-400 text-sm">{movie.release_date.slice(0, 4)}</span>}
          </div>

          <p className="hidden sm:block text-gray-200 text-sm md:text-base mb-4 sm:mb-6 drop-shadow-md leading-relaxed max-w-xl">
            {overview}
          </p>

          <div className="flex flex-row gap-2 sm:gap-3">
            <button
              onClick={() => openPlayer({ tmdbId: movie.id, mediaType: movie.media_type || 'movie', title })}
              className="flex items-center px-4 py-2 sm:px-7 sm:py-2.5 bg-white text-black rounded-md font-bold text-sm sm:text-base hover:bg-white/90 transition-all hover:[box-shadow:0_0_20px_rgba(255,255,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fp-lime"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              Reproducir
            </button>
            <Link
              href={`/${movie.media_type || 'movie'}/${movie.id}`}
              className="flex items-center px-4 py-2 sm:px-7 sm:py-2.5 bg-white/10 text-white rounded-md font-bold text-sm sm:text-base border border-white/20 hover:bg-white/20 hover:border-fp-lime/50 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fp-lime"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              Más info
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* dots — static, don't fade with content */}
      {items.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-[8%] md:bottom-[13%] left-4 md:left-8 lg:left-12 flex space-x-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-8 bg-fp-lime shadow-[0_0_6px_rgba(206,255,0,0.8)]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
