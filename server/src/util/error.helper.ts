import { AppError, handleError } from "../services/error.service";
import { Status } from "../core/entity/status.entity";

export type CustomErrorType = {
  name: string;
  message: string;
  statusCode: number;
};

export class CustomError extends Error {
  statusCode: number;
  constructor({ name, message, statusCode }: CustomErrorType) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export function unauthorizedAccess<T>(resource: string): Status<T> {
  return {
    status: "failed",
    error: new CustomError({
      name: "AuthenticationError",
      message: `Invalid ${resource}`,
      statusCode: 401,
    }),
  };
}
export function forbiddenAccess<T>(resource: string): Status<T> {
  return {
    status: "failed",
    error: new CustomError({
      name: "AuthorizationError",
      message: `Unauthorized access to this ${resource}`,
      statusCode: 403,
    }),
  };
}

export function handleGlobalError<T>(error: unknown): Status<T> {
  return {
    status: "failed",
    error: handleError(error as AppError),
  };
}
