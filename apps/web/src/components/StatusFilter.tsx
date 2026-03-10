import type { TaskStatus } from "@task-manager/shared";
import { TASK_STATUSES } from "@task-manager/shared";
import styles from "./StatusFilter.module.css";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em Andamento",
  done: "Concluida",
};

interface Props {
  current: TaskStatus | undefined;
  onChange: (status: TaskStatus | undefined) => void;
}

export function StatusFilter({ current, onChange }: Props) {
  return (
    <div className={styles.filters}>
      <button
        className={`${styles.btn} ${current === undefined ? styles.active : ""}`}
        onClick={() => onChange(undefined)}
      >
        Todas
      </button>
      {TASK_STATUSES.map((status) => (
        <button
          key={status}
          className={`${styles.btn} ${current === status ? styles.active : ""}`}
          onClick={() => onChange(status)}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}
