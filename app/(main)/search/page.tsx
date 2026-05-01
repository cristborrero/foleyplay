'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

  const hasFilters = mediaFilter !== 'all' || genreFilter !== null || yearFilter !== '';

  useEffect(() => {
    Promise.all([
      fetch('/api/tmdb/genre/movie/list').then(r => r.json()),
      fetch('/api/tmdb/genre/tv/list').then(r => r.json()),
    ]).then(([movieG, tvG]) => {
      const all = [...(movieG.genres || []), ...(tvG.genres || [])];
      const unique = Array.from(new Map(all.map((g: { id: number; name: string }) => [g.id, g])).values()) as { id: number; name: string }[];
      setGenres(unique.sort((a, b) => a.name.localeCompare(b.name)));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/tmdb/trending/all/day')
      .then(r => r.json())
      .then(d => setPopular((d.results || []).filter((m: TMDBMedia) => m.backdrop_path).slice(0, 18)))
      .catch(() => {});
  }, []);

  useEffect(() => { setInputValue(query); }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) {
        router.push(inputValue ? `/search?q=${encodeURIComponent(inputValue)}` : '/search');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, query, router]);

  useEffect(() => {
    if (!query && !hasFilters) { setResults([]); return; }
    setIsLoading(true);

    if (query) {
      fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(d => {
          let items: TMDBMedia[] = (d.results || []).filter((i: TMDBMedia) => i.media_type === 'movie' || i.media_type === 'tv');
          if (mediaFilter !== 'all') items = items.filter(m => m.media_type === mediaFilter);
          if (genreFilter) items = items.filter(m => m.genre_ids?.includes(genreFilter));
          if (yearFilter) items = items.filter(m => (m.release_date || m.first_air_date || '').startsWith(yearFilter));
          setResults(items);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      const types: ('movie' | 'tv')[] = mediaFilter === 'all' ? ['movie', 'tv'] : [mediaFilter];
      const fetches = types.map(type => {
        const params = new URLSearchParams();
        if (genreFilter) params.set('with_genres', String(genreFilter));
        if (yearFilter) params.set(type === 'movie' ? 'primary_release_year' : 'first_air_date_year', yearFilter);
        return fetch(`/api/tmdb/discover/${type}?${params}`)
          .then(r => r.json())
          .then(d => (d.results || []).map((m: TMDBMedia) => ({ ...m, media_type: type })));
      });
      Promise.all(fetches)
        .then(([a, b]) => setResults(b ? [...a, ...b] : a))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [query, mediaFilter, genreFilter, yearFilter, hasFilters]);

  const clearFilters = () => { setMediaFilter('all'); setGenreFilter(null); setYearFilter(''); };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          type="text"
          className="w-full bg-fp-elevated text-white text-lg p-4 pl-12 rounded-xl border border-fp-border outline-none focus:border-red-600/40 focus:[box-shadow:0_0_0_1px_rgba(229,9,20,0.2)] transition-all placeholder:text-gray-600"
          placeholder="Películas, series..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        {inputValue && (
          <button onClick={() => setInputValue('')} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['all', 'movie', 'tv'] as MediaFilter[]).map((type) => (
          <button key={type} onClick={() => setMediaFilter(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${mediaFilter === type ? 'bg-white text-black' : 'bg-fp-elevated text-gray-300 border border-fp-border hover:border-white/30'}`}>
            {type === 'all' ? 'Todo' : type === 'movie' ? 'Películas' : 'Series'}
          </button>
        ))}
        {genres.length > 0 && (
          <select value={genreFilter ?? ''} onChange={e => setGenreFilter(e.target.value ? parseInt(e.target.value) : null)}
            className="bg-fp-elevated text-gray-300 text-sm px-3 py-1.5 rounded-full border border-fp-border focus:border-white/30 outline-none cursor-pointer">
            <option value="">Género</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        )}
        <input type="number" min="1900" max="2099" value={yearFilter} onChange={e => setYearFilter(e.target.value)}
          placeholder="Año"
          className="w-24 bg-fp-elevated text-gray-300 text-sm px-3 py-1.5 rounded-full border border-fp-border focus:border-white/30 outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        {hasFilters && <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-300 transition-colors ml-1">Limpiar</button>}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (query || hasFilters) && results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Sin resultados{query ? ` para "${query}"` : ''}</p>
          <p className="text-gray-600 text-sm mt-2">Probá con otras palabras o filtros.</p>
        </div>
      ) : (query || hasFilters) ? (
        <>
          <p className="text-gray-500 text-sm mb-4">
            {results.length} resultado{results.length !== 1 ? 's' : ''}
            {query ? <> para "<span className="text-white">{query}</span>"</> : ''}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((media) => <div key={media.id} className="w-full"><MovieCard media={media} /></div>)}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-white text-xl font-bold mb-4">Tendencias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popular.map((media) => <div key={media.id} className="w-full"><MovieCard media={media} /></div>)}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-5 md:px-8 lg:px-12 min-h-screen bg-fp-black">
      <Suspense fallback={<div className="text-white pt-20">Cargando...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
