import { useQuery } from "@tanstack/react-query";
import { Movie } from "../types/movieType";
import { searchMovies } from "../services/movieService";

export function useMovies(query: string) {
  const {
    data: movies,
    error,
    isLoading,
    refetch,
  } = useQuery<Movie[]>({
    queryKey: ["movies", query],
    queryFn: async () => {
      try {
        const result = await searchMovies(query);
        return result || [];
      } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch movies");
      }
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    movies,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}
