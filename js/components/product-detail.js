import { getProductBySlug } from "../utils/products.js";
import { formatPrice } from "../utils/currency.js";

const detailStyles = `
  :host {
    display: block;
    font-family: system-ui, sans-serif;
    color: #2d2a29;
  }
  .product-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 5%;
  }
  @media (min-width: 992px) {
    .product-container {
      grid-template-columns: 1fr 1fr;
    }
  }
  /* Left Side: Image */
  .image-viewer {
    background: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 1px solid grey;
  }
  .image-viewer img {
    max-width: 100%;
    height: auto;
    object-fit: cover;
  }
  /* Right Side: Details */
  .details-pane h1 {
    text-transform: uppercase;
    font-size: 24px;
    letter-spacing: 1.5px;
    margin: 0 0 15px 0;
  }
  .price {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 25px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
  }
  .description-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
    font-size: 14px;
    line-height: 2;
  }
  .description-list li::before {
    content: "o ";
    color: #888;
  }
  .availability {
    font-size: 13px;
    margin: 15px 0;
    color: #666;
  }
  /* Controls */
  .size-selector {
    margin: 25px 0;
  }
  .size-selector label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .size-selector select {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    border: 1px solid #ccc;
    background: #f9f9f9;
  }
  .purchase-row {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-top: 30px;
  }
  .qty-input {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    padding: 5px 15px;
  }
  .add-btn {
    background: #ccc; /* Default state as per image */
    color: white;
    border: none;
    padding: 15px 40px;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    flex: 1;
    max-width: 200px;
  }
  .wish-btn {
    border: 1px solid #ddd;
    background: none;
    padding: 12px;
    cursor: pointer;
  }
  .size-guide-btn {
    margin-top: 20px;
    background: black;
    color: white;
    border: none;
    padding: 12px 30px;
    width: fit-content;
    cursor: pointer;
    text-transform: lowercase;
  }
`;

class ZyraProductDetail extends HTMLElement {
  connectedCallback() {
    const product = getProductBySlug();
    if (product) {
      this.render(product);
      this.updateVisualPrice(product);
    } else {
      this.innerHTML = `<h1>Product Not Found</h1>`;
    }

    window.addEventListener("currency-changed", () => {
      if (product) this.updateVisualPrice(product);
    });
  }

  /**
   * @param {import("./navbar.js").productObj} productData
   **/
  async updateVisualPrice(productData) {
    const targetCurrency = localStorage.getItem("currency") || "NGN";
    const formatted = await formatPrice(productData.price, targetCurrency);

    const priceEl = this.querySelector(".price");
    if (priceEl) priceEl.textContent = formatted;
  }

  /**
   * @param {import("../data.js").productObj} data -
   */
  render(data) {
    const { name, price, currency, image } = data;
    const symbol = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" }[currency] || "₦";
    this.innerHTML = `
      <style>${detailStyles}</style>
      <div class="product-container">
        <div class="image-viewer">
          <img src="${image}" alt="${name}" />
        </div>
        
        <div class="details-pane">
          <h1>${name} -</h1>
          <div class="price">${symbol}${Number(price).toLocaleString("en-us", { currency })}</div>
          
          <div class="description-section">
            <span style="font-size: 12px; font-weight: bold; text-transform: uppercase;">Description:</span>
            <ul class="description-list">
              <li>Fabric Type : Crepe</li>
              <li>Base Colour: Burnt Orange</li>
              <li>Full Length: 24"</li>
              <li>Model is wearing 10</li>
            </ul>
          </div>

          <div class="availability">Availability: In Stock</div>

          <div class="size-selector">
            <label>Size</label>
            <select>
              <option>Choose an option</option>
              <option>8</option>
              <option>10</option>
              <option>12</option>
            </select>
          </div>

          <div class="purchase-row">
            <div class="qty-input">
              <span>0</span>
            </div>
            <button class="add-btn">Add to Cart</button>
            <button class="wish-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>

          <button class="size-guide-btn">See size guide</button>
        </div>
      </div>
    `;
  }
}

customElements.define("zyra-product-detail", ZyraProductDetail);
