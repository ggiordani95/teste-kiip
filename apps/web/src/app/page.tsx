"use client";

import dynamic from "next/dynamic";

const KanbanPage = dynamic(
  () => import("@/features/tasks/pages/KanbanPage").then((m) => ({ default: m.KanbanPage })),
  { ssr: false },
);

export default function Home() {
  return <KanbanPage />;
}
