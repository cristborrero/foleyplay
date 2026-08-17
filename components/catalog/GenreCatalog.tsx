'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import MovieCard from '@/components/cards/MovieCard';

interface GenreOption {
  id: number | 'all';
  name: string;
}

const MOVIE_GENRES: GenreOption[] = [
  { id: 'all', name: 'Todas' },
  { id: 28, name: 'Acción' },
  { id: 35, name: 'Comedia' },
  { id: 878, name: 'Ciencia Ficción' },
  { id: 27, name: 'Terror' },
  { id: 18, name: 'Drama' },
  { id: 16, name: 'Animación' },
  { id: 80, name: 'Crimen' },
  { id: 12, name: 'Aventura' },
  { id: 14, name: 'Fantasía' },
  { id: 53, name: 'Suspenso' },
];

const TV_GENRES: GenreOption[] = [
  { id: 'all', name: 'Todas' },
  { id: 10759, name: 'Acción y Aventura' },
  { id: 35, name: 'Comedia' },
  { id: 18, name: 'Drama' },
  { id: 10765, name: 'Ciencia Ficción y Fantasía' },
  { id: 80, name: 'Crimen' },
  { id: 9648, name: 'Misterio' },
  { id: 16, name: 'Animación' },
];

interface GenreCatalogProps {
  mediaType: 'movie' | 'tv';
  defaultRows?: React.ReactNode;
}

export default function GenreCatalog({ mediaType, defaultRows }: GenreCatalogProps) {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre');
  const [activeGenre, setActiveGenre] = useState<number | 'all'>(
    initialGenre ? parseInt(initialGenre) || 'all' : 'all'
  );
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const genres = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;

  const fetchContent = useCallback(
    async (genreId: number | 'all', pageNum: number, append: boolean = false) => {
      if (genreId === 'all') {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const url = `/api/tmdb/discover/${mediaType}?with_genres=${genreId}&page=${pageNum}`;
        const res = await fetch(url);
        const data = await res.json();
        const results = (data.results || [])
          .filter((m: TMDBMedia) => m.poster_path)
          .map((m: TMDBMedia) => ({ ...m, media_type: mediaType }));

        setHasMore(results.length > 0);
        setItems((prev) => (append ? [...prev, ...results] : results));
      } catch (err) {
        console.error('Error fetching genre catalog:', err);
      } finally {
        setLoading(false);
      }
    },
    [mediaType]
  );

  useEffect(() => {
    setPage(1);
    fetchContent(activeGenre, 1, false);
  }, [activeGenre, fetchContent]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchContent(activeGenre, next, true);
  };

  const selectedGenreObj = genres.find((g) => g.id === activeGenre);

  return (
    <div className="w-full">
      {/* Genre Filter Pills */}
      <div className="container-editorial mb-8">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {genres.map((g) => {
            const isActive = activeGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGenre(g.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150 shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-fp-lime text-black font-bold border-fp-lime'
                    : 'bg-[#151815] hover:bg-[#1C201C] active:scale-95 text-[#9CA39D] hover:text-[#F4F6F4] border-white/[0.08] hover:border-white/20'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered View OR Default Rails */}
      {activeGenre === 'all' ? (
        defaultRows
      ) : (
        <div className="container-editorial pb-20 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-4 py-4 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-fp-lime" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F6F4]">
                {mediaType === 'movie' ? 'Películas de ' : 'Series de '}
                {selectedGenreObj?.name}
              </h2>
            </div>

            <button
              onClick={() => setActiveGenre('all')}
              className="text-xs text-fp-lime hover:underline cursor-pointer font-medium"
            >
              Ver todas las categorías
            </button>
          </div>

          {loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#9CA39D]">
              <Loader2 size={28} className="animate-spin text-fp-lime" />
              <span className="text-xs">Cargando títulos...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {items.map((media, idx) => (
                  <div
                    key={`${media.id}-${idx}`}
                    className="w-full"
                  >
                    <MovieCard media={media} mediaType={mediaType} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#151815] hover:bg-[#1C201C] text-[#F4F6F4] hover:text-fp-lime font-semibold px-6 py-3 rounded-xl border border-white/[0.08] hover:border-fp-lime/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-fp-lime" />
                        <span>Cargando más...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={15} />
                        <span>Cargar más {selectedGenreObj?.name}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
