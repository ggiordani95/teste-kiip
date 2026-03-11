"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import type { BoardConfiguration, Member, Task } from "@task-manager/shared";
import { useCallback } from "react";
import { groupTasksByColumns } from "../utils/group-tasks";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { useDeleteTask } from "../hooks/useTaskMutations";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  boardId: number;
  configuration: BoardConfiguration;
  tasks: Task[];
  members: Member[];
}

export function KanbanBoard({ boardId, configuration, tasks, members }: KanbanBoardProps) {
  const { isBusy, handleDragEnd } = useDragAndDrop(boardId, configuration);
  const deleteMutation = useDeleteTask(boardId);
  const columns = groupTasksByColumns(configuration.columns, tasks);

  const handleDelete = useCallback(
    (taskId: number) => deleteMutation.mutate(taskId),
    [deleteMutation],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex items-start gap-4" data-testid="kanban-board">
        {columns.map(({ column, tasks: columnTasks }) => (
          <KanbanColumn
            key={column.id}
            boardId={boardId}
            column={column}
            tasks={columnTasks}
            members={members}
            isBusy={isBusy || deleteMutation.isPending}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
