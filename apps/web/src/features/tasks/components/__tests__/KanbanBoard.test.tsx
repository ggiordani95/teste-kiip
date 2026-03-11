import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BoardConfiguration, Member, Task } from "@task-manager/shared";
import { KanbanBoard } from "@/features/tasks/components/KanbanBoard";

const mockMutate = vi.fn();
const mockMutateAsync = vi.fn().mockResolvedValue({});

vi.mock("@/features/tasks/hooks/useTaskMutations", () => ({
  useMoveTask: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
  useDeleteTask: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
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

const configuration: BoardConfiguration = {
  boardId: 1,
  columns: [
    { id: 1, boardId: 1, key: "todo", name: "A Fazer", position: 0, statuses: ["pending"], isDone: false },
    { id: 2, boardId: 1, key: "in-progress", name: "Em Progresso", position: 1, statuses: ["in_progress"], isDone: false },
    { id: 3, boardId: 1, key: "done", name: "Concluído", position: 2, statuses: ["done"], isDone: true },
  ],
};

const members: Member[] = [
  { id: 1, boardId: 1, name: "Ana Silva" },
];

function makeTask(id: number, status: "pending" | "in_progress" | "done"): Task {
  return {
    id,
    key: `KAN-${id}`,
    boardId: 1,
    title: `Task ${id}`,
    description: null,
    assignee: null,
    status,
    priority: "medium",
    taskType: "task",
    dueDate: null,
    rank: id * 1000,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  };
}

describe("KanbanBoard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders kanban board container", () => {
    render(
      <KanbanBoard boardId={1} configuration={configuration} tasks={[]} members={members} />,
    );

    expect(screen.getByTestId("kanban-board")).toBeInTheDocument();
  });

  it("renders all three columns", () => {
    render(
      <KanbanBoard boardId={1} configuration={configuration} tasks={[]} members={members} />,
    );

    expect(screen.getByTestId("kanban-column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("kanban-column-in-progress")).toBeInTheDocument();
    expect(screen.getByTestId("kanban-column-done")).toBeInTheDocument();
  });

  it("renders column names", () => {
    render(
      <KanbanBoard boardId={1} configuration={configuration} tasks={[]} members={members} />,
    );

    expect(screen.getByText("A Fazer")).toBeInTheDocument();
    expect(screen.getByText("Em Progresso")).toBeInTheDocument();
    expect(screen.getByText("Concluído")).toBeInTheDocument();
  });

  it("distributes tasks to correct columns", () => {
    const tasks = [
      makeTask(1, "pending"),
      makeTask(2, "in_progress"),
      makeTask(3, "done"),
    ];

    render(
      <KanbanBoard boardId={1} configuration={configuration} tasks={tasks} members={members} />,
    );

    expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-3")).toBeInTheDocument();
  });

  it("renders add card button for each column", () => {
    render(
      <KanbanBoard boardId={1} configuration={configuration} tasks={[]} members={members} />,
    );

    expect(screen.getByTestId("add-task-button-pending")).toBeInTheDocument();
    expect(screen.getByTestId("add-task-button-in_progress")).toBeInTheDocument();
    expect(screen.getByTestId("add-task-button-done")).toBeInTheDocument();
  });

  it("renders with empty tasks", () => {
    render(
      <KanbanBoard boardId={1} configuration={configuration} tasks={[]} members={members} />,
    );

    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(3);
  });

  it("shows multiple tasks in same column", () => {
    const tasks = [
      makeTask(1, "pending"),
      makeTask(2, "pending"),
      makeTask(3, "pending"),
    ];

    render(
      <KanbanBoard boardId={1} configuration={configuration} tasks={tasks} members={members} />,
    );

    expect(screen.getByText("3")).toBeInTheDocument(); // count badge
    expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-3")).toBeInTheDocument();
  });
});
