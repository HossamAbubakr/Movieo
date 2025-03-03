import { PrismaClient } from "@prisma/client";
import movieModel from "../../src/model/movie.model";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    movie: {
      upsert: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((queries) => Promise.all(queries)),
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const mockDb = new PrismaClient();

describe("movieModel", () => {
  const term = "Space";
  const year = 2020;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("upsertMovies", () => {
    it("should upsert movies into the database", async () => {
      const movies = [
        {
          imdb_id: "tt1234567",
          title: "Inception",
          director: "Christopher Nolan",
          poster: "poster_url",
          plot: "Sci-fi thriller",
          term,
          year,
        },
        {
          imdb_id: "tt7654321",
          title: "Interstellar",
          director: "Christopher Nolan",
          poster: "poster_url",
          plot: "Space exploration",
          term,
          year,
        },
      ];

      (mockDb.movie.upsert as jest.Mock).mockResolvedValueOnce(movies[0]).mockResolvedValueOnce(movies[1]);

      const result = await movieModel.upsertMovies(movies);

      expect(result).toEqual(movies);
      expect(mockDb.$transaction).toHaveBeenCalledTimes(1);
      expect(mockDb.movie.upsert).toHaveBeenCalledTimes(2);
    });

    it("should return an empty array when no movies are provided", async () => {
      const result = await movieModel.upsertMovies([]);
      expect(result).toEqual([]);
      expect(mockDb.$transaction).toHaveBeenCalledWith([]);
    });

    it("should handle database errors gracefully", async () => {
      (mockDb.movie.upsert as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(
        movieModel.upsertMovies([
          {
            imdb_id: "tt1234567",
            director: "Christopher Nolan",
            plot: "Sci-fi thriller",
            title: "Inception",
            poster: "poster_url",
            term,
            year,
          },
        ]),
      ).rejects.toThrow("Database error");

      expect(mockDb.movie.upsert).toHaveBeenCalledTimes(1);
    });
  });

  describe("countMovies", () => {
    it("should return the correct movie count for a given search term and year", async () => {
      (mockDb.movie.count as jest.Mock).mockResolvedValue(5);

      const count = await movieModel.countMovies(term, year);

      expect(count).toBe(5);
      expect(mockDb.movie.count).toHaveBeenCalledWith({ where: { term, year } });
      expect(mockDb.movie.count).toHaveBeenCalledTimes(1);
    });

    it("should return 0 if no movies match the search term and year", async () => {
      (mockDb.movie.count as jest.Mock).mockResolvedValue(0);

      const count = await movieModel.countMovies("Nonexistent", 1999);

      expect(count).toBe(0);
      expect(mockDb.movie.count).toHaveBeenCalledWith({ where: { term: "Nonexistent", year: 1999 } });
      expect(mockDb.movie.count).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when counting movies", async () => {
      (mockDb.movie.count as jest.Mock).mockRejectedValue(new Error("Count failed"));

      await expect(movieModel.countMovies(term, year)).rejects.toThrow("Count failed");
      expect(mockDb.movie.count).toHaveBeenCalledWith({ where: { term, year } });
      expect(mockDb.movie.count).toHaveBeenCalledTimes(1);
    });
  });
});
