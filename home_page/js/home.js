function generateStarRating(averageRating) {
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHtml = "";

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fa-solid fa-star text-warning col-1"></i>';
  }

  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="fa-solid fa-star-half-alt text-warning col-1"></i>';
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="fa-regular fa-star text-warning col-1"></i>';
  }

  return starsHtml;
}

// Calculate average rating
function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 5.0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return (sum / ratings.length).toFixed(1);
}

// MARK: New Arrivals
// Load latest 4 products
function loadLatestProducts() {
  const data = JSON.parse(localStorage.getItem("all_data") || "{}");
  const products = data.products || [];
  const latestProducts = products.slice(-4).reverse();
  const container = document.getElementById("latestProducts");
  container.innerHTML = "";

  latestProducts.forEach((product) => {
    const oldPrice =
      product.old_price && product.old_price !== ""
        ? parseFloat(product.old_price)
        : null;
    const discount =
      oldPrice && oldPrice > product.price
        ? Math.round(((oldPrice - product.price) / oldPrice) * 100)
        : 0;
    const averageRating = calculateAverageRating(product.ratings);

    const productHtml = `
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center"> 
        <a href="../products pages/productDetails.html?id=${
          product.id
        }" class="text-decoration-none w-100" style="max-width: 300px;"> 
          <div class="card product-card rounded-4 d-flex flex-column h-100"> 
            <img src="../${
              product.images[0]
            }" class="card-img-top product-image" alt="${product.name}"/>
            <div class="card-body text-center d-flex flex-column">
              <p class="card-title text-start fw-bolder fs-6" style="width: 100%">${
                product.name
              }</p>
              <div class="row justify-content-start align-items-start mb-2">
                ${generateStarRating(averageRating)}
                <small class="col-4">${averageRating}</small>
              </div>
              <h5 class="card-text d-flex ${
                discount ? "justify-content-between" : "justify-content-start"
              } mt-auto">
                $${product.price.toFixed(2)}
                ${
                  discount
                    ? `
                      <s class="oldPrice ms-2">$${oldPrice.toFixed(2)}</s>
                      <span class="discountPercentage ms-2">-${discount}%</span>
                    `
                    : ""
                }
              </h5>
            </div>
          </div>
        </a>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", productHtml);
  });
}

// MARK: Top Sells
// Load first 4 products
function loadFirstProducts() {
  const data = JSON.parse(localStorage.getItem("all_data") || "{}");
  const products = data.products || [];
  const firstProducts = products.slice(0, 4);
  const container = document.getElementById("firstProducts");
  container.innerHTML = "";

  firstProducts.forEach((product) => {
    const oldPrice =
      product.old_price && product.old_price !== ""
        ? parseFloat(product.old_price)
        : null;
    const discount =
      oldPrice && oldPrice > product.price
        ? Math.round(((oldPrice - product.price) / oldPrice) * 100)
        : 0;
    const averageRating = calculateAverageRating(product.ratings);

    const productHtml = `
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center"> 
        <a href="../products pages/productDetails.html?id=${
          product.id
        }" class="text-decoration-none w-100" style="max-width: 300px;"> 
          <div class="card product-card rounded-4 d-flex flex-column h-100"> 
            <img src="../${
              product.images[0]
            }" class="card-img-top product-image" alt="${product.name}"/>
            <div class="card-body text-center d-flex flex-column">
              <p class="card-title text-start fw-bolder fs-6" style="width: 100%">${
                product.name
              }</p>
              <div class="row justify-content-start align-items-start mb-2">
                ${generateStarRating(averageRating)}
                <small class="col-4">${averageRating}</small>
              </div>
              <h5 class="card-text d-flex ${
                discount ? "justify-content-between" : "justify-content-start"
              } mt-auto">
                $${product.price.toFixed(2)}
                ${
                  discount
                    ? `
                      <s class="oldPrice ms-2">$${oldPrice.toFixed(2)}</s>
                      <span class="discountPercentage ms-2">-${discount}%</span>
                    `
                    : ""
                }
              </h5>
            </div>
          </div>
        </a>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", productHtml);
  });
}

// View all Btn
document.querySelector(".viewallBtn").addEventListener("click", function () {
  window.location.href = "../products pages/catalog.html";
});

// View all Btn Top Sells
document
  .querySelector("#topSellsViewAllBtn")
  .addEventListener("click", function () {
    window.location.href = "../products pages/catalog.html";
  });

// MARK: Load
document.addEventListener("DOMContentLoaded", () => {
  // Load New Arrivals products
  loadLatestProducts();

  // Load Top Sells products
  loadFirstProducts();

  // MARK: Selecting category

  const categoryItems = document.querySelectorAll("[data-category]");
  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      window.location.href = `../products pages/catalog.html?category=${category}`;
    });
  });
});
