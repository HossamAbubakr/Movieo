import { Prisma } from "@prisma/client";

export type AppError = Prisma.PrismaClientKnownRequestError | Error;

export type CustomErrorType = {
  name: string;
  message: string;
  statusCode: number;
};

export class CustomError extends Error {
  statusCode: number;

  constructor({ name, message, statusCode }: CustomErrorType) {
    super(message);
    this.name = name || "CustomError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): CustomErrorType {
  switch (err.code) {
    case "P2002":
      return {
        name: "ValidationError",
        message: `Duplicate field value: ${err.meta?.target}`,
        statusCode: 400,
      };
    case "P2003":
      return {
        name: "ValidationError",
        message: `Foreign key constraint failed on the field: ${err.meta?.field_name}`,
        statusCode: 400,
      };
    case "P2004":
      return {
        name: "ValidationError",
        message: `A constraint failed on the database: ${err.meta?.cause}`,
        statusCode: 400,
      };
    case "P2005":
      return {
        name: "ValidationError",
        message: `Invalid value for field: ${err.meta?.field_name}`,
        statusCode: 400,
      };
    case "P2006":
      return {
        name: "ValidationError",
        message: `The provided value for the field is too long: ${err.meta?.field_name}`,
        statusCode: 400,
      };
    case "P2011":
      return {
        name: "ValidationError",
        message: `Null constraint violation on the field: ${err.meta?.field_name}`,
        statusCode: 400,
      };
    case "P2014":
      return {
        name: "ValidationError",
        message: `Invalid ID: ${err.meta?.target}`,
        statusCode: 400,
      };
    case "P2018":
      return {
        name: "NotFoundError",
        message: `The required connected records were not found`,
        statusCode: 404,
      };
    case "P2025":
      return {
        name: "NotFoundError",
        message: `Record to delete does not exist`,
        statusCode: 404,
      };
    default:
      return {
        name: "InternalServerError",
        message: `Something went wrong: ${err.message}`,
        statusCode: 500,
      };
  }
}

export function handleError(err: AppError): CustomErrorType {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err);
  } else {
    return {
      name: "InternalServerError",
      message: `Something went wrong: ${err.message}`,
      statusCode: 500,
    };
  }
}
