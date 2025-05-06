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
  document
    .getElementById("statusFilter")
    .addEventListener("change", renderProducts);

  // Render table
  function renderProducts() {
    const table = document.getElementById("productTable");
    table.innerHTML = "";

    const categoryValue = document.getElementById("categoryFilter").value;
    const stockValue = document.getElementById("stockFilter").value;
    const statusValue = document.getElementById("statusFilter").value;
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

      const matchStatus = statusValue === "" || product.status === statusValue;

      return matchSearch && matchCategory && matchStock && matchStatus;
    });

    filtered.forEach((product, index) => {
      const isFrozen = product.status === "frozen";
      const row = document.createElement("tr");
      row.className = isFrozen ? "table-secondary" : "";

      row.innerHTML = `
<td>${product.id}</td>
<td><img src="${product.images[0]}" class="table-img" /></td>
<td>${product.name}</td>
<td>${product.category}</td>
<td>$${product.price}</td>
<td>${product.stock}</td>
<td>
  <button class="btn btn-sm ${
    isFrozen ? "btn-success" : "btn-secondary"
  }" onclick="toggleFreeze(${index})">
    ${isFrozen ? "Unfreeze" : "Freeze"}
  </button>
  <button class="btn btn-warning btn-sm" onclick="openEditModal(${index})" ${
        isFrozen ? "disabled" : ""
      }>Edit</button>
  <button class="btn btn-danger btn-sm" onclick="removeProduct(${index})">Remove</button>
</td>
`;
      table.appendChild(row);
    });
  }

  function toggleFreeze(index) {
    products[index].status =
      products[index].status === "frozen" ? "active" : "frozen";
    localStorage.setItem("adminProducts", JSON.stringify(products));
    renderProducts();
  }
  function removeProduct(index) {
    if (confirm("Are you sure you want to delete this product?")) {
      products.splice(index, 1);
      localStorage.setItem("adminProducts", JSON.stringify(products));
      renderProducts();
    }
  }

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

    localStorage.setItem("adminProducts", JSON.stringify(products));
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    renderProducts();
  });
})();
