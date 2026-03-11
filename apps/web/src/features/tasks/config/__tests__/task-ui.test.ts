import { describe, expect, it } from "vitest";
import { PRIORITY_CONFIG, STATUS_CONFIG, TYPE_CONFIG } from "@/features/tasks/config/task-ui";

describe("STATUS_CONFIG", () => {
  it("has all three statuses", () => {
    expect(Object.keys(STATUS_CONFIG)).toEqual(["pending", "in_progress", "done"]);
  });

  it("pending maps to 'A Fazer'", () => {
    expect(STATUS_CONFIG.pending.label).toBe("A Fazer");
  });

  it("in_progress maps to 'Em Progresso'", () => {
    expect(STATUS_CONFIG.in_progress.label).toBe("Em Progresso");
  });

  it("done maps to 'Concluído'", () => {
    expect(STATUS_CONFIG.done.label).toBe("Concluído");
  });

  it("all statuses have color and bg", () => {
    for (const config of Object.values(STATUS_CONFIG)) {
      expect(config.color).toBeTruthy();
      expect(config.bg).toBeTruthy();
    }
  });
});

describe("PRIORITY_CONFIG", () => {
  it("has all four priorities", () => {
    expect(Object.keys(PRIORITY_CONFIG)).toEqual(["critical", "high", "medium", "low"]);
  });

  it("all priorities have icon, color, and label", () => {
    for (const config of Object.values(PRIORITY_CONFIG)) {
      expect(config.icon).toBeDefined();
      expect(config.color).toBeTruthy();
      expect(config.label).toBeTruthy();
    }
  });
});

describe("TYPE_CONFIG", () => {
  it("has all four task types", () => {
    expect(Object.keys(TYPE_CONFIG)).toEqual(["bug", "task", "story", "subtask"]);
  });

  it("all types have icon, color, and label", () => {
    for (const config of Object.values(TYPE_CONFIG)) {
      expect(config.icon).toBeDefined();
      expect(config.color).toBeTruthy();
      expect(config.label).toBeTruthy();
    }
  });
});
