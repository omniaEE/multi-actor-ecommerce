//render cards of all products from json file's data
//applying filter & checked
//dropdowns
//clear filter btn
let allPros = document.querySelector(".all-pros");
let categories = document.querySelector(".categories");
let filterColor = document.querySelector(".filter-color");
let filterSizes = document.querySelector(".filter-sizes");
let sizes = [
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "XXX-Large",
];
let priceInput = document.getElementById("priceRange");
let priceValue = document.getElementById("priceValue");
let proLength = document.getElementById("proLength");
let paginationContainer = document.querySelector(".pagination");

let selectedCategory = null;
let selectedMaxPrice = 3000;
let selectedSizes = [];
let selectedColors = [];
let selectedSort = "default";

let currentPage = 1;
const productsPerPage = 9;

//-----------------------------------apply toast
let toastTimeout;
function showToast() {
  const toast = document.querySelector(".tost");
  toast.style.display = "flex";
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
  toast.querySelector("i").addEventListener("click", () => {
    toast.style.display = "none";
    clearTimeout(toastTimeout);
  });
}

function renderProducts(products) {
  allPros.innerHTML = ""; // reset

  paginationContainer.innerHTML = "";

  // apply filters
  let filtered = products.filter((product) => {
    return !(
      (selectedCategory && product.category !== selectedCategory) ||
      (selectedSizes.length > 0 &&
        !selectedSizes.some((size) => product.sizes.includes(size))) ||
      (selectedColors.length > 0 &&
        !selectedColors.some((color) => product.colors.includes(color))) ||
      product.price > selectedMaxPrice
    );
  });

  // Sort filtered products
  if (selectedSort === "priceLow") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "priceHigh") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (selectedSort === "ratingHigh") {
    filtered.sort((a, b) => {
      const aAvg =
        a.ratings.reduce((acc, val) => acc + val, 0) / a.ratings.length;
      const bAvg =
        b.ratings.reduce((acc, val) => acc + val, 0) / b.ratings.length;
      return bAvg - aAvg;
    });
  }

  if (filtered.length === 0) {
    allPros.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: #666;">No products match your filters.</p>`;
    return;
  }

  // search part
  let searchInput = document.getElementById("prosSearch");
  let searchValue = searchInput.value.toLowerCase().trim();
  filtered = filtered.filter((product) =>
    product.name.toLowerCase().includes(searchValue)
  );
  if (filtered.length === 0) {
    allPros.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: #666;">No result match your search.</p>`;
  }

  // pagination
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = filtered.slice(start, end);

  //get user data
  let loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Render products
  paginatedProducts.forEach((product) => {
    const avgRating =
      product.ratings.reduce((acc, val) => acc + val, 0) /
      product.ratings.length;
    const fullStars = Math.floor(avgRating);
    const halfStar = avgRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    let starsHtml = "";
    for (let i = 0; i < fullStars; i++)
      starsHtml += `<i class="fa-solid fa-star"></i>`;
    if (halfStar) starsHtml += `<i class="fa-solid fa-star-half-stroke"></i>`;
    for (let i = 0; i < emptyStars; i++)
      starsHtml += `<i class="fa-regular fa-star"></i>`;

    allPros.innerHTML += `
            <div class="pro-card">
                <img src="${product.images[0]}" data-productid="${
      product.id
    }" alt="">
                <p data-productid="${product.id}">${product.name}</p>
                <div class="rating">
                    ${starsHtml}
                    &nbsp;
                    <small>${avgRating.toPrecision(2)}</small>
                </div>
                <h2>$${product.price} <s>${
      product.old_price ? "$" + product.old_price : ""
    }</s> ${
      product.old_price
        ? "<span>-" +
          Math.floor(
            ((product.old_price - product.price) / product.old_price) * 100
          ) +
          "%</span>"
        : ""
    }</h2>
                <div class="review-header" >
                ${
                  product.stock > 0
                    ? '<button class="add-to-cart" >Add To Cart</button>'
                    : '<h3 id="product-stock"><span>Out of Stock</span></h3>'
                }
                ${
                  loggedUser && loggedUser.fav?.find((p) => p.id == product.id)
                    ? '<i class="fa-solid fa-heart" style="color:#d90b0b;"></i>'
                    : '<i class="fa-regular fa-heart"></i>'
                }
                </div>
            </div>
        `;
  });

  let allCards = document.querySelectorAll(".pro-card");
  allCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (loggedUser) {
        //add in cart
        if (e.target.classList.contains("add-to-cart")) {
          //get product obj
          let product = products.find(
            (p) =>
              p.id ==
              e.target.parentNode.parentNode.children[0].dataset.productid
          );

          let existingCartItem = loggedUser.cart.find(
            (p) =>
              p.product.id == product.id &&
              p.color == product.colors[0] &&
              p.size == product.sizes[0]
          );
          if (existingCartItem) {
            existingCartItem.amount = Number(existingCartItem.amount) + 1;
          } else {
            loggedUser.cart.push({
              product: product,
              amount: 1,
              color: product.colors[0],
              size: product.sizes[0],
            });
          }
          localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
          //----------toast
          showToast();

          //add in fav
        } else if (e.target.classList.contains("fa-heart")) {
          //get product obj
          let product = products.find(
            (p) =>
              p.id ==
              e.target.parentNode.parentNode.children[0].dataset.productid
          );

          loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
          let existingFavItem = loggedUser.fav.find((p) => p.id == product.id);
          if (existingFavItem) {
            loggedUser.fav = loggedUser.fav.filter(
              (element) => element.id != product.id
            );
          } else {
            loggedUser.fav.push(product);
          }
          localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
          renderProducts(products);
        }
      } else {
        window.location.href = `../login/login.html`;
      }
    });
  });

  // Render pagination buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
      btn.style.fontWeight = "bold";
      btn.style.backgroundColor = "#000";
      btn.style.color = "#fff";
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts(products);
    });
    paginationContainer.appendChild(btn);
  }

  //open product details
  allPros.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "P") {
      window.location.href = `productDetails.html?id=${e.target.dataset.productid}`;
    }
  });
}

