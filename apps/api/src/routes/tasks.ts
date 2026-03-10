import type { FastifyInstance } from "fastify";
import type { Database } from "../database.js";
import { TaskRepository } from "../repositories/task.repository.js";
import { TaskService } from "../services/task.service.js";
import { TaskController } from "../controllers/task.controller.js";

export async function taskRoutes(app: FastifyInstance): Promise<void> {
  const db = (app as unknown as { db: Database }).db;
  const repository = new TaskRepository(db);
  const service = new TaskService(repository);
  const controller = new TaskController(service);

  app.get("/", controller.list);
  app.post("/", controller.create);
  app.patch("/:id", controller.update);
  app.delete("/:id", controller.remove);
}
