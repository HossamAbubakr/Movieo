import { shouldSkipFetching } from "../../src/util/movie.helper";
import movieModel from "../../src/model/movie.model";

jest.mock("../../src/model/movie.model");

describe("shouldSkipFetching", () => {
  let mockCountMovies: jest.Mock;
  const searchTerm = "Batman";
  const year = 2022;

  beforeEach(() => {
    mockCountMovies = jest.fn();
    (movieModel.countMovies as jest.Mock) = mockCountMovies;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if the database already contains all movies", async () => {
    mockCountMovies.mockResolvedValue(100);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const result = await shouldSkipFetching(100, searchTerm, year);

    expect(result).toBe(true);
    expect(mockCountMovies).toHaveBeenCalledWith(searchTerm, year);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Skipping fetch: Database already contains all 100 movies for "Batman" (2022).`,
    );

    consoleSpy.mockRestore();
  });

  it("should return false if the database contains fewer movies than totalResults", async () => {
    mockCountMovies.mockResolvedValue(50);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const result = await shouldSkipFetching(100, searchTerm, year);

    expect(result).toBe(false);
    expect(mockCountMovies).toHaveBeenCalledWith(searchTerm, year);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Fetching remaining 50 movies for "Batman" (2022) to complete the database.`,
    );

    consoleSpy.mockRestore();
  });

  it("should handle the case where totalResults is zero", async () => {
    mockCountMovies.mockResolvedValue(10);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const result = await shouldSkipFetching(0, searchTerm, year);

    expect(result).toBe(true);
    expect(mockCountMovies).toHaveBeenCalledWith(searchTerm, year);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Skipping fetch: Database already contains all 0 movies for "Batman" (2022).`,
    );

    consoleSpy.mockRestore();
  });

  it("should handle the case where the database is empty", async () => {
    mockCountMovies.mockResolvedValue(0);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const result = await shouldSkipFetching(100, searchTerm, year);

    expect(result).toBe(false);
    expect(mockCountMovies).toHaveBeenCalledWith(searchTerm, year);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Fetching remaining 100 movies for "Batman" (2022) to complete the database.`,
    );

    consoleSpy.mockRestore();
  });
});
