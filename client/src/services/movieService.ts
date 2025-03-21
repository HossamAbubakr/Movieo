import { MovieResponse } from "../types/movieType";
import { get } from "./apiService";

export async function searchMovies(
  query: string
): Promise<MovieResponse | null> {
  try {
    return await get<MovieResponse>(`movies?query=${query}`);
  } catch {
    return null;
  }
}
