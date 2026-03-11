import type { BoardService } from "../../domain/services/board.service";
import type { TaskService } from "../../domain/services/task.service";
import type {
  GetBoardConfigurationResponse,
  GetBoardResponse,
  ListBoardMembersResponse,
  ListBoardTasksResponse,
  ListBoardsResponse,
} from "../dtos";

export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly taskService: TaskService,
  ) {}

  list = async (): Promise<ListBoardsResponse> => {
    const boards = await this.boardService.listBoards();
    return { values: boards };
  };

  get = async (boardId: number): Promise<GetBoardResponse> => {
    return this.boardService.getBoard(boardId);
  };

  configuration = async (boardId: number): Promise<GetBoardConfigurationResponse> => {
    return this.boardService.getConfiguration(boardId);
  };

  tasks = async (boardId: number, query: unknown): Promise<ListBoardTasksResponse> => {
    return this.taskService.listBoardTasks(boardId, query);
  };

  members = async (boardId: number): Promise<ListBoardMembersResponse> => {
    return this.boardService.listMembers(boardId);
  };
}
