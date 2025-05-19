(() => {
  const data = JSON.parse(localStorage.getItem("all_data"));

  const getUserById = (id) => data.users.find((u) => u.id === id);
  const getProductById = (id) => data.products.find((p) => p.id === id);
  const ordersContainer = document.getElementById("orders-container");
  const statusFilter = document.getElementById("statusFilter");
  const sortOrder = document.getElementById("sortOrder");

  const renderOrders = () => {
    const selectedStatus = statusFilter.value;
    const sort = sortOrder.value;

    let filteredOrders = [...data.orders];

    // Filter
    if (selectedStatus !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === selectedStatus
      );
    }

    // Sort
    filteredOrders.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Clear and render
    ordersContainer.innerHTML = "";

    filteredOrders.forEach((order) => {
      const customer = getUserById(order.customerId);
      const customerName = customer
        ? `${customer.firstName} ${customer.lastName}`
        : "Unknown Customer";

      const statusClass =
        order.status === "delivered" ? "delivered" : "processing";

      const orderCard = document.createElement("div");
      orderCard.className = "order-card";

      orderCard.innerHTML = `
        <div class="order-header">Order ID: ${order.id}</div>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Date:</strong> ${order.orderDate}</p>
        <p><strong>Status:</strong> 
          <span class="status ${statusClass}">${order.status}</span>
        </p>
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
        <p><strong>Total:</strong> $${order.total}</p>
      `;

      ordersContainer.appendChild(orderCard);
    });
  };

  // Initial render
  renderOrders();

  // Event listeners for filter and sort
  statusFilter.addEventListener("change", renderOrders);
  sortOrder.addEventListener("change", renderOrders);
})();
