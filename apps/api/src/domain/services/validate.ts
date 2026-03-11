import { ZodError } from "zod";
import { ValidationError } from "../errors";

export function validate<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error.issues.map((issue) => issue.message).join(", "));
    }
    throw error;
  }
}
