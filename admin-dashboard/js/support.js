(() => {
  const allData = JSON.parse(localStorage.getItem("all_data")) || {
    tickets: [],
    users: [],
  };
  const tickets = allData.tickets || [];
  const users = allData.users || [];

  // console.log(users);

  document
    .getElementById("searchTicket")
    .addEventListener("input", function () {
      const value = this.value.toLowerCase();
      const rows = document.querySelectorAll("#ticketTable tr");
      rows.forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(value)
          ? ""
          : "none";
      });
    });

  document
    .getElementById("sendReplyBtn")
    .addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const reply = document.getElementById("adminReplyInput").value.trim();
      if (!reply) return;

      const ticket = tickets[index];

      const newReply = {
        from: "admin",
        message: reply,
        timestamp: new Date().toISOString(),
      };

      ticket.messages = ticket.messages || [];
      ticket.messages.push(newReply);

      allData.tickets = tickets;
      localStorage.setItem("all_data", JSON.stringify(allData));

      const replyDiv = document.createElement("div");
      replyDiv.innerHTML = `<strong>Admin:</strong> ${reply} <small class="text-muted">(${new Date().toLocaleString()})</small>`;
      document.getElementById("ticketThread").appendChild(replyDiv);

      document.getElementById("adminReplyInput").value = "";
    });

  function renderSellerRequests() {
    const table = document.getElementById("sellerRequestsTable");
    table.innerHTML = "";
    users.forEach((user, i) => {
      if (user.roleAsSeller === "true") {
        const row = document.createElement("tr");
        if (window.innerWidth >= 1024) {
          // Desktop view
          row.innerHTML = ` <td>${user.firstName} ${user.lastName}</td> <td>${
            user.email
          }</td> <td>${new Date(
            user.createdAt
          ).toLocaleDateString()}</td> <td><span class="badge bg-secondary">Pending</span></td> <td> <button class="btn btn-sm btn-success" onclick="approveSeller(${i})">Approve</button> <button class="btn btn-sm btn-danger ms-1" onclick="rejectSeller(${i})">Reject</button> </td> `;
          table.appendChild(row);
        } else {
          // Mobile view
          row.classList.add("mobile-details-row");
          row.innerHTML = ` <td colspan="5"> <details class="ticket-details"> <summary> <div class="ticket-summary"> <p><strong>Name:</strong> ${
            user.firstName
          } ${user.lastName}</p> <p><strong>Email:</strong> ${
            user.email
          }</p> </div> </summary> <div class="ticket-info"> <p><strong>Requested At:</strong> ${new Date(
            user.createdAt
          ).toLocaleDateString()}</p> <p><strong>Status:</strong> <span class="badge bg-secondary">Pending</span></p> </div> <div class="action-icons"> <span title="Approve" onclick="approveSeller(${i})"> <button class="btn btn-sm btn-success">Approve</button> </span> </div> </details> </td> `;
          table.appendChild(row);
        }
      }
    });
  }

  window.approveSeller = function (index) {
    users[index].roleAsSeller = "false";
    users[index].role = "seller";
    allData.users = users;
    localStorage.setItem("all_data", JSON.stringify(allData));
    renderSellerRequests();
    alert(`Approved ${users[index].firstName} as seller.`);
  };
  window.rejectSeller = function (index) {
    users.splice(index, 1); // This removes the user from the list
    allData.users = users;
    localStorage.setItem("all_data", JSON.stringify(allData));
    renderSellerRequests();
    alert(`Rejected seller request.`);
  };

  function renderTicketStats() {
    const total = tickets.length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    const pending = tickets.filter((t) => t.status === "Pending").length;

    document.getElementById("totalTickets").textContent = total;
    document.getElementById("resolvedTickets").textContent = resolved;
    document.getElementById("pendingTickets").textContent = pending;
  }

  window.openTicketModal = function (index) {
    const ticket = tickets[index];
    const modalTitle = `Ticket #${ticket.id} - ${ticket.subject}`;
    const thread = [
      `<div><strong>Customer Name:</strong> ${ticket.name}</div>`,
      `<div><strong>Customer Email:</strong> ${ticket.email}</div>`,
    ];

    (ticket.messages || []).forEach((msg) => {
      thread.push(
        `<div><strong>${msg.from}:</strong> ${
          msg.message
        } <small class="text-muted">(${new Date(
          msg.timestamp
        ).toLocaleString()})</small></div>`
      );
    });

    document.getElementById("modalTitle").textContent = modalTitle;
    document.getElementById("ticketThread").innerHTML = thread.join("");
    document.getElementById("sendReplyBtn").setAttribute("data-index", index);
    new bootstrap.Modal(document.getElementById("ticketModal")).show();
  };

  window.changeTicketStatus = function (selectEl, index) {
    const status = selectEl.value;
    tickets[index].status = status;
    allData.tickets = tickets;
    localStorage.setItem("all_data", JSON.stringify(allData));
    renderTicketStats();

    selectEl.className = "form-select form-select-sm";
    if (status === "Resolved") selectEl.classList.add("bg-success");
    else if (status === "Pending") selectEl.classList.add("bg-warning");
    else selectEl.classList.add("bg-secondary");
  };

  let deleteTicketIndex = null;

  window.deleteTicket = function (index) {
    deleteTicketIndex = index;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", function () {
      if (deleteTicketIndex !== null) {
        tickets.splice(deleteTicketIndex, 1);
        allData.tickets = tickets;
        localStorage.setItem("all_data", JSON.stringify(allData));
        renderTickets();
        renderTicketStats();
        bootstrap.Modal.getInstance(
          document.getElementById("deleteModal")
        ).hide();
      }
    });

  function renderTickets() {
    const table = document.getElementById("ticketTable");
    table.innerHTML = "";
    tickets.forEach((ticket, i) => {
      const row = document.createElement("tr");
      // Check screen size
      if (window.innerWidth >= 1024) {
        // Large screen: standard table row

        row.innerHTML = `
                  <td>${ticket.id}</td>
                  <td>${ticket.subject}</td>
                  <td>${ticket.email}</td>
                  <td>
                    <select class="form-select form-select-sm" onchange="changeTicketStatus(this, ${i})">
                      <option value="Pending" ${
                        ticket.status === "Pending" ? "selected" : ""
                      }>Pending</option>
                      <option value="Resolved" ${
                        ticket.status === "Resolved" ? "selected" : ""
                      }>Resolved</option>
                      <option value="Closed" ${
                        ticket.status === "Closed" ? "selected" : ""
                      }>Closed</option>
                    </select>
                  </td>
                  <td>${ticket.priority}</td>
                  <td>${ticket.date}</td>
                  <td>
                        <img 
                      src="./assets/img/eye-open.svg" 
                      alt="View Ticket" 
                      class="icon-action" 
                      onclick="openTicketModal(${i})" 
                      style="cursor: pointer; width: 20px; height: 20px;"/>
                          <img
                      src="./assets/img/delete-1.svg"
                      alt="Delete Ticket"
                      class="icon-action"
                      onclick="deleteTicket(${i})"
                      style="cursor: pointer; width: 20px; height: 20px;"/>
                  </td>
                  </td>
                `;
        table.appendChild(row);
      } else {
        // Small screen: collapsible summary
        row.classList.add("mobile-details-row");
        row.innerHTML = `
  <td colspan="8">
    <details class="ticket-details">
      <summary>
        <div class="ticket-summary">
          <p class="ticketId"><strong>ID:</strong> ${ticket.id}</p>
          <p class="ticketSubject"><strong>Subject:</strong> ${
            ticket.subject
          }</p>
          <p class="ticketEmail"><strong>Email:</strong> ${ticket.email}</p>
        </div>
      </summary>
      <div class="ticket-info">
        <p><strong>Status</strong>: 
          <select class="form-select form-select-sm" onchange="changeTicketStatus(this, ${i})">
            <option value="Pending" ${
              ticket.status === "Pending" ? "selected" : ""
            }>Pending</option>
            <option value="Resolved" ${
              ticket.status === "Resolved" ? "selected" : ""
            }>Resolved</option>
            <option value="Closed" ${
              ticket.status === "Closed" ? "selected" : ""
            }>Closed</option>
          </select>
        </p>
        <p><strong>Priority</strong>: ${ticket.priority}</p>
        <p><strong>Date</strong>: ${ticket.date}</p>
      </div>
      <div class="action-icons">
        <span title="View" onclick="openTicketModal(${i})">
          <img src="./assets/img/eye-open.svg" alt="View Ticket" width="30" height="30" />
        </span>
   
        <span title="Delete" onclick="deleteTicket(${i})">
          <img src="./assets/img/delete-1.svg" alt="Delete Ticket" width="30" height="30" />
        </span>
      </div>
    </details>
  </td>
`;

        table.appendChild(row);
      }
    });
  }

  // Initial rendering
  renderTicketStats();
  renderSellerRequests();
  renderTickets();
  window.addEventListener("resize", renderTickets);
  window.addEventListener("resize", renderSellerRequests);
  window.openTicketModal = openTicketModal;

  window.deleteTicket = function (index) {
    // Set the ticket index to be deleted
    deleteTicketIndex = index;

    // Show the confirmation modal
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  window.approveSeller = approveSeller;
  window.rejectSeller = rejectSeller;
  window.changeTicketStatus = changeTicketStatus;
})();
