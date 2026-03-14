import { slugify } from "./utils/slugify.js";

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

/**
 * @type {productObj[]}
 */
const Products = [
  {
    name: "Trousers",
    price: 2000,
    currency: "NGN",
    image: "../static/search-svgrepo-com.svg",
    quantity: 1,
    type: "top",
  },
].map((product) => ({
  ...product,
  slug: product.slug || slugify(product.name),
}));

export default Products;
