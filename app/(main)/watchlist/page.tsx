'use client';

import { useState, useEffect } from 'react';
import MovieCard from '@/components/cards/MovieCard';
import { TMDBMedia } from '@/types/tmdb';

// Simulate TMDBMedia from Watchlist Model
interface WatchlistItem {
  _id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const res = await fetch('/api/watchlist');
        if (res.ok) {
          const data = await res.json();
          setWatchlist(data);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWatchlist();
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
        <h1 className="text-3xl font-bold text-white mb-8">Mi Lista</h1>

        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Tu lista está vacía.</p>
            <p className="text-gray-500 mt-2">Agrega películas y series para verlas más tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item) => {
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
                <div key={item._id} className="w-full">
                  <MovieCard media={media} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}