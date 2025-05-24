document.addEventListener("DOMContentLoaded", function () {
  // active navbar
  const observer = new MutationObserver(() => {
    const overView = document.getElementById("orders_page");
    if (overView) {
      overView.classList.add("nav-active");
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  //-----------------new orders-----------------------------------
  (() => {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || {};

    const users = all_data.users || [];
    const products = all_data.products || [];
    const newOrders = all_data.orders || [];

    //totsal orders statistics
    document.getElementById("totalOrders").textContent = newOrders.length;
    const deliveredCount = newOrders.filter(
      (order) => order.status === "Delivered"
    ).length;
    const ProcessingCount = newOrders.filter(
      (order) => order.status === "Processing"
    ).length;
    document.getElementById("totalDileveredOrders").textContent =
      deliveredCount;
    document.getElementById("totalProcessingOrders").textContent =
      ProcessingCount;

    for (let i = 0; i < newOrders.length; i++) {
      const user = users.find((u) => u.id === newOrders[i].customerId) || {
        firstName: "",
        lastName: "",
      };

      let productNames = "";

      newOrders[i].items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        const productName = product ? product.name : "no product";
        productNames += `${productName} x ${item.quantity}  -→  $${item.price} <br>`;
      });

      document.getElementsByTagName("tbody")[0].innerHTML += `
        <tr">
            <td data-label="Order ID">${newOrders[i].id}</td>
            <td data-label="Customer"class="ps-0"> ${user.firstName} ${
        user.lastName
      }</td>
            <td data-label="product" class="p-0" style="text-align: left;"><br>${productNames}</td>
            <td data-label="Order Date">${newOrders[i].orderDate} </td>


            <td data-label="Price">${newOrders[i].total}</td>
            <td data-label="address">${newOrders[i].Address}</td>
            <td data-label="details" class="px-0"> 
            <button class="btn btn-link p-0" onclick="openDetailsModal(${
              newOrders[i].id
            })" aria-label="View details">
                <i class="fas fa-info-circle" style="font-size: 1.5rem; color:rgb(0, 0, 0);"></i>
            </button>
            </td>
            <td data-label="Status" class="ps-0">
            <button class="btn btn-sm btn-${
              newOrders[i].status === "Delivered" ? "success" : "warning"
            } statusBtn"  data-order-id="${newOrders[i].id}">
                ${newOrders[i].status}
            </button>
            </td>
        </tr>
    `;
    }

    //---------------------- change status-- by button----------and change status in local storage----------------------------------------------
    document.addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("statusBtn")) {
        const orderId = e.target.dataset.orderId;

        const allData = JSON.parse(localStorage.getItem("all_data")) || {};
        const newOrders = allData.orders || [];

        const order = newOrders.find((order) => order.id === parseInt(orderId));

        if (order) {
          order.status =
            order.status === "Delivered" ? "Processing" : "Delivered";

          allData.orders = newOrders;
          localStorage.setItem("all_data", JSON.stringify(allData));

          e.target.innerText = order.status;
          e.target.classList.toggle("btn-success");
          e.target.classList.toggle("btn-warning");
        }
      }
    });
  })();

  // model
  window.openDetailsModal = function (orderId) {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || {};
    const users = all_data.users || [];
    const products = all_data.products || [];
    const orders = all_data.orders || [];

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const customer = users.find((u) => u.id === order.customerId) || {
      firstName: "",
      lastName: "",
    };

    let content = `
        <p><strong>Order number:</strong># ${order.id}</p>
        <p><strong>Customer:</strong> ${customer.firstName} ${customer.lastName}</p>
        <p><strong>Order Date:</strong> ${order.orderDate}</p>
        <p><strong>Address:</strong> ${order.Address}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total Price:</strong> $${order.total}</p>
        <hr>
        <h6>Items:</h6>
        <table class="table table-bordered ">
        <thead>
            <tr>
            <th class="p-0">Name</th>
            <th class="p-0">Quantity</th>
            <th class="p-0">Price</th>
            <th class="p-0">size</th>
            <th class="p-0">color</th>
            </tr>
        </thead>
        <tbody>    `;

    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      const productName = product ? product.name : "Unknown Product";
      content += `
            <tr class="align-middle">
                <td class="p-0">${productName}</td>
                <td class="p-0">${item.quantity}</td>
                <td class="p-0">$${item.price}</td>
                <td class="p-0">${item.size}</td>
                <td class="p-0"><div style="width: 20px; height: 20px; background-color:${item.color}; border: 1px solid #ccc; border-radius: 4px; margin: 0 auto"></div></td>
            </tr>
        `;
    });
    content += `
        </tbody>
      </table>
    `;

    document.getElementById("orderDetailsBody").innerHTML = content;

    // Show the modal
    const modal = new bootstrap.Modal(
      document.getElementById("orderDetailsModal")
    );
    modal.show();
  };

  //---------------search-bar-----------------------------------------------------
  let searchInput = document.getElementById("userSearch");
  let myTable = document.getElementById("mainTable");

  searchInput.addEventListener("input", function () {
    let searchChar = searchInput.value.toLowerCase();
    let rows = myTable.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      let cellId = row.children[0];
      let cellName = row.children[1];
      if (
        (cellName &&
          cellName.innerText.trim().toLowerCase().includes(searchChar)) ||
        (cellId && cellId.innerText.trim().toLowerCase().includes(searchChar))
      ) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  });

  //---------------status-bar-----------------------------------------------------
  let statusInput = document.getElementById("stockSelect");
  let Table = document.getElementById("mainTable");

  statusInput.addEventListener("input", function () {
    let statusChar = statusInput.value.toLowerCase();
    let rows = Table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      let cellName = row.children[6];
      if (
        cellName &&
        cellName.innerText.trim().toLowerCase().includes(statusChar)
      ) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  });

  //-----------mobile display- stock-----------
  document
    .getElementById("stockDropdown")
    .addEventListener("click", function (e) {
      if (e.target && e.target.matches("a.dropdown-item")) {
        e.preventDefault();
        const value = e.target.getAttribute("data-value");
        const label = e.target.innerText;

        document.getElementById("selectedStatus").innerText = label;

        const rows = document.querySelectorAll("#mainTable tbody tr");

        rows.forEach((row) => {
          const statusCell = row.children[6];
          const statusText = statusCell
            ? statusCell.innerText.trim().toLowerCase()
            : "";

          if (!value || statusText.includes(value.toLowerCase())) {
            row.style.display = "table-row";
          } else {
            row.style.display = "none";
          }
        });
      }
    });
});
