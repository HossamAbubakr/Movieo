import { Client } from "@elastic/elasticsearch";
import { createIndexIfNotExists, indexMovies, searchMovies } from "../../src/services/elasticsearch.service";
import { MovieDetails } from "../../src/core/entity/movie.entity";

jest.mock("@elastic/elasticsearch", () => {
  const mockBulk = jest.fn().mockResolvedValue({ errors: false, items: [] });
  const mockSearch = jest.fn().mockResolvedValue({ hits: { hits: [] } });
  const mockExists = jest.fn().mockResolvedValue(false);
  const mockCreate = jest.fn().mockResolvedValue({ acknowledged: true });

  return {
    Client: jest.fn().mockImplementation(() => ({
      indices: {
        exists: mockExists,
        create: mockCreate,
      },
      bulk: mockBulk,
      search: mockSearch,
    })),
  };
});

const mockClient = new Client({ node: "http://localhost:9200" }) as jest.Mocked<Client>;

describe("Elasticsearch Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createIndexIfNotExists", () => {
    it("should create index if it does not exist", async () => {
      (mockClient.indices.exists as jest.Mock).mockResolvedValue(false);
      (mockClient.indices.create as jest.Mock).mockResolvedValue({} as unknown);

      await createIndexIfNotExists();

      expect(mockClient.indices.exists).toHaveBeenCalledWith({ index: "movies" });
      expect(mockClient.indices.create).toHaveBeenCalled();
    });

    it("should not create index if it already exists", async () => {
      (mockClient.indices.exists as jest.Mock).mockResolvedValue(true);

      await createIndexIfNotExists();

      expect(mockClient.indices.create).not.toHaveBeenCalled();
    });
  });

  describe("indexMovies", () => {
    const movies: MovieDetails[] = [
      { imdb_id: "tt1234567", title: "Test Movie", director: "John Doe", plot: "A test plot", poster: "poster.jpg" },
      {
        imdb_id: "tt2345678",
        title: "Another Movie",
        director: "Jane Doe",
        plot: "Another plot",
        poster: "poster2.jpg",
      },
    ];

    it("should index movies successfully", async () => {
      (mockClient.bulk as jest.Mock).mockResolvedValue({ errors: false, items: [] });

      await indexMovies(movies);

      expect(mockClient.bulk).toHaveBeenCalled();
    });

    it("should log an error if bulk indexing fails", async () => {
      console.error = jest.fn();
      (mockClient.bulk as jest.Mock).mockRejectedValue(new Error("Bulk index error"));

      await indexMovies(movies);

      expect(console.error).toHaveBeenCalledWith("Bulk index request failed:", expect.any(Error));
    });
  });

  describe("searchMovies", () => {
    it("should return search results", async () => {
      (mockClient.search as jest.Mock).mockResolvedValue({
        hits: {
          hits: [{ _source: { title: "Test Movie", director: "John Doe", plot: "A test plot" } }],
        },
      } as unknown);

      const results = await searchMovies("Test");

      expect(results).toEqual({
        movies: [{ director: "John Doe", plot: "A test plot", title: "Test Movie" }],
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it("should return an empty array if no results are found", async () => {
      (mockClient.search as jest.Mock).mockResolvedValue({ hits: { hits: [] } } as unknown);

      const results = await searchMovies("Unknown");

      expect(results).toEqual({ movies: [], page: 1, size: 10, total: 0, totalPages: 0 });
    });
  });
});
