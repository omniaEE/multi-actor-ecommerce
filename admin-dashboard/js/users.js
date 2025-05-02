document.getElementById("userSearch").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();
  const rows = document.querySelectorAll("#userTableBody tr");

  rows.forEach((row) => {
    const name = row.children[1].textContent.toLowerCase();
    const email = row.children[2].textContent.toLowerCase();
    const matches = name.includes(searchTerm) || email.includes(searchTerm);
    row.style.display = matches ? "" : "none";
  });
});
