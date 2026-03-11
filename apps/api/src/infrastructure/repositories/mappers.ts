import type {
  Board,
  BoardColumn,
  Member,
  TaskPriority,
  TaskType,
  TaskStatus,
} from "@task-manager/shared";
import type { Task } from "@task-manager/shared";

export function mapBoard(row: Record<string, unknown>): Board {
  return {
    id: row.id as number,
    key: row.key as string,
    name: row.name as string,
    type: row.type as "kanban",
  };
}

export function mapColumn(row: Record<string, unknown>): BoardColumn {
  return {
    id: row.id as number,
    boardId: row.board_id as number,
    key: row.column_key as string,
    name: row.name as string,
    position: row.position as number,
    statuses: [row.status as TaskStatus],
    isDone: row.is_done as boolean,
  };
}

export function mapMember(row: Record<string, unknown>): Member {
  return {
    id: row.id as number,
    boardId: row.board_id as number,
    name: row.name as string,
  };
}

export function mapTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as number,
    key: row.task_key as string,
    boardId: row.board_id as number,
    title: row.title as string,
    description: row.description as string | null,
    assignee: row.assignee as string | null,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    taskType: row.task_type as TaskType,
    dueDate: row.due_date ? (row.due_date as Date).toISOString().split("T")[0] : null,
    rank: row.rank as number,
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  };
}
