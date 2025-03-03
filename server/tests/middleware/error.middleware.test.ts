import { Request, Response, NextFunction } from "express";
import errorHandler from "../../src/middleware/error.middleware";
import { CustomErrorType } from "../../src/services/error.service";

describe("Error Handler Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    next = jest.fn();
  });

  it("should call next if headers are already sent", () => {
    res.headersSent = true;

    const error = new Error("Test error") as CustomErrorType;
    errorHandler(error, req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return a custom error response if error has name and statusCode", () => {
    const error = {
      name: "ValidationError",
      statusCode: 400,
      message: "Invalid request",
    } as CustomErrorType;

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid request" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 500 response for an unknown error", () => {
    const error = new Error("Unexpected failure") as CustomErrorType;

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "An internal server error occurred" });
    expect(next).not.toHaveBeenCalled();
  });
});
