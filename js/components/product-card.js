import { formatPrice } from "../utils/currency.js";

const cardStyles = `
  :host {
    display: block;
    font-family: system-ui, sans-serif;
  }
  .card {
    position: relative;
    background: #f7f7f7; /* Matching the footer and image background */
    padding: 0;
    text-align: center;
    overflow: hidden;
    transition: background 0.3s ease, box-shadow 0.3s ease;
    outline: 1px solid #e7e7e7;
  }
  .image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .image-container img {
    max-width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  /* Sidebar Overlay (Hover State) */
  .actions-sidebar {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%) translateX(-60px);
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: white;
    padding: 12px 8px;
    border-radius: 2px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.4s ease;
    z-index: 10;
  }
  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2d2a29;
    transition: color 0.2s;
  }
  .action-btn:hover { color: #888; }
  .action-btn svg { width: 20px; height: 20px; }

  /* Hover Triggers */
  .card:hover { box-shadow: 0px 0px 10px 0px grey; }
  .card:hover .actions-sidebar { transform: translateY(-50%) translateX(0); }
  .card:hover img { transform: scale(1.03); }

  /* Info Section */
  .product-info {
    padding: 20px 10px;
    background: #fff;
  }
  .product-name {
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 2px;
    color: #2d2a29;
    margin: 0 0 8px 0;
    font-weight: 500;
  }
  .product-price {
    font-size: 14px;
    color: #555;
    letter-spacing: 0.5px;
  }
`;

class ZyraProductCard extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupListeners();
    this.updateVisualPrice();

    window.addEventListener("currency-changed", () => {
      this.updateVisualPrice();
    });
  }

  async updateVisualPrice() {
    const priceNGN = Number(this.getAttribute("price"));
    const targetCurrency = localStorage.getItem("currency") || "NGN";

    const formatted = await formatPrice(priceNGN, targetCurrency);
    const priceElement = this.querySelector(".product-price");
    if (priceElement) priceElement.textContent = formatted;
  }

  render() {
    const img = this.getAttribute("img") || "";
    const price = this.getAttribute("price") || "0.00";
    const name = this.getAttribute("name") || "Product";
    const currency = this.getAttribute("currency") || "NGN";

    this.innerHTML = `
      <style>${cardStyles}</style>
      <div class="card">
        <div class="image-container">
          <div class="actions-sidebar">
            <button class="action-btn" id="view-btn" aria-label="View">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
             <button class="action-btn" id="add-to-cart" aria-label="Add to Cart">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </button>
          </div>
          <img src="${img}" alt="${name}" loading="lazy" />
        </div>
        <div class="product-info">
          <h3 class="product-name">${name}</h3>
          <span class="product-price">${(() => {
            switch (currency) {
              case "NGN":
                return "₦";
              case "USD":
                return "$";
              case "GBP":
                return "£";
              case "EUR":
                return "€";
              default:
                return "₦";
            }
          })()}${Number(price).toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  setupListeners() {
    const cartBtn = this.querySelector("#add-to-cart");
    cartBtn?.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("add-to-cart", {
          bubbles: true,
          detail: {
            quantity: Number(this.getAttribute("quantity")) || 1,
            image: this.getAttribute("img") || "",
            type: this.getAttribute("type") || "skirt",
            price: Number(this.getAttribute("price")) || 0,
            currency: this.getAttribute("currency") || "NGN",
            slug: this.getAttribute("slug") || "product-no-name",
            name: this.getAttribute("name") || "product no name",
          },
        }),
      );
    });

    this.addEventListener("click", (e) => {
      // Only navigate if they didn't click the "Add to Cart" button
      if (!e.target.closest(".action-btn")) {
        const slug = this.getAttribute("slug");
        window.location.href = `/html/productDetail.html?id=${slug}`;
      }
    });
  }
}
customElements.define("zyra-product-card", ZyraProductCard);
