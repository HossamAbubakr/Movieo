import { MovieService } from "../../src/services/movie.service";
import { OmdbService } from "../../src/services/omdb.service";
import movieModel from "../../src/model/movie.model";
import { indexMovies } from "../../src/services/elasticsearch.service";
import { handleGlobalError } from "../../src/util/error.helper";

jest.mock("../../src/services/omdb.service");
jest.mock("../../src/services/elasticsearch.service");
jest.mock("../../src/model/movie.model");
jest.mock("../../src/util/error.helper");

const mockedOmdbService = OmdbService.prototype as jest.Mocked<OmdbService>;
const mockedIndexMovies = indexMovies as jest.MockedFunction<typeof indexMovies>;
const mockedMovieModel = movieModel as jest.Mocked<typeof movieModel>;
const mockedHandleGlobalError = handleGlobalError as jest.MockedFunction<typeof handleGlobalError>;

describe("MovieService", () => {
  let movieService: MovieService;

  beforeEach(() => {
    movieService = new MovieService();
    jest.clearAllMocks();
  });

  describe("saveMovies", () => {
    it("should return failed status if movies already exist", async () => {
      mockedOmdbService.fetchAllMovies.mockResolvedValue(null);

      const result = await movieService.saveMovies("test", 2022);
      expect(result).toEqual({ status: "failed", error: new Error("Movies already exist in the database.") });
    });

    it("should return failed status if no movies are found", async () => {
      mockedOmdbService.fetchAllMovies.mockResolvedValue([]);

      const result = await movieService.saveMovies("test", 2022);
      expect(result).toEqual({ status: "failed", error: new Error("No movies found.") });
    });

    it("should process and save movies in batches", async () => {
      const mockImdbIds = ["tt123", "tt456", "tt789", "tt101"];
      const mockMovies = [
        { imdb_id: "tt123", title: "Movie A", poster: "", director: "Director A", plot: "", term: "test", year: 2022 },
        { imdb_id: "tt456", title: "Movie B", poster: "", director: "Director B", plot: "", term: "test", year: 2022 },
      ];

      mockedOmdbService.fetchAllMovies.mockResolvedValue(mockImdbIds);
      mockedOmdbService.fetchMovieDetails
        .mockResolvedValueOnce(mockMovies[0])
        .mockResolvedValueOnce(mockMovies[1])
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      mockedMovieModel.upsertMovies.mockResolvedValue([]);
      mockedIndexMovies.mockResolvedValue(undefined);

      const result = await movieService.saveMovies("test", 2022, 2);

      expect(mockedOmdbService.fetchAllMovies).toHaveBeenCalledWith("test", 2022);
      expect(mockedOmdbService.fetchMovieDetails).toHaveBeenCalledTimes(4);
      expect(mockedMovieModel.upsertMovies).toHaveBeenCalledWith(mockMovies);
      expect(mockedIndexMovies).toHaveBeenCalledWith(mockMovies);
      expect(result).toEqual({ status: "success" });
    });

    it("should handle global errors and return failed status", async () => {
      const mockError = new Error("Database connection error");
      mockedOmdbService.fetchAllMovies.mockRejectedValue(mockError);
      mockedHandleGlobalError.mockReturnValue({ status: "failed", error: mockError });

      const result = await movieService.saveMovies("test", 2022);
      expect(mockedHandleGlobalError).toHaveBeenCalledWith(mockError);
      expect(result).toEqual({ status: "failed", error: mockError });
    });
  });
});
