import axios from "axios";
import { OmdbMovieDetails, OmdbResponse } from "../core/entity/movie.entity";
import { shouldSkipFetching } from "../util/movie.helper";
import { OmdbUseCase } from "../core/use-case/omdb.use-case";

const API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export class OmdbService implements OmdbUseCase {
  async fetchFromOMDB<T>(params: Record<string, string | number>): Promise<T | null> {
    try {
      const { data } = await axios.get<OmdbResponse<T>>(
        `${BASE_URL}?apikey=${API_KEY}&type=movie&${new URLSearchParams(params as Record<string, string>)}`,
      );
      return data.Response === "True" ? data : null;
    } catch (error) {
      console.error(`OMDB API error:`, error);
      return null;
    }
  }

  async fetchAllMovies(searchTerm: string, year: number): Promise<string[] | null> {
    console.log(`Fetching movies for "${searchTerm}" (${year})...`);
    const allMovies: string[] = [];
    let page = 1;
    let totalResults = 0;

    while (allMovies.length < totalResults || page === 1) {
      console.log(`Fetching page ${page}...`);
      const data = await this.fetchFromOMDB<{ Search?: { imdbID: string }[]; totalResults?: string }>({
        s: searchTerm,
        y: year,
        page,
      });

      if (!data?.Search) break;

      if (page === 1) {
        totalResults = parseInt(data.totalResults || "0", 10);
        if (totalResults === 0) return null;

        if (await shouldSkipFetching(totalResults, searchTerm, year)) return null;
      }

      allMovies.push(...data.Search.map(({ imdbID }) => imdbID));
      page++;

      if (allMovies.length >= totalResults) break;
    }

    console.log(`Fetched ${allMovies.length} movies.`);
    return allMovies.length ? allMovies : null;
  }

  async fetchMovieDetails(imdbID: string) {
    console.log(`Fetching details for ${imdbID}...`);
    const data = await this.fetchFromOMDB<OmdbMovieDetails>({ i: imdbID });

    return data
      ? { imdb_id: data.imdbID, title: data.Title, poster: data.Poster, director: data.Director, plot: data.Plot }
      : null;
  }
}
