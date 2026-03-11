import type { Task } from "@task-manager/shared";

// --- Request DTOs ---

export type GetTaskRequest = { id: number };
export type CreateTaskRequest = { body: unknown };
export type UpdateTaskRequest = { id: number; body: unknown };
export type MoveTaskRequest = { id: number; body: unknown };
export type DeleteTaskRequest = { id: number };

// --- Response DTOs ---

export type GetTaskResponse = Task;
export type CreateTaskResponse = Task;
export type UpdateTaskResponse = Task;
export type MoveTaskResponse = Task;
