CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  task_key VARCHAR(50) NOT NULL UNIQUE,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  task_type VARCHAR(20) NOT NULL DEFAULT 'task',
  due_date DATE,
  rank INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_tasks_priority CHECK(priority IN ('critical', 'high', 'medium', 'low')),
  CONSTRAINT chk_tasks_type CHECK(task_type IN ('bug', 'task', 'story', 'subtask')),
  CONSTRAINT chk_tasks_status CHECK(status IN ('pending', 'in_progress', 'done'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_board_status_rank ON tasks(board_id, status, rank);
CREATE INDEX IF NOT EXISTS idx_tasks_board_created_at ON tasks(board_id, created_at DESC);
