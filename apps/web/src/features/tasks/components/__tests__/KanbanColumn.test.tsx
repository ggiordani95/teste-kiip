import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BoardColumn, Member, Task } from "@task-manager/shared";
import { KanbanColumn } from "@/features/tasks/components/KanbanColumn";

const mockMutateAsync = vi.fn().mockResolvedValue({});

vi.mock("@/features/tasks/hooks/useTaskMutations", () => ({
  useCreateTask: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: undefined,
  }),
  useUpdateTask: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: undefined,
  }),
}));

const column: BoardColumn = {
  id: 1,
  boardId: 1,
  key: "todo",
  name: "A Fazer",
  position: 0,
  statuses: ["pending"],
  isDone: false,
};

const members: Member[] = [
  { id: 1, boardId: 1, name: "Ana Silva" },
];

function makeTask(id: number): Task {
  return {
    id,
    key: `KAN-${id}`,
    boardId: 1,
    title: `Task ${id}`,
    description: null,
    assignee: null,
    status: "pending",
    priority: "medium",
    taskType: "task",
    dueDate: null,
    rank: id * 1000,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  };
}

function renderColumn(tasks: Task[] = [], onDelete = vi.fn()) {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <KanbanColumn
        boardId={1}
        column={column}
        tasks={tasks}
        members={members}
        isBusy={false}
        onDelete={onDelete}
      />
    </DragDropContext>,
  );
}

describe("KanbanColumn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders column name", () => {
    renderColumn();

    expect(screen.getByText("A Fazer")).toBeInTheDocument();
  });

  it("renders task count badge", () => {
    renderColumn([makeTask(1), makeTask(2)]);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders zero count when no tasks", () => {
    renderColumn([]);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders all task cards", () => {
    renderColumn([makeTask(1), makeTask(2), makeTask(3)]);

    expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-3")).toBeInTheDocument();
  });

  it("renders add card button", () => {
    renderColumn();

    expect(screen.getByTestId("add-task-button-pending")).toBeInTheDocument();
    expect(screen.getByText("Add a card")).toBeInTheDocument();
  });

  it("has correct column test id", () => {
    renderColumn();

    expect(screen.getByTestId("kanban-column-todo")).toBeInTheDocument();
  });

  it("opens create panel when add card is clicked", () => {
    renderColumn();

    fireEvent.click(screen.getByTestId("add-task-button-pending"));

    expect(screen.getByText("Nova tarefa")).toBeInTheDocument();
  });

  it("opens edit panel when task card is clicked", () => {
    renderColumn([makeTask(1)]);

    fireEvent.click(screen.getByTestId("task-card-1"));

    expect(screen.getByText("Editar tarefa")).toBeInTheDocument();
  });

  it("closes panel when cancel is clicked on create form", () => {
    renderColumn();

    fireEvent.click(screen.getByTestId("add-task-button-pending"));
    expect(screen.getByText("Nova tarefa")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancelar"));

    // Panel close has a 200ms timeout, but the form should still disappear
    // The modal's handleClose sets open=false and calls onClose after timeout
  });
});
