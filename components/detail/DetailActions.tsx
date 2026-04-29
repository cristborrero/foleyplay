'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface DetailActionsProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
}

export default function DetailActions({ tmdbId, mediaType, title, posterPath }: DetailActionsProps) {
  const { data: session } = useSession();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        // Track history
        fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tmdbId,
            mediaType,
            title,
            posterPath,
            progress: 10
          })
        });

        // Check watchlist
        const res = await fetch('/api/watchlist');
        if (res.ok) {
          const wl = await res.json();
          setInWatchlist(wl.some((item: any) => item.tmdbId === tmdbId && item.mediaType === mediaType));
        }
      } catch (error) {
        console.error('Error tracking view/watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkStatus();
  }, [session, tmdbId, mediaType, title, posterPath]);

  const toggleWatchlist = async () => {
    if (!session?.user) {
      alert('Debes iniciar sesión para usar Mi Lista');
      return;
    }

    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId, mediaType, title, posterPath })
      });
      
      const data = await res.json();
      if (res.ok) {
        setInWatchlist(data.added);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
      <button
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }}
        className="bg-white text-black font-bold py-2 px-4 sm:px-6 rounded flex items-center text-sm sm:text-base hover:bg-gray-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2">
          <path d="M8 5v14l11-7z" />
        </svg>
        Reproducir
      </button>

      <button
        onClick={toggleWatchlist}
        disabled={isLoading}
        className="bg-[#333] text-white font-bold py-2 px-4 sm:px-6 rounded flex items-center text-sm sm:text-base hover:bg-[#444] transition-colors disabled:opacity-50"
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
