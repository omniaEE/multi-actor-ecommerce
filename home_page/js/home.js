//MARK: Search
function searchProducts(query) {
  // Validation
  if (!query || typeof query !== "string") {
    return [];
  }

  query = query.trim().toLowerCase();
  if (query.length === 0) {
    return [];
  }

  const data = JSON.parse(localStorage.getItem("all_data") || "[]");
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

// Event listener setup
document.addEventListener("DOMContentLoaded", () => {
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
