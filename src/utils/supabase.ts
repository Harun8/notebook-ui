import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  "https://kuzmldftexihlrycjzmm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1em1sZGZ0ZXhpaGxyeWNqem1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMDA1MTEsImV4cCI6MjA3NDU3NjUxMX0.eo1d1Z9IbgKuJiAEOjJIYSyNolcOHznujOx1Wq1vPmE"
);
