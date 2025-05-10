

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let allData = JSON.parse(localStorage.getItem("all_data"));

document.getElementById("profileIcon").addEventListener("click", () => {
    if (loggedInUser) {
        let userIndex = allData.users.findIndex(user => user.id == loggedInUser.id);
        if (userIndex !== -1) {
            allData.users[userIndex] = loggedInUser;
            localStorage.setItem("all_data", JSON.stringify(allData));
        }

        // --- go to profile page here
    } else {
        window.location.href = "../../login/login.html";
    }
});