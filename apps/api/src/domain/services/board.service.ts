import type { Board, BoardConfiguration, Member } from "@task-manager/shared";
import { NotFoundError } from "../errors";
import type { BoardRepositoryPort } from "../ports";

export class BoardService {
  constructor(private readonly repository: BoardRepositoryPort) {}

  async listBoards(): Promise<Board[]> {
    return this.repository.listBoards();
  }

  async getBoard(boardId: number): Promise<Board> {
    const board = await this.repository.findById(boardId);
    if (!board) {
      throw new NotFoundError(`Board with id ${boardId} not found`);
    }
    return board;
  }

  async getConfiguration(boardId: number): Promise<BoardConfiguration> {
    const configuration = await this.repository.getConfiguration(boardId);
    if (!configuration) {
      throw new NotFoundError(`Board with id ${boardId} not found`);
    }
    return configuration;
  }

  async listMembers(boardId: number): Promise<Member[]> {
    const board = await this.repository.findById(boardId);
    if (!board) {
      throw new NotFoundError(`Board with id ${boardId} not found`);
    }
    return this.repository.listMembers(boardId);
  }
}
