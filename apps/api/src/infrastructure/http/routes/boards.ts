import type { FastifyInstance } from "fastify";
import { getContainer } from "../../../di/container";
import { parseId } from "../helpers";

export async function boardRoutes(app: FastifyInstance): Promise<void> {
  const { boardController } = getContainer();

  app.get("/", async () => boardController.list());

  app.get<{ Params: { boardId: string } }>("/:boardId", async (req) =>
    boardController.get(parseId(req.params.boardId)),
  );

  app.get<{ Params: { boardId: string } }>("/:boardId/configuration", async (req) =>
    boardController.configuration(parseId(req.params.boardId)),
  );

  app.get<{ Params: { boardId: string } }>("/:boardId/tasks", async (req) =>
    boardController.tasks(parseId(req.params.boardId), req.query),
  );

  app.get<{ Params: { boardId: string } }>("/:boardId/members", async (req) =>
    boardController.members(parseId(req.params.boardId)),
  );
}
