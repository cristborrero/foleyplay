'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Loader2, Filter } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import MovieCard from '@/components/cards/MovieCard';

type MediaFilter = 'all' | 'movie' | 'tv';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [popular, setPopular] = useState<TMDBMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [genreFilter, setGenreFilter] = useState<number | null>(null);
  const [yearFilter, setYearFilter] = useState('');
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  const hasFilters =
    mediaFilter !== 'all' || genreFilter !== null || yearFilter !== '';

  useEffect(() => {
    Promise.all([
      fetch('/api/tmdb/genre/movie/list').then((r) => r.json()),
      fetch('/api/tmdb/genre/tv/list').then((r) => r.json()),
    ])
      .then(([movieG, tvG]) => {
        const all = [...(movieG.genres || []), ...(tvG.genres || [])];
        const unique = Array.from(
          new Map(
            all.map((g: { id: number; name: string }) => [g.id, g])
          ).values()
        ) as { id: number; name: string }[];
        setGenres(unique.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/tmdb/trending/all/day')
      .then((r) => r.json())
      .then((d) =>
        setPopular(
          (d.results || [])
            .filter((m: TMDBMedia) => m.poster_path)
            .slice(0, 18)
        )
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) {
        router.push(
          inputValue ? `/search?q=${encodeURIComponent(inputValue)}` : '/search'
        );
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, query, router]);

  useEffect(() => {
    if (!query && !hasFilters) {
      setResults([]);
      return;
    }
    setIsLoading(true);

    if (query) {
      fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => {
          let items: TMDBMedia[] = (d.results || []).filter(
            (i: TMDBMedia) => i.media_type === 'movie' || i.media_type === 'tv'
          );
          if (mediaFilter !== 'all')
            items = items.filter((m) => m.media_type === mediaFilter);
          if (genreFilter)
            items = items.filter((m) => m.genre_ids?.includes(genreFilter));
          if (yearFilter)
            items = items.filter((m) =>
              (m.release_date || m.first_air_date || '').startsWith(yearFilter)
            );
          setResults(items);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      const types: ('movie' | 'tv')[] =
        mediaFilter === 'all' ? ['movie', 'tv'] : [mediaFilter];
      const fetches = types.map((type) => {
        const params = new URLSearchParams();
        if (genreFilter) params.set('with_genres', String(genreFilter));
        if (yearFilter)
          params.set(
            type === 'movie' ? 'primary_release_year' : 'first_air_date_year',
            yearFilter
          );
        return fetch(`/api/tmdb/discover/${type}?${params}`)
          .then((r) => r.json())
          .then((d) =>
            (d.results || []).map((m: TMDBMedia) => ({ ...m, media_type: type }))
          );
      });
      Promise.all(fetches)
        .then(([a, b]) => setResults(b ? [...a, ...b] : a))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [query, mediaFilter, genreFilter, yearFilter, hasFilters]);

  const clearFilters = () => {
    setMediaFilter('all');
    setGenreFilter(null);
    setYearFilter('');
  };

  return (
    <div className="w-full pb-16">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#F4F6F4] tracking-tight mb-4">
          Búsqueda y Exploración
        </h1>

        {/* Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#9CA39D]">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full bg-[#151815] text-[#F4F6F4] text-base sm:text-lg py-4 pl-12 pr-12 rounded-2xl border border-white/10 focus:border-white/20 outline-none transition-all placeholder:text-[#9CA39D]/60"
            placeholder="Buscar películas, series, directores, actores..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#9CA39D] hover:text-white transition-colors cursor-pointer"
              aria-label="Limpiar campo"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center gap-2.5 mb-8">
        <div className="flex items-center gap-1 text-xs text-[#9CA39D] mr-1">
          <Filter size={13} />
          <span>Filtros:</span>
        </div>

        {(['all', 'movie', 'tv'] as MediaFilter[]).map((type) => (
          <button
            key={type}
            onClick={() => setMediaFilter(type)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mediaFilter === type
                ? 'bg-fp-lime text-black font-bold'
                : 'bg-[#151815] text-[#9CA39D] hover:text-[#F4F6F4] border border-white/[0.08] hover:border-white/20'
            }`}
          >
            {type === 'all'
              ? 'Todo'
              : type === 'movie'
              ? 'Películas'
              : 'Series'}
          </button>
        ))}

        {genres.length > 0 && (
          <select
            value={genreFilter ?? ''}
            onChange={(e) =>
              setGenreFilter(e.target.value ? parseInt(e.target.value) : null)
            }
            className="bg-[#151815] text-[#9CA39D] text-xs px-3.5 py-1.5 rounded-full border border-white/[0.08] hover:border-white/20 focus:border-white/30 outline-none cursor-pointer"
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          min="1900"
          max="2099"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          placeholder="Año"
          className="w-20 bg-[#151815] text-[#F4F6F4] text-xs px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-white/20 focus:border-white/30 outline-none placeholder:text-[#9CA39D]/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-fp-lime hover:underline transition-colors ml-2 cursor-pointer font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Results or Trending */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#9CA39D] gap-3">
          <Loader2 size={24} className="animate-spin text-fp-lime" />
          <span className="text-sm">Buscando en el catálogo...</span>
        </div>
      ) : (query || hasFilters) && results.length === 0 ? (
        <div className="text-center py-20 bg-[#101310] rounded-2xl border border-white/[0.08] p-8">
          <p className="text-[#F4F6F4] text-lg font-bold">
            No se encontraron resultados{query ? ` para "${query}"` : ''}
          </p>
          <p className="text-xs text-[#9CA39D] mt-2">
            Probá ajustando las palabras clave o cambiando los filtros seleccionados.
          </p>
        </div>
      ) : query || hasFilters ? (
        <div>
          <p className="text-xs font-semibold text-[#9CA39D] uppercase tracking-wider mb-4">
            {results.length} resultado{results.length !== 1 ? 's' : ''}
            {query ? (
              <>
                {' '}
                para "<span className="text-[#F4F6F4]">{query}</span>"
              </>
            ) : (
              ''
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {results.map((media) => (
              <div key={media.id} className="w-full">
                <MovieCard media={media} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#F4F6F4] tracking-tight">
              Títulos Populares y Recomendados
            </h2>
            <p className="text-xs text-[#9CA39D]">
              Explora lo más visto mientras realizas tu búsqueda
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {popular.map((media) => (
              <div key={media.id} className="w-full">
                <MovieCard media={media} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#080A09]">
      <div className="container-editorial">
        <Suspense
          fallback={
            <div className="text-[#9CA39D] py-20 text-center">Cargando búsqueda...</div>
          }
        >
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
