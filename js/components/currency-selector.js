const selectStyle = `
    background: transparent;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 6px 8px;
    font-size: 0.8rem;
    width: fit-content;
`;

class CurrencySelector extends HTMLElement {
  connectedCallback() {
    this.render();
    this.updateCurrency();
  }

  render() {
    this.innerHTML = `
    <select name="currency" id="currency-selector" style="${selectStyle}">
      <option value="NGN" selected>₦ NGN</option>
      <option value="USD">$ USD</option>
      <option value="EUR">€ EUR</option>
      <option value="GBP">£ GBP</option>
    </select>
    `;
  }

  updateCurrency() {
    /**
     * @type {HTMLSelectElement}
     */
    const currencySelector = this.querySelector("#currency-selector");

    const currency = localStorage.getItem("currency");
    if (currency) {
      const options = currencySelector.options;
      for (let i = 0; i < options.length; i++) {
        const element = options[i];
        if (element.value === currency) currencySelector.selectedIndex = i;
      }
    }

    // Inside js/components/currency-selector.js
    currencySelector.addEventListener("change", (e) => {
      const selectedValue = e.target.value;
      localStorage.setItem("currency", selectedValue);

      // Notify the whole window that prices need to change
      window.dispatchEvent(
        new CustomEvent("currency-changed", {
          detail: { currency: selectedValue },
        }),
      );
    });

    addEventListener("currency-changed", (e) => {
      const options = currencySelector.options;
      for (let i = 0; i < options.length; i++) {
        const element = options[i];
        if (element.value === e.detail) currencySelector.selectedIndex = i;
      }
    });
  }
}

customElements.define("currency-selector", CurrencySelector);
