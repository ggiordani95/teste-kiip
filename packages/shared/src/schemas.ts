import { z } from "zod";

export const TASK_STATUSES = ["pending", "in_progress", "done"] as const;

export const taskStatusSchema = z.enum(TASK_STATUSES);

export const taskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  assignee: z.string().max(100).nullable(),
  status: taskStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(1000).optional(),
  assignee: z.string().max(100).optional(),
  status: taskStatusSchema.optional().default("pending"),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(255),
    description: z.string().max(1000).nullable(),
    assignee: z.string().max(100).nullable(),
    status: taskStatusSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const taskQuerySchema = z.object({
  status: taskStatusSchema.optional(),
});
