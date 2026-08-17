(() => {
  "use strict";

  /* =========================================================
     AJMAL RESTAURANT — CALL WAITER
  ========================================================= */

  const TABLE_KEY = "ajmalRestaurantTable";


  /* =========================================================
     GET TABLE
  ========================================================= */

  function getTable() {
    try {
      return sessionStorage.getItem(TABLE_KEY) || "";
    } catch (error) {
      console.error("Could not read table:", error);
      return "";
    }
  }


  /* =========================================================
     SHOW MESSAGE
  ========================================================= */

  function showMessage(message) {
    alert(message);
  }


  /* =========================================================
     CALL WAITER
  ========================================================= */

  async function callWaiter(reason) {

    const table = getTable();

    /* -------------------------------------------------------
       CHECK TABLE
    ------------------------------------------------------- */

    if (!table) {
      showMessage(
        "Please scan your table QR code first."
      );

      return false;
    }

    /* -------------------------------------------------------
       CHECK REASON
    ------------------------------------------------------- */

    if (!reason || !reason.trim()) {
      return false;
    }


    /* -------------------------------------------------------
       REQUEST DATA

       IMPORTANT:
       Supabase uses "table_number", not "table_no".
    ------------------------------------------------------- */

    const request = {
      type: "waiter_call",

      table_number: table,

      reason: reason.trim(),

      status: "pending",

      created_at: new Date().toISOString()
    };


    console.log(
      "Sending waiter request:",
      request
    );


    /* -------------------------------------------------------
       CHECK SUPABASE
    ------------------------------------------------------- */

    if (!window.ajmalSupabase) {

      console.error(
        "Supabase client is not available."
      );

      showMessage(
        "❌ Supabase is not connected."
      );

      return false;
    }


    /* -------------------------------------------------------
       SEND TO SUPABASE
    ------------------------------------------------------- */

    try {

      const {
        data,
        error
      } = await window.ajmalSupabase
        .from("waiter_calls")
        .insert([request])
        .select();


      /* -----------------------------------------------------
         SUPABASE ERROR
      ----------------------------------------------------- */

      if (error) {

        console.error(
          "Supabase waiter error:",
          error
        );

        showMessage(
          "❌ Could not contact the waiter.\n\n" +
          error.message
        );

        return false;
      }


      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      console.log(
        "✅ Waiter request saved:",
        data
      );


      showMessage(
        `🔔 Waiter called successfully!\n\n` +
        `Table: ${table}\n` +
        `Request: ${reason}`
      );


      return true;


    } catch (error) {

      console.error(
        "Call waiter error:",
        error
      );

      showMessage(
        "❌ Could not contact the waiter.\n\n" +
        error.message
      );

      return false;
    }
  }


  /* =========================================================
     BUTTON
  ========================================================= */

  function setupCallWaiter() {

    const button =
      document.getElementById(
        "ajmalCallWaiterButton"
      );


    if (!button) {

      console.warn(
        "Call Waiter button was not found on this page."
      );

      return;
    }


    /* -------------------------------------------------------
       BUTTON CLICK
    ------------------------------------------------------- */

    button.addEventListener(
      "click",
      async () => {

        const table = getTable();


        /* ---------------------------------------------------
           NO TABLE
        --------------------------------------------------- */

        if (!table) {

          showMessage(
            "Please scan your table QR code first."
          );

          return;
        }


        /* ---------------------------------------------------
           ASK CUSTOMER
        --------------------------------------------------- */

        const reason = prompt(
          `Table ${table}\n\n` +
          "What do you need?\n\n" +
          "Examples:\n" +
          "• Please bring water\n" +
          "• I need the bill\n" +
          "• I am ready to order\n" +
          "• I need assistance"
        );


        if (!reason) {
          return;
        }


        const cleanReason =
          reason.trim();


        if (!cleanReason) {
          return;
        }


        /* ---------------------------------------------------
           BUTTON LOADING
        --------------------------------------------------- */

        button.disabled = true;

        button.textContent =
          "⏳ Calling...";


        /* ---------------------------------------------------
           SEND REQUEST
        --------------------------------------------------- */

        const success =
          await callWaiter(
            cleanReason
          );


        /* ---------------------------------------------------
           RESET BUTTON
        --------------------------------------------------- */

        button.disabled = false;

        button.textContent =
          "🔔 Call Waiter";


        if (success) {

          console.log(
            "✅ Call Waiter completed."
          );

        }

      }
    );


    console.log(
      "✅ Ajmal Call Waiter initialized."
    );
  }


  /* =========================================================
     INITIALIZE
  ========================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      setupCallWaiter
    );

  } else {

    setupCallWaiter();

  }


  /* =========================================================
     PUBLIC API
  ========================================================= */

  window.AjmalCallWaiter = {

    getTable,

    callWaiter

  };

})();