import { ValidationError } from "../../domain/errors/validation.error";

export function parseId(value: string): number {
  const id = Number(value);
  if (!Number.isFinite(id) || id <= 0) {
    throw new ValidationError("Invalid ID parameter");
  }
  return id;
}
