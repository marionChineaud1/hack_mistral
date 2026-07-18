ALTER TABLE reports ADD COLUMN supersedes_report_id text;
CREATE INDEX IF NOT EXISTS reports_supersedes_idx ON reports (supersedes_report_id);
