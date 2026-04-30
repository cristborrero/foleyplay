'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import TVCard from './TVCard';

export default function TVSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState<TMDBMedia[]>([]);

  useEffect(() => {
    fetch('/api/tmdb/trending/all/day')
      .then(r => r.json())
      .then(d => setTrending((d.results || []).filter((i: TMDBMedia) => i.poster_path).slice(0, 20)));
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(d => setResults(
          (d.results || []).filter((i: TMDBMedia) =>
            (i.media_type === 'movie' || i.media_type === 'tv') && i.poster_path
          ).slice(0, 24)
        ))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  const display = query.trim() ? results : trending;

  return (
    <div className="flex-1 h-full overflow-y-auto px-8 lg:px-12 py-6" style={{ scrollbarWidth: 'none' }}>
      <div className="relative mb-8">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas y series..."
          autoFocus
          className="w-full bg-[#1a1a1a] text-white text-lg py-4 pl-12 pr-4 rounded-xl border border-[#2a2a2a] outline-none focus:border-red-600/50 transition-all placeholder:text-gray-600"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && display.length > 0 && (
        <div data-tv-row>
          {query && <p className="text-gray-500 text-sm mb-4">{results.length} resultados para "{query}"</p>}
          {!query && <h2 className="text-white text-lg font-bold mb-4">Tendencias</h2>}
          <div className="flex flex-wrap gap-3 pt-3">
            {display.map(item => (
              <div key={item.id} className="w-[140px]">
                <TVCard media={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="text-gray-400 text-center py-20">Sin resultados para "{query}"</p>
      )}
    </div>
  );
}
