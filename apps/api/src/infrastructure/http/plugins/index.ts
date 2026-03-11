import type { FastifyInstance } from "fastify";
import { registerCors } from "./cors";
import { registerErrorHandler } from "./error-handler";
import { registerScalar } from "./scalar";

export async function registerPlugins(app: FastifyInstance): Promise<void> {
  await registerCors(app);
  await registerScalar(app);
  registerErrorHandler(app);
}
