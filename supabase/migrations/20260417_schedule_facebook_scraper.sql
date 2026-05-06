-- Schedule the Facebook Events scraper to run daily at 6am UTC (1am Knoxville time)
-- Requires pg_cron + pg_net extensions

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Unschedule any existing job with the same name (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-facebook-events-scrape') THEN
    PERFORM cron.unschedule('daily-facebook-events-scrape');
  END IF;
END $$;

-- Schedule the job: every day at 6:00 UTC
SELECT cron.schedule(
  'daily-facebook-events-scrape',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://utoykngdauuglqttjlvw.supabase.co/functions/v1/scrape-facebook-events',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    )
  ) AS request_id;
  $$
);
