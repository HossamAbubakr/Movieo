export type Movie = {
  imdb_id: string;
  title: string;
  poster: string;
  director: string;
  plot: string;
};

export type MovieResponse = {
  movies: Movie[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};
