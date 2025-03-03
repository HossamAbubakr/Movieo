import { MovieDetails } from "../entity/movie.entity";

export interface OmdbUseCase {
  fetchFromOMDB<T>(params: Record<string, string | number>): Promise<T | null>;
  fetchAllMovies(searchTerm: string, year: number): Promise<string[] | null>;
  fetchMovieDetails(imdbID: string): Promise<MovieDetails | null>;
}
