import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rlxjxydvzwouwunpypfh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJseGp4eWR2endvdXd1bnB5cGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxMzU1MzAsImV4cCI6MjAzMjcxMTUzMH0.9BJIV551Qk3pkccVVQkIxGFDOhRO7QCwmgLvIVr1aZc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
