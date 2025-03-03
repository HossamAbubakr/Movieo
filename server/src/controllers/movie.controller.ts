import { Request, Response, NextFunction } from "express";
import { searchMovies } from "../services/elasticsearch.service";

export class MovieController {
  static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchTerm = req.query.search as string;

      if (!searchTerm?.trim() || searchTerm.trim().length < 3) {
        res.status(400).json({
          message: "The 'search' query parameter is required and must be at least 3 characters long.",
        });
        return;
      }

      const results = await searchMovies(searchTerm.trim());
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
