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


/* =========================================================
   DEBUG
========================================================= */

console.log(
  "=== AJMAL SUPABASE DEBUG ==="
);

console.log(
  "Supabase URL:",
  SUPABASE_URL
);

console.log(
  "Supabase client:",
  window.ajmalSupabase
);


ajmalSupabase.auth
  .getSession()
  .then(({ data, error }) => {

    console.log(
      "Supabase session:",
      data.session
    );

    console.log(
      "Supabase auth error:",
      error
    );

  });