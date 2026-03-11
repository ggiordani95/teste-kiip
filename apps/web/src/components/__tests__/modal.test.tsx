import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Modal } from "@/components/Modal/Modal";

describe("Modal", () => {
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
  });

  it("renders title", () => {
    render(<Modal title="Test Title" onClose={onClose}>Content</Modal>);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Modal title="Title" onClose={onClose}><p>Hello</p></Modal>);

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("calls onClose on Escape key", () => {
    render(<Modal title="Title" onClose={onClose}>Content</Modal>);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders close button", () => {
    render(<Modal title="Title" onClose={onClose}>Content</Modal>);

    // The X button should be present
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
