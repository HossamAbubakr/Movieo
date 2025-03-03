export type OmdbMovieDetails = {
  imdbID: string;
  Title: string;
  Poster: string;
  Director: string;
  Plot: string;
  Response: string;
};

export type MovieDetails = {
  imdb_id: string;
  title: string;
  poster: string;
  director: string;
  plot: string;
};

export type DbMovie = MovieDetails & {
  imdb_id: string;
  title: string;
  poster: string;
  director?: string;
  plot?: string;
  term: string;
  year: number;
};

export type OmdbResponse<T> = T & { Response: "True" | "False" };
