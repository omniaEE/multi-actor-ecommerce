//--------------------------------------------------------------------------------------------
// show alert
function showAlert(message, type = "danger") {
  const alertBox = document.getElementById("alertBox");
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.classList.remove("d-none");
}

//----------------------------------------------------------------------------------------
// check confirm password
document
  .getElementById("ConfirmPassword")
  .addEventListener("input", function () {
    const password = document.getElementById("password").value;
    const confirmPasswordInput = document.getElementById("ConfirmPassword");

    if (confirmPasswordInput.value === password) {
      confirmPasswordInput.classList.remove("is-invalid");
    } else {
      confirmPasswordInput.classList.add("is-invalid");
    }
  });

//----------------------------------------------------------------------------------------
// sign up
function signUp(event) {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phone = document.getElementById("phone").value;
  const emailInput = document.getElementById("email");
  const password = document.getElementById("password").value;
  const ConfirmPassword = document.getElementById("ConfirmPassword").value;
  const role = document.getElementById("role");

  const email = emailInput.value;

  let sellerRequest = role.checked;

  let all_data = JSON.parse(localStorage.getItem("all_data")) || [];
  let users = all_data.users;
  const exists = users.find((users) => users.email === email);

  if (exists) {
    alert("Email already exists");
    emailInput.classList.remove("is-valid");
    emailInput.classList.add("is-invalid");
    emailInput.focus();
    return;
  } else {
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
  }

  if (password !== ConfirmPassword) {
    alert("Passwords do not match.");
    document.getElementById("password").focus();
    return;
  }
  const newId = Math.max(0, ...all_data.users.map((p) => p.id || 0)) + 1;

  const newUser = {
    id: newId,
    role: "customer",
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email,
    password: password,
    address: "no address",
    orders: [],
    status: "Active",
    roleAsSeller: sellerRequest,
    cart: [],
    fav: [],
    createdAt: "",
    storeName: "",
    permissions: [],
  };

  all_data.users.push(newUser);
  localStorage.setItem("all_data", JSON.stringify(all_data));

  showAlert("Signed up successfully!", "success");
}
//-----------------------------------------------------------------------------------------------------------------
function resetPassword() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message");
  const newPassword = document.getElementById("password");

  const all_data = JSON.parse(localStorage.getItem("all_data")) || [];
  const users = all_data.users;

  const userIndex = users.findIndex(
    (users) =>
      users.email === email &&
      users.firstName === firstName &&
      users.lastName === lastName &&
      users.phone === phone
  );

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
    let all_data = JSON.parse(localStorage.getItem("all_data")) || [];
    let users = all_data.users;
    users[userIndex].password = password;

    localStorage.setItem("all_data", JSON.stringify(all_data));
    message.style.display = "none";
    message2.style.color = "green";
    message2.textContent = "Password updated successfully!";
  }
}

//----------------------------------------------------------------------------------------------------
//bootstrap validation style
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
