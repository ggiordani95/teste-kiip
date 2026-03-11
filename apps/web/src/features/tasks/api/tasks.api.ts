import type {
  Board,
  BoardConfiguration,
  BoardTaskQuery,
  BoardTasksResponse,
  CreateTaskInput,
  Member,
  Task,
  MoveTaskInput,
  UpdateTaskInput,
} from "@task-manager/shared";
import { httpRequest } from "@/lib/http-client";

export interface BoardListResponse {
  values: Board[];
}

function toSearchParams(query?: Partial<BoardTaskQuery>): string {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.startAt !== undefined) params.set("startAt", String(query.startAt));
  if (query.maxResults !== undefined) params.set("maxResults", String(query.maxResults));
  if (query.status) params.set("status", query.status);
  if (query.assignee) params.set("assignee", query.assignee);
  if (query.query) params.set("query", query.query);

  const value = params.toString();
  return value ? `?${value}` : "";
}

// --- Boards ---

export function fetchBoards(): Promise<BoardListResponse> {
  return httpRequest<BoardListResponse>("/api/boards");
}

export function fetchBoard(boardId: number): Promise<Board> {
  return httpRequest<Board>(`/api/boards/${boardId}`);
}

export function fetchBoardConfiguration(boardId: number): Promise<BoardConfiguration> {
  return httpRequest<BoardConfiguration>(`/api/boards/${boardId}/configuration`);
}

export function fetchBoardTasks(
  boardId: number,
  query?: Partial<BoardTaskQuery>,
): Promise<BoardTasksResponse> {
  return httpRequest<BoardTasksResponse>(`/api/boards/${boardId}/tasks${toSearchParams(query)}`);
}

// --- Tasks ---

export function fetchTask(taskId: number): Promise<Task> {
  return httpRequest<Task>(`/api/tasks/${taskId}`);
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return httpRequest<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function moveTask(taskId: number, input: MoveTaskInput): Promise<Task> {
  return httpRequest<Task>(`/api/tasks/${taskId}/move`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function updateTask(taskId: number, input: UpdateTaskInput): Promise<Task> {
  return httpRequest<Task>(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteTask(taskId: number): Promise<void> {
  return httpRequest<void>(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}

// --- Members ---

export function fetchBoardMembers(boardId: number): Promise<Member[]> {
  return httpRequest<Member[]>(`/api/boards/${boardId}/members`);
}
