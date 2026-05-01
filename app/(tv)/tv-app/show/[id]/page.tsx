import { tmdb } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import DetailActions from '@/components/detail/DetailActions';
import TVShowDetail from '@/components/tv/TVShowDetail';

export default async function TVShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const tv = await tmdb.getDetail('tv', Number(id));
    if (!tv) return notFound();

    const title = tv.title || tv.name || tv.original_name || '';
    const firstAirYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '';

    return (
      <div className="overflow-y-auto h-full [&::-webkit-scrollbar]:hidden bg-fp-black" style={{ scrollbarWidth: 'none' }}>
        <div className="relative h-[40vh] w-full">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})` }} />
          <div className="absolute inset-0 bg-linear-to-t from-fp-black via-fp-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h1 className="text-3xl font-bold text-white mb-1 leading-tight">{title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
              <span>{firstAirYear}</span>
              {tv.number_of_seasons && <span>{tv.number_of_seasons} Temporadas</span>}
              <span className="text-green-400 font-bold">★ {tv.vote_average?.toFixed(1)}</span>
            </div>
            <p className="text-gray-300 text-sm max-w-2xl line-clamp-2">{tv.overview}</p>
            <DetailActions tmdbId={Number(id)} mediaType="tv" title={title} posterPath={tv.poster_path || ''} />
          </div>
        </div>
        <div className="px-6 py-4">
          <TVShowDetail
            tmdbId={Number(id)}
            seasons={tv.seasons?.filter(s => s.season_number > 0) || []}
            imdbId={tv.external_ids?.imdb_id}
            similar={tv.similar?.results || []}
          />
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}
