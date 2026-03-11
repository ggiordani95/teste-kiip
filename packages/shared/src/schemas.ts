import { z } from "zod";

export const TASK_STATUSES = ["pending", "in_progress", "done"] as const;
export const BOARD_TYPES = ["kanban"] as const;
export const TASK_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export const TASK_TYPES = ["bug", "task", "story", "subtask"] as const;

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const boardTypeSchema = z.enum(BOARD_TYPES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);
export const taskTypeSchema = z.enum(TASK_TYPES);

export const boardSchema = z.object({
  id: z.number().int().positive(),
  key: z.string().min(1).max(20),
  name: z.string().min(1).max(120),
  type: boardTypeSchema,
});

export const boardColumnSchema = z.object({
  id: z.number().int().positive(),
  boardId: z.number().int().positive(),
  key: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  position: z.number().int().nonnegative(),
  statuses: z.array(taskStatusSchema).min(1),
  isDone: z.boolean(),
});

export const boardConfigurationSchema = z.object({
  boardId: z.number().int().positive(),
  columns: z.array(boardColumnSchema),
});

// --- Tasks ---

export const taskSchema = z.object({
  id: z.number().int().positive(),
  key: z.string().min(1),
  boardId: z.number().int().positive(),
  title: z.string().min(1).max(30),
  description: z.string().max(500).nullable(),
  assignee: z.string().max(100).nullable(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  taskType: taskTypeSchema,
  dueDate: z.string().nullable(),
  rank: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const boardTasksResponseSchema = z.object({
  startAt: z.number().int().nonnegative(),
  maxResults: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  tasks: z.array(taskSchema),
});

export const boardTaskQuerySchema = z.object({
  startAt: z.coerce.number().int().nonnegative().optional().default(0),
  maxResults: z.coerce.number().int().positive().max(100).optional().default(50),
  status: taskStatusSchema.optional(),
  assignee: z.string().trim().min(1).optional(),
  query: z.string().trim().min(1).optional(),
});

export const createTaskSchema = z.object({
  boardId: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(30, "Title must be at most 30 characters"),
  description: z.string().max(500, "Description must be at most 200 characters").optional(),
  assignee: z.string().max(100).optional(),
  status: taskStatusSchema.optional().default("pending"),
  priority: taskPrioritySchema.optional().default("medium"),
  taskType: taskTypeSchema.optional().default("task"),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(30, "Title must be at most 30 characters").optional(),
  description: z.string().max(500, "Description must be at most 200 characters").nullable().optional(),
  assignee: z.string().max(100).nullable().optional(),
});

export const moveTaskSchema = z.object({
  columnId: z.number().int().positive(),
  targetIndex: z.number().int().nonnegative(),
  status: taskStatusSchema.optional(),
});

// --- Members ---

export const memberSchema = z.object({
  id: z.number().int().positive(),
  boardId: z.number().int().positive(),
  name: z.string().min(1).max(100),
});
