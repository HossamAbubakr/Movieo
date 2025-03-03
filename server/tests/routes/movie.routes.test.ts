import request from "supertest";
import express from "express";
import movieRoutes from "../../src/routes/movie.routes";
import { MovieController } from "../../src/controllers/movie.controller";

jest.mock("../../src/controllers/movie.controller", () => ({
  MovieController: {
    search: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/movies", movieRoutes);

describe("Movie Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call MovieController.search when hitting GET /movies", async () => {
    (MovieController.search as jest.Mock).mockImplementation((req, res) => {
      res.json({ message: "Mocked search" });
    });

    const response = await request(app).get("/movies").query({ search: "Inception" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Mocked search" });
    expect(MovieController.search).toHaveBeenCalled();
  });

  it("should return a 400 error if no search query is provided", async () => {
    (MovieController.search as jest.Mock).mockImplementation((req, res) => {
      res
        .status(400)
        .json({ message: "The 'search' query parameter is required and must be at least 3 characters long." });
    });

    const response = await request(app).get("/movies");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "The 'search' query parameter is required and must be at least 3 characters long.",
    });
  });
});
