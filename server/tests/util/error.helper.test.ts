import { CustomError, unauthorizedAccess, forbiddenAccess, handleGlobalError } from "../../src/util/error.helper";
import { CustomErrorType, handleError } from "../../src/services/error.service";

jest.mock("../../src/services/error.service", () => ({
  handleError: jest.fn((error) => ({
    name: "HandledError",
    message: `Handled: ${error.message}`,
    statusCode: 500,
  })),
}));

describe("error.helper", () => {
  describe("CustomError", () => {
    it("should create a CustomError instance with correct properties", () => {
      const error = new CustomError({ name: "TestError", message: "This is a test", statusCode: 400 });

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("TestError");
      expect(error.message).toBe("This is a test");
      expect(error.statusCode).toBe(400);
    });
  });

  describe("unauthorizedAccess", () => {
    it("should return an authentication error", () => {
      const result = unauthorizedAccess("resource") as { status: "failed"; error: CustomErrorType };

      expect(result.status).toBe("failed");
      expect(result.error).toBeInstanceOf(CustomError);
      expect(result.error.name).toBe("AuthenticationError");
      expect(result.error.message).toBe("Invalid resource");
      expect(result.error.statusCode).toBe(401);
    });
  });

  describe("forbiddenAccess", () => {
    it("should return an authorization error", () => {
      const result = forbiddenAccess("resource") as { status: "failed"; error: CustomErrorType };

      expect(result.status).toBe("failed");
      expect(result.error).toBeInstanceOf(CustomError);
      expect(result.error.name).toBe("AuthorizationError");
      expect(result.error.message).toBe("Unauthorized access to this resource");
      expect(result.error.statusCode).toBe(403);
    });
  });

  describe("handleGlobalError", () => {
    it("should return a formatted error using handleError", () => {
      const error = new Error("Something went wrong");
      const result = handleGlobalError(error) as { status: "failed"; error: CustomErrorType };

      expect(result.status).toBe("failed");
      expect(result.error.name).toBe("HandledError");
      expect(result.error.message).toBe("Handled: Something went wrong");
      expect(result.error.statusCode).toBe(500);
      expect(handleError).toHaveBeenCalledWith(error);
    });
  });
});
