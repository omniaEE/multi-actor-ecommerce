// تحميل الهيدر
fetch("header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    const user = JSON.parse(localStorage.getItem("loggedInUser")) || [];

    if (user) {
      document.getElementById("name").innerText =
        user.firstName + " " + user.lastName;
    }
  });

// تحميل السايدبار
fetch("nav bar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;

    const toggleBtn = document.querySelector(".toggle-btn");
    const sidebar = document.getElementById("sidebar");
    const toggleIcon = document.getElementById("toggleIcon");

    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");

      if (sidebar.classList.contains("collapsed")) {
        toggleIcon.classList.remove("fa-angle-double-left");
        toggleIcon.classList.add("fa-angle-double-right");
      } else {
        toggleIcon.classList.remove("fa-angle-double-right");
        toggleIcon.classList.add("fa-angle-double-left");
      }
    });
  });

const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
let all_data = JSON.parse(localStorage.getItem("all_data")) || { users: [] };
// Display the modal to confirm logout
function showLogoutModal() {
  const logoutModal = new bootstrap.Modal(
    document.getElementById("logoutModal")
  );
  logoutModal.show();
}

// Perform the logout action
function performLogout() {
  let userIndex = all_data.users.findIndex((u) => u.id == user.id);
  if (userIndex !== -1) {
    all_data.users[userIndex] = user;
    localStorage.setItem("all_data", JSON.stringify(all_data));
  }
  // Remove the logged-in user from localStorage
  localStorage.removeItem("loggedInUser");
  // Redirect the user to the login page
  window.location.href = "../../login/login.html";
}
