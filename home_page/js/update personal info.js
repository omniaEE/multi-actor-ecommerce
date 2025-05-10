document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log(user)
    if (user && user.role === "customer") {
        document.getElementById("firstname").value = user.firstName;
        document.getElementById("secondname").value = user.lastName;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;
        document.getElementById("address").value = user.address;
        document.getElementById("password").value = user.password;
        if (user.dob) {
            document.getElementById("dob").value = user.dob;
        }
    } else {
        alert("You are not authorized to view this page.");
        window.location.href = "index.html";
    }


    document.getElementById("editButton").addEventListener("click", () => {
        const updatedUser = {
            ...user,
            firstName: document.getElementById("firstname").value,
            lastName: document.getElementById("secondname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            dob: document.getElementById("dob").value,
            password: document.getElementById("password").value
        };

        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        const allData = JSON.parse(localStorage.getItem("all_data"));
        const userIndex = allData.users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            allData.users[userIndex] = updatedUser;
            localStorage.setItem("all_data", JSON.stringify(allData));
        }

        alert("Profile updated successfully!");
    });

    document.getElementById("close").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../home_page/homepage.html";
    });
});
