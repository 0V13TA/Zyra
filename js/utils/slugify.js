/**
 * Converts a string into a URL-friendly slug
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toString() // Ensure it's a string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars (except -)
    .replace(/--+/g, "-"); // Replace multiple - with single -
}
