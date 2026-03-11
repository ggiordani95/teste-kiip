import type { Board, BoardConfiguration, BoardTaskQuery, BoardTasksResponse, Member } from "@task-manager/shared";

// --- Request DTOs ---

export type GetBoardRequest = { boardId: number };
export type GetBoardConfigurationRequest = { boardId: number };
export type ListBoardTasksRequest = { boardId: number; query: unknown };
export type ListBoardMembersRequest = { boardId: number };

// --- Response DTOs ---

export type ListBoardsResponse = { values: Board[] };
export type GetBoardResponse = Board;
export type GetBoardConfigurationResponse = BoardConfiguration;
export type ListBoardTasksResponse = BoardTasksResponse;
export type ListBoardMembersResponse = Member[];
