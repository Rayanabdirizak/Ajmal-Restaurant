(() => {
  "use strict";


  /* =========================================================
     AJMAL RESTAURANT — CALL WAITER
  ========================================================= */

  const TABLE_KEY =
    "ajmalRestaurantTable";


  /* =========================================================
     GET TABLE
  ========================================================= */

  function getTable() {

    try {

      return (
        sessionStorage.getItem(
          TABLE_KEY
        ) || ""
      );

    } catch (error) {

      console.error(
        "Could not read table:",
        error
      );

      return "";
    }
  }


  /* =========================================================
     SHOW MESSAGE
  ========================================================= */

  function showMessage(
    message
  ) {

    alert(message);
  }


  /* =========================================================
     CALL WAITER
  ========================================================= */

  async function callWaiter(
    reason
  ) {

    const table =
      getTable();


    /* -------------------------------------------------------
       REQUIRE TABLE QR
    ------------------------------------------------------- */

    if (!table) {

      showMessage(
        "Please scan your table QR code first."
      );

      return false;
    }


    if (!reason) {

      return false;
    }


    const request = {

      type:
        "waiter_call",

      table_no:
        table,

      reason:
        reason,

      status:
        "pending",

      created_at:
        new Date().toISOString()

    };


    console.log(
      "Sending waiter request:",
      request
    );


    /* -------------------------------------------------------
       SUPABASE
    ------------------------------------------------------- */

    try {

      if (
        !window.ajmalSupabase
      ) {

        throw new Error(
          "Supabase client is not available."
        );
      }


      const {
        error
      } =
        await window.ajmalSupabase
          .from(
            "waiter_calls"
          )
          .insert(
            request
          );


      if (error) {

        console.error(
          "Supabase error:",
          error
        );

        showMessage(
          "❌ Could not contact the waiter.\n\n" +
          error.message
        );

        return false;
      }


      console.log(
        "Waiter request sent successfully."
      );


      showMessage(
        `🔔 Waiter called!\n\nTable: ${table}\nRequest: ${reason}`
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

      console.error(
        "Call Waiter button not found."
      );

      return;
    }


    button.addEventListener(
      "click",
      async () => {

        const table =
          getTable();


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
           REQUEST
        --------------------------------------------------- */

        const reason =
          prompt(
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


        button.disabled =
          true;

        button.textContent =
          "⏳ Calling...";


        await callWaiter(
          cleanReason
        );


        button.disabled =
          false;

        button.textContent =
          "🔔 Call Waiter";

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
    document.readyState ===
    "loading"
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