'use client';

import { useEffect } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useHistory } from '@/hooks/useHistory';

interface DetailActionsProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
}

export default function DetailActions({ tmdbId, mediaType, title, posterPath }: DetailActionsProps) {
  const { isInWatchlist, toggle, isLoading } = useWatchlist();
  const { logView } = useHistory();

  const inWatchlist = isInWatchlist(tmdbId, mediaType);

  useEffect(() => {
    // Track in view history
    logView({
      tmdbId,
      mediaType,
      title,
      posterPath,
      progress: 10,
    });
  }, [tmdbId, mediaType, title, posterPath, logView]);

  const handleToggleWatchlist = () => {
    toggle({ tmdbId, mediaType, title, posterPath });
  };

  return (
    <div data-tv-row className="flex flex-wrap gap-2 sm:gap-3 mt-4">
      <button
        data-tv-card
        tabIndex={0}
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }}
        className="bg-white text-black font-bold py-2 px-4 sm:px-6 rounded flex items-center text-sm sm:text-base hover:bg-gray-200 transition-colors outline-none focus:ring-2 focus:ring-fp-lime cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2">
          <path d="M8 5v14l11-7z" />
        </svg>
        Reproducir
      </button>

      <button
        data-tv-card
        tabIndex={0}
        onClick={handleToggleWatchlist}
        disabled={isLoading}
        className="bg-[#333] text-white font-bold py-2 px-4 sm:px-6 rounded flex items-center text-sm sm:text-base hover:bg-[#444] transition-colors disabled:opacity-50 outline-none focus:ring-2 focus:ring-fp-lime cursor-pointer"
      >
        {inWatchlist ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            En mi lista
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Mi lista
          </>
        )}
      </button>
    </div>
  );
}
