"use client";

import type { Member } from "@task-manager/shared";
import { UserRound } from "lucide-react";
import { useMemo } from "react";
import { Avatar, Select, type SelectOption } from "@/components";

interface MemberSelectProps {
  value: string;
  members: Member[];
  onChange: (value: string) => void;
}

export function MemberSelect({ value, members, onChange }: MemberSelectProps) {
  const options = useMemo<SelectOption[]>(
    () => [
      { value: "", label: "Sem responsável", icon: <UserRound className="h-4 w-4" /> },
      ...members.map((m) => ({
        value: m.name,
        label: m.name,
        icon: <Avatar name={m.name} size={"sm" as const} />,
      })),
    ],
    [members],
  );

  const placeholder = (
    <>
      <UserRound className="h-4 w-4" />
      Sem responsável
    </>
  );

  return (
    <Select
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={onChange}
      data-testid="modal-task-assignee"
    />
  );
}
