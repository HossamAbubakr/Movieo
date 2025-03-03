import axios from "axios";
import { OmdbService } from "../../src/services/omdb.service";
import { shouldSkipFetching } from "../../src/util/movie.helper";

jest.mock("axios");
jest.mock("../../src/util/movie.helper");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedShouldSkipFetching = shouldSkipFetching as jest.Mock;

describe("OmdbService", () => {
  let omdbService: OmdbService;

  beforeEach(() => {
    omdbService = new OmdbService();
    jest.clearAllMocks();
  });

  describe("fetchFromOMDB", () => {
    it("should return data when OMDB API responds successfully", async () => {
      const mockResponse = { Response: "True", Search: [{ imdbID: "tt1234567" }] };
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await omdbService.fetchFromOMDB({ s: "test" });
      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("s=test"));
    });

    it("should return null if OMDB API responds with Response: False", async () => {
      mockedAxios.get.mockResolvedValue({ data: { Response: "False" } });

      const result = await omdbService.fetchFromOMDB({ s: "invalid" });
      expect(result).toBeNull();
    });

    it("should return null on API error", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      const result = await omdbService.fetchFromOMDB({ s: "error" });
      expect(result).toBeNull();
    });
  });

  describe("fetchAllMovies", () => {
    it("should fetch movies by search term and year", async () => {
      const mockMovies = [{ imdbID: "tt1234567" }, { imdbID: "tt7654321" }];
      mockedAxios.get.mockResolvedValue({ data: { Response: "True", Search: mockMovies, totalResults: "2" } });

      const result = await omdbService.fetchAllMovies("test", 2022);
      expect(result).toEqual(["tt1234567", "tt7654321"]);
    });

    it("should return null if no movies are found", async () => {
      mockedAxios.get.mockResolvedValue({ data: { Response: "False" } });

      const result = await omdbService.fetchAllMovies("unknown", 1990);
      expect(result).toBeNull();
    });

    it("should stop fetching if shouldSkipFetching returns true", async () => {
      mockedShouldSkipFetching.mockResolvedValue(true);
      mockedAxios.get.mockResolvedValue({
        data: { Response: "True", Search: [{ imdbID: "tt1234567" }], totalResults: "100" },
      });

      const result = await omdbService.fetchAllMovies("popular", 2022);
      expect(result).toBeNull();
      expect(mockedShouldSkipFetching).toHaveBeenCalled();
    });
  });

  describe("fetchMovieDetails", () => {
    it("should return movie details when found", async () => {
      const mockMovie = {
        imdbID: "tt1234567",
        Title: "Test Movie",
        Poster: "http://example.com/poster.jpg",
        Director: "John Doe",
        Plot: "Test plot",
      };
      mockedAxios.get.mockResolvedValue({ data: { Response: "True", ...mockMovie } });

      const result = await omdbService.fetchMovieDetails("tt1234567");
      expect(result).toEqual({
        imdb_id: "tt1234567",
        title: "Test Movie",
        poster: "http://example.com/poster.jpg",
        director: "John Doe",
        plot: "Test plot",
      });
    });

    it("should return null if movie details are not found", async () => {
      mockedAxios.get.mockResolvedValue({ data: { Response: "False" } });

      const result = await omdbService.fetchMovieDetails("invalid_id");
      expect(result).toBeNull();
    });
  });
});
