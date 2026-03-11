import type { TaskService } from "../../domain/services/task.service";
import type { CreateTaskResponse, GetTaskResponse, MoveTaskResponse, UpdateTaskResponse } from "../dtos";

export class TaskController {
  constructor(private readonly service: TaskService) {}

  get = async (id: number): Promise<GetTaskResponse> => {
    return this.service.getTask(id);
  };

  create = async (body: unknown): Promise<CreateTaskResponse> => {
    return this.service.createTask(body);
  };

  update = async (id: number, body: unknown): Promise<UpdateTaskResponse> => {
    return this.service.updateTask(id, body);
  };

  move = async (id: number, body: unknown): Promise<MoveTaskResponse> => {
    return this.service.moveTask(id, body);
  };

  remove = async (id: number): Promise<void> => {
    await this.service.deleteTask(id);
  };
}
