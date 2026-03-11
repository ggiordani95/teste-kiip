import { z } from "zod";
import { describe, expect, it } from "vitest";
import { ValidationError } from "@/domain/errors";
import { validate } from "@/domain/services/validate";

const testSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

describe("validate", () => {
  it("returns parsed data for valid input", () => {
    const result = validate(testSchema, { name: "Ana", age: 25 });

    expect(result).toEqual({ name: "Ana", age: 25 });
  });

  it("throws ValidationError for invalid input", () => {
    expect(() => validate(testSchema, { name: "", age: -1 })).toThrow(ValidationError);
  });

  it("includes field error messages", () => {
    try {
      validate(testSchema, { name: "" });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).message).toContain("String must contain at least 1 character");
    }
  });

  it("strips unknown fields", () => {
    const result = validate(testSchema, { name: "Ana", age: 25, extra: "field" });

    expect(result).toEqual({ name: "Ana", age: 25 });
    expect((result as any).extra).toBeUndefined();
  });
});
