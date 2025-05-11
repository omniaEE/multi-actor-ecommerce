// MARK: Search
function searchProducts(query) {
  // Validation
  if (!query || typeof query !== "string") {
    return [];
  }

  query = query.trim().toLowerCase();
  if (query.length === 0) {
    return [];
  }

  const data = JSON.parse(localStorage.getItem("all_data") || "{}");
  return data.products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
}

// Display search results
function displayResults(results) {
  const resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = "";

  if (results.length === 0) {
    resultsContainer.classList.remove("show");
    return;
  }

  results.forEach((product) => {
    const item = document.createElement("a");
    item.className = "dropdown-item";
    item.textContent = product.name;
    item.addEventListener("click", () => {
      window.location.href = `../products pages/productDetails.html?id=${product.id}`;
    });
    resultsContainer.appendChild(item);
  });

  resultsContainer.classList.add("show");
}

// Debounce function to limit search calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <small class="col-4">${averageRating}</small>
              </div>
              <h5 class="card-text d-flex ${
                discount ? "justify-content-center" : "justify-content-start"
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
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <i class="fa-solid fa-star text-warning col-1"></i>
                <small class="col-4">${averageRating}</small>
              </div>
              <h5 class="card-text d-flex ${
                discount ? "justify-content-center" : "justify-content-start"
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

// MARK: Load
document.addEventListener("DOMContentLoaded", () => {
  // Setup search
  const searchInput = document.getElementById("searchInput");

  // Debounced search
  const debouncedSearch = debounce((value) => {
    const results = searchProducts(value);
    displayResults(results);
  }, 300);

  // Input event listener
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  });

  // Hide results when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !searchInput.contains(e.target) &&
      !document.getElementById("searchResults").contains(e.target)
    ) {
      document.getElementById("searchResults").classList.remove("show");
    }
  });

  // Load latest products
  loadLatestProducts();

  // Load Top Sells products
  loadFirstProducts();

  // تحديد جميع عناصر الفئات
  const categoryItems = document.querySelectorAll("[data-category]");

  // إضافة حدث النقر لكل فئة
  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      // توجيه المستخدم إلى صفحة الكتالوج مع إضافة معامل الفئة
      window.location.href = `../products pages/catalog.html?category=${category}`;
    });
  });
});
