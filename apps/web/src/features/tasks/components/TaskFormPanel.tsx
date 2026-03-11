"use client";

import type { Member, Task, TaskStatus } from "@task-manager/shared";
import { Modal } from "@/components";
import { useTaskForm } from "../hooks/useTaskForm";
import { MemberSelect } from "./MemberSelect";

type CreateProps = { mode: "create"; boardId: number; status: TaskStatus };
type EditProps = { mode: "edit"; task: Task };

export type TaskFormPanelProps = (CreateProps | EditProps) & {
  members: Member[];
  onClose: () => void;
};

export function TaskFormPanel(props: TaskFormPanelProps) {
  const { members, onClose, ...formProps } = props;
  const form = useTaskForm({ ...formProps, onClose });

  const title = form.isEdit ? "Editar tarefa" : "Nova tarefa";
  const submitLabel = form.isEdit
    ? form.isPending ? "Salvando..." : "Salvar"
    : form.isPending ? "Criando..." : "Criar tarefa";

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={form.handleSubmit} className="flex flex-col gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="task-title" className="text-[12px] font-medium text-text-secondary">
              Titulo *
            </label>
            <span className={`text-[11px] ${form.title.length > 30 ? "text-tag-red" : "text-text-muted"}`}>
              {form.title.length}/30
            </span>
          </div>
          <input
            ref={form.titleRef}
            id="task-title"
            type="text"
            className="w-full rounded border border-border bg-transparent px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            placeholder="Digite o titulo da tarefa..."
            value={form.title}
            onChange={(e) => form.setTitle(e.target.value)}
            maxLength={30}
            required
            data-testid="modal-task-title"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="task-description" className="text-[12px] font-medium text-text-secondary">
              Descricao
            </label>
            <span className={`text-[11px] ${form.description.length > 500 ? "text-tag-red" : "text-text-muted"}`}>
              {form.description.length}/500
            </span>
          </div>
          <textarea
            id="task-description"
            className="h-72 w-full resize-none rounded border border-border bg-transparent px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            placeholder="Descreva a tarefa (opcional)"
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            data-testid="modal-task-description"
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-medium text-text-secondary">
            Responsável
          </label>
          <MemberSelect
            value={form.assignee}
            members={members}
            onChange={form.setAssignee}
          />
        </div>

        <div className="mt-1 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded px-3 py-2 text-[13px] text-text-muted transition hover:text-text-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded bg-accent px-4 py-2 text-[13px] font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
            disabled={!form.canSubmit}
            data-testid="modal-submit-task"
          >
            {submitLabel}
          </button>
        </div>

        {form.isError && (
          <p className="text-[12px] text-tag-red">Erro: {form.error?.message}</p>
        )}
      </form>
    </Modal>
  );
}
