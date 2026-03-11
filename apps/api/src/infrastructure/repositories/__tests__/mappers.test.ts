import { describe, expect, it } from "vitest";
import { mapBoard, mapColumn, mapMember, mapTask } from "@/infrastructure/repositories/mappers";

describe("mapBoard", () => {
  it("maps raw row to Board", () => {
    const result = mapBoard({ id: 1, key: "KAN", name: "Kanban Board", type: "kanban" });

    expect(result).toEqual({ id: 1, key: "KAN", name: "Kanban Board", type: "kanban" });
  });
});

describe("mapColumn", () => {
  it("maps raw row to BoardColumn with statuses array", () => {
    const result = mapColumn({
      id: 1,
      board_id: 1,
      column_key: "pending",
      name: "Pendente",
      position: 0,
      status: "pending",
      is_done: false,
    });

    expect(result).toEqual({
      id: 1,
      boardId: 1,
      key: "pending",
      name: "Pendente",
      position: 0,
      statuses: ["pending"],
      isDone: false,
    });
  });
});

describe("mapMember", () => {
  it("maps raw row to Member", () => {
    const result = mapMember({ id: 1, board_id: 1, name: "Ana Silva" });

    expect(result).toEqual({ id: 1, boardId: 1, name: "Ana Silva" });
  });
});

describe("mapTask", () => {
  it("maps raw row to Task with camelCase fields", () => {
    const now = new Date();
    const result = mapTask({
      id: 1,
      task_key: "KAN-1",
      board_id: 1,
      title: "Setup board",
      description: "A description",
      assignee: "Gustavo",
      status: "pending",
      priority: "medium",
      task_type: "task",
      due_date: null,
      rank: 1000,
      created_at: now,
      updated_at: now,
    });

    expect(result).toEqual({
      id: 1,
      key: "KAN-1",
      boardId: 1,
      title: "Setup board",
      description: "A description",
      assignee: "Gustavo",
      status: "pending",
      priority: "medium",
      taskType: "task",
      dueDate: null,
      rank: 1000,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it("formats dueDate as YYYY-MM-DD", () => {
    const now = new Date();
    const dueDate = new Date("2025-12-25T10:00:00Z");
    const result = mapTask({
      id: 1,
      task_key: "KAN-1",
      board_id: 1,
      title: "Test",
      description: null,
      assignee: null,
      status: "pending",
      priority: "low",
      task_type: "bug",
      due_date: dueDate,
      rank: 0,
      created_at: now,
      updated_at: now,
    });

    expect(result.dueDate).toBe("2025-12-25");
  });

  it("handles null description and assignee", () => {
    const now = new Date();
    const result = mapTask({
      id: 1,
      task_key: "KAN-1",
      board_id: 1,
      title: "Test",
      description: null,
      assignee: null,
      status: "done",
      priority: "high",
      task_type: "story",
      due_date: null,
      rank: 0,
      created_at: now,
      updated_at: now,
    });

    expect(result.description).toBeNull();
    expect(result.assignee).toBeNull();
    expect(result.dueDate).toBeNull();
  });
});
