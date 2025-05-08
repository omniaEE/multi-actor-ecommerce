(() => {
  const data = JSON.parse(localStorage.getItem("all_data"));
  // console.log("all_data", data.orders);

  const getUserById = (id) => data.users.find((u) => u.id === id);
  const getProductById = (id) => data.products.find((p) => p.id === id);

  const ordersContainer = document.getElementById("orders-container");

  data.orders.forEach((order) => {
    const customer = getUserById(order.customerId);
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const statusClass =
      order.status === "delivered" ? "delivered" : "processing";

    orderCard.innerHTML = `
      <div class="order-header">Order ID: ${order.id}</div>
      <p><strong>Customer:</strong> ${customer.firstName} ${
      customer.lastName
    }</p>
      <p><strong>Date:</strong> ${order.orderDate}</p>
      <p><strong>Status:</strong> <span class="status ${statusClass}">${
      order.status
    }</span></p>
      <p><strong>Items:</strong></p>
      <div class="items">
        ${order.items
          .map((item) => {
            const product = getProductById(item.productId);
            return `<div class="item">- ${
              product?.name || "Unknown Product"
            } x ${item.quantity} @ $${item.price.toFixed(2)}</div>`;
          })
          .join("")}
      </div>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    `;

    ordersContainer.appendChild(orderCard);
  });
})();
