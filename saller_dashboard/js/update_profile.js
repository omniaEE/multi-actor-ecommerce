// nav bar
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

//---------------------------------------------------------------

const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
let all_data = JSON.parse(localStorage.getItem("all_data")) || { users: [] };

// Set user name from loggedInUser
if (user) {
  document.getElementById("name").innerText =
    user.firstName + " " + user.lastName;
}
//--------------------------------------------
//profile button
window.updateProfile = function () {
  document.getElementById("profileCard").classList.remove("d-none");
  document.getElementById("securityCard").classList.add("d-none");
  document.getElementById("messageCard").classList.add("d-none");
};
//security button
window.updateSecurity = function () {
  document.getElementById("securityCard").classList.remove("d-none");
  document.getElementById("profileCard").classList.add("d-none");
  document.getElementById("messageCard").classList.add("d-none");
};
//message button
window.updateMessage = function () {
  document.getElementById("messageCard").classList.remove("d-none");
  document.getElementById("profileCard").classList.add("d-none");
  document.getElementById("securityCard").classList.add("d-none");
};

//-----------------------------------------------update profile-------------------------------------------------------------------------------------
// Fill the form with current user data
window.onload = () => {
  document.getElementById("firstName").value = user.firstName || "";
  document.getElementById("lastName").value = user.lastName || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("address").value = user.address || "";
};

document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Update loggedInUser object
  user.firstName = document.getElementById("firstName").value;
  user.lastName = document.getElementById("lastName").value;
  user.email = document.getElementById("email").value;
  user.phone = document.getElementById("phone").value;
  user.address = document.getElementById("address").value;

  // Save back to localStorage (loggedInUser)
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  // Update all_data.users
  const userIndex = all_data.users.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    all_data.users[userIndex] = { ...all_data.users[userIndex], ...user };
    localStorage.setItem("all_data", JSON.stringify(all_data));
  }

  document.getElementById("successMessage").classList.remove("d-none");
});

//-----------------------------------------------update password-(security))-----------------------------------------------------------------------------------

// check confirm password
document
  .getElementById("confirmPassword")
  .addEventListener("input", function () {
    const password = document.getElementById("newPassword").value;
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (confirmPasswordInput.value === password) {
      confirmPasswordInput.classList.remove("is-invalid");
    } else {
      confirmPasswordInput.classList.add("is-invalid");
    }
  });

//--------------------------------------------------------------------------------------------
// show alert
function showMessage(text, type = "success") {
  const messageBox = document.getElementById("messageBox");
  messageBox.className = `alert alert-${type}`;
  messageBox.textContent = text;
  messageBox.classList.remove("d-none");

  setTimeout(() => {
    messageBox.classList.add("d-none");
  }, 5000);
}
//----------------------------------------------------------------------------------------
function changePassword(event) {
  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    showMessage("❌ Please fill in all fields.", "danger");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("❌ New password and confirmation do not match!", "danger");
    document.getElementById("confirmPassword").focus();
    return;
  }
  const all_data = JSON.parse(localStorage.getItem("all_data")) || [];
  const users = all_data.users;
  const userIndex = users.findIndex(
    (users) => users.password === currentPassword
  );

  if (userIndex === -1) {
    showMessage("❌ Current password is incorrect.", "danger");
    document.getElementById("currentPassword").focus();
    document.getElementById("currentPassword").classList.add("is-invalid");
    document.getElementById("currentPassword").classList.remove("is-valid");
    return;
  }

  all_data.users[userIndex].password = newPassword;
  localStorage.setItem("all_data", JSON.stringify(all_data));
  // localStorage.setItem("loggedInUser", JSON.stringify(all_data));

  showMessage("✅Password updated successfully!", "success");
  document.getElementById("securityForm").reset();
}
//-----------------------------------------------------------------------------------------------------------------

//---------------------bootstrap-------validation- form---------------------------------------------------------------------------------------
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//-----------------logout----------------------------------

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
