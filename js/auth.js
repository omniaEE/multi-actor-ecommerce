
function signUp() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const ConfirmPassword = document.getElementById("ConfirmPassword").value;

    if (!firstName || !lastName || !email || !phone || !password || !ConfirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== ConfirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.email === email);
    if (exists) {
        alert("Email already exists");
        return;
    }
    const role = "customer";


    users.push({ firstName, lastName, email, phone, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signed up successfully as a customer!");
}
//-----------------------------------------------------------------------------------------------------------------
function login() {
    const email = document.getElementById("email").value;
    const loginPassword = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => user.email === email && user.password === loginPassword);

    if (validUser) {
        switch (validUser.role) {
            case "admin":
                window.location.href = "admin.html";
                break;
            case "customer":
                window.location.href = "home.html";
                break;
            case "seller":
                window.location.href = "seller.html";
                break;
        }
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));
    } else {
        alert("Invalid username or password");
    }
}

//-----------------------------------------------------------------------------------------------------------------
function resetPassword() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message");
    const newPassword = document.getElementById("password")

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userIndex = users.findIndex(user => user.email === email && user.firstName === firstName && user.lastName === lastName && user.phone === phone);

    if (userIndex === -1) {
        message.textContent = "Email not found.";
        message.style.color = "red";

        return;
    } else {
        message.style.color = "green";
        message.textContent = "You can reset your password now!";
        newPassword.classList.remove("d-none");
        document.getElementById("ConfirmPassword").classList.remove("d-none");
        document.getElementById("checkAccount").classList.add("d-none");
        document.getElementById("updatePassword").classList.remove("d-none");

        newPassword.dataset.userIndex = userIndex;
    }
}
//-----------------------------------------------------------------------------------------------------------------
function updatepassword() {
    const password = document.getElementById("password").value;
    const ConfirmPassword = document.getElementById("ConfirmPassword").value;
    const message = document.getElementById("message");
    const message2 = document.getElementById("message2");
    const userIndex = document.getElementById("password").dataset.userIndex;



    if (!password || !ConfirmPassword) {
        message.textContent = "Please enter your new password.";
        message.style.color = "red";
        return;
    }
    if (password !== ConfirmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return;
    } else {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users[userIndex].password = password;
        localStorage.setItem("users", JSON.stringify(users));
        message.style.display = "none";
        message2.style.color = "green";
        message2.textContent = "Password updated successfully!";
    }
}