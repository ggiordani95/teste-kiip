import type { CSSProperties } from "react";

export function formatDueDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function snapshotStyle(
  style: CSSProperties | undefined,
  isDropAnimating = false,
): CSSProperties {
  if (!style) {
    return { willChange: "transform" };
  }

  const {
    transitionDuration: _transitionDuration,
    transitionTimingFunction: _transitionTimingFunction,
    transitionDelay: _transitionDelay,
    ...nextStyle
  } = style;

  return {
    ...nextStyle,
    willChange: "transform",
    transition: isDropAnimating
      ? "transform 180ms cubic-bezier(0.2, 0, 0, 1)"
      : nextStyle.transition,
  };
}
