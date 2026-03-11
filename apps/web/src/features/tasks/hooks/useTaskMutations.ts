"use client";

import { useCallback, useState } from "react";
import type {
  CreateTaskInput,
  MoveTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@task-manager/shared";
import { showErrorToast } from "@/components/Toast";
import * as tasksApi from "../api/tasks.api";
import { reorderTaskInCache } from "../utils/task-cache";
import { useBoardStore } from "../stores";

// --- Create ---

export function useCreateTask() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const refetchTasks = useBoardStore((s) => s.refetchTasks);
  const refetchBoards = useBoardStore((s) => s.refetchBoards);

  const mutateAsync = useCallback(
    async (input: CreateTaskInput) => {
      setIsPending(true);
      setError(null);
      try {
        const task = await tasksApi.createTask(input);
        refetchTasks(input.boardId);
        refetchBoards();
        return task;
      } catch (err) {
        setError(err as Error);
        showErrorToast("Erro ao criar tarefa.");
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [refetchTasks, refetchBoards],
  );

  return { mutateAsync, isPending, isError: error !== null, error };
}

// --- Update (optimistic) ---

export function useUpdateTask(boardId?: number) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setTasks = useBoardStore((s) => s.setTasks);
  const tasksResponse = useBoardStore((s) => s.tasksResponse);
  const refetchTasks = useBoardStore((s) => s.refetchTasks);

  const mutateAsync = useCallback(
    async ({ taskId, input }: { taskId: number; input: UpdateTaskInput }) => {
      if (boardId === undefined) return;
      setIsPending(true);
      setError(null);

      const snapshot = tasksResponse?.tasks ? [...tasksResponse.tasks] : [];

      // Optimistic update
      setTasks((tasks) => tasks.map((t) => (t.id === taskId ? { ...t, ...input } : t)));

      try {
        const result = await tasksApi.updateTask(taskId, input);
        refetchTasks(boardId);
        return result;
      } catch (err) {
        setTasks(() => snapshot);
        refetchTasks(boardId);
        setError(err as Error);
        showErrorToast("Erro ao atualizar tarefa.");
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [boardId, tasksResponse, setTasks, refetchTasks],
  );

  return { mutateAsync, isPending, isError: error !== null, error };
}

// --- Move (optimistic) ---

export function useMoveTask(boardId?: number) {
  const [isPending, setIsPending] = useState(false);
  const tasksResponse = useBoardStore((s) => s.tasksResponse);
  const refetchTasks = useBoardStore((s) => s.refetchTasks);

  const mutateAsync = useCallback(
    async ({
      taskId,
      input,
      targetStatus,
    }: {
      taskId: number;
      input: MoveTaskInput;
      targetStatus?: TaskStatus;
    }) => {
      if (boardId === undefined) return;
      setIsPending(true);

      const snapshot = tasksResponse;

      // Optimistic reorder
      const reordered = reorderTaskInCache(tasksResponse, taskId, input.targetIndex, targetStatus);
      if (reordered) {
        useBoardStore.setState({ tasksResponse: reordered });
      }

      try {
        await tasksApi.moveTask(taskId, input);
        refetchTasks(boardId);
      } catch {
        if (snapshot) {
          useBoardStore.setState({ tasksResponse: snapshot });
        }
        refetchTasks(boardId);
        showErrorToast("Erro ao mover tarefa.");
      } finally {
        setIsPending(false);
      }
    },
    [boardId, tasksResponse, refetchTasks],
  );

  return { mutateAsync, isPending };
}

// --- Delete ---

export function useDeleteTask(boardId?: number) {
  const [isPending, setIsPending] = useState(false);
  const setTasks = useBoardStore((s) => s.setTasks);
  const tasksResponse = useBoardStore((s) => s.tasksResponse);
  const refetchTasks = useBoardStore((s) => s.refetchTasks);

  const mutate = useCallback(
    (taskId: number) => {
      if (boardId === undefined) return;
      setIsPending(true);

      const snapshot = tasksResponse?.tasks ? [...tasksResponse.tasks] : [];

      // Optimistic delete
      setTasks((tasks) => tasks.filter((t) => t.id !== taskId));

      tasksApi
        .deleteTask(taskId)
        .then(() => refetchTasks(boardId))
        .catch(() => {
          setTasks(() => snapshot);
          refetchTasks(boardId);
          showErrorToast("Erro ao excluir tarefa.");
        })
        .finally(() => setIsPending(false));
    },
    [boardId, tasksResponse, setTasks, refetchTasks],
  );

  return { mutate, isPending };
}
