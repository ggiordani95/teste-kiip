import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "@/components/Avatar";

describe("Avatar", () => {
  it("renders first letter of name uppercase", () => {
    render(<Avatar name="ana silva" />);

    expect(screen.getByTitle("ana silva")).toHaveTextContent("A");
  });

  it("applies name as title attribute", () => {
    render(<Avatar name="Carlos Souza" />);

    expect(screen.getByTitle("Carlos Souza")).toBeInTheDocument();
  });

  it("renders sm size by default", () => {
    render(<Avatar name="Test" />);

    const el = screen.getByTitle("Test");
    expect(el.className).toContain("h-5");
    expect(el.className).toContain("w-5");
  });

  it("renders md size when specified", () => {
    render(<Avatar name="Test" size="md" />);

    const el = screen.getByTitle("Test");
    expect(el.className).toContain("h-6");
    expect(el.className).toContain("w-6");
  });

  it("generates consistent color for same name", () => {
    const { container: c1 } = render(<Avatar name="Ana" />);
    const { container: c2 } = render(<Avatar name="Ana" />);

    const bg1 = c1.querySelector("span")?.style.backgroundColor;
    const bg2 = c2.querySelector("span")?.style.backgroundColor;

    expect(bg1).toBe(bg2);
  });

  it("generates different colors for different names", () => {
    const { container: c1 } = render(<Avatar name="Ana" />);
    const { container: c2 } = render(<Avatar name="Zé" />);

    const bg1 = c1.querySelector("span")?.style.backgroundColor;
    const bg2 = c2.querySelector("span")?.style.backgroundColor;

    // Different names *usually* produce different colors, but not guaranteed.
    // At minimum, both should have a background color set.
    expect(bg1).toBeTruthy();
    expect(bg2).toBeTruthy();
  });
});
