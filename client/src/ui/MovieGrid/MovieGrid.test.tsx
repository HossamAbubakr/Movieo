import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import MovieGrid from "./MovieGrid";
import { Movie } from "../../types/movieType";

vi.mock("react-virtuoso", () => ({
  VirtuosoGrid: ({
    data,
    itemContent,
    listClassName,
  }: {
    data: Movie[];
    itemContent: (index: number, movie: Movie) => React.ReactNode;
    listClassName?: string;
  }) => (
    <div className={listClassName}>
      {data.map((item, index) => (
        <div key={item.imdb_id || index}>{itemContent(index, item)}</div>
      ))}
    </div>
  ),
}));

const mockMovies: Movie[] = [
  {
    title: "Interstellar",
    director: "Christopher Nolan",
    plot: "A team of explorers travel through a wormhole in space.",
    poster: "https://example.com/interstellar.jpg",
    imdb_id: "tt12227440",
  },
  {
    title: "2001: A Space Odyssey",
    director: "Stanley Kubrick",
    plot: "A spacecraft manned by two humans and one supercomputer is sent to Jupiter",
    poster: "https://example.com/interstellar.jpg",
    imdb_id: "tt12227441",
  },
];

describe("MovieGrid Component", () => {
  test("renders loading state", () => {
    render(
      <MovieGrid
        movies={null}
        loading={true}
        error={null}
        fetchNextPage={function (): void {}}
        hasNextPage={false}
        fetchingNextPage={false}
      />
    );

    expect(screen.getByText("Fetching Results")).toBeInTheDocument();
    expect(
      screen.getByText("Please wait while we fetch the results.")
    ).toBeInTheDocument();
  });

  test("renders error state", () => {
    render(
      <MovieGrid
        movies={null}
        loading={false}
        error={"Network error"}
        fetchNextPage={function (): void {}}
        hasNextPage={false}
        fetchingNextPage={false}
      />
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Oops! Something went wrong.")).toBeInTheDocument();
  });

  test("renders no results state", () => {
    render(
      <MovieGrid
        movies={null}
        loading={false}
        error={null}
        fetchNextPage={function (): void {}}
        hasNextPage={false}
        fetchingNextPage={false}
      />
    );

    expect(screen.getByText("No Results")).toBeInTheDocument();
    expect(screen.getByText("No movies found.")).toBeInTheDocument();
  });

  test("renders movies correctly", () => {
    render(
      <MovieGrid
        movies={mockMovies}
        loading={false}
        error={null}
        fetchNextPage={function (): void {}}
        hasNextPage={false}
        fetchingNextPage={false}
      />
    );

    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("2001: A Space Odyssey")).toBeInTheDocument();
  });
});
