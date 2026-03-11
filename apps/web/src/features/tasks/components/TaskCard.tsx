"use client";

import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@task-manager/shared";
import { CalendarDays, Trash2 } from "lucide-react";
import { Avatar } from "@/components";
import { PRIORITY_CONFIG, STATUS_CONFIG, TYPE_CONFIG } from "../config/task-ui";
import { formatDueDate, snapshotStyle } from "../config/task-utils";

interface TaskCardProps {
  task: Task;
  index: number;
  isBusy: boolean;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, index, isBusy, onDelete, onEdit }: TaskCardProps) {
  const status = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] ?? {
    label: task.status,
    color: "#5E6C84",
    bg: "#DFE1E6",
  };
  const priority = PRIORITY_CONFIG[task.priority];
  const type = TYPE_CONFIG[task.taskType];
  const PriorityIcon = priority.icon;
  const TypeIcon = type.icon;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={String(task.id)} index={index} isDragDisabled={isBusy}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative min-w-0 select-none rounded-md bg-surface p-2.5 transition-[box-shadow,transform] duration-200 ease-out cursor-pointer ${
            snapshot.isDragging
              ? "rotate-[2deg] shadow-[0_8px_16px_#091E4240]"
              : "shadow-[0_1px_2px_#091E4225] hover:shadow-[0_2px_4px_#091E4240]"
          }`}
          style={snapshotStyle(provided.draggableProps.style, snapshot.isDropAnimating)}
          data-testid={`task-card-${task.id}`}
          onClick={() => {
            if (!snapshot.isDragging) onEdit(task);
          }}
        >
          <div className="mb-1 flex items-center">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ color: status.color, backgroundColor: status.bg }}
            >
              {status.label}
            </span>
          </div>

          <p className="pl-1 text-md leading-snug text-text-primary">{task.title}</p>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="flex h-5 w-5 items-center justify-center rounded text-[11px]"
                style={{ color: type.color }}
                title={task.taskType}
              >
                <TypeIcon className="h-4 w-4" />
              </span>

              <span className="text-[11px] text-text-muted">{task.key}</span>

              <span
                className="flex items-center"
                style={{ color: priority.color }}
                title={priority.label}
              >
                <PriorityIcon className="h-3.5 w-3.5" />
              </span>

              {task.dueDate && (
                <span
                  className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-medium ${
                    isOverdue ? "bg-tag-red/10 text-tag-red" : "bg-border text-text-secondary"
                  }`}
                >
                  <CalendarDays className="h-2.5 w-2.5" />
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            {task.assignee ? (
              <Avatar name={task.assignee} size="md" />
            ) : (
              <div />
            )}
          </div>

          {!snapshot.isDragging && (
            <button
              type="button"
              className="absolute top-1.5 right-1.5 hidden rounded bg-surface p-1 text-text-muted shadow-[0_1px_4px_#091E4240] hover:text-tag-red group-hover:block"
              title="Excluir"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(task.id);
              }}
              disabled={isBusy}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </article>
      )}
    </Draggable>
  );
}
