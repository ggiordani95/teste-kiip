import type { FastifyRequest, FastifyReply } from "fastify";
import { TaskService } from "../services/task.service.js";

export class TaskController {
  constructor(private readonly service: TaskService) {}

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const tasks = this.service.getTasks(req.query);
    return reply.send(tasks);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const task = this.service.createTask(req.body);
    return reply.status(201).send(task);
  };

  update = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const id = Number(req.params.id);
    const task = this.service.updateTask(id, req.body);
    return reply.send(task);
  };

  remove = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const id = Number(req.params.id);
    this.service.deleteTask(id);
    return reply.status(204).send();
  };
}
