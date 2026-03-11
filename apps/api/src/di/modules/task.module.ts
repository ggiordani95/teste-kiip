import type pg from "pg";
import { TaskController } from "../../application/controllers/task.controller";
import { TaskService } from "../../domain/services/task.service";
import { TaskRepository } from "../../infrastructure/repositories/task.repository";

export function createTaskModule(pool: pg.Pool) {
  const taskRepository = new TaskRepository(pool);
  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);

  return { taskController, taskService };
}
