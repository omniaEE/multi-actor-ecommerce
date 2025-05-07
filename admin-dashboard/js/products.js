(() => {
  const data = JSON.parse(localStorage.getItem("all_data"));
  let products = data.products || [];

  // Load JSON from local file

  const categorySet = new Set(products.map((p) => p.category));
  const categoryFilter = document.getElementById("categoryFilter");
  categorySet.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  renderProducts();

  document
    .getElementById("userSearch")
    .addEventListener("input", renderProducts);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", renderProducts);
  document
    .getElementById("stockFilter")
    .addEventListener("change", renderProducts);

  // Function to save products to localStorage
  function saveProducts() {
    const data = JSON.parse(localStorage.getItem("all_data")) || {};
    data.products = products; // Save the updated products list
    localStorage.setItem("all_data", JSON.stringify(data)); // Store it in localStorage
  }

  // Render table
  function renderProducts() {
    const table = document.getElementById("productTable");
    table.innerHTML = "";

    const categoryValue = document.getElementById("categoryFilter").value;
    const stockValue = document.getElementById("stockFilter").value;
    const searchTerm = document
      .getElementById("userSearch")
      .value.toLowerCase()
      .trim();

    const filtered = products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.id.toString().includes(searchTerm);

      const matchCategory =
        categoryValue === "" || product.category === categoryValue;

      const matchStock =
        stockValue === "" ||
        (stockValue === "in" && product.stock > 0) ||
        (stockValue === "out" && product.stock === 0);

      return matchSearch && matchCategory && matchStock;
    });

    filtered.forEach((product, index) => {
      const isFrozen = product.status === "frozen";
      const statusBadge =
        product.stock > 0
          ? '<span class="status-pill status-available">Available</span>'
          : '<span class="status-pill status-out">Out of Stock</span>';

      // Check screen size
      if (window.innerWidth >= 1024) {
        // Large screen: standard table row
        const row = document.createElement("tr");
        row.className = isFrozen ? "table-secondary" : "";

        row.innerHTML = `
          <td>${product.id}</td>
          <td><img src="${product.images[0]}" class="table-img" /></td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>$${product.price}</td>
          <td>${product.stock}</td>
          <td>${statusBadge}</td>
          <td class="action-icons">
              <span title="Details" onclick="openDetailsModal(${index})">
                  <img src="./assets/img/eye-open.svg" alt="Edit" width="30" height="30" />
              </span>
              <span title="Edit" onclick="openEditModal(${index})">
                  <img src="./assets/img/edit.svg" alt="Edit" width="20" height="20" />
              </span>
              <span title="Delete" onclick="confirmDelete(${index})">
                  <img src="./assets/img/delete-1.svg" alt="Delete" width="30" height="30" />
              </span>
          </td>
        `;
        table.appendChild(row);
      } else {
        // Small screen: collapsible summary
        const detailsRow = document.createElement("tr");
        detailsRow.classList.add("mobile-details-row");
        detailsRow.innerHTML = `
          <td colspan="8">
            <details class="product-details">
              <summary>
                <div class="product-summary">
                  <img src="${product.images[0]}" class="table-img" />
                  <p  class="productId">${product.id}</p>
                  <p class="productName">${product.name}</p>
                </div>
              </summary>
              <div class="product-info">
                <p><strong>Price</strong>: $${product.price}</p>
                <p><strong>Size</strong>: ${product.size || "N/A"}</p>
                <p><strong>QTY</strong>: ${product.stock}</p>
          
                <p><strong>Status</strong>: ${statusBadge}</p>
              </div>
              <div class="action-icons">
                    <span title="Details" onclick="openDetailsModal(${index})">
                  <img src="./assets/img/eye-open.svg" alt="Edit" width="30" height="30" />
              </span>
                  <span title="Edit" onclick="openEditModal(${index})">
                      <img src="./assets/img/edit.svg" alt="Edit" width="20" height="20" />
                  </span>
                  <span title="Delete" onclick="confirmDelete(${index})">
                      <img src="./assets/img/delete-1.svg" alt="Delete" width="30" height="30" />
                  </span>
              </div>
            </details>
          </td>
        `;
        table.appendChild(detailsRow);
      }
    });
  }

  let deleteIndex = null; // Track index to delete

  window.confirmDelete = function (index) {
    deleteIndex = index;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", function () {
      if (deleteIndex !== null && deleteIndex !== undefined) {
        // Delete product from array
        products.splice(deleteIndex, 1);

        saveProducts();

        renderProducts();

        // Close the modal
        deleteIndex = null;
        bootstrap.Modal.getInstance(
          document.getElementById("deleteModal")
        ).hide();
      }
    });

  // Edit modal handlers
  function openEditModal(index) {
    const p = products[index];
    document.getElementById("editId").value = index;
    document.getElementById("editName").value = p.name;
    document.getElementById("editCategory").value = p.category;
    document.getElementById("editPrice").value = p.price;
    document.getElementById("editStock").value = p.stock;
    new bootstrap.Modal(document.getElementById("editModal")).show();
  }

  document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const index = document.getElementById("editId").value;
    products[index].name = document.getElementById("editName").value;
    products[index].category = document.getElementById("editCategory").value;
    products[index].price = parseFloat(
      document.getElementById("editPrice").value
    );
    products[index].stock = parseInt(
      document.getElementById("editStock").value
    );

    const data = JSON.parse(localStorage.getItem("all_data"));
    data.products = products;
    localStorage.setItem("all_data", JSON.stringify(data));

    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    renderProducts();
  });

  window.openDetailsModal = function (index) {
    const p = products[index];
    document.getElementById("detailId").textContent = p.id;
    document.getElementById("detailName").textContent = p.name;
    document.getElementById("detailCategory").textContent = p.category;
    document.getElementById("detailPrice").textContent = p.price;
    document.getElementById("detailStock").textContent = p.stock;
    document.getElementById("detailImage").src = p.images[0] || "";

    new bootstrap.Modal(document.getElementById("detailsModal")).show();
  };
  window.addEventListener("resize", renderProducts);

  window.openEditModal = openEditModal;
})();
