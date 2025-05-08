(() => {
  let selectedUserId = null;
  let users = JSON.parse(localStorage.getItem("all_data")).users;

  // Event listeners
  const userSearch = document.getElementById("userSearch");
  const roleFilter = document.getElementById("roleFilter");
  const statusFilter = document.getElementById("statusFilter");
  const table = document.getElementById("userTableBody");

  userSearch.addEventListener("input", renderUsers);
  roleFilter.addEventListener("change", renderUsers);
  statusFilter.addEventListener("change", renderUsers);

  // Render users to table
  function renderUsers() {
    table.innerHTML = "";

    const searchTerm = userSearch.value.toLowerCase().trim();
    const roleValue = roleFilter.value;
    const statusValue = statusFilter.value;

    const filteredUsers = users.filter((user) => {
      return (
        searchUser(user, searchTerm) &&
        (roleValue === "" || user.role === roleValue) &&
        (statusValue === "" || user.status === statusValue)
      );
    });

    filteredUsers.forEach((user, index) => {
      const isInactive = user.status !== "Active";
      const statusBadge = getStatusBadge(user.status);
      const activityCount = getActivityCount(user);
      const actionButtons = generateActionButtons(user);

      const rowHTML =
        window.innerWidth >= 1024
          ? generateDesktopRow(
              user,
              activityCount,
              statusBadge,
              actionButtons,
              index,
              isInactive
            )
          : generateMobileRow(user, activityCount, statusBadge, actionButtons);

      table.insertAdjacentHTML("beforeend", rowHTML);
    });
  }

  // Helper Functions
  function searchUser(user, searchTerm) {
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone.includes(searchTerm)
    );
  }

  function getStatusBadge(status) {
    return status === "Active"
      ? '<span class="status-pill status-available">Active</span>'
      : '<span class="status-pill status-out">Banned</span>';
  }

  function getActivityCount(user) {
    switch (user.role) {
      case "customer":
        return user.orders?.length || 0;
      case "seller":
        return user.products?.length || 0;
      case "admin":
        return user.permissions?.length || 0;
      default:
        return "-";
    }
  }

  function generateActionButtons(user) {
    return `
      <span title="View" data-action="view" data-id="${user.id}">
        <img src="./assets/img/eye-open.svg" alt="View" width="25" height="25" style="cursor:pointer;" />
      </span>
      ${user.role !== "admin" ? generateBanUnbanButton(user) : ""}
      <span title="Delete" data-action="delete" data-id="${user.id}">
        <img src="./assets/img/delete-1.svg" alt="Delete" width="25" height="25" style="cursor:pointer;" />
      </span>
    `;
  }

  function generateBanUnbanButton(user) {
    const action = user.status === "Active" ? "ban" : "unban";
    const icon = user.status === "Active" ? "lock.svg" : "lock-open.svg";
    return `
      <span title="${
        user.status === "Active" ? "Ban" : "Unban"
      }" data-action="${action}" data-id="${user.id}">
        <img src="./assets/img/${icon}" alt="${
      user.status === "Active" ? "Ban" : "Unban"
    }" width="25" height="25" style="cursor:pointer;" />
      </span>
    `;
  }

  function generateDesktopRow(
    user,
    activityCount,
    statusBadge,
    actionButtons,
    index,
    isInactive
  ) {
    return `
      <tr class="${isInactive ? "table-secondary" : ""}">
        <td>${index + 1}</td>
        <td>${user.firstName} ${user.lastName}</td>
        <td>
          <div>${truncateEmail(user.email)}</div>
          <div class="userPhone">${user.phone}</div>
        </td>
        <td>${user.address || "-"}</td>
        <td>${activityCount}</td>
        <td>${statusBadge}</td>
        <td>${user.role}</td>
        <td class="action-icons">${actionButtons}</td>
      </tr>
    `;
  }

  function generateMobileRow(user, activityCount, statusBadge, actionButtons) {
    return `
      <tr class="mobile-details-row">
        <td colspan="8">
          <details class="user-details">
            <summary>
              <div class="user-summary">
                <p class="userName">${user.firstName} ${user.lastName}</p>
                <p class="userEmail">${truncateEmail(user.email)}</p>
              </div>
            </summary>
            <div class="user-info">
              <p><strong>Phone:</strong> ${user.phone}</p>
              <p><strong>Address:</strong> ${user.address || "-"}</p>
              <p><strong>Activity:</strong> ${activityCount}</p>
              <p><strong>Status:</strong> ${statusBadge}</p>
              <p><strong>Role:</strong> ${user.role}</p>
            </div>
            <div class="action-icons">${actionButtons}</div>
          </details>
        </td>
      </tr>
    `;
  }

  function truncateEmail(email) {
    if (!email) return "-";
    const [userPart, domain] = email.split("@");
    return `${userPart}@${domain?.slice(0, 5)}....`;
  }

  // Delegate action buttons
  table.addEventListener("click", (e) => {
    const action = e.target.closest("span")?.dataset.action;
    const id = parseInt(e.target.closest("span")?.dataset.id);
    if (!action || isNaN(id)) return;

    selectedUserId = id;

    const actions = {
      view: openUserDetails,
      delete: confirmDeleteUser,
      ban: openBanModal,
      unban: openUnbanModal,
    };

    actions[action]?.(id);
  });

  // Functions for Modals
  window.openUserDetails = function (id) {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const userDetailsHTML = `
      <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Address:</strong> ${user.address || "-"}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p><strong>Status:</strong> ${user.status}</p>
    `;

    document.getElementById("userDetailBody").innerHTML = userDetailsHTML;

    const modal = new bootstrap.Modal(document.getElementById("viewModal"));
    modal.show();
  };

  window.confirmDeleteUser = function (id) {
    selectedUserId = id;
    const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
  };

  window.openBanModal = function (id) {
    selectedUserId = id;
    const modal = new bootstrap.Modal(document.getElementById("banModal"));
    modal.show();
  };

  window.openUnbanModal = function (id) {
    selectedUserId = id;
    const modal = new bootstrap.Modal(document.getElementById("unbanModal"));
    modal.show();
  };

  // Confirm Ban
  document.getElementById("confirmBanBtn").addEventListener("click", () => {
    updateUserStatus("Banned");
  });

  // Confirm Unban
  document.getElementById("confirmUnbanBtn").addEventListener("click", () => {
    updateUserStatus("Active");
  });

  // Confirm Delete
  document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    users = users.filter((u) => u.id !== selectedUserId);
    const data = JSON.parse(localStorage.getItem("all_data"));
    data.users = users;
    localStorage.setItem("all_data", JSON.stringify(data));
    renderUsers();
    selectedUserId = null;

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("deleteModal")
    );
    if (modal) modal.hide();
  });

  function updateUserStatus(newStatus) {
    users = users.map((user) =>
      user.id === selectedUserId ? { ...user, status: newStatus } : user
    );
    const data = JSON.parse(localStorage.getItem("all_data"));
    data.users = users;
    localStorage.setItem("all_data", JSON.stringify(data));
    renderUsers();
    selectedUserId = null;

    const modalId = newStatus === "Banned" ? "banModal" : "unbanModal";
    const modalElement = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  }

  // Initial render
  renderUsers();
})();
