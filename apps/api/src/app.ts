import Fastify from "fastify";
import cors from "@fastify/cors";
import { Database } from "./database.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { taskRoutes } from "./routes/tasks.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  registerErrorHandler(app);

  const db = new Database();
  app.decorate("db", db);

  app.get("/api/health", async () => ({ status: "ok" }));

  await app.register(taskRoutes, { prefix: "/api/tasks" });

  return app;
}
