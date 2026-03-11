import type {
  Board,
  BoardColumn,
  BoardConfiguration,
  BoardTaskQuery,
  BoardTasksResponse,
  CreateTaskInput,
  Member,
  MoveTaskInput,
  UpdateTaskInput,
  Task,
} from "@task-manager/shared";

export interface BoardRepositoryPort {
  listBoards(): Promise<Board[]>;
  findById(boardId: number): Promise<Board | undefined>;
  getConfiguration(boardId: number): Promise<BoardConfiguration | undefined>;
  listMembers(boardId: number): Promise<Member[]>;
}

export interface TaskRepositoryPort {
  listByBoard(boardId: number, query: BoardTaskQuery): Promise<BoardTasksResponse>;
  create(input: CreateTaskInput): Promise<Task | undefined>;
  update(id: number, input: UpdateTaskInput): Promise<Task | undefined>;
  move(id: number, input: MoveTaskInput): Promise<Task | undefined>;
  delete(id: number): Promise<{ deleted: boolean; boardId?: number }>;
  findById(id: number): Promise<Task | undefined>;
}
