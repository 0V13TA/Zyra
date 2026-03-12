const scriptsLink = [
  "/js/data.js",
  "/js/cart.js",
  "/js/components/currency-selector.js",
  "/js/components/footer.js",
  "/js/components/navbar.js",
  "/js/components/product-card.js",
  "/js/layout.js",
];

scriptsLink.forEach((link) => {
  const script = document.createElement("script");
  script.src = link;
  document.head.append(script);
});
