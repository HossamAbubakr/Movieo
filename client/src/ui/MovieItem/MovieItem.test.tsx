import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import MovieItem from "./MovieItem";
import { Movie } from "../../types/movieType";

const mockMovie: Movie = {
  title: "Interstellar",
  director: "Christopher Nolan",
  plot: "A team of explorers travel through a wormhole in space.",
  poster: "https://example.com/interstellar.jpg",
  imdb_id: "tt12227440",
};

describe("MovieItem Component", () => {
  test("renders movie poster correctly", () => {
    render(<MovieItem movie={mockMovie} index={0} />);
    const poster = screen.getByAltText(mockMovie.title);
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute("src", mockMovie.poster);
  });

  test("renders movie title correctly", () => {
    render(<MovieItem movie={mockMovie} index={0} />);
    expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
  });

  test("renders movie director correctly", () => {
    render(<MovieItem movie={mockMovie} index={0} />);
    expect(
      screen.getByText(`Director: ${mockMovie.director}`)
    ).toBeInTheDocument();
  });

  test("renders movie plot correctly", () => {
    render(<MovieItem movie={mockMovie} index={0} />);
    expect(screen.getByText(mockMovie.plot)).toBeInTheDocument();
  });
});
