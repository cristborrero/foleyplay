import { tmdb } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import DetailActions from '@/components/detail/DetailActions';
import TVShowDetail from '@/components/tv/TVShowDetail';

export default async function TVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const tv = await tmdb.getDetail('tv', Number(id));

    if (!tv) {
      return notFound();
    }

    const title = tv.title || tv.name || tv.original_name;
    const firstAirYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '';

    return (
      <div className="min-h-screen bg-fp-black">
        {/* Banner Section */}
        <div className="relative h-[45vh] sm:h-[50vh] md:h-[60vh] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-fp-black via-fp-black/80 to-transparent" />

          <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 lg:p-12 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-300 mb-3">
              <span>{firstAirYear}</span>
              {tv.number_of_seasons && <span>{tv.number_of_seasons} Temporadas</span>}
              <span className="flex items-center text-green-400 font-bold">
                ★ {tv.vote_average?.toFixed(1)}
              </span>
            </div>
            <p className="max-w-full md:max-w-3xl text-gray-200 text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
              {tv.overview}
            </p>
            <DetailActions
              tmdbId={Number(id)}
              mediaType="tv"
              title={title || 'Título desconocido'}
              posterPath={tv.poster_path || ''}
            />
          </div>
        </div>

        {/* Player + Episodes + Similar Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 max-w-7xl mx-auto">
          <TVShowDetail
            tmdbId={Number(id)}
            seasons={tv.seasons?.filter(s => s.season_number > 0) || []}
            imdbId={tv.external_ids?.imdb_id}
            cast={tv.credits?.cast || []}
            similar={tv.similar?.results || []}
          />
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
