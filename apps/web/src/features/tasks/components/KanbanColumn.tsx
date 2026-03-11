"use client";

import { Droppable } from "@hello-pangea/dnd";
import type { BoardColumn, Member, Task, TaskStatus } from "@task-manager/shared";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { TaskCard } from "./TaskCard";
import { TaskFormPanel } from "./TaskFormPanel";

type CreatePanel = { mode: "create"; boardId: number; status: TaskStatus; members: Member[] };
type EditPanel = { mode: "edit"; task: Task; members: Member[] };
type PanelState = CreatePanel | EditPanel | null;

interface KanbanColumnProps {
  boardId: number;
  column: BoardColumn;
  tasks: Task[];
  members: Member[];
  isBusy: boolean;
  onDelete: (taskId: number) => void;
}

export function KanbanColumn({
  boardId,
  column,
  tasks,
  members,
  isBusy,
  onDelete,
}: KanbanColumnProps) {
  const [panel, setPanel] = useState<PanelState>(null);

  const openCreate = useCallback(() => {
    setPanel({ mode: "create", boardId, status: column.statuses[0], members });
  }, [boardId, column.statuses, members]);

  const openEdit = useCallback((task: Task) => {
    setPanel({ mode: "edit", task, members });
  }, [members]);

  return (
    <>
      <section
        className="flex w-[280px] shrink-0 flex-col rounded-[10px] bg-column"
        data-testid={`kanban-column-${column.key}`}
      >
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold text-text-primary">{column.name}</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-border text-[11px] font-medium text-text-secondary">
              {tasks.length}
            </span>
          </div>
        </div>

        <Droppable droppableId={String(column.id)}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex min-h-[40px] flex-col gap-1.5 px-1.5 pb-1.5 transition-colors ${
                snapshot.isDraggingOver ? "rounded-b-[10px] bg-accent/5" : ""
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  isBusy={isBusy}
                  onDelete={onDelete}
                  onEdit={openEdit}
                />
              ))}
              {provided.placeholder}

              <button
                type="button"
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] text-text-muted transition hover:bg-column-hover hover:text-text-secondary"
                onClick={openCreate}
                data-testid={`add-task-button-${column.statuses[0]}`}
              >
                <Plus className="h-4 w-4" />
                Add a card
              </button>
            </div>
          )}
        </Droppable>
      </section>

      {panel && <TaskFormPanel {...panel} onClose={() => setPanel(null)} />}
    </>
  );
}
