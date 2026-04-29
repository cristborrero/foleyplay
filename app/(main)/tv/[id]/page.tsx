import { tmdb } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import SeasonSelector from '@/components/detail/SeasonSelector';
import DetailActions from '@/components/detail/DetailActions';
import CastRow from '@/components/detail/CastRow';
import SimilarRow from '@/components/detail/SimilarRow';

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
        <div className="relative h-[40vh] md:h-[60vh] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-fp-black via-fp-black/80 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
              <span>{firstAirYear}</span>
              {tv.number_of_seasons && <span>{tv.number_of_seasons} Temporadas</span>}
              <span className="flex items-center text-green-400 font-bold">
                ★ {tv.vote_average?.toFixed(1)}
              </span>
            </div>
            <p className="max-w-3xl text-gray-200 text-sm md:text-base leading-relaxed">
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

        {/* Episodes & Player Section */}
        <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Episodios</h2>
          {tv.seasons && (
            <SeasonSelector
              tmdbId={Number(id)}
              seasons={tv.seasons.filter(s => s.season_number > 0)}
              imdbId={tv.external_ids?.imdb_id}
            />
          )}
          <CastRow cast={tv.credits?.cast || []} />
          <SimilarRow items={tv.similar?.results || []} mediaType="tv" />
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}