import { ZodError } from "zod";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "@task-manager/shared";
import type { Task, TaskQuery } from "@task-manager/shared";
import { TaskRepository } from "../repositories/task.repository.js";
import { NotFoundError, ValidationError } from "../errors.js";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  getTasks(query: unknown): Task[] {
    const parsed = this.validate(taskQuerySchema, query);
    return this.repository.findAll(parsed.status);
  }

  createTask(input: unknown): Task {
    const parsed = this.validate(createTaskSchema, input);
    return this.repository.create(parsed);
  }

  updateTask(id: number, input: unknown): Task {
    const parsed = this.validate(updateTaskSchema, input);
    const task = this.repository.update(id, parsed);
    if (!task) throw new NotFoundError(`Task with id ${id} not found`);
    return task;
  }

  deleteTask(id: number): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw new NotFoundError(`Task with id ${id} not found`);
  }

  private validate<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map((i) => i.message).join(", ");
        throw new ValidationError(messages);
      }
      throw err;
    }
  }
}
