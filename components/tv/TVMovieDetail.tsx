'use client';

import { useEffect, useRef, useState } from 'react';
import { TMDBMedia } from '@/types/tmdb';
import ServerSelector from '@/components/player/ServerSelector';
import TVSimilarPanel from '@/components/tv/TVSimilarPanel';
import { Maximize, Minimize } from 'lucide-react';

interface TVMovieDetailProps {
  tmdbId: number;
  imdbId?: string;
  similar: TMDBMedia[];
}

export default function TVMovieDetail({ tmdbId, imdbId, similar }: TVMovieDetailProps) {
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

  return (
    <div className="flex gap-4">
      <div className="flex-[3] min-w-0 flex flex-col gap-3">
        <div data-tv-row className="flex shrink-0">
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
        <ServerSelector mediaType="movie" tmdbId={tmdbId} imdbId={imdbId} iframeRef={iframeRef} tvMode />
      </div>
      <div className="flex-[2] min-w-0 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <TVSimilarPanel items={similar} mediaType="movie" />
      </div>
    </div>
  );
}
