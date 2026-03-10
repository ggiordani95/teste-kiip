import type { Task, TaskStatus, CreateTaskInput } from "@task-manager/shared";
import type { Database, TaskRow } from "../database.js";

export class TaskRepository {
  constructor(private readonly db: Database) {}

  findAll(status?: TaskStatus): Task[] {
    const rows = this.db.findAll(status);
    return rows.map(this.mapRow);
  }

  findById(id: number): Task | undefined {
    const row = this.db.findById(id);
    return row ? this.mapRow(row) : undefined;
  }

  create(input: CreateTaskInput): Task {
    const row = this.db.insert({
      title: input.title,
      description: input.description ?? null,
      assignee: input.assignee ?? null,
      status: input.status ?? "pending",
    });
    return this.mapRow(row);
  }

  update(id: number, input: Record<string, unknown>): Task | undefined {
    const fields: Record<string, unknown> = {};
    for (const key of ["title", "description", "assignee", "status"]) {
      if (key in input) {
        fields[key] = input[key];
      }
    }

    const row = this.db.update(id, fields);
    return row ? this.mapRow(row) : undefined;
  }

  delete(id: number): boolean {
    return this.db.delete(id);
  }

  private mapRow(row: TaskRow): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      assignee: row.assignee,
      status: row.status as TaskStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
