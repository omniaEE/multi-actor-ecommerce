// ----- cart.js -----
const itemsContainer = document.querySelector(".items_in_cart");
const subtotalEl = document.getElementById("subtotal");
const discountLabel = document.getElementById("discount-label");
const discountValue = document.getElementById("discount-value");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total_price");
const promoinput = document.getElementById("promo-input");
const applypromo = document.getElementById("apply-promo");
const promos = ["fadl", "yousef", "alaa", "omnia", "hager"];
let promoapplied = false;

function show_cart_items() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const cartItems = user.cart || [];
  const allData = JSON.parse(localStorage.getItem("all_data"));
  itemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    itemsContainer.innerHTML = `
            <div class="empty-cart text-center py-5">
                <span class="icon-wrapper">
                    <i class="fas fa-shopping-cart cart-icon"></i>
                    <i class="fas fa-xmark x-icon"></i>
                </span>
                <p class="empty-message mt-3">Your Cart is Empty </p><br/>
                <a href="../products pages/catalog.html">Click Here to go to Products</a>
            </div>`;
    subtotalEl.style.display = "none";
    discountLabel.style.display = "none";
    discountValue.style.display = "none";
    deliveryEl.style.display = "none";
    totalEl.style.display = "none";
    return;
  } else {
    subtotalEl.style.display = "block";
    discountLabel.style.display = "block";
    discountValue.style.display = "block";
    deliveryEl.style.display = "block";
    totalEl.style.display = "block";
  }

  cartItems.forEach((item) => {
    const product = allData.products.find((p) => p.id === item.product.id);
    itemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.product.images[0]}" data-productid="${item.product.id
      }" style="cursor: pointer;" alt="${item.product.name}">
                <div class="content w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5>${item.product.name}</h5>
                            <p>Size: ${item.size}<br>Color: ${item.color}</p>
                             <span style="display:none;">Max available: ${product ? product.stock : 0
      }</span>
                        </div>
                        <i class="fa fa-trash-can" onclick="removeItem(${item.product.id
      }, '${item.color}', '${item.size}')"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="fw-bold">$${item.product.price}</span>
                        <div class="quantity_btn d-flex align-items-center">
                            <button onclick="decreaseQuantity(${item.product.id
      }, '${item.color}', '${item.size}')">-</button>
                            <span>${item.amount}</span>
                            <button onclick="increaseQuantity(${item.product.id
      }, '${item.color}', '${item.size}')">+</button>
                        </div>
                    </div>
                </div>
            </div>`;
  });

  updateSummary();

  //open product details
  itemsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      const imageSrc = e.target.src;
      console.log(imageSrc)
      window.location.href = `../products pages/productDetails.html?id=${e.target.dataset.productid}`;
    }
  });
}

function increaseQuantity(id, color, size) {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let cartItems = user.cart;

  let totalAmountForThisProduct = cartItems.filter(item => item.product.id === id).reduce((sum, item) => +sum + +(item.amount), 0);
  console.log(totalAmountForThisProduct)

  let targetItem = cartItems.find(
    (item) =>
      item.product.id === id &&
      item.color === color &&
      item.size === size
  );

  const allData = JSON.parse(localStorage.getItem("all_data"));
  const product = allData.products.find((p) => p.id === id);

  if (targetItem && product) {
    if (totalAmountForThisProduct < product.stock) {
      targetItem.amount++;

      user.cart = cartItems;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      show_cart_items();
    } else {
      Swal.fire({
        title: "Out of Stock!",
        text: `Sorry, only ${product.stock} units available in total for this product.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }
}



function decreaseQuantity(id, color, size) {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let cartItems = user.cart || [];
  let item = cartItems.find(
    (item) =>
      item.product.id === id && item.color === color && item.size === size
  );
  if (item && item.amount > 1) {
    item.amount--;
    user.cart = cartItems;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    show_cart_items();
  } else if (item && item.amount === 1) {
    removeItem(id, color, size);
  }
}

function removeItem(id, color, size) {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let cartItems = user.cart || [];
  const removedItem = cartItems.find(
    (item) =>
      item.product.id === id && item.color === color && item.size === size
  );
  if (removedItem) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove ${removedItem.product.name} from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        cartItems = cartItems.filter(
          (item) =>
            item.product.id !== id || item.color !== color || item.size !== size
        );
        user.cart = cartItems;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        show_cart_items();
        Swal.fire(
          "Removed!",
          `${removedItem.product.name} has been removed from your cart.`,
          "success"
        );
      }
    });
  }
}

function updateSummary() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let cartItems = user.cart || [];
  promoapplied = !!user.promoApplied;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.amount,
    0
  );
  const discountRate = promoapplied ? 0.25 : 0.2;
  const discount = subtotal * discountRate;
  const delivery = 15;
  const total = subtotal - discount + delivery;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  discountLabel.textContent = `Discount (${(discountRate * 100).toFixed(0)}%):`;
  discountValue.textContent = `- $${discount.toFixed(2)}`;
  deliveryEl.textContent = `$${delivery.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

applypromo.addEventListener("click", function () {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  const enteredCode = promoinput.value.trim().toLowerCase();
  if (promos.includes(enteredCode)) {
    if (!promoapplied) {
      promoapplied = true;
      user.promoApplied = true;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      Swal.fire({
        title: "Success!",
        text: "Promo code applied. You now have a 25% discount.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Info!",
        text: "Promo code already applied.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  } else {
    if (promoapplied) {
      promoapplied = false;
      user.promoApplied = false;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      Swal.fire({
        title: "Invalid Code!",
        text: "Invalid code! Default discount (20%) restored.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: "You do not have a valid promo code.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  }
  updateSummary();
});

const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let cartItems = user.cart || [];
    if (cartItems.length === 0) {
      Swal.fire({
        title: "Oops!",
        text: "Go to products first before checkout!",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    window.location.href = "checkout.html";
  });
}

show_cart_items();
