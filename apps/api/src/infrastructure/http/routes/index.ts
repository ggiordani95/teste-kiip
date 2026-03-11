import type { FastifyInstance } from "fastify";
import { boardRoutes } from "./boards";
import { taskRoutes } from "./tasks";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/health", async () => ({ status: "ok" }));
  await app.register(boardRoutes, { prefix: "/api/boards" });
  await app.register(taskRoutes, { prefix: "/api/tasks" });
}
