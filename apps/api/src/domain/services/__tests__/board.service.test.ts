import type { Board, BoardColumn, BoardConfiguration, Member } from "@task-manager/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@/domain/errors";
import type { BoardRepositoryPort } from "@/domain/ports";
import { BoardService } from "@/domain/services/board.service";

const baseBoard: Board = { id: 1, key: "KAN", name: "Kanban Board", type: "kanban" };

const baseConfiguration: BoardConfiguration = {
  boardId: 1,
  columns: [
    { id: 1, boardId: 1, key: "pending", name: "Pendente", position: 0, statuses: ["pending"], isDone: false },
    { id: 2, boardId: 1, key: "in_progress", name: "Em andamento", position: 1, statuses: ["in_progress"], isDone: false },
    { id: 3, boardId: 1, key: "done", name: "Concluido", position: 2, statuses: ["done"], isDone: true },
  ],
};

const baseMembers: Member[] = [
  { id: 1, boardId: 1, name: "Ana Silva" },
  { id: 2, boardId: 1, name: "Carlos Souza" },
];

function createMockRepository(): BoardRepositoryPort {
  return {
    listBoards: vi.fn(),
    findById: vi.fn(),
    getConfiguration: vi.fn(),
    listMembers: vi.fn(),
  };
}

describe("BoardService", () => {
  let repository: BoardRepositoryPort;
  let service: BoardService;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = createMockRepository();
    service = new BoardService(repository);
  });

  describe("listBoards", () => {
    it("returns all boards", async () => {
      vi.mocked(repository.listBoards).mockResolvedValue([baseBoard]);

      const result = await service.listBoards();

      expect(result).toEqual([baseBoard]);
    });

    it("returns empty array when no boards exist", async () => {
      vi.mocked(repository.listBoards).mockResolvedValue([]);

      const result = await service.listBoards();

      expect(result).toEqual([]);
    });
  });

  describe("getBoard", () => {
    it("returns board by id", async () => {
      vi.mocked(repository.findById).mockResolvedValue(baseBoard);

      const result = await service.getBoard(1);

      expect(result).toEqual(baseBoard);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError for non-existent board", async () => {
      vi.mocked(repository.findById).mockResolvedValue(undefined);

      await expect(service.getBoard(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("getConfiguration", () => {
    it("returns board configuration with columns", async () => {
      vi.mocked(repository.getConfiguration).mockResolvedValue(baseConfiguration);

      const result = await service.getConfiguration(1);

      expect(result).toEqual(baseConfiguration);
      expect(result.columns).toHaveLength(3);
    });

    it("throws NotFoundError for non-existent board", async () => {
      vi.mocked(repository.getConfiguration).mockResolvedValue(undefined);

      await expect(service.getConfiguration(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("listMembers", () => {
    it("returns members for existing board", async () => {
      vi.mocked(repository.findById).mockResolvedValue(baseBoard);
      vi.mocked(repository.listMembers).mockResolvedValue(baseMembers);

      const result = await service.listMembers(1);

      expect(result).toEqual(baseMembers);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.listMembers).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError for non-existent board", async () => {
      vi.mocked(repository.findById).mockResolvedValue(undefined);

      await expect(service.listMembers(999)).rejects.toBeInstanceOf(NotFoundError);
      expect(repository.listMembers).not.toHaveBeenCalled();
    });
  });

});
