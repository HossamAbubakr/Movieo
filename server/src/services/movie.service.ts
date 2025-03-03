import { MovieUseCase } from "../core/use-case/movie.use-case";
import { OmdbService } from "./omdb.service";
import { Status } from "../core/entity/status.entity";
import { handleGlobalError } from "../util/error.helper";
import { MovieDetails } from "../core/entity/movie.entity";
import { indexMovies } from "./elasticsearch.service";
import movieModel from "../model/movie.model";

export class MovieService extends OmdbService implements MovieUseCase {
  async saveMovies(searchTerm: string, year: number, batchSize = 3): Promise<Status<void>> {
    try {
      const imdbIds = await this.fetchAllMovies(searchTerm, year);

      if (!imdbIds) return { status: "failed", error: new Error("Movies already exist in the database.") };
      if (!imdbIds.length) return { status: "failed", error: new Error("No movies found.") };

      console.log(`Fetching details for ${imdbIds.length} movies...`);

      for (let i = 0; i < imdbIds.length; i += batchSize) {
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}...`);

        const results = await Promise.allSettled(
          imdbIds.slice(i, i + batchSize).map((id) => this.fetchMovieDetails(id)),
        );
        const movies: MovieDetails[] = results
          .filter((r): r is PromiseFulfilledResult<MovieDetails> => r.status === "fulfilled" && r.value !== null)
          .map((r) => r.value);

        if (movies.length) {
          const dbMovies = movies.map((movie) => ({
            imdb_id: movie.imdb_id,
            title: movie.title,
            director: movie.director,
            plot: movie.plot,
            poster: movie.poster,
            term: searchTerm,
            year,
          }));

          await movieModel.upsertMovies(dbMovies);
          await indexMovies(movies);
          console.log(`Saved & indexed batch ${Math.floor(i / batchSize) + 1}`);
        }
      }
      return { status: "success" };
    } catch (error) {
      return handleGlobalError(error);
    }
  }
}
