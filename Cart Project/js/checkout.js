const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
const cartItems = loggedInUser.cart || [];
const orderList = document.getElementById('order-summary');
const totalPriceEl = document.getElementById('total-checkout');
let subtotal = 0;
let promoapplied = false;

if (loggedInUser.promoApplied) {
    promoapplied = true;
}

if (cartItems.length === 0) {
    orderList.innerHTML = `<li class="list-group-item text-center">Your cart is empty.</li>`;
    totalPriceEl.textContent = "$0.00";
} else {
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
              <strong>${item.product.name}</strong>
              <br />
              <small>Qty: ${item.amount}</small>
            </div>
            <span>$${(item.product.price * item.amount).toFixed(2)}</span>
        `;
        subtotal += item.product.price * item.amount;
        orderList.appendChild(li);
    });

    const discountRate = promoapplied ? 0.25 : 0.2;
    const discount = subtotal * discountRate;
    const delivery = 15;
    const finalTotal = subtotal - discount + delivery;

    orderList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Discount (${(discountRate * 100).toFixed(0)}%)</span>
            <span class="text-danger">- $${discount.toFixed(2)}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <span>Delivery</span>
            <span>$${delivery.toFixed(2)}</span>
        </li>
    `;

    totalPriceEl.textContent = `$${finalTotal.toFixed(2)}`;
}

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let userName = document.querySelector('input[placeholder="Full Name"]').value;
    let address = document.querySelector('input[placeholder="Address"]').value;

    const orderDate = new Date().toISOString().split('T')[0];
    let newOrders = [{
        FullName: userName,
        Address: address,
        items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.amount,
            price: item.product.price
        })),
        total: (subtotal - (subtotal * (promoapplied ? 0.25 : 0.2)) + 15).toFixed(2),
        status: "processing",
        orderDate: orderDate
    }];

    let allData = JSON.parse(localStorage.getItem('all_data')) || { users: [], orders: [], categories: [] };
    const insufficientStockItems = cartItems.filter(item => {
        const product = allData.products.find(p => p.id === item.product.id);
        return product && product.stock < item.amount;
    });

    if (insufficientStockItems.length > 0) {
        let productNames = insufficientStockItems.map(item => item.product.name).join(", ");
        Swal.fire({
            title: 'Insufficient Stock!',
            text: `Sorry, we do not have enough stock for the following products: ${productNames}. Please reduce the quantity.`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    allData.orders.push(...newOrders);

    const userIndex = allData.users.findIndex(u => u.id === loggedInUser.id);
    if (userIndex !== -1) {
        if (!Array.isArray(allData.users[userIndex].orders)) {
            allData.users[userIndex].orders = [];
        }
        allData.users[userIndex].orders.push(...newOrders.map((_, i) => allData.orders.length - newOrders.length + i));
    }

    cartItems.forEach(item => {
        const productIndex = allData.products.findIndex(p => p.id === item.product.id);
        if (productIndex !== -1) {
            const product = allData.products[productIndex];
            product.stock -= item.amount;
        }
    });

    localStorage.setItem("all_data", JSON.stringify(allData));

    loggedInUser.cart = [];
    loggedInUser.promoApplied = false;
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been placed successfully. Redirecting to cart.',
        confirmButtonColor: '#3085d6',
        timer: 3000,
        showConfirmButton: false
    }).then(() => {
        window.location.replace("cart.html");
    });
});
