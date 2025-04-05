import { useInfiniteQuery } from "@tanstack/react-query";
import { Movie } from "../types/movieType";
import { searchMovies } from "../services/movieService";

type PaginatedMovies = {
  movies: Movie[];
  totalPages: number;
};

export function useMovies(query: string) {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PaginatedMovies>({
    queryKey: ["movies", query],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await searchMovies(query, pageParam);
      return result || { movies: [], totalPages: 1 };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    movies: data?.pages.flatMap((page) => page.movies) || [],
    loading: isLoading,
    fetchingNextPage: isFetchingNextPage,
    error: error ? error.message : null,
    fetchNextPage,
    hasNextPage,
  };
}
