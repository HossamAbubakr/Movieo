import { Request, Response, NextFunction } from "express";
import { searchMovies } from "../services/elasticsearch.service";
import { isInvalid } from "../util/validation.helper";

export class MovieController {
  static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, page = "1", size = "10" } = req.query;
      const pageNum = parseInt(page as string, 10);
      const pageSize = parseInt(size as string, 10);

      if (isInvalid(query, 3)) {
        res.status(400).json({
          message: "The 'query' query parameter is required and must be at least 3 characters long.",
        });
        return;
      }

      if (isInvalid(pageNum, 1) || isInvalid(pageSize, 1)) {
        res.status(400).json({
          message: "The 'page' or 'size' query parameters must be a number greater than 0.",
        });
        return;
      }

      const result = await searchMovies(query as string, pageNum, pageSize);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
