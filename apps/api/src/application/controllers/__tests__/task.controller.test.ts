import type { Task } from "@task-manager/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskController } from "@/application/controllers/task.controller";
import type { TaskService } from "@/domain/services/task.service";

const baseTask: Task = {
  id: 1,
  key: "KAN-1",
  boardId: 1,
  title: "Setup board",
  description: null,
  assignee: null,
  status: "pending",
  priority: "medium",
  taskType: "task",
  dueDate: null,
  rank: 1000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function createMockService(): TaskService {
  return {
    getTask: vi.fn(),
    listBoardTasks: vi.fn(),
    createTask: vi.fn(),
    moveTask: vi.fn(),
    deleteTask: vi.fn(),
  } as unknown as TaskService;
}

describe("TaskController", () => {
  let service: TaskService;
  let controller: TaskController;

  beforeEach(() => {
    vi.clearAllMocks();
    service = createMockService();
    controller = new TaskController(service);
  });

  it("get delegates to service.getTask", async () => {
    vi.mocked(service.getTask).mockResolvedValue(baseTask);

    const result = await controller.get(1);

    expect(result).toEqual(baseTask);
    expect(service.getTask).toHaveBeenCalledWith(1);
  });

  it("create delegates to service.createTask", async () => {
    vi.mocked(service.createTask).mockResolvedValue(baseTask);

    const result = await controller.create({ boardId: 1, title: "Setup board" });

    expect(result).toEqual(baseTask);
    expect(service.createTask).toHaveBeenCalledWith({ boardId: 1, title: "Setup board" });
  });

  it("move delegates to service.moveTask", async () => {
    vi.mocked(service.moveTask).mockResolvedValue(baseTask);

    const result = await controller.move(1, { columnId: 1, targetIndex: 0 });

    expect(result).toEqual(baseTask);
    expect(service.moveTask).toHaveBeenCalledWith(1, { columnId: 1, targetIndex: 0 });
  });

  it("remove delegates to service.deleteTask and returns undefined", async () => {
    vi.mocked(service.deleteTask).mockResolvedValue(undefined);

    const result = await controller.remove(1);

    expect(result).toBeUndefined();
    expect(service.deleteTask).toHaveBeenCalledWith(1);
  });
});
