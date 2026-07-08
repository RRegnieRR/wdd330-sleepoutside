import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function getDiscount(product) {
  const discount =
    ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) *
    100;

  return Math.round(discount);
}

function discountTemplate(product) {
  return `<div class="product__prices">
    <p class="product__regular-price">Regular Price: $${product.SuggestedRetailPrice.toFixed(2)}</p>
    <p class="product-card__price">Sale Price: $${product.FinalPrice}</p>
    <p class="product__discount">You save ${getDiscount(product)}%</p>
  </div>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    let cartItems = getLocalStorage("so-cart");

    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    const productDetail = document.querySelector(".product-detail");

    productDetail.innerHTML = `<h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.Name}"
      />
      ${discountTemplate(this.product)}
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart">Add to Cart</button>
      </div>`;
  }
}
