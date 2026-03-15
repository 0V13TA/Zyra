/**
 * js/utils/currency.js
 */

const API_URL = "https://open.er-api.com/v6/latest/NGN";
let rates = null;

const symbols = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };

/**
 * Fetches latest rates based on NGN as base
 */
async function fetchRates() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    rates = data.rates;
    return rates;
  } catch (error) {
    console.error("Failed to fetch rates:", error);
    return null;
  }
}

/**
 * Converts price and returns formatted string with symbol
 * @param {number} priceInNGN
 * @param {string} targetCurrency
 */
export async function formatPrice(priceInNGN, targetCurrency) {
  if (!rates) await fetchRates();

  const rate = rates[targetCurrency] || 1;
  const converted = priceInNGN * rate;
  const symbol = symbols[targetCurrency] || "₦";

  return `${symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
