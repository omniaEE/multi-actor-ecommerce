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

fetch("../../data/data.json")
  .then((response) => response.json())
  .then((data) => {
    const users = data.users;
    const tbody = document.getElementById("userTableBody");

    tbody.innerHTML = ""; // Clear existing content

    users.forEach((user, index) => {
      const statusClass =
        user.status === "Active" ? "bg-success" : "bg-secondary";
      const actionButtons =
        user.status === "Active"
          ? `<button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#banModal">Ban</button>`
          : `<button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#unbanModal">Unban</button>`;

      const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${user.firstName} ${user.lastName}</td>
              <td>${user.email}</td>
              <td><span class="badge ${statusClass}">${user.status}</span></td>
              <td>${user.role}</td>
              <td>
                ${actionButtons}
                <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
              </td>
            </tr>
          `;

      tbody.insertAdjacentHTML("beforeend", row);
    });
  })
  .catch((error) => {
    console.error("Failed to load user data:", error);
  });
