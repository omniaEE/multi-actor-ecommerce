// active navbar
const observer = new MutationObserver(() => {
  const overView = document.getElementById("overView_page");
  if (overView) {
    overView.classList.add("nav-active");
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
//------------------------------------------------------------------------------------
(() => {
  //welcome message
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || [];

  if (user) {
    document.getElementById("userName").innerText = user.firstName;
  }

  //-----------------------------------------------------------------------------
  const updateChangeBadge = (id, changeValue) => {
    const el = document.getElementById(id);
    const isPositive = changeValue >= 0;

    el.textContent = `${isPositive ? "↑" : "↓"} ${Math.abs(changeValue).toFixed(
      1
    )}%`;
    el.className = `badge ${isPositive ? "bg-success" : "bg-danger"}`;
  };

  //---------------------------------------------------------------------------------------------
  const all_data = JSON.parse(localStorage.getItem("all_data")) || {};

  let totalUsers = 0;
  let totalProducts = 0;
  let totalOrders = 0;

  if (!all_data) {
    console.error("No data found in localStorage under 'all-data'");
    return;
  }

  try {
    totalUsers = all_data.users.length;
    totalProducts = all_data.products.length;
    totalOrders = all_data.orders.length;

    document.getElementById("totalUsers").textContent = totalUsers;
    document.getElementById("totalProducts").textContent = totalProducts;
    document.getElementById("totalOrders").textContent = totalOrders;

    if (all_data) {
      orders = all_data.orders;
      products = all_data.products;
      users = all_data.users;

      const customersCount = users.filter(
        (user) => user.role?.toLowerCase() === "customer"
      ).length;
      document.getElementById("totalUsers").textContent = customersCount;

      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(now.getDate() - 30);

      const newUsers = users.filter((users) => {
        const createdAt = new Date(users.createdAt);
        return createdAt >= oneMonthAgo;
      });

      const newProducts = products.filter((products) => {
        const createdAt = new Date(products.createdAt);
        return createdAt >= oneMonthAgo;
      });

      const newOrders = orders.filter((order) => {
        const createdAt = new Date(order.orderDate);
        return createdAt >= oneMonthAgo;
      });

      totalUsers = users.length;
      const newUsersCount = newUsers.length;
      const changePercent =
        totalUsers === 0 ? 0 : (newUsersCount / totalUsers) * 100;

      totalProducts = products.length;
      const newProductsCount = newProducts.length;
      const productsChange =
        totalProducts === 0 ? 0 : (newProductsCount / totalProducts) * 100;

      totalOrders = orders.length;
      const newOrdersCount = newOrders.length;
      const ordersChange =
        totalOrders === 0 ? 0 : (newOrdersCount / totalOrders) * 100;

      updateChangeBadge("totalUsersChange", changePercent);
      updateChangeBadge("productsChange", productsChange);
      updateChangeBadge("ordersChange", ordersChange);
    } else {
      console.warn("no data found in localStorage");
    }
  } catch (error) {
    console.error("Failed to parse data from localStorage:", error);
  }

  //-------------------------------------------------------------------------------------------
  //new orders
  const newOrders = all_data.orders;

  for (let i = newOrders.length - 1; i >= 0; i--) {
    const user = users.find((u) => u.id === newOrders[i].customerId) || {
      firstName: "",
      lastName: "",
    };

    let productNames = "";

    newOrders[i].items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      const productName = product ? product.name : "no product";
      productNames += `${productName} <br>`;
    });

    document.getElementsByTagName("tbody")[0].innerHTML += `
        <tr">
            <td data-label="Customer"><i class="fa-solid fa-circle-user"></i> ${user.firstName} ${user.lastName}</td>
            <td data-label="product">${productNames}</td>
            <td data-label="Order Date">${newOrders[i].orderDate}</td>
            <td data-label="Price">${newOrders[i].total}</td>
        </tr>
    `;
  }
})();

//---------------------------------------------------------------------------
