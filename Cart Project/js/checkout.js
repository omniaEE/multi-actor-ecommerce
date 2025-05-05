const cartItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];

const orderList = document.getElementById('order-summary');
const totalPriceEl = document.getElementById('total-checkout');

let subtotal = 0;

if (cartItems.length === 0) {
    orderList.innerHTML = `<li class="list-group-item text-center">Your cart is empty.</li>`;
    totalPriceEl.textContent = "$0.00";
} else {
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
              <strong>${item.name}</strong>
              <br />
              <small>Qty: ${item.quantity}</small>
            </div>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        subtotal += item.price * item.quantity;
        orderList.appendChild(li);
    });

    const discount = subtotal * 0.2;
    const delivery = 15;
    const finalTotal = subtotal - discount + delivery;

    orderList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Discount (20%)</span>
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
    let user = document.querySelector('input[placeholder="Full Name"]').value;
    let cartItems = JSON.parse(localStorage.getItem("checkoutItems")) || []
    let neworders = cartItems.map(item => {
        return {
            customer: user,
            product: item.name,
            quantity: item.quantity
        }
    })
    let existingorders = JSON.parse(localStorage.getItem('orders')) || [];
    let allorders = existingorders.concat(neworders)
    localStorage.setItem("orders", JSON.stringify(allorders))
    localStorage.removeItem("checkoutItems")

    window.location.href = "index2.html";
});

