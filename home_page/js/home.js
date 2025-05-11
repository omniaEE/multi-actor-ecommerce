// ./js/home.js
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

// MARK: New Arrivals
// Calculate average rating
function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 5.0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return (sum / ratings.length).toFixed(1);
}

// Load latest 4 products
function loadLatestProducts() {
  const data = JSON.parse(localStorage.getItem("all_data") || "{}");
  const products = data.products || [];
  const latestProducts = products.slice(-4).reverse(); // Get last 4 products, reverse for newest first
  const container = document.getElementById("latestProducts");
  container.innerHTML = "";

  latestProducts.forEach((product, index) => {
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
      <a href="../products pages/productDetails.html?id=${
        product.id
      }" class="col-lg col-sm-6 m-1 d-flex flex-column align-items-start mb-sm-3 text-decoration-none">
        <img src="../assets/pro${
          index + 1
        }.png" height="300px" class="row rounded-4 align-self-center" alt="${
      product.name
    }"/>
        <p class="row fw-bolder p-3 fs-6">${product.name}</p>
        <div class="ratingContainer">
          <i class="fa-solid fa-star col"></i>
          <i class="fa-solid fa-star col"></i>
          <i class="fa-solid fa-star col"></i>
          <i class="fa-solid fa-star col"></i>
          <i class="fa-solid fa-star col"></i>
          <small class="ms-2">${averageRating}</small>
        </div>
        <h5 class="d-flex">
          $${product.price.toFixed(2)}
          ${
            discount
              ? `
                <s class="oldPrice">$${oldPrice.toFixed(2)}</s>
                <span class="discountPercentage">-${discount}%</span>
              `
              : ""
          }
        </h5>
      </a>
    `;
    container.insertAdjacentHTML("beforeend", productHtml);
  });
}

// Event listener setup
document.addEventListener("DOMContentLoaded", () => {
  // Load latest products
  loadLatestProducts();

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
});
