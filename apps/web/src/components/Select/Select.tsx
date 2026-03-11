"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useDropdown } from "./hooks/useDropdown";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SelectProps<T extends string = string> {
  value: T;
  options: SelectOption<T>[];
  placeholder?: ReactNode;
  onChange: (value: T) => void;
  "data-testid"?: string;
}

export function Select<T extends string = string>({
  value,
  options,
  placeholder,
  onChange,
  "data-testid": testId,
}: SelectProps<T>) {
  const { isOpen, containerRef, toggle, close } = useDropdown();

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative" data-testid={testId}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded border border-border bg-transparent px-3 py-2 text-[13px] outline-none focus:border-accent"
        onClick={toggle}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            {selected.icon}
            <span className="text-text-primary">{selected.label}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-text-muted">
            {placeholder ?? "Selecione..."}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 text-text-muted transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded border border-border bg-surface shadow-lg">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-2 text-[13px] transition hover:bg-column-hover ${
                  value === option.value ? "bg-column-hover text-text-primary" : "text-text-primary"
                }`}
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
              >
                {option.icon}
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
