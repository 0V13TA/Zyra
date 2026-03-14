import Products from "./data.js";

export function getProductBySlug() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  return Products.find((p) => p.slug === slug);
}
