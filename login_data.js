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
