document.getElementById("profileIcon").addEventListener("click", () => {
  window.location.href = "../../login/login.html";
});

let data = JSON.parse(localStorage.getItem("all_data"));
let filtered = [];

let searchInput = document.getElementById("prosSearch");
searchInput.addEventListener("change", () => {
  let searchValue = searchInput.value.toLowerCase().trim();

  filtered = data.products.filter((product) =>
    product.name.toLowerCase().includes(searchValue)
  );

  if (!filtered.length) {
    // allPros.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: #666;">No result match your search.</p>`;
    alert("No result match your search."); // optional: format or render as needed
  } else {
    alert(JSON.stringify(filtered)); // optional: format or render as needed
  }
});
