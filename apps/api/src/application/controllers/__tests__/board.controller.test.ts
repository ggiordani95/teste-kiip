import type { Board, BoardConfiguration, Member } from "@task-manager/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BoardController } from "@/application/controllers/board.controller";
import type { BoardService } from "@/domain/services/board.service";
import type { TaskService } from "@/domain/services/task.service";

const baseBoard: Board = { id: 1, key: "KAN", name: "Kanban Board", type: "kanban" };

function createMockServices() {
  const boardService = {
    listBoards: vi.fn(),
    getBoard: vi.fn(),
    getConfiguration: vi.fn(),
    listMembers: vi.fn(),
  } as unknown as BoardService;

  const taskService = {
    listBoardTasks: vi.fn(),
  } as unknown as TaskService;

  return { boardService, taskService };
}

describe("BoardController", () => {
  let boardService: BoardService;
  let taskService: TaskService;
  let controller: BoardController;

  beforeEach(() => {
    vi.clearAllMocks();
    const mocks = createMockServices();
    boardService = mocks.boardService;
    taskService = mocks.taskService;
    controller = new BoardController(boardService, taskService);
  });

  it("list wraps boards in { values }", async () => {
    vi.mocked(boardService.listBoards).mockResolvedValue([baseBoard]);

    const result = await controller.list();

    expect(result).toEqual({ values: [baseBoard] });
  });

  it("get delegates to boardService.getBoard", async () => {
    vi.mocked(boardService.getBoard).mockResolvedValue(baseBoard);

    const result = await controller.get(1);

    expect(result).toEqual(baseBoard);
    expect(boardService.getBoard).toHaveBeenCalledWith(1);
  });

  it("configuration delegates to boardService.getConfiguration", async () => {
    const config: BoardConfiguration = {
      boardId: 1,
      columns: [
        { id: 1, boardId: 1, key: "pending", name: "Pendente", position: 0, statuses: ["pending"], isDone: false },
      ],
    };
    vi.mocked(boardService.getConfiguration).mockResolvedValue(config);

    const result = await controller.configuration(1);

    expect(result).toEqual(config);
  });

  it("tasks delegates to taskService.listBoardTasks", async () => {
    const response = { startAt: 0, maxResults: 50, total: 0, tasks: [] };
    vi.mocked(taskService.listBoardTasks).mockResolvedValue(response);

    const result = await controller.tasks(1, { status: "pending" });

    expect(result).toEqual(response);
    expect(taskService.listBoardTasks).toHaveBeenCalledWith(1, { status: "pending" });
  });

  it("members delegates to boardService.listMembers", async () => {
    const members: Member[] = [{ id: 1, boardId: 1, name: "Ana" }];
    vi.mocked(boardService.listMembers).mockResolvedValue(members);

    const result = await controller.members(1);

    expect(result).toEqual(members);
    expect(boardService.listMembers).toHaveBeenCalledWith(1);
  });

});
