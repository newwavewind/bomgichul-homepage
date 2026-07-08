CREATE TABLE IF NOT EXISTS mock_exam_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  year int NOT NULL,
  total int NOT NULL CHECK (total > 0),
  correct int NOT NULL CHECK (correct >= 0),
  elapsed_seconds int NOT NULL CHECK (elapsed_seconds >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mock_exam_sessions_user_subject_year_idx
  ON mock_exam_sessions (user_id, subject, year, created_at DESC);

ALTER TABLE mock_exam_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mock_exam_sessions_select_own"
  ON mock_exam_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "mock_exam_sessions_insert_own"
  ON mock_exam_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
