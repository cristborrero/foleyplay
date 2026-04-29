'use client';

import { useRef, useState, useEffect } from 'react';
import { TMDBMedia } from '@/types/tmdb';
import MovieCard from '@/components/cards/MovieCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

interface ContentRowProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
  mediaType?: 'movie' | 'tv';
}

const SKELETON_COUNT = 6;

export default function ContentRow({ title, fetchUrl, isLargeRow = false, mediaType }: ContentRowProps) {
  const [movies, setMovies] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load via IntersectionObserver — only fetch when row enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetched) {
          setFetched(true);
          setLoading(true);
          fetch(fetchUrl)
            .then(r => r.json())
            .then(d => setMovies(d.results || []))
            .catch(() => {})
            .finally(() => setLoading(false));
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchUrl, fetched]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: 'smooth',
      });
    }
  };

  // Don't render empty state (unless loading skeleton)
  if (!loading && !fetched) {
    return <div ref={containerRef} className="pl-3 sm:pl-4 md:pl-8 lg:pl-12 my-6 sm:my-8 h-[160px] sm:h-[200px]" />;
  }
  if (!loading && movies.length === 0) return null;

  return (
    <div ref={containerRef} className="pl-3 sm:pl-4 md:pl-8 lg:pl-12 my-6 sm:my-8">
      <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center rounded-l-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div
          ref={rowRef}
          className="flex space-x-2 sm:space-x-3 overflow-x-scroll py-3 sm:py-4 pr-3 sm:pr-4 md:pr-8 lg:pr-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className={`flex-none ${isLargeRow ? 'w-[110px] sm:w-[140px] md:w-[175px]' : 'w-[150px] sm:w-[185px] md:w-[230px]'}`}>
                  <SkeletonCard isLargeRow={isLargeRow} />
                </div>
              ))
            : movies.map((movie) => (
                <div key={movie.id} className={`flex-none ${isLargeRow ? 'w-[110px] sm:w-[140px] md:w-[175px]' : 'w-[150px] sm:w-[185px] md:w-[230px]'}`}>
                  <MovieCard media={movie} isLargeRow={isLargeRow} mediaType={mediaType} />
                </div>
              ))}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center rounded-r-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
