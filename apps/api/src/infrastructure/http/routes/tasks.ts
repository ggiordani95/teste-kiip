import type { FastifyInstance } from "fastify";
import { getContainer } from "../../../di/container";
import { parseId } from "../helpers";

export async function taskRoutes(app: FastifyInstance): Promise<void> {
  const { taskController } = getContainer();

  app.post("/", async (req, reply) => {
    const task = await taskController.create(req.body);
    return reply.status(201).send(task);
  });

  app.get<{ Params: { id: string } }>("/:id", async (req) =>
    taskController.get(parseId(req.params.id)),
  );

  app.put<{ Params: { id: string } }>("/:id", async (req) =>
    taskController.update(parseId(req.params.id), req.body),
  );

  app.put<{ Params: { id: string } }>("/:id/move", async (req) =>
    taskController.move(parseId(req.params.id), req.body),
  );

  app.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    await taskController.remove(parseId(req.params.id));
    return reply.status(204).send();
  });
}
