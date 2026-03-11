import { describe, expect, it } from "vitest";
import type { BoardTasksResponse, Task } from "@task-manager/shared";
import { reorderTaskInCache } from "@/features/tasks/utils/task-cache";

function makeTask(overrides: Partial<Task> & { id: number }): Task {
  return {
    key: `KAN-${overrides.id}`,
    boardId: 1,
    title: `Task ${overrides.id}`,
    description: null,
    assignee: null,
    status: "pending",
    priority: "medium",
    taskType: "task",
    dueDate: null,
    rank: 0,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeResponse(tasks: Task[]): BoardTasksResponse {
  return { startAt: 0, maxResults: 50, total: tasks.length, tasks };
}

describe("reorderTaskInCache", () => {
  it("returns undefined for undefined data", () => {
    expect(reorderTaskInCache(undefined, 1, 0)).toBeUndefined();
  });

  it("returns data unchanged when task not found", () => {
    const data = makeResponse([makeTask({ id: 1, rank: 1000 })]);
    const result = reorderTaskInCache(data, 999, 0);

    expect(result).toEqual(data);
  });

  it("reorders task within same status column", () => {
    const data = makeResponse([
      makeTask({ id: 1, status: "pending", rank: 1000 }),
      makeTask({ id: 2, status: "pending", rank: 2000 }),
      makeTask({ id: 3, status: "pending", rank: 3000 }),
    ]);

    const result = reorderTaskInCache(data, 3, 0);

    const pendingTasks = result!.tasks.filter((t) => t.status === "pending");
    expect(pendingTasks.map((t) => t.id)).toEqual([3, 1, 2]);
  });

  it("normalizes ranks after reorder", () => {
    const data = makeResponse([
      makeTask({ id: 1, status: "pending", rank: 1000 }),
      makeTask({ id: 2, status: "pending", rank: 2000 }),
    ]);

    const result = reorderTaskInCache(data, 2, 0);
    const pendingTasks = result!.tasks.filter((t) => t.status === "pending");

    expect(pendingTasks[0].rank).toBe(0);
    expect(pendingTasks[1].rank).toBe(1000);
  });

  it("moves task to a different status column", () => {
    const data = makeResponse([
      makeTask({ id: 1, status: "pending", rank: 1000 }),
      makeTask({ id: 2, status: "in_progress", rank: 1000 }),
    ]);

    const result = reorderTaskInCache(data, 1, 0, "in_progress");

    expect(result!.tasks.find((t) => t.id === 1)!.status).toBe("in_progress");
    const inProgressTasks = result!.tasks.filter((t) => t.status === "in_progress");
    expect(inProgressTasks.map((t) => t.id)).toEqual([1, 2]);
  });

  it("moves task to end of target column", () => {
    const data = makeResponse([
      makeTask({ id: 1, status: "pending", rank: 1000 }),
      makeTask({ id: 2, status: "done", rank: 1000 }),
      makeTask({ id: 3, status: "done", rank: 2000 }),
    ]);

    const result = reorderTaskInCache(data, 1, 2, "done");

    const doneTasks = result!.tasks.filter((t) => t.status === "done");
    expect(doneTasks.map((t) => t.id)).toEqual([2, 3, 1]);
  });

  it("clamps targetIndex to bounds", () => {
    const data = makeResponse([
      makeTask({ id: 1, status: "pending", rank: 1000 }),
    ]);

    const result = reorderTaskInCache(data, 1, 100);

    expect(result!.tasks).toHaveLength(1);
    expect(result!.tasks[0].id).toBe(1);
  });

  it("preserves tasks from other columns", () => {
    const data = makeResponse([
      makeTask({ id: 1, status: "pending", rank: 1000 }),
      makeTask({ id: 2, status: "in_progress", rank: 1000 }),
      makeTask({ id: 3, status: "done", rank: 1000 }),
    ]);

    const result = reorderTaskInCache(data, 1, 0, "done");

    expect(result!.tasks.find((t) => t.id === 2)!.status).toBe("in_progress");
    expect(result!.tasks).toHaveLength(3);
  });

  it("preserves total and pagination metadata", () => {
    const data: BoardTasksResponse = {
      startAt: 10,
      maxResults: 25,
      total: 100,
      tasks: [makeTask({ id: 1, status: "pending", rank: 1000 })],
    };

    const result = reorderTaskInCache(data, 1, 0);

    expect(result!.startAt).toBe(10);
    expect(result!.maxResults).toBe(25);
    expect(result!.total).toBe(100);
  });
});
