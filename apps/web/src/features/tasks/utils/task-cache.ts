import type { BoardTasksResponse, Task, TaskStatus } from "@task-manager/shared";

function normalizeRanks(tasks: Task[]): Task[] {
  return tasks.map((task, index) => ({
    ...task,
    rank: index * 1000,
  }));
}

export function reorderTaskInCache(
  data: BoardTasksResponse | undefined,
  taskId: number,
  targetIndex: number,
  targetStatus?: TaskStatus,
): BoardTasksResponse | undefined {
  if (!data) {
    return data;
  }

  const movingTask = data.tasks.find((task) => task.id === taskId);

  if (!movingTask) {
    return data;
  }

  const nextStatus = targetStatus ?? movingTask.status;
  const remainingTasks = data.tasks.filter((task) => task.id !== taskId);
  const targetColumnTasks = remainingTasks.filter((task) => task.status === nextStatus);
  const otherTasks = remainingTasks.filter((task) => task.status !== nextStatus);
  const safeTargetIndex = Math.max(0, Math.min(targetIndex, targetColumnTasks.length));

  targetColumnTasks.splice(safeTargetIndex, 0, {
    ...movingTask,
    status: nextStatus,
  });

  return {
    ...data,
    tasks: [...otherTasks, ...normalizeRanks(targetColumnTasks)],
  };
}
