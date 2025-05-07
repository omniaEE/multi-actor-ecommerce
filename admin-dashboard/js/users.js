(() => {
  let selectedUserId = null;

  const data = JSON.parse(localStorage.getItem("all_data"));
  console.log("all_data", data.users);
  let users = data.users;

  // Search filter
  document.getElementById("userSearch").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#userTableBody tr");

    rows.forEach((row) => {
      const name = row.children[1].textContent.toLowerCase();
      const email = row.children[2].textContent.toLowerCase();
      row.style.display =
        name.includes(searchTerm) || email.includes(searchTerm) ? "" : "none";
    });
  });

  // Render users to table
  function renderUsers() {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    users.forEach((user, index) => {
      const statusClass =
        user.status === "Active" ? "bg-success" : "bg-secondary";

      // Determine order count or product count depending on the role
      let activityCount = "-";
      if (user.role === "customer") {
        activityCount = user.orders?.length || 0;
      } else if (user.role === "seller") {
        activityCount = user.products?.length || 0;
      } else if (user.role === "admin") {
        activityCount = user.permissions?.length || 0;
      }

      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${user.firstName} ${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.address || "-"}</td>
          <td>${activityCount}</td>
          <td><span class="badge ${statusClass}">${user.status}</span></td>
          <td>${user.role}</td>
          <td>
            <button class="btn btn-info btn-sm view-btn"
              data-bs-toggle="modal"
              data-bs-target="#viewModal"
              data-id="${user.id}">View</button>
  
            ${
              user.role !== "admin" // Hide ban/unban buttons for admin
                ? `<button class="btn btn-${
                    user.status === "Active" ? "warning" : "success"
                  } btn-sm action-btn"
                    data-action="${user.status === "Active" ? "ban" : "unban"}"
                    data-id="${user.id}"
                    data-bs-toggle="modal"
                    data-bs-target="#${
                      user.status === "Active" ? "banModal" : "unbanModal"
                    }">
                      ${user.status === "Active" ? "Ban" : "Unban"}
                  </button>`
                : ""
            }
  
            <button class="btn btn-danger btn-sm action-btn"
              data-action="delete"
              data-id="${user.id}"
              data-bs-toggle="modal"
              data-bs-target="#deleteModal">Delete</button>
          </td>
        </tr>
      `;

      tbody.insertAdjacentHTML("beforeend", row);
    });

    // View Modal event listeners
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const userId = parseInt(this.getAttribute("data-id"));
        const user = users.find((u) => u.id === userId);
        if (user) {
          const userDetails = `
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Address:</strong> ${user.address}</p>
          <p><strong>Role:</strong> ${user.role}</p>
          <p><strong>Status:</strong> ${user.status}</p>
          <p><strong>Orders:</strong> ${user.orders.join(", ") || "None"}</p>
        `;
          document.getElementById("userDetailBody").innerHTML = userDetails;
        }
      });
    });

    // Set selected user for action buttons
    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        selectedUserId = parseInt(this.getAttribute("data-id"));
      });
    });
  }

  // Confirm Ban
  document.getElementById("confirmBanBtn").addEventListener("click", () => {
    updateUserStatus("Inactive");
  });

  // Confirm Unban
  document.getElementById("confirmUnbanBtn").addEventListener("click", () => {
    updateUserStatus("Active");
  });

  // Confirm Delete
  document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    users = users.filter((u) => u.id !== selectedUserId);
    renderUsers();
    selectedUserId = null;
  });

  // Update status helper
  function updateUserStatus(newStatus) {
    users = users.map((user) =>
      user.id === selectedUserId ? { ...user, status: newStatus } : user
    );
    renderUsers();
    selectedUserId = null;
  }
  renderUsers();
})();
