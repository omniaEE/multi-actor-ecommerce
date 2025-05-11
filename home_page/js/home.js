// MARK: Rating Stars
function generateStarRating(averageRating) {
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHtml = "";

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fa-solid fa-star text-warning"></i>';
  }

  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="fa-solid fa-star-half-alt text-warning"></i>';
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="fa-regular fa-star text-warning"></i>';
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
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  latestProducts.forEach((product) => {
    const oldPrice =
      product.old_price && product.old_price !== ""
        ? parseFloat(product.old_price)
        : null;
    const discount =
      oldPrice && oldPrice > product.price
        ? Math.floor(((oldPrice - product.price) / oldPrice) * 100)
        : 0;
    const averageRating = calculateAverageRating(product.ratings);
    const starsHtml = generateStarRating(averageRating);

    // NEW TEMPLATE IMPLEMENTATION FOR NEW ARRIVALS
    const productHtml = `
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center"> 
        <div class="pro-card">
          <img src="../${product.images[0]}" data-productid="${
      product.id
    }" alt="${product.name}">
          <p data-productid="${product.id}">${product.name}</p>
          <div class="rating">
            ${starsHtml}
            &nbsp;
            <small>${averageRating}</small>
          </div>
          <h2>$${product.price.toFixed(2)} 
            ${oldPrice ? `<s>$${oldPrice.toFixed(2)}</s>` : ""}
            ${discount ? `<span>-${discount}%</span>` : ""}
          </h2>
          <div class="review-header">
            ${
              product.stock > 0
                ? `<button class="add-to-cart" data-product-id="${product.id}">Add To Cart</button>`
                : `<h3 id="product-stock"><span>Out of Stock</span></h3>`
            }
            ${
              loggedUser &&
              loggedUser.fav &&
              loggedUser.fav.find((p) => p.id == product.id)
                ? '<i class="fa-solid fa-heart" style="color:#d90b0b;"></i>'
                : '<i class="fa-regular fa-heart"></i>'
            }
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", productHtml);
  });

  // Add event listeners for the new elements
  addProductCardEventListeners();
}

// MARK: Top Sells
// Load first 4 products
function loadFirstProducts() {
  const data = JSON.parse(localStorage.getItem("all_data") || "{}");
  const products = data.products || [];
  const firstProducts = products.slice(0, 4);
  const container = document.getElementById("firstProducts");
  container.innerHTML = "";
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  firstProducts.forEach((product) => {
    const oldPrice =
      product.old_price && product.old_price !== ""
        ? parseFloat(product.old_price)
        : null;
    const discount =
      oldPrice && oldPrice > product.price
        ? Math.floor(((oldPrice - product.price) / oldPrice) * 100)
        : 0;
    const averageRating = calculateAverageRating(product.ratings);
    const starsHtml = generateStarRating(averageRating);

    // NEW TEMPLATE IMPLEMENTATION FOR TOP SELLS (same structure as New Arrivals)
    const productHtml = `
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center"> 
        <div class="pro-card">
          <img src="../${product.images[0]}" data-productid="${
      product.id
    }" alt="${product.name}">
          <p data-productid="${product.id}">${product.name}</p>
          <div class="rating">
            ${starsHtml}
            &nbsp;
            <small>${averageRating}</small>
          </div>
          <h2>$${product.price.toFixed(2)} 
            ${oldPrice ? `<s>$${oldPrice.toFixed(2)}</s>` : ""}
            ${discount ? `<span>-${discount}%</span>` : ""}
          </h2>
          <div class="review-header">
            ${
              product.stock > 0
                ? `<button class="add-to-cart" data-product-id="${product.id}">Add To Cart</button>`
                : `<h3 id="product-stock"><span>Out of Stock</span></h3>`
            }
            ${
              loggedUser &&
              loggedUser.fav &&
              loggedUser.fav.find((p) => p.id == product.id)
                ? '<i class="fa-solid fa-heart" style="color:#d90b0b;"></i>'
                : '<i class="fa-regular fa-heart"></i>'
            }
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", productHtml);
  });

  // Add event listeners for the new elements
  addProductCardEventListeners();
}

// Helper function to add event listeners to product cards
function addProductCardEventListeners() {
  // Click event for product images and names
  document
    .querySelectorAll(
      ".pro-card img[data-productid], .pro-card p[data-productid]"
    )
    .forEach((element) => {
      element.addEventListener("click", function () {
        const productId = this.getAttribute("data-productid");
        window.location.href = `../products pages/productDetails.html?id=${productId}`;
      });
    });

  // Click event for add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      // Add your add to cart logic here
      console.log(`Add to cart clicked for product ${productId}`);
    });
  });

  // Click event for heart icons
  document.querySelectorAll(".fa-heart").forEach((heart) => {
    heart.addEventListener("click", function () {
      const isSolid = this.classList.contains("fa-solid");
      // Add your favorite toggle logic here
      console.log(`Favorite ${isSolid ? "removed" : "added"}`);
    });
  });
}

// MARK: AddToCart & Fav buttons handler
function handleProductCardInteractions() {
  const allCards = document.querySelectorAll(".pro-card");
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const data = JSON.parse(localStorage.getItem("all_data") || "{}");

  allCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Early return if not logged in
      if (!loggedUser) {
        window.location.href = "../../login/login.html";
        return;
      }

      // Helper function to get product from card
      const getProductFromCard = (element) => {
        const productId = element.closest(".pro-card").querySelector("img")
          .dataset.productid;
        return data.products.find((p) => p.id == productId);
      };

      // Handle add to cart
      if (e.target.classList.contains("add-to-cart")) {
        e.stopPropagation(); // Prevent card click event
        const product = getProductFromCard(e.target);

        // Update cart
        const existingCartItem = loggedUser.cart.find(
          (p) => p.product.id == product.id
        );
        if (existingCartItem) {
          existingCartItem.amount += 1;
        } else {
          loggedUser.cart.push({
            product: product,
            amount: 1,
            color: product.colors?.[0] || null,
            size: product.sizes?.[0] || null,
          });
        }

        localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
        showToast(); // Show notification

        // Handle favorite toggle
      } else if (e.target.classList.contains("fa-heart")) {
        e.stopPropagation(); // Prevent card click event
        const product = getProductFromCard(e.target);

        // Toggle favorite status
        const existingFavIndex = loggedUser.fav.findIndex(
          (p) => p.id == product.id
        );
        if (existingFavIndex !== -1) {
          loggedUser.fav.splice(existingFavIndex, 1);
        } else {
          loggedUser.fav.push(product);
        }

        localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

        // Update UI without full reload by toggling heart classes
        e.target.classList.toggle("fa-regular");
        e.target.classList.toggle("fa-solid");
        e.target.style.color = e.target.classList.contains("fa-solid")
          ? "#d90b0b"
          : "";
      }
    });

    // Add separate click handlers for product image and name to maintain link functionality
    const productLinkElements = card.querySelectorAll(
      "img[data-productid], p[data-productid]"
    );
    productLinkElements.forEach((el) => {
      el.addEventListener("click", (e) => {
        if (
          !e.target.classList.contains("add-to-cart") &&
          !e.target.classList.contains("fa-heart")
        ) {
          window.location.href = `../products pages/productDetails.html?id=${e.target.dataset.productid}`;
        }
      });
    });
  });
}

// MARK: View all Btns
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

  // Handle Cart Interactions
  handleProductCardInteractions();

  // MARK: Selecting category
  const categoryItems = document.querySelectorAll("[data-category]");
  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      window.location.href = `../products pages/catalog.html?category=${category}`;
    });
  });
});
