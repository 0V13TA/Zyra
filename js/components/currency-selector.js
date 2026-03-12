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

    currencySelector.addEventListener("change", (e) => {
      /**
       * @type {HTMLSelectElement}
       */
      const target = e.currentTarget;
      /**
       * @type {HTMLOptionElement}
       */
      const selectedOption = target.selectedOptions[0];
      localStorage.setItem("currency", selectedOption.value);
      dispatchEvent(
        new CustomEvent("optionChange", {
          detail: selectedOption.value,
        }),
      );
    });

    addEventListener("optionChange", (e) => {
      const options = currencySelector.options;
      for (let i = 0; i < options.length; i++) {
        const element = options[i];
        if (element.value === e.detail) currencySelector.selectedIndex = i;
      }
    });
  }
}

customElements.define("currency-selector", CurrencySelector);
