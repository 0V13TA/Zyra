/**
 * layout.js - Centralized entry point for shared components
 */
import "./components/navbar.js";
import "./components/footer.js";
import "./components/product-card.js";
import "./components/product-detail.js";
import { addToCart } from "./utils/cart.js";

/**
 * @typedef {Object} productObj
 * @property {string} name
 * @property {string} slug
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 * @property {"NGN" | "USD" | "GBP" | "EUR"} currency
 * @property {"top" | "dress" | "shirt" | "trouser" | "skirt"} type
 */

const zyraNavbar = document.createElement("zyra-navbar");
const zyraFooter = document.createElement("zyra-footer");
document.body.prepend(zyraNavbar);
document.body.append(zyraFooter);

// init.js example snippet
document.addEventListener("add-to-cart", (e) => {
  const product = e.detail;
  addToCart(product);
});
