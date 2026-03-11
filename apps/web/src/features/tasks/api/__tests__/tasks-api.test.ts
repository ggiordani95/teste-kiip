import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTask,
  deleteTask,
  fetchBoard,
  fetchBoardConfiguration,
  fetchBoardMembers,
  fetchBoardTasks,
  fetchBoards,
  fetchTask,
  moveTask,
  updateTask,
} from "@/features/tasks/api/tasks.api";

const mockHttpRequest = vi.fn();

vi.mock("@/lib/http-client", () => ({
  httpRequest: (...args: unknown[]) => mockHttpRequest(...args),
}));

describe("tasks.api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Boards ---

  describe("fetchBoards", () => {
    it("calls GET /api/boards", async () => {
      const data = { values: [{ id: 1, key: "KAN", name: "Board", type: "kanban" }] };
      mockHttpRequest.mockResolvedValue(data);

      const result = await fetchBoards();

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/boards");
      expect(result).toEqual(data);
    });
  });

  describe("fetchBoard", () => {
    it("calls GET /api/boards/:id", async () => {
      mockHttpRequest.mockResolvedValue({ id: 1 });

      await fetchBoard(1);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/boards/1");
    });
  });

  describe("fetchBoardConfiguration", () => {
    it("calls GET /api/boards/:id/configuration", async () => {
      mockHttpRequest.mockResolvedValue({ boardId: 1, columns: [] });

      await fetchBoardConfiguration(1);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/boards/1/configuration");
    });
  });

  describe("fetchBoardTasks", () => {
    it("calls GET /api/boards/:id/tasks without query", async () => {
      mockHttpRequest.mockResolvedValue({ startAt: 0, maxResults: 50, total: 0, tasks: [] });

      await fetchBoardTasks(1);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/boards/1/tasks");
    });

    it("appends status query param", async () => {
      mockHttpRequest.mockResolvedValue({ startAt: 0, maxResults: 50, total: 0, tasks: [] });

      await fetchBoardTasks(1, { status: "pending" });

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.stringContaining("status=pending"),
      );
    });

    it("appends assignee query param", async () => {
      mockHttpRequest.mockResolvedValue({ startAt: 0, maxResults: 50, total: 0, tasks: [] });

      await fetchBoardTasks(1, { assignee: "Ana" });

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.stringContaining("assignee=Ana"),
      );
    });

    it("appends multiple query params", async () => {
      mockHttpRequest.mockResolvedValue({ startAt: 0, maxResults: 50, total: 0, tasks: [] });

      await fetchBoardTasks(1, { status: "done", startAt: 10, maxResults: 25 });

      const url = mockHttpRequest.mock.calls[0][0] as string;
      expect(url).toContain("status=done");
      expect(url).toContain("startAt=10");
      expect(url).toContain("maxResults=25");
    });

    it("appends query text param", async () => {
      mockHttpRequest.mockResolvedValue({ startAt: 0, maxResults: 50, total: 0, tasks: [] });

      await fetchBoardTasks(1, { query: "login" });

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.stringContaining("query=login"),
      );
    });

    it("skips empty query object", async () => {
      mockHttpRequest.mockResolvedValue({ startAt: 0, maxResults: 50, total: 0, tasks: [] });

      await fetchBoardTasks(1, {});

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/boards/1/tasks");
    });
  });

  describe("fetchBoardMembers", () => {
    it("calls GET /api/boards/:id/members", async () => {
      mockHttpRequest.mockResolvedValue([]);

      await fetchBoardMembers(1);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/boards/1/members");
    });
  });

  // --- Tasks ---

  describe("fetchTask", () => {
    it("calls GET /api/tasks/:id", async () => {
      mockHttpRequest.mockResolvedValue({ id: 5 });

      await fetchTask(5);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/tasks/5");
    });
  });

  describe("createTask", () => {
    it("calls POST /api/tasks with body", async () => {
      const input = { boardId: 1, title: "New task", status: "pending" as const };
      mockHttpRequest.mockResolvedValue({ id: 1, ...input });

      await createTask(input);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/tasks", {
        method: "POST",
        body: JSON.stringify(input),
      });
    });
  });

  describe("updateTask", () => {
    it("calls PUT /api/tasks/:id with body", async () => {
      const input = { title: "Updated" };
      mockHttpRequest.mockResolvedValue({ id: 1, title: "Updated" });

      await updateTask(1, input);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/tasks/1", {
        method: "PUT",
        body: JSON.stringify(input),
      });
    });
  });

  describe("moveTask", () => {
    it("calls PUT /api/tasks/:id/move with body", async () => {
      const input = { columnId: 2, targetIndex: 0, status: "in_progress" as const };
      mockHttpRequest.mockResolvedValue({ id: 1 });

      await moveTask(1, input);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/tasks/1/move", {
        method: "PUT",
        body: JSON.stringify(input),
      });
    });
  });

  describe("deleteTask", () => {
    it("calls DELETE /api/tasks/:id", async () => {
      mockHttpRequest.mockResolvedValue(undefined);

      await deleteTask(1);

      expect(mockHttpRequest).toHaveBeenCalledWith("/api/tasks/1", {
        method: "DELETE",
      });
    });
  });
});
