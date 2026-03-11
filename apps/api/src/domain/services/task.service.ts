import type { BoardTasksResponse, Task } from "@task-manager/shared";
import { boardTaskQuerySchema, createTaskSchema, moveTaskSchema, updateTaskSchema } from "@task-manager/shared";
import { NotFoundError } from "../errors";
import type { TaskRepositoryPort } from "../ports";
import { validate } from "./validate";

export class TaskService {
  constructor(private readonly repository: TaskRepositoryPort) {}

  async getTask(id: number): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) throw new NotFoundError(`Task with id ${id} not found`);
    return task;
  }

  async listBoardTasks(boardId: number, query: unknown): Promise<BoardTasksResponse> {
    const parsed = validate(boardTaskQuerySchema, query);
    return this.repository.listByBoard(boardId, parsed);
  }

  async createTask(input: unknown): Promise<Task> {
    const parsed = validate(createTaskSchema, input);
    const task = await this.repository.create(parsed);
    if (!task) throw new NotFoundError(`Board with id ${parsed.boardId} not found`);
    return task;
  }

  async updateTask(id: number, input: unknown): Promise<Task> {
    const parsed = validate(updateTaskSchema, input);
    const task = await this.repository.update(id, parsed);
    if (!task) throw new NotFoundError(`Task with id ${id} not found`);
    return task;
  }

  async moveTask(id: number, input: unknown): Promise<Task> {
    const parsed = validate(moveTaskSchema, input);
    const task = await this.repository.move(id, parsed);
    if (!task) throw new NotFoundError(`Task with id ${id} not found`);
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (!result.deleted) throw new NotFoundError(`Task with id ${id} not found`);
  }
}
