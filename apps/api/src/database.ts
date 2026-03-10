import fs from "node:fs";
import path from "node:path";

export interface TaskRow {
  id: number;
  title: string;
  description: string | null;
  assignee: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DbData {
  nextId: number;
  tasks: TaskRow[];
}

export class Database {
  private data: DbData;
  private readonly filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || process.env.DB_PATH || "./data/tasks.json";
    this.data = this.load();
  }

  private load(): DbData {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(raw);
      }
    } catch {
      // Start fresh if file is corrupted
    }

    return { nextId: 1, tasks: [] };
  }

  private save(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  findAll(status?: string): TaskRow[] {
    let tasks = [...this.data.tasks];
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    return tasks.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  findById(id: number): TaskRow | undefined {
    return this.data.tasks.find((t) => t.id === id);
  }

  insert(row: Omit<TaskRow, "id" | "created_at" | "updated_at">): TaskRow {
    const now = new Date().toISOString();
    const newRow: TaskRow = {
      ...row,
      id: this.data.nextId++,
      created_at: now,
      updated_at: now,
    };
    this.data.tasks.push(newRow);
    this.save();
    return newRow;
  }

  update(
    id: number,
    fields: Partial<Pick<TaskRow, "title" | "description" | "assignee" | "status">>,
  ): TaskRow | undefined {
    const task = this.data.tasks.find((t) => t.id === id);
    if (!task) return undefined;

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (task as any)[key] = value;
      }
    }
    task.updated_at = new Date().toISOString();
    this.save();
    return task;
  }

  delete(id: number): boolean {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.data.tasks.splice(index, 1);
    this.save();
    return true;
  }
}
