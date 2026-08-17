"use strict";

const SUPABASE_URL =
  "https://aenwlbazurdquwryqhce.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_Ip0apyRgiXPp1HQjAOV5wQ_gokmfUwv";

if (!window.supabase) {
  console.error(
    "❌ Supabase library has not loaded."
  );
} else {
  const ajmalSupabase =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

  window.ajmalSupabase =
    ajmalSupabase;

  console.log(
    "✅ Ajmal Supabase client loaded successfully."
  );
}