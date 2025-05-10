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





    // Display the modal to confirm logout
function showLogoutModal() {
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
}

// Perform the logout action
function performLogout() {
    // Remove the logged-in user from localStorage
    localStorage.removeItem("loggedInUser");
    // Redirect the user to the login page
    window.location.href = "../../login/login.html";
}