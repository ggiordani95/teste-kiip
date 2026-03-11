"use client";

import type { Task, TaskStatus } from "@task-manager/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCreateTask, useUpdateTask } from "./useTaskMutations";

type CreateMode = { mode: "create"; boardId: number; status: TaskStatus };
type EditMode = { mode: "edit"; task: Task };

type UseTaskFormOptions = (CreateMode | EditMode) & { onClose: () => void };

export function useTaskForm(options: UseTaskFormOptions) {
  const isEdit = options.mode === "edit";
  const task = isEdit ? options.task : null;

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignee, setAssignee] = useState(task?.assignee ?? "");
  const titleRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask(isEdit ? options.task.boardId : 0);
  const mutation = isEdit ? updateMutation : createMutation;

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      if (isEdit) {
        await updateMutation.mutateAsync({
          taskId: options.task.id,
          input: {
            title: title.trim(),
            description: description.trim() || null,
            assignee: assignee || null,
          },
        });
      } else {
        await createMutation.mutateAsync({
          boardId: options.boardId,
          status: options.status,
          title: title.trim(),
          description: description.trim() || undefined,
          assignee: assignee || undefined,
        });
      }

      options.onClose();
    },
    [isEdit, title, description, assignee, createMutation, updateMutation, options],
  );

  const canSubmit = title.trim().length > 0 && title.length <= 30 && description.length <= 500 && !mutation.isPending;

  return {
    isEdit,
    titleRef,
    title,
    setTitle,
    description,
    setDescription,
    assignee,
    setAssignee,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    canSubmit,
    handleSubmit,
  };
}
