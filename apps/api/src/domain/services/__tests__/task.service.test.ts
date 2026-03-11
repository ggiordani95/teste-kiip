import type { BoardTasksResponse, Task } from "@task-manager/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError, ValidationError } from "@/domain/errors";
import type { TaskRepositoryPort } from "@/domain/ports";
import { TaskService } from "@/domain/services/task.service";

const baseTask: Task = {
  id: 1,
  key: "KAN-1",
  boardId: 1,
  title: "Setup board",
  description: null,
  assignee: "Gustavo",
  status: "pending",
  priority: "medium",
  taskType: "task",
  dueDate: null,
  rank: 1000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function createMockRepository(): TaskRepositoryPort {
  return {
    listByBoard: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    move: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
  };
}

describe("TaskService", () => {
  let repository: TaskRepositoryPort;
  let service: TaskService;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = createMockRepository();
    service = new TaskService(repository);
  });

  describe("getTask", () => {
    it("returns task by id", async () => {
      vi.mocked(repository.findById).mockResolvedValue(baseTask);

      const result = await service.getTask(1);

      expect(result).toEqual(baseTask);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError for non-existent task", async () => {
      vi.mocked(repository.findById).mockResolvedValue(undefined);

      await expect(service.getTask(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("listBoardTasks", () => {
    it("lists tasks with default pagination", async () => {
      const response: BoardTasksResponse = {
        startAt: 0,
        maxResults: 50,
        total: 1,
        tasks: [baseTask],
      };
      vi.mocked(repository.listByBoard).mockResolvedValue(response);

      const result = await service.listBoardTasks(1, {});

      expect(result).toEqual(response);
      expect(repository.listByBoard).toHaveBeenCalledWith(1, { startAt: 0, maxResults: 50 });
    });

    it("passes custom query params to repository", async () => {
      const response: BoardTasksResponse = { startAt: 10, maxResults: 5, total: 0, tasks: [] };
      vi.mocked(repository.listByBoard).mockResolvedValue(response);

      await service.listBoardTasks(1, { startAt: 10, maxResults: 5, status: "done" });

      expect(repository.listByBoard).toHaveBeenCalledWith(1, {
        startAt: 10,
        maxResults: 5,
        status: "done",
      });
    });

    it("throws ValidationError for invalid query", async () => {
      await expect(service.listBoardTasks(1, { maxResults: -1 })).rejects.toBeInstanceOf(
        ValidationError,
      );
    });
  });

  describe("createTask", () => {
    it("creates task successfully", async () => {
      vi.mocked(repository.create).mockResolvedValue(baseTask);

      const result = await service.createTask({ boardId: 1, title: "Setup board" });

      expect(result).toEqual(baseTask);
      expect(repository.create).toHaveBeenCalled();
    });

    it("applies default values from schema", async () => {
      vi.mocked(repository.create).mockResolvedValue(baseTask);

      await service.createTask({ boardId: 1, title: "Test" });

      const calledWith = vi.mocked(repository.create).mock.calls[0][0];
      expect(calledWith.status).toBe("pending");
      expect(calledWith.priority).toBe("medium");
      expect(calledWith.taskType).toBe("task");
    });

    it("throws NotFoundError when board does not exist", async () => {
      vi.mocked(repository.create).mockResolvedValue(undefined);

      await expect(service.createTask({ boardId: 999, title: "Test" })).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("throws ValidationError for empty title", async () => {
      await expect(service.createTask({ boardId: 1, title: "" })).rejects.toBeInstanceOf(
        ValidationError,
      );
    });

    it("throws ValidationError for missing boardId", async () => {
      await expect(service.createTask({ title: "Test" } as any)).rejects.toBeInstanceOf(
        ValidationError,
      );
    });
  });

  describe("updateTask", () => {
    it("updates task successfully", async () => {
      const updated = { ...baseTask, title: "Updated" };
      vi.mocked(repository.update).mockResolvedValue(updated);

      const result = await service.updateTask(1, { title: "Updated" });

      expect(result).toEqual(updated);
      expect(repository.update).toHaveBeenCalledWith(1, { title: "Updated" });
    });

    it("throws NotFoundError for non-existent task", async () => {
      vi.mocked(repository.update).mockResolvedValue(undefined);

      await expect(service.updateTask(999, { title: "Test" })).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("allows setting description and assignee to null", async () => {
      vi.mocked(repository.update).mockResolvedValue({ ...baseTask, description: null, assignee: null });

      await service.updateTask(1, { description: null, assignee: null });

      expect(repository.update).toHaveBeenCalledWith(1, { description: null, assignee: null });
    });
  });

  describe("moveTask", () => {
    it("moves task successfully", async () => {
      const movedTask = { ...baseTask, rank: 2000 };
      vi.mocked(repository.move).mockResolvedValue(movedTask);

      const result = await service.moveTask(1, { columnId: 1, targetIndex: 2 });

      expect(result).toEqual(movedTask);
      expect(repository.move).toHaveBeenCalledWith(1, { columnId: 1, targetIndex: 2 });
    });

    it("passes optional status to repository", async () => {
      vi.mocked(repository.move).mockResolvedValue({ ...baseTask, status: "done" });

      await service.moveTask(1, { columnId: 1, targetIndex: 0, status: "done" });

      expect(repository.move).toHaveBeenCalledWith(1, {
        columnId: 1,
        targetIndex: 0,
        status: "done",
      });
    });

    it("throws NotFoundError for non-existent task", async () => {
      vi.mocked(repository.move).mockResolvedValue(undefined);

      await expect(service.moveTask(999, { columnId: 1, targetIndex: 0 })).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("throws ValidationError for negative targetIndex", async () => {
      await expect(service.moveTask(1, { columnId: 1, targetIndex: -1 })).rejects.toBeInstanceOf(
        ValidationError,
      );
    });
  });

  describe("deleteTask", () => {
    it("deletes task successfully", async () => {
      vi.mocked(repository.delete).mockResolvedValue({ deleted: true, boardId: 1 });

      await expect(service.deleteTask(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError for non-existent task", async () => {
      vi.mocked(repository.delete).mockResolvedValue({ deleted: false });

      await expect(service.deleteTask(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
