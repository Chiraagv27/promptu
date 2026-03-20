-- Ensure thumbs feedback uses `feedback` text; remove legacy CHECK that rejects -1 on rating.
-- (Some DBs had rating constrained to 1–5 stars, which broke thumbs-down as rating = -1.)

ALTER TABLE public.optimization_logs
  ADD COLUMN IF NOT EXISTS feedback text;

ALTER TABLE public.optimization_logs
  DROP CONSTRAINT IF EXISTS optimization_logs_rating_check;
