"use client";

const AVATAR_COLORS = ["#0065FF", "#FF5630", "#36B37E", "#6554C0", "#FF991F"];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

const SIZE_CLASSES = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-6 w-6 text-[11px]",
} as const;

export function Avatar({ name, size = "sm" }: AvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${SIZE_CLASSES[size]}`}
      style={{ backgroundColor: getColor(name) }}
      title={name}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
