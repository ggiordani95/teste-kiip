"use client";

import { LayoutGrid } from "lucide-react";
import { Suspense, useEffect } from "react";
import { KanbanBoard } from "../components/KanbanBoard";
import { useBoardsData, useBoardData } from "../hooks/useBoards";
import { useBoardStore } from "../stores";

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}

function BoardSelector() {
  const boards = useBoardsData();
  const { activeBoardId, setActiveBoardId } = useBoardStore();

  const firstBoardId = boards.values[0]?.id;

  useEffect(() => {
    if (firstBoardId && !activeBoardId) {
      setActiveBoardId(firstBoardId);
    }
  }, [activeBoardId, firstBoardId, setActiveBoardId]);

  if (!activeBoardId) {
    return <LoadingScreen message="Carregando board..." />;
  }

  return (
    <Suspense fallback={<LoadingScreen message="Carregando board..." />}>
      <BoardContent boardId={activeBoardId} />
    </Suspense>
  );
}

function BoardContent({ boardId }: { boardId: number }) {
  const { board, configuration, tasksResponse, members } = useBoardData(boardId);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-page">
      <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-4">
          <LayoutGrid className="h-5 w-5 text-[#0052CC]" />
          <h1 className="text-[17px] font-bold text-text-primary" data-testid="board-title">
            {board.name}
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-5">
        <KanbanBoard
          boardId={boardId}
          configuration={configuration}
          tasks={tasksResponse.tasks}
          members={members}
        />
      </main>
    </div>
  );
}

export function KanbanPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Carregando boards..." />}>
      <BoardSelector />
    </Suspense>
  );
}
