import Fastify from "fastify";
import { env } from "./config/env";
import { closeDatabase, initDatabase } from "./infrastructure/database";
import { registerPlugins } from "./infrastructure/http/plugins";
import { registerRoutes } from "./infrastructure/http/routes";

const start = async () => {
  // Initialize the database and run migrations
  await initDatabase();

  // Create Fastify instance
  const app = Fastify({ logger: true });

  // Register plugins and routes
  await registerPlugins(app);
  await registerRoutes(app);

  await app.listen({ port: env.port, host: "0.0.0.0" });

  // Graceful shutdown
  const shutdown = async () => {
    app.log.info("Shutting down gracefully...");
    await app.close();
    await closeDatabase();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
