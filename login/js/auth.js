

//--------------------------------------------------------------------------------------------
function showAlert(message, type = "danger") {
    const alertBox = document.getElementById("alertBox");
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`; // alert-danger, alert-success, etc.
    alertBox.classList.remove("d-none");
}

//----------------------------------------------------------------------------------------
document.getElementById("phone").addEventListener("input", function () {
    const phoneInput = document.getElementById("phone");
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;

    if (phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.remove("is-invalid");
    } else {
        phoneInput.classList.add("is-invalid");
    }
});


//----------------------------------------------------------------------------------------
document.getElementById("ConfirmPassword").addEventListener("input", function () {
    const password = document.getElementById("password").value;
    const confirmPasswordInput = document.getElementById("ConfirmPassword");

    if (confirmPasswordInput.value === password) {
        confirmPasswordInput.classList.remove("is-invalid");
    } else {
        confirmPasswordInput.classList.add("is-invalid");
    }
});

//----------------------------------------------------------------------------------------
function signUp(event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const ConfirmPassword = document.getElementById("ConfirmPassword").value;

    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;

    if (!phoneRegex.test(phone)) {
        document.getElementById("phone").classList.add("is-invalid");

        return;
    }
    else {
        document.getElementById("phone").classList.remove("is-invalid");
    }

    if (password !== ConfirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    
    
    let all_data = JSON.parse(localStorage.getItem("all_data")) || [];
    let users = all_data.users;
    
    const newId = Math.max(0, ...all_data.users.map(p => p.id || 0)) + 1;
    
    const exists = users.find(user => user.email === email);
    if (exists) {
        alert("Email already exists");
        return;
    }


    const newUser = { 
        id: newId,
        role: "customer",
        firstName: firstName,
        lastName: lastName,
        phone:phone,
        email: email,
        password: password,
        address: '123 Tanta, Egypt',
        orders: [101, 102],
        status: "Active"
     };

    all_data.users.push(newUser);
    localStorage.setItem("all_data", JSON.stringify(all_data));

    showAlert("Signed up successfully!", "success");
}

//-----------------------------------------------------------------------------------------------------------------
function login() {
    const email = document.getElementById("email").value;
    const loginPassword = document.getElementById("loginPassword").value;
    const all_data = JSON.parse(localStorage.getItem("all_data")) || [];


    const users = all_data.users;

    const validUser = users.find(users => users.email === email && users.password === loginPassword);

    if (validUser) {
        switch (validUser.role) {
            case "admin":
                window.location.href = "../admin-dashboard/admin.html";
                break;
            case "seller":
                window.location.href = "../saller/overView.html";
                break;
            case "customer":
                window.location.href = "../homePage.html";
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

//----------------------------------------------------------------------------------------------------
//bootstrap validation style
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()