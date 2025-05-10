const itemsContainer = document.querySelector('.items_in_cart');
const subtotalEl = document.getElementById('subtotal');
const discountLabel = document.getElementById('discount-label');
const discountValue = document.getElementById('discount-value');
const deliveryEl = document.getElementById('delivery');
const totalEl = document.getElementById('total_price');
const promoinput = document.getElementById('promo-input');
const applypromo = document.getElementById('apply-promo');

const promos = ["fadl", "yousef", "alaa", "omnia", "hager"];
let promoapplied = false;


// show cart items 
function show_cart_items() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const cartItems = user.cart || [];

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
            </div>
        `;
        subtotalEl.style.display = 'none';
        discountLabel.style.display = 'none';
        discountValue.style.display = 'none';
        deliveryEl.style.display = 'none';
        totalEl.style.display = 'none';
        return;
    } else {
        subtotalEl.style.display = 'block';
        discountLabel.style.display = 'block';
        discountValue.style.display = 'block';
        deliveryEl.style.display = 'block';
        totalEl.style.display = 'block';
    }

    cartItems.forEach(item => {
        itemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.product.images[0]}" alt="${item.product.name}">
                <div class="content w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5>${item.product.name}</h5>
                            <p>Size: ${item.size}<br>Color: ${item.color}</p>
                        </div>
                        <i class="fa fa-trash-can" onclick="removeItem(${item.product.id}, '${item.color}', '${item.size}')"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="fw-bold">$${item.product.price}</span>
                        <div class="quantity_btn d-flex align-items-center">
                            <button onclick="decreaseQuantity(${item.product.id})">-</button>
                            <span>${item.amount}</span>
                            <button onclick="increaseQuantity(${item.product.id})">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    updateSummary();
}

// Remove Element by id
function removeItem(id, color, size) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let cartItems = user.cart || [];

    cartItems = cartItems.filter(item => {
        return !(item.product.id === id && item.color === color && item.size === size);
    });

    user.cart = cartItems;
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    show_cart_items();
}

// increase Q
function increaseQuantity(id) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let cartItems = user.cart || [];

    let item = cartItems.find(item => item.product.id === id);
    if (item) {
        item.amount++;
        user.cart = cartItems;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        show_cart_items();
    }
}

// Decrease Q
function decreaseQuantity(id) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let cartItems = user.cart || [];

    let item = cartItems.find(item => item.product.id === id);
    if (item && item.amount > 1) {
        item.amount--;
        user.cart = cartItems;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        show_cart_items();
    }
}

// update the summary
function updateSummary() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let cartItems = user.cart || [];

    promoapplied = !!user.promoApplied;

    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.product.price) * item.amount, 0);
    const discountRate = promoapplied ? 0.25 : 0.20;
    const discount = subtotal * discountRate;
    const delivery = 15;
    const total = subtotal - discount + delivery;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    discountLabel.textContent = `Discount (${(discountRate * 100).toFixed(0)}%):`;
    discountValue.textContent = `- $${discount.toFixed(2)}`;
    deliveryEl.textContent = `$${delivery.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Apply promo code
applypromo.addEventListener("click", function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    const enteredCode = promoinput.value.trim().toLowerCase();

    if (promos.includes(enteredCode)) {
        if (!promoapplied) {
            promoapplied = true;
            user.promoApplied = true;
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            alert("Promo code applied. You now have a 25% discount.");
        } else {
            alert("Promo code already applied.");
        }
    } else {
        if (promoapplied) {
            promoapplied = false;
            user.promoApplied = false;
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            alert("Invalid code! Default discount (20%) restored.");
        } else {
            alert("You do not have a valid promo code.");
        }
    }

    updateSummary();
});

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        let user = JSON.parse(localStorage.getItem("loggedInUser"));
        let cartItems = user.cart || [];
        if (cartItems.length === 0) {
            alert("Go to products page first to choose what you want before checkout.");
            return;
        }
        window.location.href = "checkout.html";
    });
}

show_cart_items();
