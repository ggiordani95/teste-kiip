import { z } from "zod";
import {
  taskSchema,
  taskStatusSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "./schemas.js";

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.input<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
