-- Removes the standalone Build Log and Learnings modules.
-- Note: projects.learnings (text[] column) and profile.about_learning are
-- unrelated fields on other tables and are intentionally left untouched.
DROP TABLE IF EXISTS "build_log";
DROP TABLE IF EXISTS "learnings";
