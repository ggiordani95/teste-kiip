import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { env } from "../../../config/env";

export async function registerCors(app: FastifyInstance): Promise<void> {
  const allowedOrigins = new Set([
    env.frontendUrl,
    "http://127.0.0.1:3004",
  ]);

  await app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed"), false);
    },
  });
}
