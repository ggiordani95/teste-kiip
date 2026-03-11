import scalarPlugin from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";
import { env } from "../../../config/env";

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Task Manager API",
    version: "1.0.0",
    description: "API para gerenciamento de tarefas em um quadro Kanban.",
  },
  servers: [{ url: `http://localhost:${env.port}`, description: "Local" }],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", example: "ok" } } } } } } },
      },
    },
    "/api/boards": {
      get: {
        tags: ["Boards"],
        summary: "Listar boards",
        responses: {
          "200": {
            description: "Lista de boards",
            content: { "application/json": { schema: { type: "object", properties: { values: { type: "array", items: { $ref: "#/components/schemas/Board" } } } } } },
          },
        },
      },
    },
    "/api/boards/{boardId}": {
      get: {
        tags: ["Boards"],
        summary: "Detalhe de um board",
        parameters: [{ name: "boardId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Board encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Board" } } } },
          "404": { description: "Board nao encontrado" },
        },
      },
    },
    "/api/boards/{boardId}/configuration": {
      get: {
        tags: ["Boards"],
        summary: "Configuracao do board (colunas)",
        parameters: [{ name: "boardId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Configuracao do board", content: { "application/json": { schema: { $ref: "#/components/schemas/BoardConfiguration" } } } },
          "404": { description: "Board nao encontrado" },
        },
      },
    },
    "/api/boards/{boardId}/tasks": {
      get: {
        tags: ["Boards"],
        summary: "Tasks do board (com filtros)",
        parameters: [
          { name: "boardId", in: "path", required: true, schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["pending", "in_progress", "done"] } },
          { name: "assignee", in: "query", schema: { type: "string" } },
          { name: "query", in: "query", schema: { type: "string" } },
          { name: "startAt", in: "query", schema: { type: "integer", default: 0 } },
          { name: "maxResults", in: "query", schema: { type: "integer", default: 50, maximum: 100 } },
        ],
        responses: {
          "200": { description: "Lista paginada de tasks", content: { "application/json": { schema: { $ref: "#/components/schemas/BoardTasksResponse" } } } },
        },
      },
    },
    "/api/boards/{boardId}/members": {
      get: {
        tags: ["Boards"],
        summary: "Membros do board",
        parameters: [{ name: "boardId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Lista de membros", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Member" } } } } },
          "404": { description: "Board nao encontrado" },
        },
      },
    },
    "/api/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Criar task",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTask" } } } },
        responses: {
          "201": { description: "Task criada", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
          "400": { description: "Dados invalidos" },
          "404": { description: "Board nao encontrado" },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Detalhe da task",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Task encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
          "404": { description: "Task nao encontrada" },
        },
      },
      put: {
        tags: ["Tasks"],
        summary: "Atualizar task",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTask" } } } },
        responses: {
          "200": { description: "Task atualizada", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
          "400": { description: "Dados invalidos" },
          "404": { description: "Task nao encontrada" },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Remover task",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "204": { description: "Task removida" },
          "404": { description: "Task nao encontrada" },
        },
      },
    },
    "/api/tasks/{id}/move": {
      put: {
        tags: ["Tasks"],
        summary: "Mover task entre colunas",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MoveTask" } } } },
        responses: {
          "200": { description: "Task movida", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
          "404": { description: "Task nao encontrada" },
        },
      },
    },
  },
  components: {
    schemas: {
      Board: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          key: { type: "string", example: "KAN" },
          name: { type: "string", example: "Kanban Board" },
          type: { type: "string", enum: ["kanban"] },
        },
      },
      BoardColumn: {
        type: "object",
        properties: {
          id: { type: "integer" },
          boardId: { type: "integer" },
          key: { type: "string" },
          name: { type: "string" },
          position: { type: "integer" },
          statuses: { type: "array", items: { type: "string", enum: ["pending", "in_progress", "done"] } },
          isDone: { type: "boolean" },
        },
      },
      BoardConfiguration: {
        type: "object",
        properties: {
          boardId: { type: "integer" },
          columns: { type: "array", items: { $ref: "#/components/schemas/BoardColumn" } },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "integer" },
          key: { type: "string", example: "KAN-1" },
          boardId: { type: "integer" },
          title: { type: "string", maxLength: 30 },
          description: { type: "string", maxLength: 500, nullable: true },
          assignee: { type: "string", nullable: true },
          status: { type: "string", enum: ["pending", "in_progress", "done"] },
          priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
          taskType: { type: "string", enum: ["bug", "task", "story", "subtask"] },
          dueDate: { type: "string", nullable: true },
          rank: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      BoardTasksResponse: {
        type: "object",
        properties: {
          startAt: { type: "integer" },
          maxResults: { type: "integer" },
          total: { type: "integer" },
          tasks: { type: "array", items: { $ref: "#/components/schemas/Task" } },
        },
      },
      CreateTask: {
        type: "object",
        required: ["boardId", "title"],
        properties: {
          boardId: { type: "integer" },
          title: { type: "string", minLength: 1, maxLength: 30 },
          description: { type: "string", maxLength: 500 },
          assignee: { type: "string" },
          status: { type: "string", enum: ["pending", "in_progress", "done"], default: "pending" },
          priority: { type: "string", enum: ["critical", "high", "medium", "low"], default: "medium" },
          taskType: { type: "string", enum: ["bug", "task", "story", "subtask"], default: "task" },
          dueDate: { type: "string" },
        },
      },
      UpdateTask: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1, maxLength: 30 },
          description: { type: "string", maxLength: 500, nullable: true },
          assignee: { type: "string", nullable: true },
        },
      },
      MoveTask: {
        type: "object",
        required: ["columnId", "targetIndex"],
        properties: {
          columnId: { type: "integer" },
          targetIndex: { type: "integer" },
          status: { type: "string", enum: ["pending", "in_progress", "done"] },
        },
      },
      Member: {
        type: "object",
        properties: {
          id: { type: "integer" },
          boardId: { type: "integer" },
          name: { type: "string" },
        },
      },
    },
  },
};

export async function registerScalar(app: FastifyInstance): Promise<void> {
  app.get("/api/openapi.json", async () => openApiSpec);

  await app.register(scalarPlugin, {
    routePrefix: "/api/docs",
    configuration: {
      url: "/api/openapi.json",
      pageTitle: "Task Manager API",
    },
  });
}
