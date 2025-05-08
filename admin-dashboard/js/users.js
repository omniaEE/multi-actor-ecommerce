(() => {
  let selectedUserId = null;

  const data = JSON.parse(localStorage.getItem("all_data"));
  console.log("all_data", data.users);
  let users = data.users;

  // Search filter
  document.getElementById("userSearch").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#userTableBody tr");
    // other filters
    document
      .getElementById("roleFilter")
      .addEventListener("change", renderUsers);
    document
      .getElementById("statusFilter")
      .addEventListener("change", renderUsers);

    rows.forEach((row) => {
      const name = row.children[1].textContent.toLowerCase();
      const contactCell = row.children[2];
      const email = contactCell.getAttribute("data-email");
      const phone = contactCell.getAttribute("data-phone");

      row.style.display =
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        phone.includes(searchTerm)
          ? ""
          : "none";
    });
  });

  // Render users to table
  function renderUsers() {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    users.forEach((user, index) => {
      const statusClass =
        user.status === "Active" ? "status-available" : " status-out";

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
<td data-email="${user.email.toLowerCase()}" data-phone="${user.phone.toLowerCase()}">
  <div>${truncateEmail(user.email)}</div>
  <div class="userPhone">${user.phone}</div>
</td>


          <td>${user.address || "-"}</td>
          <td>${activityCount}</td>
          <td><span class="status-pill ${statusClass}">${
        user.status
      }</span></td>
          <td>${user.role}</td>
<td class="action-icons">
  <span title="View" class="view-btn" 
        data-bs-toggle="modal" 
        data-bs-target="#viewModal" 
        data-id="${user.id}">
    <img src="./assets/img/eye-open.svg" alt="View" width="25" height="25" style="cursor:pointer;" />
  </span>

  ${
    user.role !== "admin"
      ? `
<span title="${user.status === "Active" ? "Ban" : "Unban"}" class="action-btn"
      data-action="${user.status === "Active" ? "ban" : "unban"}"
      data-id="${user.id}"
      data-bs-toggle="modal"
      data-bs-target="#${user.status === "Active" ? "banModal" : "unbanModal"}">
  <img src="./assets/img/${
    user.status === "Active" ? "lock.svg" : "lock-open.svg"
  }" 
       alt="${user.status === "Active" ? "Ban" : "Unban"}" 
       width="25" height="25" style="cursor:pointer;" />
</span>`
      : ""
  }

  <span title="Delete" class="action-btn" 
        data-action="delete" 
        data-id="${user.id}"
        data-bs-toggle="modal"
        data-bs-target="#deleteModal">
    <img src="./assets/img/delete-1.svg" alt="Delete" width="25" height="25" style="cursor:pointer;" />
  </span>
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
          <p><strong>Phone:</strong> ${user.phone}</p>
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
    updateUserStatus("Banned");
  });
  document.getElementById("confirmUnbanBtn").addEventListener("click", () => {
    updateUserStatus("Active");
  });

  // Confirm Delete
  document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    // Perform delete
    users = users.filter((u) => u.id !== selectedUserId);

    // Update localStorage
    const data = JSON.parse(localStorage.getItem("all_data"));
    data.users = users;
    localStorage.setItem("all_data", JSON.stringify(data));

    renderUsers();
    selectedUserId = null;

    // Close the modal after deletion
    const modalElement = document.getElementById("deleteModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  });

  // Truncate email function
  function truncateEmail(email) {
    if (!email) return "-";
    const [userPart, domain] = email.split("@");
    return `${userPart}@${domain?.slice(0, 5)}....`;
  }

  // Update status helper
  function updateUserStatus(newStatus) {
    users = users.map((user) =>
      user.id === selectedUserId ? { ...user, status: newStatus } : user
    );

    // Update localStorage
    const data = JSON.parse(localStorage.getItem("all_data"));
    data.users = users;
    localStorage.setItem("all_data", JSON.stringify(data));

    renderUsers();
    selectedUserId = null;

    // Close the appropriate modal
    const modalId = newStatus === "Banned" ? "banModal" : "unbanModal";
    const modalElement = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  renderUsers();
})();
