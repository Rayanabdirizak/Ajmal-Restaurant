const SUPABASE_URL =
  "https://aenwlbazurdquwryqhce.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_Ip0apyRgiXPp1HQjAOV5wQ_gokmfUwv";

const ajmalSupabase =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

window.ajmalSupabase =
  ajmalSupabase;