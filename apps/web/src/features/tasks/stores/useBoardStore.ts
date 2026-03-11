import type {
  Board,
  BoardConfiguration,
  BoardTasksResponse,
  Member,
  Task,
} from "@task-manager/shared";
import { create } from "zustand";
import * as tasksApi from "../api/tasks.api";
import type { BoardListResponse } from "../api/tasks.api";

interface BoardState {
  activeBoardId: number | undefined;

  boards: BoardListResponse | undefined;
  board: Board | undefined;
  configuration: BoardConfiguration | undefined;
  tasksResponse: BoardTasksResponse | undefined;
  members: Member[];

  _promises: Map<string, Promise<unknown>>;

  setActiveBoardId: (id: number | undefined) => void;

  fetchBoards: () => Promise<BoardListResponse>;
  fetchBoardData: (boardId: number) => Promise<void>;

  setTasks: (updater: (tasks: Task[]) => Task[]) => void;

  refetchTasks: (boardId: number) => void;
  refetchBoards: () => void;
  invalidateBoardData: (boardId: number) => void;
}

function cachedPromise<T>(
  promises: Map<string, Promise<unknown>>,
  key: string,
  factory: () => Promise<T>,
): Promise<T> {
  const existing = promises.get(key);
  if (existing) return existing as Promise<T>;
  const promise = factory();
  promises.set(key, promise);
  return promise;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  activeBoardId: undefined,
  boards: undefined,
  board: undefined,
  configuration: undefined,
  tasksResponse: undefined,
  members: [],

  _promises: new Map(),

  setActiveBoardId: (id) => {
    const state = get();
    if (state.activeBoardId === id) return;

    // Limpa cache de dados do board anterior
    const promises = new Map(state._promises);
    for (const key of promises.keys()) {
      if (key.startsWith("board:")) promises.delete(key);
    }

    set({
      activeBoardId: id,
      board: undefined,
      configuration: undefined,
      tasksResponse: undefined,
      members: [],
      _promises: promises,
    });
  },

  fetchBoards: () => {
    const { _promises } = get();

    return cachedPromise(_promises, "boards", async () => {
      const boards = await tasksApi.fetchBoards();
      set({ boards });
      return boards;
    });
  },

  fetchBoardData: (boardId: number) => {
    const { _promises } = get();

    return cachedPromise(_promises, `board:${boardId}`, async () => {
      const [board, configuration, tasksResponse, members] = await Promise.all([
        tasksApi.fetchBoard(boardId),
        tasksApi.fetchBoardConfiguration(boardId),
        tasksApi.fetchBoardTasks(boardId),
        tasksApi.fetchBoardMembers(boardId),
      ]);

      set({ board, configuration, tasksResponse, members });
    });
  },

  setTasks: (updater) => {
    const { tasksResponse } = get();
    if (!tasksResponse) return;

    const updatedTasks = updater(tasksResponse.tasks);
    set({
      tasksResponse: { ...tasksResponse, tasks: updatedTasks },
    });
  },

  refetchTasks: (boardId: number) => {
    tasksApi.fetchBoardTasks(boardId).then((tasksResponse) => {
      set({ tasksResponse });
    });
  },

  refetchBoards: () => {
    tasksApi.fetchBoards().then((boards) => {
      set({ boards });
    });
  },

  invalidateBoardData: (boardId: number) => {
    const promises = new Map(get()._promises);
    promises.delete(`board:${boardId}`);
    set({ _promises: promises });

    get().refetchTasks(boardId);
  },
}));
