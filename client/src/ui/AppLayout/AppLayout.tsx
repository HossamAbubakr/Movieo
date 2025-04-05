import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { useDebounce } from "../../hooks/useDebounce";
import { useMovies } from "../../hooks/useMovies";
import MovieGrid from "../MovieGrid/MovieGrid";
import "./AppLayout.css";
import Placeholder from "../Placeholder/Placeholder";
import Logo from "../Logo/Logo";

function AppLayout() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 700);
  const {
    movies = [],
    loading,
    error,
    fetchNextPage,
    hasNextPage,
    fetchingNextPage,
  } = useMovies(debouncedQuery);
  const showPlaceholder = !query.trim();

  return (
    <>
      <Logo />
      <SearchBar setQuery={setQuery} />
      {showPlaceholder ? (
        <Placeholder
          heading="Welcome"
          message="Start by searching for a movie!"
        />
      ) : (
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          fetchingNextPage={fetchingNextPage}
        />
      )}
    </>
  );
}

export default AppLayout;
