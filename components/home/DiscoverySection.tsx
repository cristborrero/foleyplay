'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Flame, Film, Tv, Sparkles, Popcorn, Compass, Heart, Zap, Ghost, Laugh,
  Loader2, ArrowLeft, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import MovieCard from '@/components/cards/MovieCard';

export interface CategoryOption {
  id: string; // 'all' | 'movie' | 'tv' | genre number
  label: string;
  icon: any;
  movieGenreId?: number;
  tvGenreId?: number;
  description?: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Todo / Inicio', icon: Flame, description: 'Catálogo completo y selecciones editoriales' },
  { id: 'movie', label: 'Películas', icon: Film, description: 'Todos los estrenos y películas populares' },
  { id: 'tv', label: 'Series', icon: Tv, description: 'Series de televisión y temporadas completas' },
  { id: '28', label: 'Acción', icon: Zap, movieGenreId: 28, tvGenreId: 10759, description: 'Adrenalina, explosiones, superhéroes y artes marciales' },
  { id: '35', label: 'Comedia', icon: Laugh, movieGenreId: 35, tvGenreId: 35, description: 'Risas, humor inteligente y momentos divertidos' },
  { id: '878', label: 'Ciencia Ficción', icon: Sparkles, movieGenreId: 878, tvGenreId: 10765, description: 'Futurismo, viajes espaciales y tecnología distópica' },
  { id: '27', label: 'Terror', icon: Ghost, movieGenreId: 27, tvGenreId: 9648, description: 'Sustos, tensión psicológica y horror sobrenatural' },
  { id: '18', label: 'Drama', icon: Heart, movieGenreId: 18, tvGenreId: 18, description: 'Historias conmovedoras, conflictos humanos y romance' },
  { id: '16', label: 'Animación', icon: Popcorn, movieGenreId: 16, tvGenreId: 16, description: 'Obras maestras de la animación para todas las edades' },
  { id: '80', label: 'Crimen y Suspenso', icon: Compass, movieGenreId: 80, tvGenreId: 80, description: 'Misterio, detectives, mafia y giros inesperados' },
];

interface DiscoverySectionProps {
  children?: React.ReactNode; // Default full editorial feed when 'all' is active
}

