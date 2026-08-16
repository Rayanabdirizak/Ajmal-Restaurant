/* =========================================================
   AJMAL RESTAURANT — COMPLETE MAIN.JS
   Matched to supplied index.html

   FEATURES
   ---------------------------------------------------------
   • Menu rendering / filtering / search
   • Cart + localStorage
   • Checkout
   • Delivery / Pickup
   • Dine-In via scanned table QR
   • Automatic QR scanner button + modal
   • Camera QR scanning
   • BarcodeDetector support where available
   • html5-qrcode fallback
   • Table number detection
   • Session table persistence
   • Order number generation
   • Delivery fee calculation
   • WhatsApp order integration
   • Scroll effects
   • Mobile navigation
   • Scroll reveal
========================================================= */

(() => {
  'use strict';


  /* =======================================================
     HELPERS
  ======================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


  const money = (value) =>
    `KES ${Number(value || 0).toLocaleString('en-KE')}`;


  const escapeHTML = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');


  const STORAGE_KEY = 'ajmalRestaurantCart';

  const TABLE_STORAGE_KEY =
    'ajmalRestaurantTable';

  const WHATSAPP_NUMBER =
    '254748974948';

  const DELIVERY_FEE =
    200;


  /* =======================================================
     MENU DATA
  ======================================================= */

  const menuItems = [

    {
      id: 1,
      name: 'English Breakfast',
      category: 'breakfast',
      price: 650,
      image: 'images/menu/breakfast/english-breakfast.jpg',
      description:
        'Eggs, sausages, toast, grilled tomato and breakfast potatoes.'
    },

    {
      id: 2,
      name: 'Ajmal Omelette',
      category: 'breakfast',
      price: 420,
      image: 'images/menu/breakfast/omelette.jpg',
      description:
        'Three-egg omelette with herbs, peppers, onion and cheese.'
    },

    {
      id: 3,
      name: 'Buttermilk Pancakes',
      category: 'breakfast',
      price: 450,
      image: 'images/menu/breakfast/pancakes.jpg',
      description:
        'Fluffy pancakes served with syrup and seasonal fruit.'
    },

    {
      id: 4,
      name: 'Avocado Toast',
      category: 'breakfast',
      price: 390,
      image: 'images/menu/breakfast/omelette.jpg',
      description:
        'Toasted sourdough, smashed avocado, herbs and chilli.'
    },

    {
      id: 5,
      name: 'Breakfast Bites',
      category: 'breakfast',
      price: 520,
      image: 'images/menu/breakfast/english-breakfast.jpg',
      description:
        'A light plate of eggs, toast, fruit and grilled vegetables.'
    },


    {
      id: 6,
      name: 'Grilled Chicken',
      category: 'lunch',
      price: 650,
      image: 'images/menu/lunch/grilled-chicken.jpg',
      description:
        'Juicy grilled chicken with signature sauce and fresh sides.'
    },

    {
      id: 7,
      name: 'Chicken Biryani',
      category: 'lunch',
      price: 750,
      image: 'images/menu/lunch/chicken-biryani.jpg',
      description:
        'Fragrant basmati rice layered with tender chicken and spices.'
    },

    {
      id: 8,
      name: 'Chicken Rice Bowl',
      category: 'lunch',
      price: 680,
      image: 'images/menu/lunch/chicken-rice.jpg',
      description:
        'Seasoned chicken, fragrant rice, vegetables and house dressing.'
    },

    {
      id: 9,
      name: 'Beef Pilau',
      category: 'lunch',
      price: 780,
      image: 'images/menu/lunch/beef-pilau.jpg',
      description:
        'Aromatic pilau rice with tender beef and fresh kachumbari.'
    },

    {
      id: 10,
      name: 'Ajmal Burger',
      category: 'lunch',
      price: 720,
      image: 'images/menu/lunch/burger.jpg',
      description:
        'House beef burger with cheese, crisp lettuce and fries.'
    },

    {
      id: 11,
      name: 'Grilled Steak',
      category: 'lunch',
      price: 1250,
      image: 'images/menu/lunch/steak.jpg',
      description:
        'Tender grilled steak with vegetables and a rich pan sauce.'
    },

    {
      id: 12,
      name: 'Grilled Fish',
      category: 'lunch',
      price: 980,
      image: 'images/menu/lunch/fish.jpg',
      description:
        'Fresh fish grilled with herbs, lemon and seasonal sides.'
    },

    {
      id: 13,
      name: 'Chicken Tikka Plate',
      category: 'lunch',
      price: 780,
      image: 'images/food/chicken.jpg',
      description:
        'Charred chicken tikka with salad, fries and house chutney.'
    },


    {
      id: 14,
      name: 'Family Sharing Platter',
      category: 'dinner',
      price: 1800,
      image: 'images/menu/dinner/family-platter.jpg',
      description:
        'A generous spread of grilled favourites made for sharing.'
    },

    {
      id: 15,
      name: 'Chef Special',
      category: 'dinner',
      price: 1450,
      image: 'images/menu/dinner/chef-special.jpg',
      description:
        'Our kitchen team’s featured plate, changing with the season.'
    },

    {
      id: 16,
      name: 'Ajmal Mixed Grill',
      category: 'dinner',
      price: 1650,
      image: 'images/food/platter.jpg',
      description:
        'Chicken, beef and grilled accompaniments for the whole table.'
    },

    {
      id: 17,
      name: 'Slow-Cooked Beef',
      category: 'dinner',
      price: 1100,
      image: 'images/menu/lunch/steak.jpg',
      description:
        'Tender beef cooked slowly with aromatic spices and vegetables.'
    },

    {
      id: 18,
      name: 'Seafood Selection',
      category: 'dinner',
      price: 1350,
      image: 'images/menu/lunch/fish.jpg',
      description:
        'Fresh seafood prepared to order with lemon, herbs and sides.'
    },

    {
      id: 19,
      name: 'Biryani Family Pot',
      category: 'dinner',
      price: 2100,
      image: 'images/menu/lunch/chicken-biryani.jpg',
      description:
        'A fragrant family-sized biryani served with accompaniments.'
    },


    {
      id: 20,
      name: 'Garden Salad',
      category: 'salads',
      price: 420,
      image: 'images/menu/salads/garden-salad.jpg',
      description:
        'Crisp greens, cucumber, tomato, herbs and house vinaigrette.'
    },

    {
      id: 21,
      name: 'Caesar Salad',
      category: 'salads',
      price: 520,
      image: 'images/menu/salads/caesar-salad.jpg',
      description:
        'Crisp lettuce, parmesan, croutons and creamy Caesar dressing.'
    },

    {
      id: 22,
      name: 'Avocado Salad',
      category: 'salads',
      price: 480,
      image: 'images/menu/salads/avocado-salad.jpg',
      description:
        'Avocado, greens, tomato, cucumber and citrus dressing.'
    },

    {
      id: 23,
      name: 'Chicken Garden Salad',
      category: 'salads',
      price: 650,
      image: 'images/menu/salads/garden-salad.jpg',
      description:
        'Fresh garden vegetables topped with grilled chicken strips.'
    },


    {
      id: 24,
      name: 'Chocolate Cake',
      category: 'desserts',
      price: 450,
      image: 'images/menu/desserts/chocolate-cake.jpg',
      description:
        'Rich chocolate cake finished with silky chocolate sauce.'
    },

    {
      id: 25,
      name: 'New York Cheesecake',
      category: 'desserts',
      price: 480,
      image: 'images/menu/desserts/cheesecake.jpg',
      description:
        'Creamy cheesecake served with berry compote.'
    },

    {
      id: 26,
      name: 'Fresh Fruit Platter',
      category: 'desserts',
      price: 420,
      image: 'images/menu/desserts/fruit-platter.jpg',
      description:
        'A colourful selection of fresh seasonal fruits.'
    },

    {
      id: 27,
      name: 'Ice Cream Trio',
      category: 'desserts',
      price: 390,
      image: 'images/menu/desserts/ice-cream.jpg',
      description:
        'Three scoops of creamy ice cream with toppings.'
    },

    {
      id: 28,
      name: 'Chocolate Sundae',
      category: 'desserts',
      price: 440,
      image: 'images/menu/desserts/ice-cream.jpg',
      description:
        'Ice cream, chocolate sauce and a crisp wafer.'
    },


    {
      id: 29,
      name: 'Espresso',
      category: 'coffee',
      price: 250,
      image: 'images/menu/coffee/espresso.jpg',
      description:
        'A short, intense espresso made fresh to order.'
    },

    {
      id: 30,
      name: 'Cappuccino',
      category: 'coffee',
      price: 330,
      image: 'images/menu/coffee/cappuccino.jpg',
      description:
        'Espresso with silky steamed milk and a soft foam finish.'
    },

    {
      id: 31,
      name: 'Café Latte',
      category: 'coffee',
      price: 350,
      image: 'images/menu/coffee/latte.jpg',
      description:
        'Smooth espresso and steamed milk with a delicate foam cap.'
    },

    {
      id: 32,
      name: 'Mocha',
      category: 'coffee',
      price: 390,
      image: 'images/menu/coffee/mocha.jpg',
      description:
        'Espresso, chocolate and steamed milk, served rich and warm.'
    },

    {
      id: 33,
      name: 'Americano',
      category: 'coffee',
      price: 280,
      image: 'images/menu/coffee/espresso.jpg',
      description:
        'Espresso lengthened with hot water for a clean finish.'
    },


    {
      id: 34,
      name: 'Kenyan Tea',
      category: 'tea',
      price: 220,
      image: 'images/menu/tea/tea.jpg',
      description:
        'Classic black tea brewed smooth and comforting.'
    },

    {
      id: 35,
      name: 'Masala Tea',
      category: 'tea',
      price: 280,
      image: 'images/menu/tea/masala-tea.jpg',
      description:
        'Black tea infused with warming aromatic spices.'
    },

    {
      id: 36,
      name: 'Fresh Mint Tea',
      category: 'tea',
      price: 260,
      image: 'images/menu/tea/mint-tea.jpg',
      description:
        'Refreshing mint tea served hot with fresh leaves.'
    },

    {
      id: 37,
      name: 'Ginger Tea',
      category: 'tea',
      price: 260,
      image: 'images/menu/tea/tea.jpg',
      description:
        'Warming tea with fresh ginger and a touch of lemon.'
    },


    {
      id: 38,
      name: 'Mango Juice',
      category: 'juices',
      price: 280,
      image: 'images/menu/juices/mango-juice.jpg',
      description:
        'Naturally sweet mango juice served chilled.'
    },

    {
      id: 39,
      name: 'Passion Juice',
      category: 'juices',
      price: 280,
      image: 'images/menu/juices/passion-juice.jpg',
      description:
        'Bright, tangy passion fruit juice made fresh.'
    },

    {
      id: 40,
      name: 'Pineapple Juice',
      category: 'juices',
      price: 280,
      image: 'images/menu/juices/pineapple-juice.jpg',
      description:
        'Fresh pineapple juice with a clean tropical finish.'
    },

    {
      id: 41,
      name: 'Tropical Juice',
      category: 'juices',
      price: 320,
      image: 'images/menu/juices/tropical-juice.jpg',
      description:
        'A refreshing blend of tropical fruits served cold.'
    },

    {
      id: 42,
      name: 'Mango Passion Blend',
      category: 'juices',
      price: 320,
      image: 'images/menu/juices/mango-juice.jpg',
      description:
        'A smooth blend of ripe mango and bright passion fruit.'
    }

  ];


  /* =======================================================
     STATE
  ======================================================= */

  let cart = loadCart();

  let activeCategory = 'all';

  let currentTable =
    loadTable();

  let scanner = null;

  let scannerRunning = false;

  let scannerLibraryPromise = null;


  /* =======================================================
     DOM REFERENCES
  ======================================================= */

  const header =
    $('#siteHeader');

  const menuToggle =
    $('#menuToggle');

  const mobileNav =
    $('#mobileNav');

  const categoryFilters =
    $('#categoryFilters');

  const menuSearch =
    $('#menuSearch');

  const menuGrid =
    $('#menuGrid');

  const menuCount =
    $('#menuCount');

  const menuEmpty =
    $('#menuEmpty');

  const openCartButton =
    $('#openCartButton');

  const cartDrawer =
    $('#cartDrawer');

  const cartOverlay =
    $('#cartOverlay');

  const cartClose =
    $('#cartClose');

  const cartItems =
    $('#cartItems');

  const cartSubtotal =
    $('#cartSubtotal');

  const cartCount =
    $('#cartCount');

  const checkoutButton =
    $('#checkoutButton');

  const checkoutOverlay =
    $('#checkoutOverlay');

  const checkoutClose =
    $('#checkoutClose');

  const checkoutForm =
    $('#checkoutForm');

  const checkoutItems =
    $('#checkoutItems');

  const checkoutTotal =
    $('#checkoutTotal');

  const deliverySection =
    $('#deliverySection');

  const deliveryLocation =
    $('#deliveryLocation');

  const year =
    $('#year');


  /* =======================================================
     LOCAL STORAGE — CART
  ======================================================= */

  function loadCart() {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) {
        return [];
      }

      const parsed =
        JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(item =>
          item &&
          Number.isFinite(
            Number(item.id)
          )
        )
        .map(item => {

          const menuItem =
            menuItems.find(
              product =>
                product.id ===
                Number(item.id)
            );

          if (!menuItem) {
            return null;
          }

          return {
            ...menuItem,
            quantity:
              Math.max(
                1,
                Number(item.quantity) || 1
              )
          };

        })
        .filter(Boolean);

    } catch (error) {

      console.warn(
        'Ajmal cart could not be restored:',
        error
      );

      return [];
    }
  }


  function saveCart() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
      );

    } catch (error) {

      console.warn(
        'Ajmal cart could not be saved:',
        error
      );

    }
  }


  /* =======================================================
     TABLE STORAGE
  ======================================================= */

  function loadTable() {

    try {

      const saved =
        sessionStorage.getItem(
          TABLE_STORAGE_KEY
        );

      return saved ?
        String(saved) :
        '';

    } catch {

      return '';
    }
  }


  function saveTable(table) {

    currentTable =
      String(table || '').trim();

    try {

      if (currentTable) {

        sessionStorage.setItem(
          TABLE_STORAGE_KEY,
          currentTable
        );

      } else {

        sessionStorage.removeItem(
          TABLE_STORAGE_KEY
        );

      }

    } catch {
      /* Ignore storage failures */
    }

    updateTableUI();
    updateDineInOption();
  }


  function clearTable() {

    currentTable = '';

    try {

      sessionStorage.removeItem(
        TABLE_STORAGE_KEY
      );

    } catch {
      /* Ignore */
    }

    updateTableUI();
    updateDineInOption();
  }


  /* =======================================================
     ORDER NUMBER
  ======================================================= */

  function generateOrderNumber() {

    const random =
      Math.floor(
        100000 +
        Math.random() * 900000
      );

    return `AJM-${random}`;
  }


  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  function openMobileNav() {

    if (!mobileNav) {
      return;
    }

    mobileNav.classList.add(
      'active'
    );

    mobileNav.setAttribute(
      'aria-hidden',
      'false'
    );

    menuToggle?.classList.add(
      'active'
    );

    menuToggle?.setAttribute(
      'aria-expanded',
      'true'
    );

    document.body.classList.add(
      'locked'
    );
  }


  function closeMobileNav() {

    if (!mobileNav) {
      return;
    }

    mobileNav.classList.remove(
      'active'
    );

    mobileNav.setAttribute(
      'aria-hidden',
      'true'
    );

    menuToggle?.classList.remove(
      'active'
    );

    menuToggle?.setAttribute(
      'aria-expanded',
      'false'
    );

    document.body.classList.remove(
      'locked'
    );
  }


  menuToggle?.addEventListener(
    'click',
    () => {

      const isOpen =
        mobileNav?.classList.contains(
          'active'
        );

      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }

    }
  );


  $$('.mobile-nav a')
    .forEach(link => {

      link.addEventListener(
        'click',
        closeMobileNav
      );

    });


  /* =======================================================
     HEADER SCROLL
  ======================================================= */

  function updateHeader() {

    if (!header) {
      return;
    }

    header.classList.toggle(
      'scrolled',
      window.scrollY > 35
    );
  }


  updateHeader();

  window.addEventListener(
    'scroll',
    updateHeader,
    { passive: true }
  );


  /* =======================================================
     MENU FILTERING
  ======================================================= */

  function getFilteredMenu() {

    const query =
      (menuSearch?.value || '')
        .trim()
        .toLowerCase();

    return menuItems.filter(
      item => {

        const categoryMatches =
          activeCategory === 'all' ||
          item.category ===
          activeCategory;

        if (!categoryMatches) {
          return false;
        }

        if (!query) {
          return true;
        }

        const searchableText =
          `${item.name} ${item.description} ${item.category}`
            .toLowerCase();

        return searchableText
          .includes(query);

      }
    );
  }


  /* =======================================================
     MENU RENDER
  ======================================================= */

  function renderMenu() {

    if (!menuGrid) {
      return;
    }

    const items =
      getFilteredMenu();

    if (menuCount) {

      menuCount.textContent =
        `${items.length} ${
          items.length === 1
            ? 'item'
            : 'items'
        }`;

    }

    if (menuEmpty) {

      menuEmpty.hidden =
        items.length !== 0;

    }

    if (!items.length) {

      menuGrid.innerHTML = '';

      return;
    }


    menuGrid.innerHTML =
      items.map(item => {

        const safeName =
          escapeHTML(item.name);

        const safeDescription =
          escapeHTML(
            item.description
          );

        const safeImage =
          escapeHTML(item.image);

        return `
          <article class="menu-card">

            <div class="menu-card-image">
              <img
                src="${safeImage}"
                alt="${safeName}"
                loading="lazy"
              >
            </div>

            <div class="menu-card-content">

              <div class="menu-card-top">

                <h3>
                  ${safeName}
                </h3>

                <span class="menu-card-price">
                  ${money(item.price)}
                </span>

              </div>

              <p>
                ${safeDescription}
              </p>

              <button
                class="add-to-order"
                type="button"
                data-add="${item.id}"
              >
                + ADD TO ORDER
              </button>

            </div>

          </article>
        `;

      }).join('');

  }


  /* =======================================================
     CATEGORY BUTTONS
  ======================================================= */

  $$('#categoryFilters .category-button')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          activeCategory =
            button.dataset.category ||
            'all';

          $$('#categoryFilters .category-button')
            .forEach(item =>
              item.classList.remove(
                'active'
              )
            );

          button.classList.add(
            'active'
          );

          renderMenu();

        }
      );

    });


  menuSearch?.addEventListener(
    'input',
    renderMenu
  );


  /* =======================================================
     CART
  ======================================================= */

  function addToCart(id) {

    const product =
      menuItems.find(
        item => item.id === id
      );

    if (!product) {
      return;
    }

    const existing =
      cart.find(
        item => item.id === id
      );

    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({
        ...product,
        quantity: 1
      });

    }

    saveCart();
    renderCart();
  }


  function getCartQuantity() {

    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }


  function getCartSubtotal() {

    return cart.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );
  }


  function getDeliveryFee(
    orderType
  ) {

    return orderType ===
      'delivery'
      ? DELIVERY_FEE
      : 0;
  }


  function renderCart() {

    if (!cartItems) {
      return;
    }

    if (!cart.length) {

      cartItems.innerHTML = `
        <div class="cart-empty">
          <strong>Your order is empty.</strong>
          <span>Add something delicious from the menu.</span>
        </div>
      `;

    } else {

      cartItems.innerHTML =
        cart.map(item => {

          const safeName =
            escapeHTML(item.name);

          const safeImage =
            escapeHTML(item.image);

          return `
            <div class="cart-item">

              <div class="cart-item-image">
                <img
                  src="${safeImage}"
                  alt="${safeName}"
                >
              </div>

              <div class="cart-item-details">

                <div class="cart-item-name">
                  ${safeName}
                </div>

                <div class="cart-item-price">
                  ${money(item.price)}
                </div>

                <div class="cart-item-controls">

                  <div class="quantity-controls">

                    <button
                      type="button"
                      data-minus="${item.id}"
                      aria-label="Decrease ${safeName} quantity"
                    >
                      −
                    </button>

                    <span class="quantity-number">
                      ${item.quantity}
                    </span>

                    <button
                      type="button"
                      data-plus="${item.id}"
                      aria-label="Increase ${safeName} quantity"
                    >
                      +
                    </button>

                  </div>

                  <button
                    class="remove-item"
                    type="button"
                    data-remove="${item.id}"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>
          `;

        }).join('');

    }


    if (cartSubtotal) {

      cartSubtotal.textContent =
        money(
          getCartSubtotal()
        );

    }

    if (cartCount) {

      cartCount.textContent =
        getCartQuantity();

    }
  }


  function changeQuantity(
    id,
    amount
  ) {

    const item =
      cart.find(
        product =>
          product.id === id
      );

    if (!item) {
      return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {

      cart =
        cart.filter(
          product =>
            product.id !== id
        );

    }

    saveCart();
    renderCart();
  }


  function removeFromCart(id) {

    cart =
      cart.filter(
        item =>
          item.id !== id
      );

    saveCart();
    renderCart();
  }


  menuGrid?.addEventListener(
    'click',
    event => {

      const button =
        event.target.closest(
          '[data-add]'
        );

      if (!button) {
        return;
      }

      const id =
        Number(button.dataset.add);

      addToCart(id);

      const originalText =
        button.textContent;

      button.textContent =
        '✓ ADDED';

      button.classList.add(
        'added'
      );

      setTimeout(() => {

        button.textContent =
          originalText;

        button.classList.remove(
          'added'
        );

      }, 900);

    }
  );


  cartItems?.addEventListener(
    'click',
    event => {

      const minus =
        event.target.closest(
          '[data-minus]'
        );

      const plus =
        event.target.closest(
          '[data-plus]'
        );

      const remove =
        event.target.closest(
          '[data-remove]'
        );


      if (minus) {

        changeQuantity(
          Number(
            minus.dataset.minus
          ),
          -1
        );

        return;
      }


      if (plus) {

        changeQuantity(
          Number(
            plus.dataset.plus
          ),
          1
        );

        return;
      }


      if (remove) {

        removeFromCart(
          Number(
            remove.dataset.remove
          )
        );

      }

    }
  );


  /* =======================================================
     CART DRAWER
  ======================================================= */

  function openCart() {

    renderCart();

    cartDrawer?.classList.add(
      'active'
    );

    cartOverlay?.classList.add(
      'active'
    );

    document.body.classList.add(
      'locked'
    );
  }


  function closeCart() {

    cartDrawer?.classList.remove(
      'active'
    );

    cartOverlay?.classList.remove(
      'active'
    );

    document.body.classList.remove(
      'locked'
    );
  }


  openCartButton?.addEventListener(
    'click',
    openCart
  );


  cartClose?.addEventListener(
    'click',
    closeCart
  );


  cartOverlay?.addEventListener(
    'click',
    closeCart
  );


  /* =======================================================
     DINE-IN OPTION
     Injected automatically when a table is scanned.
  ======================================================= */

  function injectDineInOption() {

    const choiceGrid =
      $(
        'input[name="orderType"]'
      )?.closest(
        '.choice-grid'
      );

    if (!choiceGrid) {
      return;
    }

    if (
      choiceGrid.querySelector(
        'input[value="dinein"]'
      )
    ) {
      return;
    }


    const label =
      document.createElement(
        'label'
      );

    label.innerHTML = `
      <input
        type="radio"
        name="orderType"
        value="dinein"
      >
      <span>
        <b>Dine In</b>
        <small>
          Order from your table
        </small>
      </span>
    `;


    choiceGrid.appendChild(
      label
    );


    label
      .querySelector('input')
      ?.addEventListener(
        'change',
        updateOrderType
      );
  }


  function updateDineInOption() {

    injectDineInOption();

    const dineIn =
      $(
        'input[name="orderType"][value="dinein"]'
      );

    if (!dineIn) {
      return;
    }

    const label =
      dineIn.closest('label');

    if (currentTable) {

      label?.classList.add(
        'table-ready'
      );

      const small =
        label?.querySelector(
          'small'
        );

      if (small) {

        small.textContent =
          `Table ${currentTable}`;

      }

    } else {

      label?.classList.remove(
        'table-ready'
      );

      const small =
        label?.querySelector(
          'small'
        );

      if (small) {

        small.textContent =
          'Scan a table QR first';

      }

    }
  }


  /* =======================================================
     ORDER TYPE
  ======================================================= */

  function updateOrderType() {

    const selected =
      $(
        'input[name="orderType"]:checked'
      );

    const orderType =
      selected?.value ||
      'delivery';


    const isDelivery =
      orderType ===
      'delivery';

    const isDineIn =
      orderType ===
      'dinein';


    if (deliverySection) {

      deliverySection.style.display =
        isDelivery
          ? ''
          : 'none';

    }


    if (deliveryLocation) {

      deliveryLocation.required =
        isDelivery;

    }


    if (
      isDineIn &&
      !currentTable
    ) {

      alert(
        'Please scan the table QR code before choosing Dine In.'
      );

      const delivery =
        $(
          'input[name="orderType"][value="delivery"]'
        );

      if (delivery) {

        delivery.checked =
          true;

        deliverySection.style.display =
          '';

        deliveryLocation.required =
          true;

      }

    }

  }


  $$('input[name="orderType"]')
    .forEach(radio => {

      radio.addEventListener(
        'change',
        updateOrderType
      );

    });


  /* =======================================================
     CHECKOUT
  ======================================================= */

  function renderCheckout() {

    if (!checkoutItems) {
      return;
    }


    if (!cart.length) {

      checkoutItems.innerHTML = `
        <div class="summary-empty">
          Your order is empty.
        </div>
      `;

    } else {

      checkoutItems.innerHTML =
        cart.map(item => {

          const safeName =
            escapeHTML(item.name);

          return `
            <div class="summary-item">

              <span>
                ${safeName} × ${item.quantity}
              </span>

              <strong>
                ${money(
                  item.price *
                  item.quantity
                )}
              </strong>

            </div>
          `;

        }).join('');

    }


    const selected =
      $(
        'input[name="orderType"]:checked'
      );

    const orderType =
      selected?.value ||
      'delivery';


    const subtotal =
      getCartSubtotal();

    const deliveryFee =
      getDeliveryFee(
        orderType
      );

    const total =
      subtotal +
      deliveryFee;


    if (checkoutTotal) {

      checkoutTotal.textContent =
        money(total);

    }


    injectCheckoutFee(
      deliveryFee,
      subtotal
    );
  }


  function injectCheckoutFee(
    deliveryFee,
    subtotal
  ) {

    if (!checkoutItems) {
      return;
    }


    let feeRow =
      $('#checkoutDeliveryFee');


    if (!feeRow) {

      feeRow =
        document.createElement(
          'div'
        );

      feeRow.id =
        'checkoutDeliveryFee';

      feeRow.className =
        'summary-item';


      const total =
        $('.summary-total');

      if (total?.parentNode) {

        total.parentNode.insertBefore(
          feeRow,
          total
        );

      }

    }


    feeRow.innerHTML = `
      <span>
        ${
          deliveryFee
            ? 'Delivery Fee'
            : 'Service Fee'
        }
      </span>

      <strong>
        ${money(deliveryFee)}
      </strong>
    `;
  }


  function openCheckout() {

    if (!cart.length) {

      alert(
        'Please add at least one item to your order first.'
      );

      return;
    }


    closeCart();

    renderCheckout();

    checkoutOverlay?.classList.add(
      'active'
    );

    document.body.classList.add(
      'locked'
    );

  }


  function closeCheckout() {

    checkoutOverlay?.classList.remove(
      'active'
    );

    document.body.classList.remove(
      'locked'
    );
  }


  checkoutButton?.addEventListener(
    'click',
    openCheckout
  );


  checkoutClose?.addEventListener(
    'click',
    closeCheckout
  );


  checkoutOverlay?.addEventListener(
    'click',
    event => {

      if (
        event.target ===
        checkoutOverlay
      ) {

        closeCheckout();

      }

    }
  );


  /* =======================================================
     QR SCANNER — AUTOMATIC UI INJECTION
  ======================================================= */

  function injectScannerUI() {

    if ($('#ajmalScannerButton')) {
      return;
    }


    /* -----------------------------------------------------
       Scanner button
    ----------------------------------------------------- */

    const button =
      document.createElement(
        'button'
      );

    button.type =
      'button';

    button.id =
      'ajmalScannerButton';

    button.className =
      'button button-gold ajmal-scanner-button';

    button.innerHTML =
      '▣ Scan Table QR';


    button.addEventListener(
      'click',
      openScanner
    );


    /*
      Put scanner button near
      the menu CTA.
    */

    const menuCTA =
      $('.menu-cta');


    if (menuCTA) {

      const rightSide =
        menuCTA.querySelector(
          '.button'
        );

      if (rightSide) {

        rightSide.insertAdjacentElement(
          'beforebegin',
          button
        );

      } else {

        menuCTA.appendChild(
          button
        );

      }

    } else if (header) {

      header
        .querySelector(
          '.header-actions'
        )
        ?.appendChild(button);

    }


    /* -----------------------------------------------------
       Scanner modal
    ----------------------------------------------------- */

    const overlay =
      document.createElement(
        'div'
      );

    overlay.id =
      'ajmalScannerOverlay';

    overlay.className =
      'ajmal-scanner-overlay';


    overlay.innerHTML = `

      <div
        class="ajmal-scanner-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ajmalScannerTitle"
      >

        <div class="ajmal-scanner-header">

          <div>

            <span class="eyebrow">
              AJMAL RESTAURANT
            </span>

            <h3 id="ajmalScannerTitle">
              Scan your table
            </h3>

          </div>

          <button
            type="button"
            class="icon-button"
            id="ajmalScannerClose"
            aria-label="Close scanner"
          >
            ×
          </button>

        </div>


        <div class="ajmal-scanner-body">

          <div
            id="ajmalScannerViewport"
            class="ajmal-scanner-viewport"
          >

            <div
              id="ajmalScannerVideoWrap"
              class="ajmal-scanner-video-wrap"
            ></div>

            <div
              class="ajmal-scanner-frame"
              aria-hidden="true"
            ></div>

          </div>


          <p
            id="ajmalScannerStatus"
            class="ajmal-scanner-status"
          >
            Point your camera at the QR code on your table.
          </p>


          <div
            id="ajmalScannerResult"
            class="ajmal-scanner-result"
            hidden
          ></div>


          <button
            type="button"
            id="ajmalScannerManual"
            class="ajmal-scanner-manual"
          >
            Enter table number manually
          </button>


          <div
            id="ajmalManualTableBox"
            class="ajmal-manual-table-box"
            hidden
          >

            <label for="ajmalManualTable">
              Table number
            </label>

            <div class="ajmal-manual-table-row">

              <input
                id="ajmalManualTable"
                type="text"
                inputmode="text"
                placeholder="e.g. T12"
              >

              <button
                type="button"
                class="button button-gold"
                id="ajmalManualTableSubmit"
              >
                Use Table
              </button>

            </div>

          </div>

        </div>

      </div>

    `;


    document.body.appendChild(
      overlay
    );


    injectScannerStyles();


    $('#ajmalScannerClose')
      ?.addEventListener(
        'click',
        closeScanner
      );


    overlay.addEventListener(
      'click',
      event => {

        if (
          event.target ===
          overlay
        ) {

          closeScanner();

        }

      }
    );


    $('#ajmalScannerManual')
      ?.addEventListener(
        'click',
        () => {

          const box =
            $('#ajmalManualTableBox');

          if (!box) {
            return;
          }

          box.hidden =
            !box.hidden;

          if (!box.hidden) {

            $('#ajmalManualTable')
              ?.focus();

          }

        }
      );


    $('#ajmalManualTableSubmit')
      ?.addEventListener(
        'click',
        () => {

          const input =
            $('#ajmalManualTable');

          const table =
            parseTableValue(
              input?.value || ''
            );

          if (!table) {

            setScannerStatus(
              'Please enter a valid table number, such as T12.',
              true
            );

            return;
          }

          handleTableDetected(
            table,
            input.value
          );

        }
      );


    $('#ajmalManualTable')
      ?.addEventListener(
        'keydown',
        event => {

          if (
            event.key ===
            'Enter'
          ) {

            event.preventDefault();

            $('#ajmalManualTableSubmit')
              ?.click();

          }

        }
      );
  }


  /* =======================================================
     SCANNER STYLES
  ======================================================= */

  function injectScannerStyles() {

    if (
      $('#ajmalScannerInjectedStyles')
    ) {
      return;
    }


    const style =
      document.createElement(
        'style'
      );

    style.id =
      'ajmalScannerInjectedStyles';


    style.textContent = `

      .ajmal-scanner-button {
        margin-right: 10px;
        white-space: nowrap;
      }

      .ajmal-scanner-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0,0,0,.78);
        backdrop-filter: blur(8px);
      }

      .ajmal-scanner-overlay.active {
        display: flex;
      }

      .ajmal-scanner-modal {
        width: min(94vw, 520px);
        max-height: 92vh;
        overflow: auto;
        background: #11100d;
        color: #fff;
        border: 1px solid rgba(255,255,255,.12);
        box-shadow: 0 25px 80px rgba(0,0,0,.45);
      }

      .ajmal-scanner-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 22px 22px 18px;
        border-bottom: 1px solid rgba(255,255,255,.1);
      }

      .ajmal-scanner-header h3 {
        margin: 5px 0 0;
        font-family: "Playfair Display", serif;
        font-size: 28px;
      }

      .ajmal-scanner-body {
        padding: 20px;
      }

      .ajmal-scanner-viewport {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        background: #050505;
        border-radius: 8px;
      }

      .ajmal-scanner-video-wrap,
      .ajmal-scanner-video-wrap video,
      .ajmal-scanner-video-wrap canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .ajmal-scanner-video-wrap video {
        display: block;
        object-fit: cover;
      }

      .ajmal-scanner-frame {
        position: absolute;
        width: 58%;
        aspect-ratio: 1;
        left: 21%;
        top: 21%;
        border: 2px solid rgba(255,255,255,.9);
        box-shadow:
          0 0 0 9999px rgba(0,0,0,.18),
          0 0 35px rgba(255,255,255,.2);
        pointer-events: none;
      }

      .ajmal-scanner-frame::before,
      .ajmal-scanner-frame::after {
        content: "";
        position: absolute;
        width: 28px;
        height: 28px;
        border-color: #d6b36a;
        border-style: solid;
      }

      .ajmal-scanner-frame::before {
        left: -2px;
        top: -2px;
        border-width: 4px 0 0 4px;
      }

      .ajmal-scanner-frame::after {
        right: -2px;
        bottom: -2px;
        border-width: 0 4px 4px 0;
      }

      .ajmal-scanner-status {
        margin: 16px 0;
        color: rgba(255,255,255,.72);
        line-height: 1.5;
        text-align: center;
      }

      .ajmal-scanner-status.error {
        color: #ffb4b4;
      }

      .ajmal-scanner-result {
        margin: 14px 0;
        padding: 14px;
        background: rgba(214,179,106,.1);
        border: 1px solid rgba(214,179,106,.35);
        text-align: center;
      }

      .ajmal-scanner-result strong {
        display: block;
        color: #d6b36a;
        margin-bottom: 4px;
      }

      .ajmal-scanner-manual {
        display: block;
        width: 100%;
        padding: 12px;
        border: 0;
        background: transparent;
        color: rgba(255,255,255,.7);
        cursor: pointer;
        text-decoration: underline;
      }

      .ajmal-manual-table-box {
        margin-top: 15px;
      }

      .ajmal-manual-table-box label {
        display: block;
        margin-bottom: 7px;
        font-size: 13px;
      }

      .ajmal-manual-table-row {
        display: flex;
        gap: 8px;
      }

      .ajmal-manual-table-row input {
        min-width: 0;
        flex: 1;
        padding: 13px;
        border: 1px solid rgba(255,255,255,.15);
        background: rgba(255,255,255,.06);
        color: #fff;
        outline: none;
      }

      .ajmal-table-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 10px 0;
        padding: 8px 12px;
        border: 1px solid rgba(214,179,106,.35);
        background: rgba(214,179,106,.08);
        color: #d6b36a;
        font-size: 13px;
      }

      .ajmal-table-clear {
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        text-decoration: underline;
      }

      .ajmal-scanner-stop {
        width: 100%;
        margin-top: 12px;
      }

      @media (max-width: 600px) {

        .ajmal-scanner-button {
          margin-right: 0;
          margin-bottom: 10px;
        }

        .ajmal-scanner-modal {
          width: 100%;
        }

        .ajmal-scanner-body {
          padding: 14px;
        }

        .ajmal-manual-table-row {
          flex-direction: column;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =======================================================
     TABLE UI
  ======================================================= */

  function updateTableUI() {

    const existing =
      $('#ajmalTableBadge');


    if (!currentTable) {

      existing?.remove();

      return;
    }


    if (existing) {

      const text =
        existing.querySelector(
          '[data-table-text]'
        );

      if (text) {

        text.textContent =
          `Table ${currentTable}`;

      }

      return;
    }


    const badge =
      document.createElement(
        'div'
      );

    badge.id =
      'ajmalTableBadge';

    badge.className =
      'ajmal-table-badge';

    badge.innerHTML = `
      <span>
        🍽 Table
        <strong data-table-text>
          ${escapeHTML(currentTable)}
        </strong>
      </span>

      <button
        type="button"
        class="ajmal-table-clear"
        aria-label="Clear table"
      >
        Change
      </button>
    `;


    const menuIntro =
      $('.menu-intro');


    if (menuIntro) {

      menuIntro.insertAdjacentElement(
        'afterend',
        badge
      );

    }


    badge
      .querySelector(
        '.ajmal-table-clear'
      )
      ?.addEventListener(
        'click',
        () => {

          clearTable();

          openScanner();

        }
      );
  }


  /* =======================================================
     PARSE TABLE VALUE
  ======================================================= */

  function parseTableValue(
    rawValue
  ) {

    if (!rawValue) {
      return '';
    }


    let value =
      String(rawValue)
        .trim();


    /*
      QR may contain:

      T12
      TABLE 12
      TABLE-12
      table=12
      https://site.com/?table=T12
      https://site.com/menu?table=12
    */


    try {

      if (
        value.startsWith(
          'http://'
        ) ||
        value.startsWith(
          'https://'
        )
      ) {

        const url =
          new URL(value);

        const params =
          url.searchParams;

        const tableParam =
          params.get('table') ||
          params.get('tableNumber') ||
          params.get('table_id');

        if (tableParam) {

          value =
            tableParam;

        }

      }

    } catch {
      /* Not a URL — continue parsing */
    }


    value =
      decodeURIComponent(
        value
      ).trim();


    /*
      Normalize common forms.
    */

    const match =
      value.match(
        /(?:table|tbl|t)\s*[-_:#=]?\s*([a-z0-9]+)|^([0-9]+)$/i
      );


    if (match) {

      const number =
        match[1] ||
        match[2];

      return `T${String(number)
        .toUpperCase()}`;

    }


    /*
      If QR contains a simple identifier
      like "T12".
    */

    if (
      /^T[A-Z0-9]+$/i.test(
        value
      )
    ) {

      return value
        .toUpperCase();

    }


    return '';
  }


  /* =======================================================
     SCANNER STATUS
  ======================================================= */

  function setScannerStatus(
    message,
    isError = false
  ) {

    const status =
      $('#ajmalScannerStatus');

    if (!status) {
      return;
    }

    status.textContent =
      message;

    status.classList.toggle(
      'error',
      Boolean(isError)
    );
  }


  /* =======================================================
     SCANNER RESULT
  ======================================================= */

  function showScannerResult(
    table,
    raw
  ) {

    const result =
      $('#ajmalScannerResult');

    if (!result) {
      return;
    }

    result.hidden =
      false;

    result.innerHTML = `
      <strong>
        ✓ Table detected
      </strong>

      <span>
        ${escapeHTML(table)}
      </span>
    `;
  }


  /* =======================================================
     HANDLE TABLE DETECTION
  ======================================================= */

  function handleTableDetected(
    table,
    rawValue
  ) {

    if (!table) {

      setScannerStatus(
        'That QR code does not contain a valid Ajmal table number.',
        true
      );

      return;
    }


    showScannerResult(
      table,
      rawValue
    );


    saveTable(
      table
    );


    /*
      Automatically select Dine In.
    */

    injectDineInOption();


    const dineIn =
      $(
        'input[name="orderType"][value="dinein"]'
      );

    if (dineIn) {

      dineIn.checked =
        true;

    }


    updateOrderType();


    setScannerStatus(
      `Table ${table} selected. Your order will be sent as a Dine In order.`
    );


    /*
      Stop camera after successful scan.
    */

    stopScanner();


    /*
      Give customer a moment to see
      the confirmation before closing.
    */

    setTimeout(() => {

      closeScanner();

      document
        .querySelector('#menu')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

    }, 850);

  }


  /* =======================================================
     BARCODE DETECTOR
  ======================================================= */

  async function startNativeScanner() {

    if (
      !('BarcodeDetector' in window)
    ) {

      throw new Error(
        'BarcodeDetector is not supported.'
      );

    }


    let formats = [
      'qr_code'
    ];


    try {

      if (
        BarcodeDetector.getSupportedFormats
      ) {

        const supported =
          await BarcodeDetector
            .getSupportedFormats();

        if (
          !supported.includes(
            'qr_code'
          )
        ) {

          throw new Error(
            'QR detection is not supported.'
          );

        }

      }

    } catch {
      /* Continue with qr_code */
    }


    const detector =
      new BarcodeDetector({
        formats
      });


    const video =
      document.createElement(
        'video'
      );

    video.autoplay =
      true;

    video.muted =
      true;

    video.playsInline =
      true;


    const wrap =
      $('#ajmalScannerVideoWrap');


    if (!wrap) {
      throw new Error(
        'Scanner video container missing.'
      );
    }


    wrap.innerHTML = '';

    wrap.appendChild(
      video
    );


    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment'
          }
        },
        audio: false
      });


    video.srcObject =
      stream;


    await video.play();


    scanner = {
      type: 'native',
      stream,
      video,
      detector,
      animationFrame: null
    };


    scannerRunning =
      true;


    const scan =
      async () => {

        if (
          !scannerRunning ||
          !scanner
        ) {
          return;
        }


        try {

          const codes =
            await detector.detect(
              video
            );


          if (
            codes &&
            codes.length
          ) {

            const raw =
              codes[0].rawValue ||
              '';


            const table =
              parseTableValue(
                raw
              );


            if (table) {

              handleTableDetected(
                table,
                raw
              );

              return;

            }

          }

        } catch {
          /* Keep scanning */
        }


        scanner.animationFrame =
          requestAnimationFrame(
            scan
          );

      };


    scanner.animationFrame =
      requestAnimationFrame(
        scan
      );


    setScannerStatus(
      'Camera ready. Point it at the table QR code.'
    );

  }


  /* =======================================================
     HTML5-QRCODE FALLBACK
  ======================================================= */

  function loadHtml5QrCode() {

    if (
      window.Html5Qrcode
    ) {

      return Promise.resolve(
        window.Html5Qrcode
      );

    }


    if (scannerLibraryPromise) {

      return scannerLibraryPromise;

    }


    scannerLibraryPromise =
      new Promise(
        (resolve, reject) => {

          const existing =
            document.querySelector(
              'script[data-ajmal-qr-library]'
            );


          if (existing) {

            existing.addEventListener(
              'load',
              () => {

                if (
                  window.Html5Qrcode
                ) {

                  resolve(
                    window.Html5Qrcode
                  );

                } else {

                  reject(
                    new Error(
                      'QR library failed to load.'
                    )
                  );

                }

              }
            );


            existing.addEventListener(
              'error',
              () => {

                reject(
                  new Error(
                    'QR library failed to load.'
                  )
                );

              }
            );

            return;
          }


          const script =
            document.createElement(
              'script'
            );


          script.src =
            'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';


          script.async =
            true;

          script.dataset.ajmalQrLibrary =
            'true';


          script.onload =
            () => {

              if (
                window.Html5Qrcode
              ) {

                resolve(
                  window.Html5Qrcode
                );

              } else {

                reject(
                  new Error(
                    'QR library unavailable.'
                  )
                );

              }

            };


          script.onerror =
            () => {

              reject(
                new Error(
                  'Could not load QR scanner library.'
                )
              );

            };


          document.head.appendChild(
            script
          );

        }
      );


    return scannerLibraryPromise;
  }


  async function startHtml5Scanner() {

    const Html5Qrcode =
      await loadHtml5QrCode();


    const wrap =
      $('#ajmalScannerVideoWrap');


    if (!wrap) {
      throw new Error(
        'Scanner container missing.'
      );
    }


    wrap.innerHTML = `

      <div
        id="ajmalHtml5QrReader"
        style="width:100%;height:100%;"
      ></div>

    `;


    const reader =
      new Html5Qrcode(
        'ajmalHtml5QrReader'
      );


    scanner = {
      type: 'html5',
      reader
    };


    scannerRunning =
      true;


    await reader.start(

      {
        facingMode: 'environment'
      },

      {
        fps: 10,
        qrbox: {
          width: 220,
          height: 220
        },
        aspectRatio: 1
      },

      decodedText => {

        if (
          !scannerRunning
        ) {
          return;
        }


        const table =
          parseTableValue(
            decodedText
          );


        if (table) {

          handleTableDetected(
            table,
            decodedText
          );

        } else {

          setScannerStatus(
            'QR detected, but it does not contain a valid table number.',
            true
          );

        }

      },

      () => {
        /*
          QR scan frame errors are normal.
        */
      }

    );


    setScannerStatus(
      'Camera ready. Point it at the table QR code.'
    );
  }


  /* =======================================================
     START SCANNER
  ======================================================= */

  async function startScanner() {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      setScannerStatus(
        'Camera access is not available. Use HTTPS or localhost, then try again.',
        true
      );

      return;
    }


    setScannerStatus(
      'Starting camera…'
    );


    try {

      await startNativeScanner();

      return;

    } catch (nativeError) {

      console.info(
        'Native QR scanner unavailable. Trying fallback.',
        nativeError
      );

    }


    try {

      await startHtml5Scanner();

    } catch (fallbackError) {

      console.error(
        'Ajmal QR scanner failed:',
        fallbackError
      );


      setScannerStatus(
        'Unable to start the camera scanner. Please allow camera access or enter the table number manually.',
        true
      );

    }
  }


  /* =======================================================
     STOP SCANNER
  ======================================================= */

  async function stopScanner() {

    scannerRunning =
      false;


    if (!scanner) {
      return;
    }


    try {

      if (
        scanner.type ===
        'native'
      ) {

        if (
          scanner.animationFrame
        ) {

          cancelAnimationFrame(
            scanner.animationFrame
          );

        }


        scanner.stream
          ?.getTracks()
          .forEach(
            track =>
              track.stop()
          );


        if (
          scanner.video
        ) {

          scanner.video.srcObject =
            null;

        }

      }


      if (
        scanner.type ===
        'html5'
      ) {

        try {

          await scanner.reader.stop();

        } catch {
          /* Already stopped */
        }


        try {

          await scanner.reader.clear();

        } catch {
          /* Already cleared */
        }

      }

    } catch (error) {

      console.warn(
        'Could not fully stop scanner:',
        error
      );

    }


    scanner =
      null;


    const wrap =
      $('#ajmalScannerVideoWrap');


    if (wrap) {
      wrap.innerHTML = '';
    }
  }


  /* =======================================================
     OPEN SCANNER
  ======================================================= */

  async function openScanner() {

    injectScannerUI();


    const overlay =
      $('#ajmalScannerOverlay');


    if (!overlay) {
      return;
    }


    overlay.classList.add(
      'active'
    );


    document.body.classList.add(
      'locked'
    );


    const result =
      $('#ajmalScannerResult');


    if (result) {
      result.hidden = true;
    }


    const manualBox =
      $('#ajmalManualTableBox');


    if (manualBox) {
      manualBox.hidden = true;
    }


    setScannerStatus(
      'Starting camera…'
    );


    await startScanner();
  }


  /* =======================================================
     CLOSE SCANNER
  ======================================================= */

  async function closeScanner() {

    await stopScanner();


    const overlay =
      $('#ajmalScannerOverlay');


    overlay?.classList.remove(
      'active'
    );


    document.body.classList.remove(
      'locked'
    );

  }


  /* =======================================================
     INITIALIZE SCANNER UI
  ======================================================= */

  injectScannerUI();

  updateTableUI();

  updateDineInOption();


  /* =======================================================
     CHECKOUT SUBMIT
  ======================================================= */

  checkoutForm?.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      if (!cart.length) {

        alert(
          'Your order is empty. Please add something from the menu.'
        );

        return;
      }


      const name =
        $('#customerName')
          ?.value
          .trim() ||
        '';


      const phone =
        $('#customerPhone')
          ?.value
          .trim() ||
        '';


      const orderType =
        $(
          'input[name="orderType"]:checked'
        )?.value ||
        'delivery';


      const payment =
        $(
          'input[name="paymentMethod"]:checked'
        )?.value ||
        'mpesa';


      const location =
        $('#deliveryLocation')
          ?.value
          .trim() ||
        '';


      const address =
        $('#deliveryAddress')
          ?.value
          .trim() ||
        '';


      const notes =
        $('#orderNotes')
          ?.value
          .trim() ||
        '';


      if (!name) {

        alert(
          'Please enter your full name.'
        );

        $('#customerName')
          ?.focus();

        return;
      }


      if (!phone) {

        alert(
          'Please enter your phone number.'
        );

        $('#customerPhone')
          ?.focus();

        return;
      }


      if (
        orderType ===
        'delivery' &&
        !location
      ) {

        alert(
          'Please enter your Nairobi delivery location.'
        );

        deliveryLocation?.focus();

        return;
      }


      if (
        orderType ===
        'dinein' &&
        !currentTable
      ) {

        alert(
          'Please scan your table QR code first.'
        );

        closeCheckout();

        openScanner();

        return;
      }


      const orderNumber =
        generateOrderNumber();


      const subtotal =
        getCartSubtotal();


      const deliveryFee =
        getDeliveryFee(
          orderType
        );


      const total =
        subtotal +
        deliveryFee;


      const orderLines =
        cart.map(item =>
          `• ${item.name} × ${item.quantity} — ${money(
            item.price *
            item.quantity
          )}`
        );


      /*
        WhatsApp message intentionally uses
        clean plain text + asterisks so it
        renders nicely in WhatsApp.
      */

      let message =
`🍽️ *AJMAL RESTAURANT ORDER*

*Order No:* ${orderNumber}
*Customer:* ${name}
*Phone:* ${phone}
*Order Type:* ${
  orderType === 'delivery'
    ? 'Delivery'
    : orderType === 'pickup'
      ? 'Pickup'
      : 'Dine In'
}`;

      if (
        orderType ===
        'dinein'
      ) {

        message +=
`

*TABLE*
*Table:* ${currentTable}`;

      }


      if (
        orderType ===
        'delivery'
      ) {

        message +=
`

*DELIVERY DETAILS*
*Nairobi Location:* ${location}
*Address / Building:* ${
  address ||
  'Not provided'
}`;

      }


      message +=
`

*ORDER ITEMS*
${orderLines.join('\n')}

*Food Subtotal:* ${money(subtotal)}`;


      if (
        orderType ===
        'delivery'
      ) {

        message +=
`
*Delivery Fee:* ${money(deliveryFee)}`;

      }


      message +=
`

*TOTAL: ${money(total)}*

*Payment Method:* ${
  payment === 'mpesa'
    ? 'M-Pesa'
    : 'Cash'
}`;


      if (notes) {

        message +=
`

*Special Instructions:*
${notes}`;

      }


      message +=
`

Thank you - Ajmal Restaurant 🇰🇪`;


      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${
          encodeURIComponent(
            message
          )
        }`;


      /*
        Open WhatsApp.
      */

      window.open(
        whatsappURL,
        '_blank',
        'noopener,noreferrer'
      );


      /*
        Clear cart after the WhatsApp
        order has been prepared.
      */

      cart = [];

      saveCart();

      renderCart();

      closeCheckout();


      /*
        Keep table during the current
        session so the customer can
        place another order from the
        same table.

        Delivery/pickup does not clear
        table either, because a customer
        may have scanned before deciding.
      */

    }
  );


  /* =======================================================
     PAYMENT CHANGE → REFRESH CHECKOUT
  ======================================================= */

  $$(
    'input[name="paymentMethod"]'
  ).forEach(
    radio => {

      radio.addEventListener(
        'change',
        renderCheckout
      );

    }
  );


  /* =======================================================
     ORDER TYPE CHANGE → REFRESH CHECKOUT
  ======================================================= */

  $$(
    'input[name="orderType"]'
  ).forEach(
    radio => {

      radio.addEventListener(
        'change',
        () => {

          updateOrderType();

          renderCheckout();

        }
      );

    }
  );


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key !==
        'Escape'
      ) {
        return;
      }


      closeMobileNav();

      closeCart();

      closeCheckout();

      closeScanner();

    }
  );


  /* =======================================================
     SMOOTH ANCHOR SCROLLING
  ======================================================= */

  $$(
    'a[href^="#"]'
  ).forEach(
    link => {

      link.addEventListener(
        'click',
        event => {

          const targetID =
            link.getAttribute(
              'href'
            );


          if (
            !targetID ||
            targetID === '#'
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetID
            );


          if (!target) {
            return;
          }


          event.preventDefault();

          closeMobileNav();

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

        }
      );

    }
  );


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements =
    $$(
      '.intro-grid, ' +
      '.experience-card, ' +
      '.feature-card, ' +
      '.menu-card, ' +
      '.gallery-grid figure, ' +
      '.visit-box, ' +
      '.menu-cta'
    );


  if (
    'IntersectionObserver' in window &&
    revealElements.length
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.classList.add(
                'is-visible'
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.12,
          rootMargin:
            '0px 0px -40px 0px'
        }
      );


    revealElements.forEach(
      element => {

        element.classList.add(
          'reveal'
        );

        observer.observe(
          element
        );

      }
    );

  } else {

    revealElements.forEach(
      element => {

        element.classList.add(
          'is-visible'
        );

      }
    );

  }


  /* =======================================================
     IMAGE ERROR FALLBACK
  ======================================================= */

  document.addEventListener(
    'error',
    event => {

      const image =
        event.target;


      if (
        image &&
        image.tagName ===
        'IMG'
      ) {

        image.classList.add(
          'image-error'
        );

      }

    },
    true
  );


  /* =======================================================
     YEAR
  ======================================================= */

  if (year) {

    year.textContent =
      new Date()
        .getFullYear();

  }


  /* =======================================================
     INITIALIZATION
  ======================================================= */

  renderMenu();

  renderCart();

  updateOrderType();

  updateTableUI();

  updateDineInOption();


  /* =======================================================
     PUBLIC DEBUG API
  ======================================================= */

  window.AjmalRestaurant = {

    menuItems,

    getCart: () =>
      [...cart],

    getCartTotal: () =>
      getCartSubtotal(),

    getTable: () =>
      currentTable,

    setTable: table => {

      const parsed =
        parseTableValue(
          table
        );

      if (!parsed) {

        console.warn(
          'Invalid table:',
          table
        );

        return false;
      }

      handleTableDetected(
        parsed,
        table
      );

      return true;
    },

    clearTable,

    addToCart,

    removeFromCart,

    openCart,

    closeCart,

    openCheckout,

    closeCheckout,

    openScanner,

    closeScanner,

    clearCart: () => {

      cart = [];

      saveCart();

      renderCart();

    }

  };


})();