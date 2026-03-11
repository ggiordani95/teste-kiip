CREATE TABLE IF NOT EXISTS board_columns (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  column_key VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  position INTEGER NOT NULL,
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(board_id, column_key)
);

INSERT INTO board_columns (board_id, column_key, name, status, position, is_done)
SELECT b.id, 'todo', 'A Fazer', 'pending', 0, FALSE
FROM boards b WHERE b.key = 'KAN'
  AND NOT EXISTS (SELECT 1 FROM board_columns bc WHERE bc.board_id = b.id AND bc.column_key = 'todo');

INSERT INTO board_columns (board_id, column_key, name, status, position, is_done)
SELECT b.id, 'in-progress', 'Em Progresso', 'in_progress', 1, FALSE
FROM boards b WHERE b.key = 'KAN'
  AND NOT EXISTS (SELECT 1 FROM board_columns bc WHERE bc.board_id = b.id AND bc.column_key = 'in-progress');

INSERT INTO board_columns (board_id, column_key, name, status, position, is_done)
SELECT b.id, 'done', 'Concluído', 'done', 2, TRUE
FROM boards b WHERE b.key = 'KAN'
  AND NOT EXISTS (SELECT 1 FROM board_columns bc WHERE bc.board_id = b.id AND bc.column_key = 'done');
