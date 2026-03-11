import type { z } from "zod";
import type {
  boardColumnSchema,
  boardConfigurationSchema,
  boardTaskQuerySchema,
  boardTasksResponseSchema,
  boardSchema,
  boardTypeSchema,
  createTaskSchema,
  memberSchema,
  taskPrioritySchema,
  taskSchema,
  taskTypeSchema,
  moveTaskSchema,
  updateTaskSchema,
  taskStatusSchema,
} from "./schemas.js";

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export type BoardType = z.infer<typeof boardTypeSchema>;
export type Board = z.infer<typeof boardSchema>;
export type BoardColumn = z.infer<typeof boardColumnSchema>;
export type BoardConfiguration = z.infer<typeof boardConfigurationSchema>;

export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type TaskType = z.infer<typeof taskTypeSchema>;
export type Task = z.infer<typeof taskSchema>;
export type BoardTaskQuery = z.infer<typeof boardTaskQuerySchema>;
export type BoardTasksResponse = z.infer<typeof boardTasksResponseSchema>;
export type CreateTaskInput = z.input<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type Member = z.infer<typeof memberSchema>;