// MARK:Category filter from home page
function checkUrlForCategory() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");

  if (categoryFromUrl) {
    // Find the category in your categories
    const allCategories = JSON.parse(
      localStorage.getItem("all_data")
    ).categories;
    const matchedCategory = allCategories.find(
      (cat) => cat.name.toLowerCase() === categoryFromUrl.toLowerCase()
    );

    if (matchedCategory) {
      selectedCategory = matchedCategory.name;

      // Highlight the category
      document
        .querySelectorAll(".categories .category-item")
        .forEach((item) => {
          item.classList.remove("active");
          if (
            item.querySelector("p").textContent.trim() === matchedCategory.name
          ) {
            item.classList.add("active");
            // Apply the same styles as clicking manually
            item.style.fontWeight = "bold";
            item.style.color = "#000";
          }
        });
    }
  }
}

let allProducts = JSON.parse(localStorage.getItem("all_data")).products;

// Check for category in URL when page loads
checkUrlForCategory();

proLength.innerText = allProducts.length + " Items";

//category
JSON.parse(localStorage.getItem("all_data")).categories.forEach((category) => {
  let categoryDiv = document.createElement("div");
  categoryDiv.classList.add("category-item");
  categoryDiv.innerHTML = `<p>${category.name}</p><i class="fa-solid fa-plus"></i>`;

  categoryDiv.addEventListener("click", () => {
    selectedCategory = category.name;
    document.querySelectorAll(".categories .category-item").forEach((item) => {
      item.classList.remove("active");
      item.style.fontWeight = ""; // Reset style
      item.style.color = ""; // Reset style
    });
    categoryDiv.classList.add("active");
    categoryDiv.style.fontWeight = "bold";
    categoryDiv.style.color = "#000";
    currentPage = 1;
    renderProducts(allProducts);

    // // Update URL without reloading
    // const url = new URL(window.location);
    // url.searchParams.set("category", category.name.toLowerCase());
    // window.history.pushState({}, "", url);
  });
  // Update URL without reloading
  const url = new URL(window.location);
  url.searchParams.set("category", category.name.toLowerCase());
  window.history.pushState({}, "", url);

  categories.appendChild(categoryDiv);
});

