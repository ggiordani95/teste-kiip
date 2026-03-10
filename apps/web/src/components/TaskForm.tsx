import { useState } from "react";
import { useCreateTask } from "../hooks/useTasks";
import styles from "./TaskForm.module.css";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const mutation = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    mutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        assignee: assignee.trim() || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setAssignee("");
        },
      },
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Nova Tarefa</h2>

      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          placeholder="Titulo da tarefa *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Responsavel"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Descricao (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <button
        className={styles.submit}
        type="submit"
        disabled={mutation.isPending || !title.trim()}
      >
        {mutation.isPending ? "Criando..." : "Criar Tarefa"}
      </button>

      {mutation.isError && (
        <p className={styles.error}>
          Erro: {mutation.error.message}
        </p>
      )}
    </form>
  );
}
