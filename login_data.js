document.addEventListener("DOMContentLoaded", function () {
    const profileIcon = document.getElementById("profileIcon");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        profileIcon.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "../login/login.html";
        });
    } else {
        profileIcon.setAttribute("data-bs-toggle", "dropdown");
    }
});



const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
let all_data = JSON.parse(localStorage.getItem("all_data")) || { users: [] };

    // Display the modal to confirm logout
function showLogoutModal() {
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
}

// Perform the logout action
function performLogout() {
            let userIndex = all_data.users.findIndex(u => u.id == user.id);    
    if (userIndex !== -1) {        
        all_data.users[userIndex] = user;
        localStorage.setItem("all_data", JSON.stringify(all_data));
    }
    // Remove the logged-in user from localStorage
    localStorage.removeItem("loggedInUser");
    // Redirect the user to the login page
    window.location.href = "../../login/login.html";
}