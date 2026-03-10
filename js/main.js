/**
 * @typedef {Object} productObj
 * @property {string} name
 * @property {number} price
 * @property {string} currency
 * @property {string} image
 * @property {number} quantity
 */

/**
 * Find and Increases the product quantity in array
 *
 * @param {productObj[]} productArr - An Array Of The Products
 * @param {string}  name - The Name of the product
 * @returns {boolean} True if it incremented else false
 *
 * @example
 * ```
 * const ParsedProducts = JSON.parse(localProducts);
 * const increased = incrementProductQuantity(ParsedProducts, product.name);
 * if (!increased) ParsedProducts.push(product);
 *
 * const stringProduct = JSON.stringify(ParsedProducts);
 * localStorage.setItem("cart", stringProduct);
 * ```
 */
function incrementProductQuantity(productArr, name) {
  if (productArr.length === 0) return false;

  const productIndex = productArr.findIndex((product) => product.name === name);
  if (productIndex === -1) return false;
  productArr[productIndex].quantity += 1;
  return true;
}

/**
 * Find and Increases the product quantity in array
 *
 * @param {productObj[]} productArr - An Array Of The Products
 * @param {string}  name - The Name of the product
 * @returns {boolean} True if it incremented else false
 *
 */
function decrementProductQuantity(productArr, name) {
  if (productArr.length === 0) return false;

  const productIndex = productArr.findIndex((product) => product.name === name);
  if (productIndex === -1) return false;
  productArr[productIndex].quantity -= 1;
  return true;
}

/**
 * Adds A Product to local storage
 *
 *
 * @param {productObj} product - The Product to be actually stored
 * @returns void Doesn't return anything
 *
 * @example
 * ```
 * addToCart({name:"Trousers",price:1000,currency:"naira",image:"/logo";quantity:30})
 * ```
 */
function addToCart(product) {
  try {
    const localProducts = localStorage.getItem("cart");
    if (localProducts === null) {
      const stringProduct = JSON.stringify(product);
      localStorage.setItem("cart", stringProduct);
      return;
    }

    /**
     * @type {productObj[]}
     */
    const ParsedProducts = JSON.parse(localProducts);

    const increased = incrementProductQuantity(ParsedProducts, product.name);
    if (!increased) ParsedProducts.push(product);

    const stringProduct = JSON.stringify(ParsedProducts);
    localStorage.setItem("cart", stringProduct);
  } catch (error) {
    if (error instanceof SyntaxError)
      console.log("Invalid Value In LocalStorage");

    if (error instanceof TypeError)
      console.log("Invalid Value Or Self Referential Value Passed.");
  }
}

/**
 * Fetches All The Products In The localStorage
 *
 * @returns {productObj[]} An Array of all the objects
 *
 * @example
 * ```
 * const Carts = getCart();
 * console.log(Carts[0].name);
 * ```
 */
function getCart() {
  try {
    const localProducts = localStorage.getItem("cart");
    if (localProducts === null) {
      return [];
    }

    /**
     * @type {productObj[]}
     */
    const ParsedProducts = JSON.parse(localProducts);
    return ParsedProducts;
  } catch (error) {
    console.log("Invalid Value In LocalStorage");
    return [];
  }
}

/**
 * Reduces the quantity of a product, if zero, it deletes it.
 *
 * @param {string} name - Name of the product
 */
function reduceProductQty(name) {
  try {
    const localProducts = localStorage.getItem("cart");
    if (localProducts === null) return;
    /**
     * @type {productObj[]}
     */
    const ParsedProducts = JSON.parse(localProducts);
    const decremented = decrementProductQuantity(ParsedProducts, name);
    if (ParsedProducts.length === 0 || !decremented) {
      console.log(`Product: ${name}, does not exist`);
      return;
    }

    const filteredProduct = ParsedProducts.filter(
      (product) => product.quantity > 0,
    );

    const stringProduct = JSON.stringify(filteredProduct);
    localStorage.setItem("cart", stringProduct);
  } catch (error) {
    if (error instanceof SyntaxError)
      console.log("Invalid Value In LocalStorage");

    if (error instanceof TypeError)
      console.log("Invalid Value Or Self Referential Value Passed.");
  }
}

/**
 * Reduces the quantity of a product, if zero, it deletes it.
 *
 * @param {string} name - Name of the product
 */
function deleteProduct(name) {
  try {
    const localProducts = localStorage.getItem("cart");
    if (localProducts === null) return;
    /**
     * @type {productObj[]}
     */
    const ParsedProducts = JSON.parse(localProducts);
    if (ParsedProducts.length === 0) {
      console.log(`Product: ${name}, does not exist`);
      return;
    }

    const filteredProduct = ParsedProducts.filter(
      (product) => product.name !== name,
    );

    const stringProduct = JSON.stringify(filteredProduct);
    localStorage.setItem("cart", stringProduct);
  } catch (error) {
    if (error instanceof SyntaxError)
      console.log("Invalid Value In LocalStorage");

    if (error instanceof TypeError)
      console.log("Invalid Value Or Self Referential Value Passed.");
  }
}
