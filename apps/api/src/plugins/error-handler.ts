import type { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../errors.js";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(
    (error: FastifyError, _req: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof AppError) {
        return reply
          .status(error.statusCode)
          .send({ error: error.message });
      }

      app.log.error(error);
      return reply.status(500).send({ error: "Internal server error" });
    },
  );
}
