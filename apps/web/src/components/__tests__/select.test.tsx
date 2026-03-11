import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Select, type SelectOption } from "@/components/Select";

const options: SelectOption[] = [
  { value: "", label: "None" },
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("Select", () => {
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChange = vi.fn();
  });

  it("renders placeholder when no value selected", () => {
    const opts: SelectOption[] = [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
    ];
    render(<Select value="" options={opts} placeholder="Pick one" onChange={onChange} />);

    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("renders selected option label", () => {
    render(<Select value="a" options={options} onChange={onChange} />);

    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    render(<Select value="" options={options} onChange={onChange} />);

    expect(screen.queryByText("Option A")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("calls onChange when option is selected", () => {
    render(<Select value="" options={options} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Option B"));

    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("closes dropdown after selecting an option", () => {
    render(<Select value="" options={options} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Option A"));

    // Dropdown should be closed — Option B should not be visible
    expect(screen.queryByText("Option B")).not.toBeInTheDocument();
  });

  it("toggles dropdown on repeated clicks", () => {
    render(<Select value="" options={options} onChange={onChange} />);
    const trigger = screen.getByRole("button");

    fireEvent.click(trigger);
    expect(screen.getByText("Option A")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByText("Option A")).not.toBeInTheDocument();
  });

  it("renders data-testid when provided", () => {
    render(<Select value="" options={options} onChange={onChange} data-testid="my-select" />);

    expect(screen.getByTestId("my-select")).toBeInTheDocument();
  });

  it("shows default placeholder when none provided", () => {
    render(<Select value="" options={[{ value: "x", label: "X" }]} onChange={onChange} />);

    expect(screen.getByText("Selecione...")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <Select value="" options={options} onChange={onChange} />
        <button type="button" data-testid="outside">Outside</button>
      </div>,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Option A")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("Option A")).not.toBeInTheDocument();
  });
});
