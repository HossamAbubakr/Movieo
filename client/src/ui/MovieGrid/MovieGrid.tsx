import { Movie } from "../../types/movieType";
import "./MovieGrid.css";
import MovieItem from "../MovieItem/MovieItem";
import Placeholder from "../Placeholder/Placeholder";
import { VirtuosoGrid } from "react-virtuoso";

interface MovieGridProps {
  movies: Movie[] | null;
  loading: boolean;
  error: string | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  fetchingNextPage: boolean;
}

const MovieGrid = ({
  movies,
  loading,
  error,
  fetchNextPage,
  hasNextPage,
  fetchingNextPage,
}: MovieGridProps) => {
  if (loading)
    return (
      <Placeholder
        heading="Fetching Results"
        message="Please wait while we fetch the results."
      />
    );
  if (error)
    return (
      <Placeholder heading="Error" message="Oops! Something went wrong." />
    );
  if (!movies || movies.length === 0)
    return <Placeholder heading="No Results" message="No movies found." />;

  return (
    <VirtuosoGrid
      style={{ height: "100vh", overflowX: "hidden" }}
      data={movies}
      endReached={() => {
        if (hasNextPage && !fetchingNextPage) {
          fetchNextPage();
        }
      }}
      itemContent={(index, movie) => (
        <MovieItem key={movie.imdb_id || index} movie={movie} index={index} />
      )}
      listClassName="grid"
      itemClassName="grid-item"
      components={{
        Footer: () =>
          fetchingNextPage ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading more...
            </div>
          ) : null,
      }}
    />
  );
};

export default MovieGrid;