//price
priceInput.addEventListener("input", () => {
  selectedMaxPrice = parseInt(priceInput.value);
  priceValue.textContent = selectedMaxPrice;
  currentPage = 1;
  renderProducts(allProducts);
});

//size
sizes.forEach((size) => {
  const sizeBtn = document.createElement("button");
  sizeBtn.textContent = size;
  sizeBtn.classList.add("size-btn");
  sizeBtn.addEventListener("click", () => {
    sizeBtn.classList.toggle("active");
    if (selectedSizes.includes(size)) {
      selectedSizes = selectedSizes.filter((s) => s !== size);
    } else {
      selectedSizes.push(size);
    }
    currentPage = 1;
    renderProducts(allProducts);
  });
  filterSizes.appendChild(sizeBtn);
});

//color
const allColors = new Set();
allProducts.forEach((p) => p.colors.forEach((c) => allColors.add(c)));
allColors.forEach((color) => {
  const colorDiv = document.createElement("div");
  colorDiv.style.backgroundColor = color;
  colorDiv.addEventListener("click", () => {
    if (selectedColors.includes(color)) {
      selectedColors = selectedColors.filter((c) => c !== color);
      colorDiv.innerHTML = "";
    } else {
      selectedColors.push(color);
      if (
        colorDiv.style.backgroundColor == "white" ||
        colorDiv.style.backgroundColor == "beige"
      ) {
        colorDiv.innerHTML = `<i class="fa-solid fa-check" style="color:black;"></i>`;
      } else {
        colorDiv.innerHTML = `<i class="fa-solid fa-check"></i>`;
      }
    }
    currentPage = 1;
    renderProducts(allProducts);
  });
  filterColor.appendChild(colorDiv);
});

renderProducts(allProducts); // Initial render

//search
document.getElementById("prosSearch").addEventListener("input", () => {
  renderProducts(allProducts);
});

//sort select
document.getElementById("sortSelect").addEventListener("change", (e) => {
  selectedSort = e.target.value;
  renderProducts(allProducts);
});

//clear filter btn
document.getElementById("clear-filters").addEventListener("click", () => {
  selectedCategory = null;
  selectedSizes = [];
  selectedColors = [];
  selectedMaxPrice = 3000;
  priceInput.value = 3000;
  priceValue.textContent = 3000;
  document
    .querySelectorAll(".categories .category-item")
    .forEach((div) => div.classList.remove("active"));
  document
    .querySelectorAll(".filter-sizes button")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".filter-color div")
    .forEach((div) => (div.innerHTML = ""));

  // Remove category from URL
  const url = new URL(window.location);
  url.searchParams.delete("category");
  window.history.pushState({}, "", url);

  renderProducts(allProducts);
});

//dropdowns
document.querySelectorAll(".filter-header").forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector("i");

    if (content && content.classList.contains("filter-content")) {
      content.classList.toggle("open");
      icon.classList.toggle("rotate");
    }
  });
});

//filter menu (responsive)
let filterMenu = document.getElementById("filterMenu");
let filterMenu2 = document.getElementById("filterMenu2");
filterMenu.addEventListener("click", () => {
  if (document.getElementsByTagName("aside")[0].style.display == "block") {
    document.getElementsByTagName("aside")[0].style.display = "none";
  } else {
    document.getElementsByTagName("aside")[0].style.display = "block";
  }
});
filterMenu2.addEventListener("click", () => {
  if (document.getElementsByTagName("aside")[0].style.display == "block") {
    document.getElementsByTagName("aside")[0].style.display = "none";
  } else {
    document.getElementsByTagName("aside")[0].style.display = "block";
  }
});
