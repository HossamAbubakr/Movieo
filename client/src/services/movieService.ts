import { Movie } from "../types/movieType";
import { get } from "./apiService";

export async function searchMovies(query: string): Promise<Movie[] | null> {
  try {
    return await get<Movie[]>(`movies?search=${query}`);
  } catch (error) {
    console.error(
      `Failed to search for movies using the query query "${query}":`,
      error
    );
    return null;
  }
}
