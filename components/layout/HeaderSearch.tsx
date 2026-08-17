'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Film, Tv, ArrowRight, Loader2 } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced live search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          const filtered = (data.results || [])
            .filter((i: TMDBMedia) => (i.media_type === 'movie' || i.media_type === 'tv') && (i.poster_path || i.backdrop_path))
            .slice(0, 6);
          setResults(filtered);
        }
      } catch (err) {
        console.error('Error fetching live search:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (item: TMDBMedia) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/${item.media_type || 'movie'}/${item.id}`);
  };

  return (
    <div className="relative w-full max-w-[280px] lg:max-w-[340px]">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-[#9CA39D] pointer-events-none flex items-center">
          <Search size={15} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar películas, series..."
          className="w-full bg-[#151815] hover:bg-[#1C201C] focus:bg-[#1C201C] text-[#F4F6F4] placeholder-[#9CA39D]/70 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-full border border-white/10 focus:border-white/20 transition-all duration-200"
          aria-label="Buscar títulos"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-[#9CA39D] hover:text-[#F4F6F4] transition-colors cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Live search dropdown */}
      {isOpen && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 left-0 mt-2 bg-[#101310] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {loading ? (
            <div className="flex items-center justify-center py-6 text-[#9CA39D] gap-2 text-xs">
              <Loader2 size={16} className="animate-spin text-fp-lime" />
              <span>Buscando...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#9CA39D] uppercase tracking-wider">
                Resultados rápidos
              </div>
              {results.map((item) => {
                const title = item.title || item.name;
                const year = (item.release_date || item.first_air_date || '').split('-')[0];
                const isMovie = item.media_type === 'movie';
                return (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left cursor-pointer group"
                  >
                    <div className="relative w-9 h-13 rounded bg-black/40 overflow-hidden shrink-0">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={title || ''}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9CA39D]">
                          {isMovie ? <Film size={14} /> : <Tv size={14} />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-[#F4F6F4] truncate group-hover:text-fp-lime transition-colors">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-[#9CA39D] mt-0.5">
                        <span className="capitalize">{isMovie ? 'Película' : 'Serie'}</span>
                        {year && <span>• {year}</span>}
                        {item.vote_average > 0 && (
                          <span className="text-fp-lime font-semibold">
                            ★ {item.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              <div className="border-t border-white/5 mt-1 pt-1 px-2">
                <button
                  onClick={handleSubmit}
                  className="w-full px-3 py-2 text-xs text-fp-lime hover:bg-white/5 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Ver todos los resultados para "{query}"</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 px-4 text-center text-xs text-[#9CA39D]">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
