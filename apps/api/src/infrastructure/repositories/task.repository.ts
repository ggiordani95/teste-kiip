import type {
  BoardTaskQuery,
  BoardTasksResponse,
  CreateTaskInput,
  MoveTaskInput,
  UpdateTaskInput,
  Task,
  TaskStatus,
} from "@task-manager/shared";
import type pg from "pg";
import type { TaskRepositoryPort } from "../../domain/ports";
import { withTransaction } from "../database/transaction";
import { mapTask } from "./mappers";

export class TaskRepository implements TaskRepositoryPort {
  constructor(private readonly pool: pg.Pool) {}

  async findById(id: number): Promise<Task | undefined> {
    const { rows } = await this.pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (!rows[0]) return undefined;
    return mapTask(rows[0]);
  }

  async listByBoard(boardId: number, query: BoardTaskQuery): Promise<BoardTasksResponse> {
    const { whereClause, values, nextParamIndex } = this.buildFilterClause(boardId, query);

    const countResult = await this.pool.query(
      `SELECT COUNT(*)::int AS total FROM tasks i WHERE ${whereClause}`,
      values,
    );

    const limitIndex = nextParamIndex;
    const offsetIndex = nextParamIndex + 1;
    const { rows } = await this.pool.query(
      `SELECT i.*
       FROM tasks i
       WHERE ${whereClause}
       ORDER BY i.status ASC, i.rank ASC, i.created_at ASC
       LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      [...values, query.maxResults, query.startAt],
    );

    const tasks = rows.map((row) => mapTask(row));

    return {
      startAt: query.startAt,
      maxResults: query.maxResults,
      total: countResult.rows[0].total as number,
      tasks,
    };
  }

  async create(input: CreateTaskInput): Promise<Task | undefined> {
    return withTransaction(this.pool, async (client) => {
      const boardResult = await client.query("SELECT id, key FROM boards WHERE id = $1", [
        input.boardId,
      ]);
      const board = boardResult.rows[0];
      if (!board) {
        return undefined;
      }

      const nextRankResult = await client.query(
        `SELECT COALESCE(MAX(rank), 0) + 1000 AS next_rank
         FROM tasks
         WHERE board_id = $1 AND status = $2`,
        [input.boardId, input.status],
      );
      const nextRank = Number(nextRankResult.rows[0].next_rank);

      const insertResult = await client.query(
        `INSERT INTO tasks (task_key, board_id, title, description, assignee, status, priority, task_type, due_date, rank)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          `${board.key}-TEMP`,
          input.boardId,
          input.title,
          input.description ?? null,
          input.assignee ?? null,
          input.status,
          input.priority,
          input.taskType,
          input.dueDate ?? null,
          nextRank,
        ],
      );

      const inserted = insertResult.rows[0];
      const taskKey = `${board.key}-${inserted.id}`;
      const updatedResult = await client.query(
        `UPDATE tasks
         SET task_key = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [taskKey, inserted.id],
      );

      return mapTask(updatedResult.rows[0]);
    });
  }

  async update(id: number, input: UpdateTaskInput): Promise<Task | undefined> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (input.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(input.title);
    }
    if (input.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(input.description);
    }
    if (input.assignee !== undefined) {
      fields.push(`assignee = $${paramIndex++}`);
      values.push(input.assignee);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await this.pool.query(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );

    if (!rows[0]) return undefined;
    return mapTask(rows[0]);
  }

  async move(id: number, input: MoveTaskInput): Promise<Task | undefined> {
    return withTransaction(this.pool, async (client) => {
      const taskResult = await client.query(
        "SELECT id, board_id FROM tasks WHERE id = $1 FOR UPDATE",
        [id],
      );
      const task = taskResult.rows[0];
      if (!task) {
        return undefined;
      }

      const columnResult = await client.query(
        `SELECT id, board_id, status
         FROM board_columns
         WHERE id = $1`,
        [input.columnId],
      );
      const column = columnResult.rows[0];
      if (!column || column.board_id !== task.board_id) {
        return undefined;
      }

      const targetStatus = (input.status ?? column.status) as TaskStatus;
      const siblingsResult = await client.query(
        `SELECT id
         FROM tasks
         WHERE board_id = $1 AND status = $2 AND id <> $3
         ORDER BY rank ASC, created_at ASC
         FOR UPDATE`,
        [task.board_id, targetStatus, id],
      );

      const orderedIds = siblingsResult.rows.map((row) => row.id as number);
      const targetIndex = Math.max(0, Math.min(input.targetIndex, orderedIds.length));
      orderedIds.splice(targetIndex, 0, id);

      await client.query(
        `UPDATE tasks
         SET status = $1, updated_at = NOW()
         WHERE id = $2`,
        [targetStatus, id],
      );

      // Batch update ranks using unnest instead of N+1 loop
      const ids = orderedIds;
      const ranks = orderedIds.map((_, index) => (index + 1) * 1000);
      await client.query(
        `UPDATE tasks
         SET rank = batch.rank,
             updated_at = CASE WHEN tasks.id = $3 THEN NOW() ELSE tasks.updated_at END
         FROM (SELECT unnest($1::int[]) AS id, unnest($2::int[]) AS rank) AS batch
         WHERE tasks.id = batch.id`,
        [ids, ranks, id],
      );

      const finalResult = await client.query("SELECT * FROM tasks WHERE id = $1", [id]);
      return mapTask(finalResult.rows[0]);
    });
  }

  async delete(id: number): Promise<{ deleted: boolean; boardId?: number }> {
    const result = await this.pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       RETURNING board_id`,
      [id],
    );

    if (!result.rows[0]) {
      return { deleted: false };
    }

    return { deleted: true, boardId: result.rows[0].board_id as number };
  }

  private buildFilterClause(
    boardId: number,
    query: BoardTaskQuery,
  ): { whereClause: string; values: unknown[]; nextParamIndex: number } {
    const filters = ["i.board_id = $1"];
    const values: unknown[] = [boardId];
    let paramIndex = 2;

    if (query.status) {
      filters.push(`i.status = $${paramIndex++}`);
      values.push(query.status);
    }

    if (query.assignee) {
      filters.push(`i.assignee ILIKE $${paramIndex++}`);
      values.push(`%${query.assignee}%`);
    }

    if (query.query) {
      filters.push(
        `(i.title ILIKE $${paramIndex} OR COALESCE(i.description, '') ILIKE $${paramIndex})`,
      );
      values.push(`%${query.query}%`);
      paramIndex++;
    }

    return {
      whereClause: filters.join(" AND "),
      values,
      nextParamIndex: paramIndex,
    };
  }
}
