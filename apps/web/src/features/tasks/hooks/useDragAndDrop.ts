"use client";

import type { DropResult } from "@hello-pangea/dnd";
import type { BoardConfiguration } from "@task-manager/shared";
import { useCallback } from "react";
import { useMoveTask } from "./useTaskMutations";

export function useDragAndDrop(boardId: number, configuration: BoardConfiguration) {
  const moveMutation = useMoveTask(boardId);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const taskId = Number(draggableId);
      const destColumn = configuration.columns.find(
        (column) => String(column.id) === destination.droppableId,
      );

      if (!destColumn) return;

      const isCrossColumn = source.droppableId !== destination.droppableId;

      await moveMutation.mutateAsync({
        taskId,
        input: {
          columnId: destColumn.id,
          targetIndex: destination.index,
          status: isCrossColumn ? destColumn.statuses[0] : undefined,
        },
        targetStatus: destColumn.statuses[0],
      });
    },
    [configuration.columns, moveMutation],
  );

  return { isBusy: moveMutation.isPending, handleDragEnd };
}
