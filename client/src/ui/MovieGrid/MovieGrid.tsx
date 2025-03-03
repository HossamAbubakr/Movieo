import { Movie } from "../../types/movieType";
import "./MovieGrid.css";
import MovieItem from "../MovieItem/MovieItem";
import Placeholder from "../Placeholder/Placeholder";

interface MovieGridProps {
  movies: Movie[] | null;
  loading: boolean;
  error: string | null;
}

const MovieGrid = ({ movies, loading, error }: MovieGridProps) => {
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
    <div className="masonry-grid">
      {movies.map((movie, index) => (
        <MovieItem key={index} movie={movie} index={index} />
      ))}
    </div>
  );
};

export default MovieGrid;
