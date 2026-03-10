import { useState } from "react";
import type { TaskStatus } from "@task-manager/shared";
import { StatusFilter } from "./components/StatusFilter";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import styles from "./App.module.css";

export default function App() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Task Manager</h1>
        <p className={styles.subtitle}>Gerencie as tarefas do seu time</p>
      </header>

      <main className={styles.main}>
        <TaskForm />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tarefas</h2>
            <StatusFilter current={statusFilter} onChange={setStatusFilter} />
          </div>
          <TaskList status={statusFilter} />
        </section>
      </main>
    </div>
  );
}
