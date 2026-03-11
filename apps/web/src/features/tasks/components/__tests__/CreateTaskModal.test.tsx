import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskFormPanel } from "@/features/tasks/components/TaskFormPanel";

const mockCreateMutateAsync = vi.fn().mockResolvedValue({});
const mockUpdateMutateAsync = vi.fn().mockResolvedValue({});

vi.mock("@/features/tasks/hooks/useTaskMutations", () => ({
  useCreateTask: () => ({
    mutateAsync: mockCreateMutateAsync,
    isPending: false,
    isError: false,
    error: undefined,
  }),
  useUpdateTask: () => ({
    mutateAsync: mockUpdateMutateAsync,
    isPending: false,
    isError: false,
    error: undefined,
  }),
}));

const members = [
  { id: 1, boardId: 1, name: "Ana Silva" },
  { id: 2, boardId: 1, name: "Carlos Souza" },
  { id: 3, boardId: 1, name: "Marina Santos" },
];

const existingTask = {
  id: 10,
  key: "KAN-10",
  boardId: 1,
  title: "Task existente",
  description: "Descricao existente",
  assignee: "Ana Silva",
  status: "pending" as const,
  priority: "medium" as const,
  taskType: "task" as const,
  dueDate: null,
  rank: 1000,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

describe("TaskFormPanel", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Create mode ---

  describe("create mode", () => {
    it("renders the form with title, description, and assignee fields", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      expect(screen.getByTestId("modal-task-title")).toBeInTheDocument();
      expect(screen.getByTestId("modal-task-description")).toBeInTheDocument();
      expect(screen.getByTestId("modal-task-assignee")).toBeInTheDocument();
    });

    it("shows 'Nova tarefa' title and 'Criar tarefa' button", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      expect(screen.getByText("Nova tarefa")).toBeInTheDocument();
      expect(screen.getByTestId("modal-submit-task")).toHaveTextContent("Criar tarefa");
    });

    it("shows board members in the assignee dropdown", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      const trigger = screen.getByTestId("modal-task-assignee").querySelector("button")!;
      fireEvent.click(trigger);

      expect(screen.getByText("Ana Silva")).toBeInTheDocument();
      expect(screen.getByText("Carlos Souza")).toBeInTheDocument();
      expect(screen.getByText("Marina Santos")).toBeInTheDocument();
    });

    it("submit button is disabled when title is empty", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      expect(screen.getByTestId("modal-submit-task")).toBeDisabled();
    });

    it("submit button is enabled when title has content", async () => {
      const user = userEvent.setup();
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      await user.type(screen.getByTestId("modal-task-title"), "Nova task");

      expect(screen.getByTestId("modal-submit-task")).toBeEnabled();
    });

    it("calls createTask mutation on submit", async () => {
      const user = userEvent.setup();
      render(
        <TaskFormPanel mode="create" boardId={1} status="in_progress" members={members} onClose={onClose} />,
      );

      await user.type(screen.getByTestId("modal-task-title"), "Minha task");
      await user.type(screen.getByTestId("modal-task-description"), "Descricao da task");
      fireEvent.submit(screen.getByTestId("modal-submit-task").closest("form")!);

      expect(mockCreateMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          boardId: 1,
          status: "in_progress",
          title: "Minha task",
          description: "Descricao da task",
        }),
      );
    });

    it("shows character counter for title", async () => {
      const user = userEvent.setup();
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      expect(screen.getByText("0/30")).toBeInTheDocument();

      await user.type(screen.getByTestId("modal-task-title"), "Hello");

      expect(screen.getByText("5/30")).toBeInTheDocument();
    });

    it("enforces maxLength on title input", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      expect(screen.getByTestId("modal-task-title")).toHaveAttribute("maxLength", "30");
    });

    it("enforces maxLength on description textarea", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      expect(screen.getByTestId("modal-task-description")).toHaveAttribute("maxLength", "500");
    });
  });

  // --- Edit mode ---

  describe("edit mode", () => {
    it("shows 'Editar tarefa' title and 'Salvar' button", () => {
      render(
        <TaskFormPanel mode="edit" task={existingTask} members={members} onClose={onClose} />,
      );

      expect(screen.getByText("Editar tarefa")).toBeInTheDocument();
      expect(screen.getByTestId("modal-submit-task")).toHaveTextContent("Salvar");
    });

    it("pre-fills form with existing task data", () => {
      render(
        <TaskFormPanel mode="edit" task={existingTask} members={members} onClose={onClose} />,
      );

      expect(screen.getByTestId("modal-task-title")).toHaveValue("Task existente");
      expect(screen.getByTestId("modal-task-description")).toHaveValue("Descricao existente");
    });

    it("calls updateTask mutation on submit", async () => {
      const user = userEvent.setup();
      render(
        <TaskFormPanel mode="edit" task={existingTask} members={members} onClose={onClose} />,
      );

      const titleInput = screen.getByTestId("modal-task-title");
      await user.clear(titleInput);
      await user.type(titleInput, "Titulo editado");
      fireEvent.submit(screen.getByTestId("modal-submit-task").closest("form")!);

      expect(mockUpdateMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 10,
          input: expect.objectContaining({ title: "Titulo editado" }),
        }),
      );
    });

    it("shows current character count for pre-filled title", () => {
      render(
        <TaskFormPanel mode="edit" task={existingTask} members={members} onClose={onClose} />,
      );

      expect(screen.getByText(`${existingTask.title.length}/30`)).toBeInTheDocument();
    });
  });

  // --- Shared behavior ---

  describe("shared behavior", () => {
    it("closes on cancel click", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      fireEvent.click(screen.getByText("Cancelar"));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes on Escape key", () => {
      render(
        <TaskFormPanel mode="create" boardId={1} status="pending" members={members} onClose={onClose} />,
      );

      fireEvent.keyDown(window, { key: "Escape" });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
