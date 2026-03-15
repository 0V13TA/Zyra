import Products from "../data.js";

/**
 * @returns {import("../data.js").productObj | undefined}
 */
export function getProductBySlug() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");

  /**
   * @type {import("../data.js").productObj | undefined}
   */
  const product = Products.find((p) => p.slug === slug);
  return product;
}
