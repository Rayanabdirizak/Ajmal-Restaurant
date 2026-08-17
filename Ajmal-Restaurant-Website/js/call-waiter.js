(() => {
  "use strict";

  /* =========================================================
     AJMAL RESTAURANT — CALL WAITER
     Complete version
  ========================================================= */

  const TABLE_KEY = "ajmalRestaurantTable";


  /* =========================================================
     SHOW MESSAGE
  ========================================================= */

  function showMessage(message) {
    alert(message);
  }


  /* =========================================================
     GET TABLE
     
     Checks:
     1. sessionStorage
     2. URL ?table=T01
     3. localStorage
  ========================================================= */

  function getTable() {

    /* -------------------------------------------------------
       1. SESSION STORAGE
    ------------------------------------------------------- */

    try {

      const sessionTable =
        sessionStorage.getItem(
          TABLE_KEY
        );

      if (sessionTable) {

        return sessionTable
          .trim()
          .toUpperCase();

      }

    } catch (error) {

      console.warn(
        "Could not read sessionStorage:",
        error
      );

    }


    /* -------------------------------------------------------
       2. URL
       
       Example:
       ?table=T01
       ?tableNumber=T01
       ?table_id=T01
    ------------------------------------------------------- */

    try {

      const url =
        new URL(
          window.location.href
        );


      const urlTable =
        url.searchParams.get("table") ||
        url.searchParams.get("tableNumber") ||
        url.searchParams.get("table_id");


      if (urlTable) {

        const cleanTable =
          urlTable
            .trim()
            .toUpperCase();


        /* Save table */

        try {

          sessionStorage.setItem(
            TABLE_KEY,
            cleanTable
          );

        } catch {
          /* Ignore */
        }


        try {

          localStorage.setItem(
            TABLE_KEY,
            cleanTable
          );

        } catch {
          /* Ignore */
        }


        console.log(
          "✅ Table detected from URL:",
          cleanTable
        );


        return cleanTable;

      }

    } catch (error) {

      console.warn(
        "Could not read table from URL:",
        error
      );

    }


    /* -------------------------------------------------------
       3. LOCAL STORAGE
    ------------------------------------------------------- */

    try {

      const localTable =
        localStorage.getItem(
          TABLE_KEY
        );


      if (localTable) {

        return localTable
          .trim()
          .toUpperCase();

      }

    } catch (error) {

      console.warn(
        "Could not read localStorage:",
        error
      );

    }


    /* -------------------------------------------------------
       NO TABLE
    ------------------------------------------------------- */

    return "";
  }


  /* =========================================================
     SYNC TABLE FROM URL
  ========================================================= */

  function syncTableFromURL() {

    try {

      const url =
        new URL(
          window.location.href
        );


      const table =
        url.searchParams.get("table") ||
        url.searchParams.get("tableNumber") ||
        url.searchParams.get("table_id");


      if (!table) {
        return "";
      }


      const cleanTable =
        table
          .trim()
          .toUpperCase();


      /* Save in sessionStorage */

      try {

        sessionStorage.setItem(
          TABLE_KEY,
          cleanTable
        );

      } catch {
        /* Ignore */
      }


      /* Save in localStorage */

      try {

        localStorage.setItem(
          TABLE_KEY,
          cleanTable
        );

      } catch {
        /* Ignore */
      }


      console.log(
        "✅ Ajmal table synchronized:",
        cleanTable
      );


      return cleanTable;

    } catch (error) {

      console.error(
        "Could not synchronize table:",
        error
      );

      return "";
    }
  }


  /* =========================================================
     CALL WAITER
  ========================================================= */

  async function callWaiter(reason) {

    /* -------------------------------------------------------
       GET TABLE
    ------------------------------------------------------- */

    const table =
      getTable();


    /* -------------------------------------------------------
       REQUIRE TABLE
    ------------------------------------------------------- */

    if (!table) {

      showMessage(
        "Please scan your table QR code first."
      );

      return false;
    }


    /* -------------------------------------------------------
       REQUIRE REASON
    ------------------------------------------------------- */

    if (
      !reason ||
      !reason.trim()
    ) {

      return false;
    }


    const cleanReason =
      reason.trim();


    /* -------------------------------------------------------
       SUPABASE REQUEST
    ------------------------------------------------------- */

    const request = {

      type:
        "waiter_call",

      table_number:
        table,

      reason:
        cleanReason,

      status:
        "pending",

      created_at:
        new Date().toISOString()

    };


    console.log(
      "📤 Sending waiter request:",
      request
    );


    /* -------------------------------------------------------
       CHECK SUPABASE
    ------------------------------------------------------- */

    if (
      !window.ajmalSupabase
    ) {

      console.error(
        "Supabase client is not available."
      );

      showMessage(
        "❌ Supabase is not connected."
      );

      return false;
    }


    /* -------------------------------------------------------
       INSERT INTO SUPABASE
    ------------------------------------------------------- */

    try {

      const {
        data,
        error
      } =
        await window.ajmalSupabase
          .from(
            "waiter_calls"
          )
          .insert([
            request
          ])
          .select();


      /* -----------------------------------------------------
         ERROR
      ----------------------------------------------------- */

      if (error) {

        console.error(
          "❌ Supabase waiter error:",
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
        `Request: ${cleanReason}`
      );


      return true;

    } catch (error) {

      console.error(
        "❌ Call waiter error:",
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
     BUTTON SETUP
  ========================================================= */

  function setupCallWaiter() {

    const button =
      document.getElementById(
        "ajmalCallWaiterButton"
      );


    /* -------------------------------------------------------
       BUTTON NOT FOUND
    ------------------------------------------------------- */

    if (!button) {

      console.warn(
        "⚠️ Call Waiter button not found."
      );

      return;
    }


    /* -------------------------------------------------------
       PREVENT DUPLICATE LISTENER
    ------------------------------------------------------- */

    if (
      button.dataset.waiterReady === "true"
    ) {

      return;
    }


    button.dataset.waiterReady =
      "true";


    /* -------------------------------------------------------
       CLICK
    ------------------------------------------------------- */

    button.addEventListener(
      "click",
      async () => {

        /* Get current table */

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
           ASK CUSTOMER
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


        /* Customer cancelled */

        if (!reason) {
          return;
        }


        const cleanReason =
          reason.trim();


        /* Empty reason */

        if (!cleanReason) {
          return;
        }


        /* ---------------------------------------------------
           DISABLE BUTTON
        --------------------------------------------------- */

        button.disabled =
          true;

        button.textContent =
          "⏳ Calling...";


        /* ---------------------------------------------------
           SEND
        --------------------------------------------------- */

        await callWaiter(
          cleanReason
        );


        /* ---------------------------------------------------
           RESTORE BUTTON
        --------------------------------------------------- */

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

  function init() {

    /*
      First get the table from the QR URL.
    */

    syncTableFromURL();


    /*
      Then setup the button.
    */

    setupCallWaiter();


    /*
      Debug information.
    */

    console.log(
      "🍽️ Ajmal current table:",
      getTable()
    );

  }


  /* =========================================================
     START
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }


  /* =========================================================
     PUBLIC API
  ========================================================= */

  window.AjmalCallWaiter = {

    getTable,

    callWaiter,

    syncTableFromURL

  };

})();