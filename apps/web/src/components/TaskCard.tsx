import type { Task, TaskStatus } from "@task-manager/shared";
import { TASK_STATUSES } from "@task-manager/shared";
import { useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import styles from "./TaskCard.module.css";

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em Andamento",
  done: "Concluida",
};

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMutation.mutate({
      id: task.id,
      input: { status: e.target.value as TaskStatus },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      deleteMutation.mutate(task.id);
    }
  };

  const isLoading = updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className={`${styles.card} ${isLoading ? styles.loading : ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={`${styles.badge} ${styles[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      {task.assignee && (
        <p className={styles.assignee}>
          Responsavel: <strong>{task.assignee}</strong>
        </p>
      )}

      <div className={styles.footer}>
        <select
          className={styles.select}
          value={task.status}
          onChange={handleStatusChange}
          disabled={isLoading}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={isLoading}
        >
          {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>

      {(updateMutation.isError || deleteMutation.isError) && (
        <p className={styles.error}>
          Erro: {(updateMutation.error || deleteMutation.error)?.message}
        </p>
      )}
    </div>
  );
}
