import { indexMovies } from "../../src/util/indexer.helper";
import { MovieService } from "../../src/services/movie.service";

jest.mock("../../src/services/movie.service");

describe("indexer.helper", () => {
  let mockSaveMovies: jest.Mock;

  beforeEach(() => {
    mockSaveMovies = jest.fn();
    (MovieService as jest.Mock).mockImplementation(() => ({
      saveMovies: mockSaveMovies,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call saveMovies with correct parameters", async () => {
    mockSaveMovies.mockResolvedValue({ status: "success" });

    await indexMovies();

    expect(mockSaveMovies).toHaveBeenCalledTimes(1);
    expect(mockSaveMovies).toHaveBeenCalledWith("Space", 2020);
  });

  it("should log an error if saveMovies throws an error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const error = new Error("Failed to save movies");

    mockSaveMovies.mockRejectedValue(error);

    await indexMovies();

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching movies:", error);

    consoleErrorSpy.mockRestore();
  });
});
