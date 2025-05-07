function login(event) {
    event.preventDefault();
const form = event.target;

if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
}
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
                window.location.href = "../saller_dashboard/overView.html";
                break;
            case "customer":
                window.location.href = "../../home_page/homePage.html";
                break;
        }
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));
    } else {
        alert("Invalid username or password");
        document.getElementById("email").classList.add("is-invalid");
        document.getElementById("loginPassword").classList.add("is-invalid");
    }
}

//------------------------------------------------------
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