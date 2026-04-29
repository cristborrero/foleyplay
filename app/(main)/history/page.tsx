'use client';

import { useState, useEffect } from 'react';
import MovieCard from '@/components/cards/MovieCard';
import { TMDBMedia } from '@/types/tmdb';

interface HistoryItem {
  _id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  progress: number;
  watchedAt: string;
  season?: number;
  episode?: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-fp-black flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen bg-fp-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Continuar Viendo</h1>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No has visto nada aún.</p>
            <p className="text-gray-500 mt-2">Reproduce una película o serie para que aparezca aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {history.map((item) => {
              // Convert to TMDBMedia format for MovieCard
              const media: TMDBMedia = {
                id: item.tmdbId,
                media_type: item.mediaType,
                title: item.mediaType === 'movie' ? item.title : undefined,
                name: item.mediaType === 'tv' ? item.title : undefined,
                poster_path: item.posterPath,
                backdrop_path: '',
                overview: '',
                vote_average: 0,
                release_date: '',
                first_air_date: ''
              };

              return (
                <div key={item._id} className="w-full relative group">
                  <MovieCard media={media} />
                  {/* Progress overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 z-10 pointer-events-none">
                    <div 
                      className="h-full bg-red-600" 
                      style={{ width: `${Math.min(100, Math.max(0, item.progress || 50))}%` }}
                    ></div>
                  </div>
                  {/* Info overlay (season/episode) */}
                  {item.mediaType === 'tv' && item.season && item.episode && (
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white z-10 pointer-events-none">
                      T{item.season} E{item.episode}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}