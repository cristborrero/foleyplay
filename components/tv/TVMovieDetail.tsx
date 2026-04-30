'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsTV } from '@/lib/tv-context';
import { TMDBMedia, TMDBCast } from '@/types/tmdb';
import ServerSelector from '@/components/player/ServerSelector';
import CastRow from '@/components/detail/CastRow';
import SimilarRow from '@/components/detail/SimilarRow';
import TVSimilarPanel from '@/components/tv/TVSimilarPanel';
import { Maximize, Minimize } from 'lucide-react';

interface TVMovieDetailProps {
  tmdbId: number;
  imdbId?: string;
  title: string;
  cast: TMDBCast[];
  similar: TMDBMedia[];
}

export default function TVMovieDetail({ tmdbId, imdbId, title, cast, similar }: TVMovieDetailProps) {
  const isTV = useIsTV();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!isTV) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6 text-white">Reproducir</h2>
        <ServerSelector mediaType="movie" tmdbId={tmdbId} imdbId={imdbId} />
        <CastRow cast={cast} />
        <SimilarRow items={similar} mediaType="movie" />
      </>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Left: fullscreen button + player */}
      <div className="flex flex-col gap-3 flex-[3] min-w-0">
        <div data-tv-row className="flex gap-2 shrink-0">
          <button
            data-tv-card
            tabIndex={0}
            onClick={toggleFullscreen}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); toggleFullscreen(); } }}
            className="flex items-center gap-2 text-white bg-[#222] hover:bg-[#333] focus:bg-[#333] rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</span>
          </button>
        </div>
        <ServerSelector mediaType="movie" tmdbId={tmdbId} imdbId={imdbId} iframeRef={iframeRef} />
      </div>

      {/* Right: similar titles */}
      <div
        className="flex-[2] min-w-0 overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        <TVSimilarPanel items={similar} mediaType="movie" />
      </div>
    </div>
  );
}
