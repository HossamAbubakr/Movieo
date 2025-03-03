import { Prisma } from "@prisma/client";
import { CustomError, handleError, handlePrismaError } from "../../src/services/error.service";

describe("CustomError Class", () => {
  it("should create a custom error with the correct properties", () => {
    const error = new CustomError({
      name: "ValidationError",
      message: "Invalid input",
      statusCode: 400,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.name).toBe("ValidationError");
    expect(error.message).toBe("Invalid input");
    expect(error.statusCode).toBe(400);
  });

  it("should default name to 'CustomError' if not provided", () => {
    const error = new CustomError({
      name: "",
      message: "Default name test",
      statusCode: 500,
    });

    expect(error.name).toBe("CustomError");
  });
});

describe("handlePrismaError Function", () => {
  const createPrismaError = (code: string, meta?: Record<string, unknown>) => {
    return new Prisma.PrismaClientKnownRequestError("Error message", { code, clientVersion: "1.0.0", meta });
  };

  it("should return correct response for P2002 (Duplicate field value)", () => {
    const error = createPrismaError("P2002", { target: "email" });
    expect(handlePrismaError(error)).toEqual({
      name: "ValidationError",
      message: "Duplicate field value: email",
      statusCode: 400,
    });
  });

  it("should return correct response for P2003 (Foreign key constraint)", () => {
    const error = createPrismaError("P2003", { field_name: "userId" });
    expect(handlePrismaError(error)).toEqual({
      name: "ValidationError",
      message: "Foreign key constraint failed on the field: userId",
      statusCode: 400,
    });
  });

  it("should return correct response for P2025 (Record to delete does not exist)", () => {
    const error = createPrismaError("P2025");
    expect(handlePrismaError(error)).toEqual({
      name: "NotFoundError",
      message: "Record to delete does not exist",
      statusCode: 404,
    });
  });

  it("should return default error response for unknown Prisma error code", () => {
    const error = createPrismaError("P9999");
    expect(handlePrismaError(error)).toEqual({
      name: "InternalServerError",
      message: "Something went wrong: Error message",
      statusCode: 500,
    });
  });

  it("should return correct response for P2004 (Database constraint failed)", () => {
    const error = createPrismaError("P2004", { cause: "Unique constraint failed" });
    expect(handlePrismaError(error)).toEqual({
      name: "ValidationError",
      message: "A constraint failed on the database: Unique constraint failed",
      statusCode: 400,
    });
  });

  it("should return correct response for P2005 (Invalid value for field)", () => {
    const error = createPrismaError("P2005", { field_name: "age" });
    expect(handlePrismaError(error)).toEqual({
      name: "ValidationError",
      message: "Invalid value for field: age",
      statusCode: 400,
    });
  });

  it("should return correct response for P2006 (Value too long for field)", () => {
    const error = createPrismaError("P2006", { field_name: "username" });
    expect(handlePrismaError(error)).toEqual({
      name: "ValidationError",
      message: "The provided value for the field is too long: username",
      statusCode: 400,
    });
  });

  it("should return correct response for P2011 (Null constraint violation)", () => {
    const error = createPrismaError("P2011", { field_name: "email" });
    expect(handlePrismaError(error)).toEqual({
      name: "ValidationError",
      message: "Null constraint violation on the field: email",
      statusCode: 400,
    });
  });

  it("should return correct response for P2014 (Invalid ID)", () => {
    const error = createPrismaError("P2014", { target: "orderId" });
    expect(handlePrismaError(error)).toEqual({
      name: "ValidationError",
      message: "Invalid ID: orderId",
      statusCode: 400,
    });
  });

  it("should return correct response for P2018 (Connected records not found)", () => {
    const error = createPrismaError("P2018");
    expect(handlePrismaError(error)).toEqual({
      name: "NotFoundError",
      message: "The required connected records were not found",
      statusCode: 404,
    });
  });
});

describe("handleError Function", () => {
  it("should delegate Prisma errors to handlePrismaError", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError("Error message", {
      code: "P2002",
      clientVersion: "1.0.0",
      meta: { target: "email" },
    });

    expect(handleError(prismaError)).toEqual({
      name: "ValidationError",
      message: "Duplicate field value: email",
      statusCode: 400,
    });
  });

  it("should return a generic error for non-Prisma errors", () => {
    const genericError = new Error("Something bad happened");

    expect(handleError(genericError)).toEqual({
      name: "InternalServerError",
      message: "Something went wrong: Something bad happened",
      statusCode: 500,
    });
  });
});
export { CustomError };
