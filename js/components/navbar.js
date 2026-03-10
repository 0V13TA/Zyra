class ZyraNavbar extends HTMLElement {
  constructor() {
    super();
    // We are not using Shadow DOM here so that your global CSS
    // and fonts still apply easily, but we will scope the JS.
  }

  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    // Move your HTML here
    this.innerHTML = `
    <!-- your original styles + refinements for tablet/laptop -->
    <style>
      /* ----- base layout (mobile first, then tablet/laptop overrides) ----- */
      nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        position: relative;
        background: white;
      }

      nav::after,
      nav::before {
        content: "";
        width: 100%;
        height: 1px;
        background-color: #aaa;
        position: absolute;
        left: 0;
      }
      nav::before {
        top: 0;
      }
      nav::after {
        bottom: 0;
      }

      button {
        background: none;
        border: none;
        cursor: pointer;
        line-height: 1;
      }

      /* --- mobile left group (hamburger + cart icon + search) --- */
      #mobile-left {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      /* cart badge (always visible on mobile, refined position) */
      #cart {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        cursor: pointer;
      }
      /* badge: use pseudo after — content controlled via js later if needed, but keep 0 for now */
      #mobile-left #cart::after {
        content: "0";
        border-radius: 50%;
        background: #2d2a29;
        color: white;
        width: 20px;
        height: 20px;
        position: absolute;
        top: -10px;
        left: 14px; /* adjusted to sit near icon */
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        z-index: 2;
      }
      /* on tablet/desktop we also have a cart with count text */
      #left-side #cart {
        gap: 4px;
      }
      #left-side #cart::after {
        display: none; /* badge hidden on desktop, we show text count */
      }

      /* ----- shared panel styles (both nav, cart, search) ----- */
      .side-panel {
        position: fixed;
        top: 0;
        height: 100vh;
        background: white;
        z-index: 1000;
        transition: transform 0.3s ease-in-out;
        padding: 30px 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
      }

      #left-nav {
        left: 0;
        width: min(300px, 70vw); /* responsive width */
        transform: translateX(-100%);
      }

      #cart-sidebar-1 {
        right: 0;
        width: min(380px, 85vw);
        transform: translateX(100%);
        padding: 20px 16px;
      }

      .side-panel.open {
        transform: translateX(0) !important;
      }

      /* overlay */
      #nav-overlay,
      #cart-nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      #nav-overlay.open,
      #cart-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      /* left nav inner */
      #left-nav ul {
        list-style: none;
        margin-top: 20px;
        width: 100%;
      }
      #left-nav ul li {
        width: 100%;
        border-bottom: 1px solid #e5e5e5;
      }
      #left-nav ul li a {
        text-decoration: none;
        color: #242424;
        font-size: 18px;
        text-transform: uppercase;
        display: block;
        width: 100%;
        padding: 14px 10px;
      }
      #left-nav ul li:first-child a {
        color: grey;
      }
      #left-nav ul li.selected a {
        color: #c72a2a;
      }

      /* dropdown category */
      .dropdown-checkbox {
        display: none;
      }
      .dropdown-label {
        cursor: pointer;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
        padding: 14px 10px;
        font-size: 18px;
        text-transform: uppercase;
        width: 100%;
        box-sizing: border-box;
        color: #242424;
      }
      .dropdown-label .icon {
        width: 14px;
        height: 14px;
        position: relative;
        display: inline-block;
        margin-right: 10px;
      }
      .dropdown-label .icon::before,
      .dropdown-label .icon::after {
        content: "";
        position: absolute;
        background-color: currentColor;
        transition: transform 0.25s ease;
      }
      .dropdown-label .icon::before {
        top: 6px;
        left: 0;
        width: 100%;
        height: 2px;
      }
      .dropdown-label .icon::after {
        top: 0;
        left: 6px;
        width: 2px;
        height: 100%;
      }
      .submenu {
        max-height: 0;
        overflow: hidden;
        list-style: none;
        padding-left: 24px !important;
        transition: max-height 0.4s ease-out;
      }
      .submenu li {
        border-bottom: none !important;
      }
      .submenu li a {
        font-size: 16px !important;
        text-transform: none !important;
        padding: 10px 10px !important;
        color: #444 !important;
      }
      .dropdown-checkbox:checked ~ .submenu {
        max-height: 300px;
      }
      .dropdown-checkbox:checked + .dropdown-label .icon::after {
        transform: rotate(90deg);
        opacity: 0;
      }

      /* search overlay fullscreen */
      #desktop-search {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        z-index: 1100;
        opacity: 0;
        transform: scale(0.98);
        pointer-events: none;
        transition:
          opacity 0.25s,
          transform 0.25s;
      }
      #desktop-search.open {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }
      #desktop-search > div {
        display: flex;
        background: #2d2a29;
        border-radius: 60px;
        overflow: hidden;
        border: 1px solid #555;
      }
      #desktop-search input {
        outline: none;
        border: none;
        background: transparent;
        color: white;
        padding: 20px 28px;
        font-size: 1.2rem;
        min-width: 260px;
        width: 50vw;
        max-width: 500px;
      }
      #desktop-search button[type="submit"] {
        background: transparent;
        border: none;
        padding: 0 24px;
        cursor: pointer;
      }
      #cancle-button {
        position: absolute;
        top: 20px;
        right: 30px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* cart sidebar specifics */
      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 1rem;
        letter-spacing: 1px;
      }
      .close-btn {
        font-size: 32px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0 8px;
      }
      .cart-item {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #ddd;
      }
      .cart-item img {
        width: 80px;
        height: 100px;
        object-fit: cover;
        background: #f0f0f0;
        border-radius: 4px;
      }
      .item-details h4 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 6px;
      }
      .item-price {
        font-size: 0.85rem;
        color: #555;
      }
      .cart-actions {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px 0 8px;
      }
      .btn-dark {
        background: #2d2a29;
        color: white;
        border: none;
        padding: 15px 10px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 0.9rem;
        cursor: pointer;
        border-radius: 40px;
        transition: 0.2s;
      }
      .btn-dark:hover {
        background: #1c1a19;
      }

      /* --- left side (tablet/desktop) --- */
      #left-side {
        display: none; /* hidden on mobile, shown with media query */
        align-items: center;
        gap: 28px;
      }
      #left-side ul {
        display: flex;
        list-style: none;
        gap: 24px;
      }
      #left-side ul li a {
        text-decoration: none;
        color: #222;
        font-weight: 500;
        font-size: 1rem;
        text-transform: uppercase;
      }
      #left-side ul li.selected a {
        color: #c72a2a;
      }
      #search {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #f2f2f2;
        padding: 4px 12px;
        border-radius: 40px;
      }
      #search input {
        border: none;
        background: transparent;
        padding: 8px 4px;
        width: 150px;
        outline: none;
      }
      #currency-selector {
        background: transparent;
        border: 1px solid #ccc;
        border-radius: 20px;
        padding: 6px 8px;
        font-size: 0.8rem;
      }

      /* ----- tablet / laptop media query (refined breakpoints) ----- */
      @media screen and (min-width: 768px) {
        /* hide mobile group, show desktop group */
        #mobile-left {
          display: none;
        }
        #left-side {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          flex: 1;
        }
        /* adjust nav spacing */
        nav {
          padding: 10px 30px;
        }
        /* we still keep hamburger hidden, left-nav still there for overlay but toggle not visible */
      }

      /* for large laptop, we can keep left-side more spacious */
      @media screen and (min-width: 1024px) {
        #left-side {
          gap: 40px;
        }
        #search input {
          width: 220px;
        }
      }

      /* make sure logo fits */
      nav > img[alt="Logo"] {
        width: 70px;
        height: auto;
      }

      /* extra: active links simulation */
      #left-side ul li:first-child a {
        color: #888;
      }
    </style>
  </head>
  <body>
    <nav id="mobile">
      <!-- main logo -->
      <img src="../static/Zyra-logo.svg" alt="Logo" width="75" height="75" />

      <!-- mobile action group -->
      <div id="mobile-left">
        <button id="hamburger-button" aria-label="Menu">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'%3E%3Cline x1='3' y1='6' x2='21' y2='6'/%3E%3Cline x1='3' y1='12' x2='21' y2='12'/%3E%3Cline x1='3' y1='18' x2='21' y2='18'/%3E%3C/svg%3E"
            alt="Menu"
            width="30"
            height="30"
          />
        </button>

        <!-- cart trigger (mobile) -->
        <div id="cart" role="button" aria-label="Cart" tabindex="0">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='1.5'%3E%3Ccircle cx='9' cy='21' r='1.5'/%3E%3Ccircle cx='20' cy='21' r='1.5'/%3E%3Cpath d='M1 1h4l2.5 13h13l3-8H6' stroke='%23222' fill='none'/%3E%3C/svg%3E"
            alt="Cart"
            width="30"
            height="30"
          />
        </div>

        <button id="search-button" aria-label="Search">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.5' y2='16.5'/%3E%3C/svg%3E"
            alt="Search"
            width="30"
            height="30"
          />
        </button>
      </div>

      <!-- desktop / tablet left group (hidden on mobile) -->
      <div id="left-side">
        <ul>
          <li><a href="#">Home</a></li>
          <li class="selected"><a href="#">Categories</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>

        <div id="search">
          <input type="text" placeholder="Search..." />
          <button type="submit">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.5' y2='16.5'/%3E%3C/svg%3E"
              alt="search"
              width="20"
              height="20"
            />
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 18px">
          <select name="currency" id="currency-selector">
            <option value="NGN" selected>₦ NGN</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
          <div
            id="cart"
            role="button"
            aria-label="Cart"
            style="display: flex; align-items: center; gap: 4px"
          >
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='1.5'%3E%3Ccircle cx='9' cy='21' r='1.5'/%3E%3Ccircle cx='20' cy='21' r='1.5'/%3E%3Cpath d='M1 1h4l2.5 13h13l3-8H6' stroke='%23222' fill='none'/%3E%3C/svg%3E"
              alt="Cart"
              width="24"
              height="24"
            />
            <span id="cart-count">Cart: 0</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- mobile navigation panel (left) -->
    <div id="left-nav" class="side-panel">
      <img
          src="../static/Zyra-logo.svg"
        alt="Logo"
        width="80"
        height="80"
        style="margin-bottom: 8px"
      />
      <ul>
        <li><a href="#">Home</a></li>
        <li>
          <input
            type="checkbox"
            id="category-toggle"
            class="dropdown-checkbox"
          />
          <label for="category-toggle" class="dropdown-label">
            <span class="icon"></span> <span>Categories</span>
          </label>
          <ul class="submenu" style="padding: 0px; margin: 0px">
            <li><a href="products.html#tops">Tops</a></li>
            <li><a href="products.html#dresses">Dresses</a></li>
            <li><a href="products.html#shirts">Shirts</a></li>
            <li><a href="products.html#trousers">Trousers</a></li>
            <li><a href="products.html#skirts">Skirts</a></li>
          </ul>
        </li>
        <li><a href="#">About</a></li>
        <li class="selected"><a href="#">Contact Us</a></li>
      </ul>
    </div>
    <div id="nav-overlay"></div>

    <!-- cart sidebar (right) -->
    <div id="cart-sidebar-1" class="side-panel">
      <div class="cart-header">
        <span>Shopping Cart</span>
        <button class="close-btn" id="close-cart">&times;</button>
      </div>
      <div id="cart-items-list">
        <div class="cart-item">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23eaeaea'/%3E%3Ctext x='10' y='55' fill='%23999' font-size='12'%3EAmber%3C/text%3E%3C/svg%3E"
            alt="Amber Culottes"
          />
          <div class="item-details">
            <h4>AMBER CULOTTES - SIZE 12</h4>
            <p class="item-price">1 x ₦31,500.00</p>
          </div>
        </div>
        <div class="cart-item">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23eaeaea'/%3E%3Ctext x='10' y='55' fill='%23999' font-size='12'%3EBlouse%3C/text%3E%3C/svg%3E"
            alt="Silk blouse"
          />
          <div class="item-details">
            <h4>SILK BLOUSE - SIZE 8</h4>
            <p class="item-price">1 x ₦22,800.00</p>
          </div>
        </div>
      </div>
      <div class="cart-actions">
        <button class="btn-dark">View Cart</button>
        <button class="btn-dark">Checkout</button>
      </div>
    </div>
    <div id="cart-nav-overlay"></div>

    <!-- search fullscreen overlay -->
    <div id="desktop-search">
      <div>
        <input type="text" placeholder="Search products..." />
        <button type="submit">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.5' y2='16.5'/%3E%3C/svg%3E"
            alt="Search"
            width="28"
            height="28"
          />
        </button>
      </div>
      <button id="cancle-button">
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cline x1='18' y1='6' x2='6' y2='18'/%3E%3Cline x1='6' y1='6' x2='18' y2='18'/%3E%3C/svg%3E"
          alt="Close"
          width="30"
          height="30"
        />
      </button>
    </div> 
    `;
  }

  initLogic() {
    // Scope everything to 'this' (the custom element instance)
    const qs = (selector) => this.querySelector(selector);

    const elements = {
      hamburger: qs("#hamburger-button"),
      leftNav: qs("#left-nav"),
      navOverlay: qs("#nav-overlay"),
      searchBtn: qs("#search-button"),
      searchOverlay: qs("#desktop-search"),
      cartBtn: qs("#mobile-left #cart"),
      cartSidebar: qs("#cart-sidebar-1"),
      cartOverlay: qs("#cart-nav-overlay"),
      closeCart: qs("#close-cart"),
      cancelSearch: qs("#cancle-button"),
    };

    // Helper to toggle
    const toggle = (el, overlay, force) => {
      el?.classList.toggle("open", force);
      overlay?.classList.toggle("open", force);
    };

    // Listeners
    elements.hamburger?.addEventListener("click", () =>
      toggle(elements.leftNav, elements.navOverlay, true),
    );
    elements.navOverlay?.addEventListener("click", () =>
      toggle(elements.leftNav, elements.navOverlay, false),
    );

    elements.searchBtn?.addEventListener("click", () =>
      toggle(elements.searchOverlay, null, true),
    );
    elements.cancelSearch?.addEventListener("click", () =>
      toggle(elements.searchOverlay, null, false),
    );

    elements.cartBtn?.addEventListener("click", () =>
      toggle(elements.cartSidebar, elements.cartOverlay, true),
    );
    elements.cartOverlay?.addEventListener("click", () =>
      toggle(elements.cartSidebar, elements.cartOverlay, false),
    );
    elements.closeCart?.addEventListener("click", () =>
      toggle(elements.cartSidebar, elements.cartOverlay, false),
    );

    // Global Escape Key (Static listener)
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        toggle(elements.leftNav, elements.navOverlay, false);
        toggle(elements.searchOverlay, null, false);
        toggle(elements.cartSidebar, elements.cartOverlay, false);
      }
    });
  }
}

// Register the custom element
customElements.define("zyra-navbar", ZyraNavbar);
