(() => {
  const data = {
    users: [
      {
        id: 1,
        firstName: "Fadl",
        lastName: "Yousry",
        role: "customer",
        orders: [101, 102],
      },
      {
        id: 2,
        firstName: "Yousef",
        lastName: "Hesham",
        role: "customer",
        orders: [103, 104],
      },
    ],
    products: [
      { id: 201, name: "Product A" },
      { id: 202, name: "Product B" },
    ],
    orders: [
      {
        id: 101,
        customerId: 1,
        items: [{ productId: 201, quantity: 1, price: 499.99 }],
        total: 499.99,
        status: "delivered",
        orderDate: "2025-04-20",
      },
      {
        id: 102,
        customerId: 2,
        items: [{ productId: 202, quantity: 2, price: 149.99 }],
        total: 299.98,
        status: "processing",
        orderDate: "2025-04-30",
      },
    ],
  };

  // Utility functions
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
