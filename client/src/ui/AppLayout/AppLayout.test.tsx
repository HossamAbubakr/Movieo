import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, expect, test, vi, MockedFunction } from "vitest";
import AppLayout from "./AppLayout";
import { useMovies } from "../../hooks/useMovies";

vi.mock("../../hooks/useMovies", async () => {
  return {
    useMovies: vi.fn(),
  };
});

describe("AppLayout Component", () => {
  beforeEach(() => {
    (useMovies as MockedFunction<typeof useMovies>).mockReturnValue({
      movies: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders logo and search bar", () => {
    render(<AppLayout />);

    expect(screen.getByText("MOVIEO")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search for movies/i)
    ).toBeInTheDocument();
  });

  test("shows welcome placeholder initially", () => {
    render(<AppLayout />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(
      screen.getByText("Start by searching for a movie!")
    ).toBeInTheDocument();
  });

  test("fetches movies when user types a query", async () => {
    const mockRefetch = vi.fn();

    (useMovies as MockedFunction<typeof useMovies>).mockReturnValue({
      movies: [],
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<AppLayout />);
    const searchInput = screen.getByPlaceholderText(/search for movies/i);

    fireEvent.change(searchInput, { target: { value: "Inception" } });

    await waitFor(() => {
      expect(useMovies).toHaveBeenCalledWith("Inception");
    });
  });

  test("displays loading state when fetching movies", async () => {
    (useMovies as MockedFunction<typeof useMovies>).mockReturnValue({
      movies: undefined,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<AppLayout />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    fireEvent.change(searchInput, { target: { value: "Inception" } });

    await act(() => new Promise((r) => setTimeout(r, 750)));

    expect(await screen.findByText("Fetching Results")).toBeInTheDocument();
    expect(
      await screen.findByText("Please wait while we fetch the results.")
    ).toBeInTheDocument();
  });

  test("displays error message on failure", async () => {
    (useMovies as MockedFunction<typeof useMovies>).mockReturnValue({
      movies: undefined,
      loading: false,
      error: "Network error",
      refetch: vi.fn(),
    });

    render(<AppLayout />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    fireEvent.change(searchInput, { target: { value: "Inception" } });

    expect(
      await screen.findByRole("heading", { name: "Error" })
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Oops! Something went wrong.")
    ).toBeInTheDocument();
  });

  test("displays movie results when movies are found", async () => {
    (useMovies as MockedFunction<typeof useMovies>).mockReturnValue({
      movies: [
        {
          title: "Interstellar",
          director: "Christopher Nolan",
          plot: "A team of explorers travel through a wormhole in space.",
          poster: "https://example.com/interstellar.jpg",
          imdb_id: "tt12227440",
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AppLayout />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    fireEvent.change(searchInput, { target: { value: "Interstellar" } });

    expect(await screen.findByText("Interstellar")).toBeInTheDocument();
  });
});
