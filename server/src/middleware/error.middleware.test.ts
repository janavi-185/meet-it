import { describe, it, expect } from "vitest";
import { AppError } from "../middleware/error.middleware.js";

describe("AppError", () => {
  it("should create an error with a message and status code", () => {
    const message = "Not Found";
    const statusCode = 404;
    const error = new AppError(message, statusCode);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error).toBeInstanceOf(Error);
  });
});
