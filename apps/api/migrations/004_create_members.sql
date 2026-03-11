CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_board_id ON members(board_id);

INSERT INTO members (board_id, name)
SELECT b.id, m.name
FROM boards b
CROSS JOIN (VALUES ('Ana Silva'), ('Carlos Souza'), ('Marina Santos')) AS m(name)
WHERE b.key = 'KAN'
  AND NOT EXISTS (SELECT 1 FROM members WHERE members.board_id = b.id AND members.name = m.name);
