import { Request, Response, NextFunction } from "express";
import { CustomErrorType } from "../services/error.service";

const errorHandler = (err: CustomErrorType, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);

  if (err.name && err.statusCode) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

export default errorHandler;
