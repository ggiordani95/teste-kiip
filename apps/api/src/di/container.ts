import { getPool } from "../infrastructure/database";
import { createBoardModule } from "./modules/board.module";
import { createTaskModule } from "./modules/task.module";

function createContainer() {
  const pool = getPool();

  const { taskController, taskService } = createTaskModule(pool);
  const { boardController } = createBoardModule(pool, taskService);

  return { boardController, taskController } as const;
}

export type Container = ReturnType<typeof createContainer>;

let instance: Container | null = null;

export function getContainer(): Container {
  if (!instance) {
    instance = createContainer();
  }
  return instance;
}

export function resetContainer(): void {
  instance = null;
}
