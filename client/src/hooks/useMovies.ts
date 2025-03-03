import { useState, useEffect, useCallback } from "react";
import { Movie } from "../types/movieType";
import { searchMovies } from "../services/movieService";

export function useMovies(query: string) {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError("Failed to fetch movies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch: fetchMovies };
}
