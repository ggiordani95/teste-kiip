"use client";

import { use } from "react";
import type { Board, BoardConfiguration, BoardTasksResponse, Member } from "@task-manager/shared";
import { useBoardStore } from "../stores";
import type { BoardListResponse } from "../api/tasks.api";

export function useBoardsData(): BoardListResponse {
  const fetchBoards = useBoardStore((s) => s.fetchBoards);
  return use(fetchBoards());
}

export function useBoardData(boardId: number): {
  board: Board;
  configuration: BoardConfiguration;
  tasksResponse: BoardTasksResponse;
  members: Member[];
} {
  const fetchBoardData = useBoardStore((s) => s.fetchBoardData);
  use(fetchBoardData(boardId));

  const board = useBoardStore((s) => s.board);
  const configuration = useBoardStore((s) => s.configuration);
  const tasksResponse = useBoardStore((s) => s.tasksResponse);
  const members = useBoardStore((s) => s.members);

  return {
    board: board!,
    configuration: configuration!,
    tasksResponse: tasksResponse!,
    members: members,
  };
}
