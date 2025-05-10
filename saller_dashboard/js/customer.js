
const all_data = JSON.parse(localStorage.getItem("all_data")) || [];
const users = all_data.users
for (i = 0; i < users.length; i++) {
    if (users[i].role.toLowerCase() === "customer") {


        document.getElementsByTagName("tbody")[0].innerHTML += `<tr> <td><i class="fa-solid fa-circle-user"></i> ${users[i].firstName + " " + users[i].lastName}</td> <td>${users[i].email}</td> <td>${users[i].address}</td> </tr>`;
    }
}


//search
let searchInput = document.getElementById("search");
let myTable = document.querySelector("table"); 

searchInput.addEventListener("input", function () {
    let searchChar = searchInput.value.toLowerCase();
    let rows = myTable.querySelectorAll("tbody tr");

    rows.forEach((row) => {
        let cell = row.children[0]; 
        if (cell && cell.innerText.toLowerCase().includes(searchChar)) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });
});


// active navbar
const observer = new MutationObserver(() => {
    const overView = document.getElementById("customers_page");
    if (overView) {
        overView.classList.add("nav-active");
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
