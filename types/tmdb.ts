export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv';
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

export interface TMDBResponse {
  page: number;
  results: TMDBMedia[];
  total_pages: number;
  total_results: number;
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface TMDBDetail extends TMDBMedia {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline?: string;
  popularity?: number;
  vote_count?: number;
  imdb_id?: string;
  external_ids?: { imdb_id?: string };
  credits?: { cast: TMDBCast[]; crew?: TMDBCrew[] };
  videos?: { results: TMDBVideo[] };
  similar?: { results: TMDBMedia[] };
  release_dates?: { results: { iso_3166_1: string; release_dates: { certification: string; type: number }[] }[] };
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  created_by?: { id: number; name: string; profile_path: string | null }[];
  seasons?: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }[];
}

export interface TMDBCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBEpisode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}