import type { TaskStatus } from "@task-manager/shared";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "./TaskCard";
import styles from "./TaskList.module.css";

interface Props {
  status?: TaskStatus;
}

export function TaskList({ status }: Props) {
  const { data: tasks, isLoading, isError, error } = useTasks(status);

  if (isLoading) {
    return <p className={styles.message}>Carregando tarefas...</p>;
  }

  if (isError) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Erro ao carregar tarefas: {error.message}
      </p>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className={styles.message}>
        Nenhuma tarefa encontrada.
      </p>
    );
  }

  return (
    <div className={styles.list}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
