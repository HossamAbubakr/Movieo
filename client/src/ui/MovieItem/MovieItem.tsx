import "./MovieItem.css";
import PosterPlaceholder from "../../assets/No-Poster-Placeholder.svg";

interface MovieItemProps {
  movie: { poster: string; title: string; director: string; plot: string };
  index: number;
}

function MovieItem({
  movie: { poster, title, director, plot },
  index,
}: MovieItemProps) {
  return (
    <div key={index} className="grid-item">
      <img
        src={poster === "N/A" ? PosterPlaceholder : poster}
        loading={"lazy"}
        alt={title}
      />
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <p className="movie-director">Director: {director}</p>
        <p className="movie-plot">{plot}</p>
      </div>
    </div>
  );
}

export default MovieItem;
