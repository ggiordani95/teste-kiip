import { describe, expect, it } from "vitest";
import type { BoardColumn, Task } from "@task-manager/shared";
import { groupTasksByColumns } from "@/features/tasks/utils/group-tasks";

function makeColumn(overrides: Partial<BoardColumn> & { id: number }): BoardColumn {
  return {
    boardId: 1,
    key: `col-${overrides.id}`,
    name: `Column ${overrides.id}`,
    position: 0,
    statuses: ["pending"],
    isDone: false,
    ...overrides,
  };
}

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

describe("groupTasksByColumns", () => {
  it("groups tasks into matching columns by status", () => {
    const columns = [
      makeColumn({ id: 1, position: 0, statuses: ["pending"] }),
      makeColumn({ id: 2, position: 1, statuses: ["in_progress"] }),
      makeColumn({ id: 3, position: 2, statuses: ["done"] }),
    ];
    const tasks = [
      makeTask({ id: 1, status: "pending", rank: 1000 }),
      makeTask({ id: 2, status: "done", rank: 1000 }),
      makeTask({ id: 3, status: "in_progress", rank: 1000 }),
    ];

    const result = groupTasksByColumns(columns, tasks);

    expect(result).toHaveLength(3);
    expect(result[0].tasks.map((t) => t.id)).toEqual([1]);
    expect(result[1].tasks.map((t) => t.id)).toEqual([3]);
    expect(result[2].tasks.map((t) => t.id)).toEqual([2]);
  });

  it("sorts columns by position", () => {
    const columns = [
      makeColumn({ id: 3, position: 2, statuses: ["done"] }),
      makeColumn({ id: 1, position: 0, statuses: ["pending"] }),
      makeColumn({ id: 2, position: 1, statuses: ["in_progress"] }),
    ];

    const result = groupTasksByColumns(columns, []);

    expect(result.map((r) => r.column.id)).toEqual([1, 2, 3]);
  });

  it("sorts tasks by rank then createdAt", () => {
    const columns = [makeColumn({ id: 1, position: 0, statuses: ["pending"] })];
    const tasks = [
      makeTask({ id: 3, status: "pending", rank: 1000, createdAt: "2025-01-03T00:00:00Z" }),
      makeTask({ id: 1, status: "pending", rank: 1000, createdAt: "2025-01-01T00:00:00Z" }),
      makeTask({ id: 2, status: "pending", rank: 2000, createdAt: "2025-01-02T00:00:00Z" }),
    ];

    const result = groupTasksByColumns(columns, tasks);

    expect(result[0].tasks.map((t) => t.id)).toEqual([1, 3, 2]);
  });

  it("returns empty tasks array for columns with no matching tasks", () => {
    const columns = [
      makeColumn({ id: 1, position: 0, statuses: ["pending"] }),
      makeColumn({ id: 2, position: 1, statuses: ["done"] }),
    ];
    const tasks = [makeTask({ id: 1, status: "pending", rank: 1000 })];

    const result = groupTasksByColumns(columns, tasks);

    expect(result[1].tasks).toEqual([]);
  });

  it("handles empty columns array", () => {
    expect(groupTasksByColumns([], [makeTask({ id: 1 })])).toEqual([]);
  });

  it("handles empty tasks array", () => {
    const columns = [makeColumn({ id: 1, position: 0, statuses: ["pending"] })];
    const result = groupTasksByColumns(columns, []);

    expect(result).toHaveLength(1);
    expect(result[0].tasks).toEqual([]);
  });

  it("does not mutate original columns array", () => {
    const columns = [
      makeColumn({ id: 2, position: 1, statuses: ["done"] }),
      makeColumn({ id: 1, position: 0, statuses: ["pending"] }),
    ];
    const originalOrder = columns.map((c) => c.id);

    groupTasksByColumns(columns, []);

    expect(columns.map((c) => c.id)).toEqual(originalOrder);
  });

  it("column with multiple statuses collects tasks from all", () => {
    const columns = [
      makeColumn({ id: 1, position: 0, statuses: ["pending", "in_progress"] }),
      makeColumn({ id: 2, position: 1, statuses: ["done"] }),
    ];
    const tasks = [
      makeTask({ id: 1, status: "pending", rank: 1000 }),
      makeTask({ id: 2, status: "in_progress", rank: 2000 }),
      makeTask({ id: 3, status: "done", rank: 1000 }),
    ];

    const result = groupTasksByColumns(columns, tasks);

    expect(result[0].tasks.map((t) => t.id)).toEqual([1, 2]);
    expect(result[1].tasks.map((t) => t.id)).toEqual([3]);
  });
});
