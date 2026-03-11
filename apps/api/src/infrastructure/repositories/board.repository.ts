import type { Board, BoardConfiguration, Member } from "@task-manager/shared";
import type pg from "pg";
import type { BoardRepositoryPort } from "../../domain/ports";
import { mapBoard, mapColumn, mapMember } from "./mappers";

export class BoardRepository implements BoardRepositoryPort {
  constructor(private readonly pool: pg.Pool) {}

  async listBoards(): Promise<Board[]> {
    const { rows } = await this.pool.query(
      "SELECT id, key, name, type FROM boards ORDER BY id ASC",
    );
    return rows.map(mapBoard);
  }

  async findById(boardId: number): Promise<Board | undefined> {
    const { rows } = await this.pool.query("SELECT id, key, name, type FROM boards WHERE id = $1", [
      boardId,
    ]);
    return rows[0] ? mapBoard(rows[0]) : undefined;
  }

  async getConfiguration(boardId: number): Promise<BoardConfiguration | undefined> {
    const board = await this.findById(boardId);
    if (!board) return undefined;

    const { rows } = await this.pool.query(
      `SELECT id, board_id, column_key, name, position, status, is_done
       FROM board_columns
       WHERE board_id = $1
       ORDER BY position ASC`,
      [boardId],
    );

    return {
      boardId,
      columns: rows.map(mapColumn),
    };
  }

  async listMembers(boardId: number): Promise<Member[]> {
    const { rows } = await this.pool.query(
      "SELECT id, board_id, name FROM members WHERE board_id = $1 ORDER BY name ASC",
      [boardId],
    );
    return rows.map(mapMember);
  }
}
