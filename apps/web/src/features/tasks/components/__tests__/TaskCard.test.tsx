import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "@task-manager/shared";
import { TaskCard } from "@/features/tasks/components/TaskCard";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    key: "KAN-1",
    boardId: 1,
    title: "Implementar login",
    description: null,
    assignee: null,
    status: "pending",
    priority: "medium",
    taskType: "task",
    dueDate: null,
    rank: 1000,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

function renderCard(task: Task, props: { isBusy?: boolean; onDelete?: () => void; onEdit?: (t: Task) => void } = {}) {
  const onDelete = props.onDelete ?? vi.fn();
  const onEdit = props.onEdit ?? vi.fn();

  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="test-column">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <TaskCard
              task={task}
              index={0}
              isBusy={props.isBusy ?? false}
              onDelete={(id) => onDelete()}
              onEdit={onEdit}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>,
  );
}

describe("TaskCard", () => {
  let onDelete: ReturnType<typeof vi.fn>;
  let onEdit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onDelete = vi.fn();
    onEdit = vi.fn();
  });

  it("renders task title", () => {
    renderCard(makeTask());

    expect(screen.getByText("Implementar login")).toBeInTheDocument();
  });

  it("renders task key", () => {
    renderCard(makeTask({ key: "KAN-42" }));

    expect(screen.getByText("KAN-42")).toBeInTheDocument();
  });

  it("renders status badge with correct label", () => {
    renderCard(makeTask({ status: "pending" }));
    expect(screen.getByText("A Fazer")).toBeInTheDocument();
  });

  it("renders in_progress status label", () => {
    renderCard(makeTask({ status: "in_progress" }));
    expect(screen.getByText("Em Progresso")).toBeInTheDocument();
  });

  it("renders done status label", () => {
    renderCard(makeTask({ status: "done" }));
    expect(screen.getByText("Concluído")).toBeInTheDocument();
  });

  it("renders assignee avatar when assignee exists", () => {
    renderCard(makeTask({ assignee: "Ana Silva" }));

    expect(screen.getByTitle("Ana Silva")).toBeInTheDocument();
  });

  it("renders priority icon with tooltip", () => {
    renderCard(makeTask({ priority: "high" }));

    expect(screen.getByTitle("High")).toBeInTheDocument();
  });

  it("renders task type icon with tooltip", () => {
    renderCard(makeTask({ taskType: "bug" }));

    expect(screen.getByTitle("bug")).toBeInTheDocument();
  });

  it("renders due date when present", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    renderCard(makeTask({ dueDate: dateStr }));

    expect(screen.getByText("Amanhã")).toBeInTheDocument();
  });

  it("does not render due date when absent", () => {
    renderCard(makeTask({ dueDate: null }));

    expect(screen.queryByText("Hoje")).not.toBeInTheDocument();
    expect(screen.queryByText("Amanhã")).not.toBeInTheDocument();
  });

  it("calls onEdit when card is clicked", () => {
    const task = makeTask();
    renderCard(task, { onEdit });

    fireEvent.click(screen.getByTestId("task-card-1"));

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it("calls onDelete when delete button is clicked", () => {
    renderCard(makeTask(), { onDelete });

    const deleteButton = screen.getByTitle("Excluir");
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("delete button does not trigger onEdit", () => {
    renderCard(makeTask(), { onDelete, onEdit });

    const deleteButton = screen.getByTitle("Excluir");
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("has correct test-id based on task id", () => {
    renderCard(makeTask({ id: 42 }));

    expect(screen.getByTestId("task-card-42")).toBeInTheDocument();
  });

  it("handles unknown status gracefully with fallback", () => {
    renderCard(makeTask({ status: "unknown_status" as any }));

    expect(screen.getByText("unknown_status")).toBeInTheDocument();
  });
});
