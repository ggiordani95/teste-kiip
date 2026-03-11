import type pg from "pg";
import { BoardController } from "../../application/controllers/board.controller";
import { BoardService } from "../../domain/services/board.service";
import type { TaskService } from "../../domain/services/task.service";
import { BoardRepository } from "../../infrastructure/repositories/board.repository";

export function createBoardModule(pool: pg.Pool, taskService: TaskService) {
  const boardRepository = new BoardRepository(pool);
  const boardService = new BoardService(boardRepository);
  const boardController = new BoardController(boardService, taskService);

  return { boardController };
}
