import { MovieResponse } from "../types/movieType";
import { get } from "./apiService";

export async function searchMovies(
  query: string,
  pageParam: unknown
): Promise<MovieResponse | null> {
  try {
    return await get<MovieResponse>(`movies?query=${query}&page=${pageParam}`);
  } catch {
    return null;
  }
}
