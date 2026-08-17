import { tmdb, extractRating } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import DetailActions from '@/components/detail/DetailActions';
import SeasonSelector from '@/components/detail/SeasonSelector';
import CastRow from '@/components/detail/CastRow';
import SimilarRow from '@/components/detail/SimilarRow';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const tv = await tmdb.getDetail('tv', Number(id));
    if (!tv) return { title: 'Serie no encontrada — FoleyPlay' };

    const title = tv.title || tv.name || tv.original_name || 'Serie de TV';
    const description = tv.overview || `Ver ${title} completa online en alta calidad en FoleyPlay.`;

    return {
      title: `${title} — Ver online en FoleyPlay`,
      description,
      openGraph: {
        title: `${title} — FoleyPlay`,
        description,
        images: tv.backdrop_path
          ? [`https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`]
          : [],
      },
    };
  } catch {
    return { title: 'Serie — FoleyPlay' };
  }
}

export default async function TVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const tv = await tmdb.getDetail('tv', Number(id));
    if (!tv) return notFound();

    const title = tv.title || tv.name || tv.original_name;
    const firstAirYear = tv.first_air_date
      ? new Date(tv.first_air_date).getFullYear()
      : '';
    const rating = extractRating(tv);

    // JSON-LD Structured Data (Section 24)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'TVSeries',
      name: title,
      description: tv.overview,
      image: tv.poster_path
        ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
        : undefined,
      startDate: tv.first_air_date,
      numberOfSeasons: tv.number_of_seasons,
      numberOfEpisodes: tv.number_of_episodes,
      aggregateRating: tv.vote_average
        ? {
            '@type': 'AggregateRating',
            ratingValue: tv.vote_average,
            bestRating: '10',
            worstRating: '1',
            ratingCount: tv.vote_count || 100,
          }
        : undefined,
    };

    return (
      <div className="min-h-screen bg-[#080A09] pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero Backdrop Area */}
        <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] w-full flex items-end pt-24 pb-8 overflow-hidden">
          {tv.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
              alt={title || ''}
              fill
              className="object-cover object-top brightness-[0.65]"
              priority
              sizes="100vw"
            />
          )}

          {/* Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A09] via-[#080A09]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080A09]/95 via-[#080A09]/60 to-transparent" />

          {/* Details Content */}
          <div className="container-editorial relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#F4F6F4] tracking-tight leading-[1.05] mb-3 max-w-4xl drop-shadow-xl">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-[#9CA39D] mb-4 font-medium">
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#F4F6F4] border border-white/10 text-xs font-semibold">
                {rating}
              </span>
              {firstAirYear && <span>{firstAirYear}</span>}
              {tv.number_of_seasons && (
                <span>{tv.number_of_seasons} Temporadas</span>
              )}
              {tv.vote_average && (
                <span className="text-fp-lime font-bold">
                  ★ {tv.vote_average.toFixed(1)} / 10
                </span>
              )}
            </div>

            {tv.overview && (
              <p className="max-w-3xl text-sm sm:text-base text-[#9CA39D] leading-relaxed mb-6 font-normal">
                {tv.overview}
              </p>
            )}

            <DetailActions
              tmdbId={Number(id)}
              mediaType="tv"
              title={title || 'Serie de TV'}
              posterPath={tv.poster_path || ''}
            />
          </div>
        </div>

        {/* Episodes & Extra Content */}
        <div className="container-editorial py-8">
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F6F4] tracking-tight mb-6">
              Episodios y Temporadas
            </h2>
            {tv.seasons && (
              <SeasonSelector
                tmdbId={Number(id)}
                seasons={tv.seasons.filter((s) => s.season_number > 0)}
                imdbId={tv.external_ids?.imdb_id}
              />
            )}
          </div>

          <CastRow cast={tv.credits?.cast || []} />
          <SimilarRow items={tv.similar?.results || []} mediaType="tv" />
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}
