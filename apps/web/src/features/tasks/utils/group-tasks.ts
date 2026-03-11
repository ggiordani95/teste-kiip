import type { BoardColumn, Task } from "@task-manager/shared";

export interface ColumnWithTasks {
  column: BoardColumn;
  tasks: Task[];
}

export function groupTasksByColumns(columns: BoardColumn[], tasks: Task[]): ColumnWithTasks[] {
  return columns
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((column) => ({
      column,
      tasks: tasks
        .filter((task) => column.statuses.includes(task.status))
        .sort((a, b) => a.rank - b.rank || a.createdAt.localeCompare(b.createdAt)),
    }));
}
