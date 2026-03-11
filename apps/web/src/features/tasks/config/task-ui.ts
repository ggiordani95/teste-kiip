import {
  BookOpenText,
  Bug,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ChevronsUp,
  Minus,
  type LucideIcon,
  SplitSquareVertical,
} from "lucide-react";
import type { TaskPriority, TaskStatus, TaskType } from "@task-manager/shared";

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "A Fazer", color: "#5E6C84", bg: "#DFE1E6" },
  in_progress: { label: "Em Progresso", color: "#0052CC", bg: "#DEEBFF" },
  done: { label: "Concluído", color: "#006644", bg: "#E3FCEF" },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { color: string; icon: LucideIcon; label: string }
> = {
  critical: { icon: ChevronsUp, color: "#FF5630", label: "Critical" },
  high: { icon: ChevronUp, color: "#FF5630", label: "High" },
  medium: { icon: Minus, color: "#FF991F", label: "Medium" },
  low: { icon: ChevronDown, color: "#0065FF", label: "Low" },
};

export const TYPE_CONFIG: Record<TaskType, { color: string; icon: LucideIcon; label: string }> = {
  bug: { icon: Bug, color: "#FF5630", label: "Bug" },
  task: { icon: CheckSquare, color: "#0065FF", label: "Task" },
  story: { icon: BookOpenText, color: "#36B37E", label: "Story" },
  subtask: { icon: SplitSquareVertical, color: "#6554C0", label: "Subtask" },
};

