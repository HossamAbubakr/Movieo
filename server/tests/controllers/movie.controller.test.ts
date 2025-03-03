import { Request, Response, NextFunction } from "express";
import { MovieController } from "../../src/controllers/movie.controller";
import { searchMovies } from "../../src/services/elasticsearch.service";

jest.mock("../../src/services/elasticsearch.service");

describe("MovieController.search", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 400 if search query is missing", async () => {
    await MovieController.search(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "The 'search' query parameter is required and must be at least 3 characters long.",
    });
  });

  it("should return 400 if search query is less than 3 characters", async () => {
    req.query!.search = "ab";
    await MovieController.search(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "The 'search' query parameter is required and must be at least 3 characters long.",
    });
  });

  it("should return search results when valid query is provided", async () => {
    req.query!.search = "Space";
    const mockResults = [{ title: "2001: A Space Odyssey" }];
    (searchMovies as jest.Mock).mockResolvedValue(mockResults);

    await MovieController.search(req as Request, res as Response, next);

    expect(searchMovies).toHaveBeenCalledWith("Space");
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  it("should handle errors and call next with the error", async () => {
    req.query!.search = "Batman";
    const mockError = new Error("Elasticsearch error");
    (searchMovies as jest.Mock).mockRejectedValue(mockError);

    await MovieController.search(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
