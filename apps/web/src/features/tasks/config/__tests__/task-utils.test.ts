import { describe, expect, it, vi } from "vitest";
import { formatDueDate, snapshotStyle } from "@/features/tasks/config/task-utils";

describe("formatDueDate", () => {
  it("returns 'Hoje' for today's date", () => {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    expect(formatDueDate(dateStr)).toBe("Hoje");
  });

  it("returns 'Amanhã' for tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    expect(formatDueDate(dateStr)).toBe("Amanhã");
  });

  it("returns 'Ontem' for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    expect(formatDueDate(dateStr)).toBe("Ontem");
  });

  it("returns formatted date for other dates", () => {
    const result = formatDueDate("2025-06-15");

    expect(result).toMatch(/15/);
    expect(result).toMatch(/jun/i);
  });
});

describe("snapshotStyle", () => {
  it("returns willChange transform when style is undefined", () => {
    expect(snapshotStyle(undefined)).toEqual({ willChange: "transform" });
  });

  it("strips transition properties from style", () => {
    const result = snapshotStyle({
      transform: "translate(0, 100px)",
      transitionDuration: "0.2s",
      transitionTimingFunction: "ease",
      transitionDelay: "0s",
    });

    expect(result.willChange).toBe("transform");
    expect(result.transform).toBe("translate(0, 100px)");
    expect(result).not.toHaveProperty("transitionDuration");
    expect(result).not.toHaveProperty("transitionTimingFunction");
    expect(result).not.toHaveProperty("transitionDelay");
  });

  it("applies drop animation transition when isDropAnimating", () => {
    const result = snapshotStyle({ transform: "translate(0, 0)" }, true);

    expect(result.transition).toBe("transform 180ms cubic-bezier(0.2, 0, 0, 1)");
  });

  it("preserves existing transition when not drop animating", () => {
    const result = snapshotStyle(
      { transform: "translate(0, 0)", transition: "opacity 200ms" },
      false,
    );

    expect(result.transition).toBe("opacity 200ms");
  });
});
