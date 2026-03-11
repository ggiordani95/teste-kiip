import { describe, expect, it } from "vitest";
import { ValidationError } from "@/domain/errors";
import { parseId } from "@/infrastructure/http/helpers";

describe("parseId", () => {
  it("parses valid positive integer string", () => {
    expect(parseId("1")).toBe(1);
    expect(parseId("42")).toBe(42);
    expect(parseId("999")).toBe(999);
  });

  it("throws ValidationError for zero", () => {
    expect(() => parseId("0")).toThrow(ValidationError);
  });

  it("throws ValidationError for negative number", () => {
    expect(() => parseId("-1")).toThrow(ValidationError);
  });

  it("throws ValidationError for non-numeric string", () => {
    expect(() => parseId("abc")).toThrow(ValidationError);
    expect(() => parseId("")).toThrow(ValidationError);
  });

  it("parses float as number (no integer check)", () => {
    expect(parseId("1.5")).toBe(1.5);
  });

  it("throws ValidationError for Infinity", () => {
    expect(() => parseId("Infinity")).toThrow(ValidationError);
  });
});