export default function DiscoverySection({ children }: DiscoverySectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryOption>(CATEGORIES[0]);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchGenreContent = useCallback(async (cat: CategoryOption, type: 'all' | 'movie' | 'tv', pageNum: number, append: boolean = false) => {
    if (cat.id === 'all') return;
    setLoading(true);

    try {
      let results: TMDBMedia[] = [];

      if (cat.id === 'movie') {
        const res = await fetch(`/api/tmdb/movie/popular?page=${pageNum}`);
        const data = await res.json();
        results = (data.results || []).map((m: TMDBMedia) => ({ ...m, media_type: 'movie' }));
      } else if (cat.id === 'tv') {
        const res = await fetch(`/api/tmdb/tv/popular?page=${pageNum}`);
        const data = await res.json();
        results = (data.results || []).map((m: TMDBMedia) => ({ ...m, media_type: 'tv' }));
      } else {
        // Specific genre ID
        const fetches: Promise<any>[] = [];

        if (type === 'all' || type === 'movie') {
          if (cat.movieGenreId) {
            fetches.push(
              fetch(`/api/tmdb/discover/movie?with_genres=${cat.movieGenreId}&page=${pageNum}`)
                .then(r => r.json())
                .then(d => (d.results || []).map((m: TMDBMedia) => ({ ...m, media_type: 'movie' })))
            );
          }
        }

        if (type === 'all' || type === 'tv') {
          if (cat.tvGenreId) {
            fetches.push(
              fetch(`/api/tmdb/discover/tv?with_genres=${cat.tvGenreId}&page=${pageNum}`)
                .then(r => r.json())
                .then(d => (d.results || []).map((m: TMDBMedia) => ({ ...m, media_type: 'tv' })))
            );
          }
        }

        const responses = await Promise.all(fetches);
        if (responses.length === 2) {
          // Interleave movies & tv
          const [movies, tvs] = responses;
          const combined: TMDBMedia[] = [];
          const maxLen = Math.max(movies.length, tvs.length);
          for (let i = 0; i < maxLen; i++) {
            if (movies[i]) combined.push(movies[i]);
            if (tvs[i]) combined.push(tvs[i]);
          }
          results = combined;
        } else if (responses.length === 1) {
          results = responses[0];
        }
      }

      const filtered = results.filter((m: TMDBMedia) => m.poster_path);
      setHasMore(filtered.length > 0);
      setItems(prev => append ? [...prev, ...filtered] : filtered);
    } catch (err) {
      console.error('Error fetching genre content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // When category or filterType changes
  useEffect(() => {
    if (activeCategory.id === 'all') {
      setItems([]);
      return;
    }
    setPage(1);
    fetchGenreContent(activeCategory, filterType, 1, false);
  }, [activeCategory, filterType, fetchGenreContent]);

  const handleSelectCategory = (cat: CategoryOption) => {
    setActiveCategory(cat);
    setFilterType('all');
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGenreContent(activeCategory, filterType, nextPage, true);
  };

  return (
    <div className="w-full">
      {/* Discovery Strip Navigation */}
      <section className="container-editorial py-6 sm:py-8" aria-label="Categorías y géneros">
        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory.id === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150 shrink-0 select-none cursor-pointer border ${
                  isActive
                    ? 'bg-fp-lime text-black font-bold border-fp-lime'
                    : 'bg-[#151815] hover:bg-[#1C201C] active:scale-95 text-[#9CA39D] hover:text-[#F4F6F4] border-white/[0.08] hover:border-white/20'
                }`}
                aria-pressed={isActive}
              >
                <Icon size={15} className={isActive ? 'text-black' : 'text-fp-lime shrink-0'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* When 'all' is selected -> Show full homepage */}
      {activeCategory.id === 'all' ? (
        children
      ) : (
        /* When a specific category is selected -> Show filtered genre feed */
        <section className="container-editorial pb-20 animate-in fade-in duration-200">
          {/* Header of Filtered View */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-white/[0.08] mb-8">
            <div>
              <div className="flex items-center gap-2 text-fp-lime text-xs font-semibold uppercase tracking-wider mb-1.5">
                <activeCategory.icon size={15} />
                <span>Colección por Género</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F4F6F4] tracking-tight">
                {activeCategory.label}
              </h2>
              {activeCategory.description && (
                <p className="text-xs sm:text-sm text-[#9CA39D] mt-1">
                  {activeCategory.description}
                </p>
              )}
            </div>

            {/* Type Filter & Reset Button */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {activeCategory.id !== 'movie' && activeCategory.id !== 'tv' && (
                <div className="flex items-center bg-[#151815] p-1 rounded-xl border border-white/[0.08]">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filterType === 'all' ? 'bg-white/15 text-[#F4F6F4] font-semibold' : 'text-[#9CA39D] hover:text-[#F4F6F4]'
                    }`}
                  >
                    Todo
                  </button>
                  <button
                    onClick={() => setFilterType('movie')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filterType === 'movie' ? 'bg-white/15 text-[#F4F6F4] font-semibold' : 'text-[#9CA39D] hover:text-[#F4F6F4]'
                    }`}
                  >
                    Películas
                  </button>
                  <button
                    onClick={() => setFilterType('tv')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filterType === 'tv' ? 'bg-white/15 text-[#F4F6F4] font-semibold' : 'text-[#9CA39D] hover:text-[#F4F6F4]'
                    }`}
                  >
                    Series
                  </button>
                </div>
              )}

              <button
                onClick={() => handleSelectCategory(CATEGORIES[0])}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#9CA39D] hover:text-[#F4F6F4] text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Ver todo el catálogo</span>
              </button>
            </div>
          </div>

          {/* Grid of Results */}
          {loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3 text-[#9CA39D]">
              <Loader2 size={28} className="animate-spin text-fp-lime" />
              <span className="text-xs">Cargando títulos de {activeCategory.label}...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-[#101310] rounded-2xl border border-white/[0.08] p-8">
              <p className="text-[#F4F6F4] text-lg font-bold">No se encontraron títulos en esta categoría</p>
              <p className="text-xs text-[#9CA39D] mt-1">Prueba seleccionando otro filtro o vuelve al inicio.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {items.map((media, idx) => (
                  <div key={`${media.media_type}-${media.id}-${idx}`} className="w-full">
                    <MovieCard media={media} mediaType={media.media_type as 'movie' | 'tv'} />
                  </div>
                ))}
              </div>

              {/* Load More Action */}
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
                        <span>Cargar más títulos de {activeCategory.label}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
