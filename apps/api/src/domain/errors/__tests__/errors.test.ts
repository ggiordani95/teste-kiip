import { describe, expect, it } from "vitest";
import { AppError, NotFoundError, ValidationError } from "@/domain/errors";

describe("AppError", () => {
  it("stores statusCode and message", () => {
    const error = new AppError(500, "Internal error");

    expect(error.statusCode).toBe(500);
    expect(error.message).toBe("Internal error");
    expect(error).toBeInstanceOf(Error);
  });
});

describe("NotFoundError", () => {
  it("has statusCode 404 and default message", () => {
    const error = new NotFoundError();

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Resource not found");
    expect(error).toBeInstanceOf(AppError);
  });

  it("accepts custom message", () => {
    const error = new NotFoundError("Task not found");

    expect(error.message).toBe("Task not found");
    expect(error.statusCode).toBe(404);
  });
});

describe("ValidationError", () => {
  it("has statusCode 400", () => {
    const error = new ValidationError("Invalid input");

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Invalid input");
    expect(error).toBeInstanceOf(AppError);
  });
});
