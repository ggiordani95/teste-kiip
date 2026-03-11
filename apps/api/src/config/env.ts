import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive())
    .default("3001"),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
});

const parsed = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  databaseUrl: parsed.DATABASE_URL,
  frontendUrl: parsed.FRONTEND_URL,
};