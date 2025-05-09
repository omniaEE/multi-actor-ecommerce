


// active navbar
const observer = new MutationObserver(() => {
    const overView = document.getElementById("orders_page");
    if (overView) {
        overView.classList.add("nav-active");
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });


//-----------------new orders-----------------------------------
(() => {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || {};





const users = all_data.users || []; 
const products = all_data.products || []; 
const newOrders = all_data.orders || []; 

for (let i =0; i < newOrders.length ; i++) {
    const user = users.find(u => u.id === newOrders[i].customerId) || { firstName: "", lastName: "" };

    let productNames = "";

    newOrders[i].items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const productName = product ? product.name : "no product"; 
        productNames += `${productName} x ${item.quantity}  -→  $${item.price} <br>`;
    });

    document.getElementsByTagName("tbody")[0].innerHTML += `
        <tr">
            <td data-label="Order ID">${newOrders[i].id}</td>
            <td data-label="Customer"> ${user.firstName} ${user.lastName}</td>
            <td data-label="product" class="p-0"><br>${productNames}</td>
            <td data-label="Order Date">${newOrders[i].orderDate}</td>
            <td data-label="Price">${newOrders[i].total}</td>
            <td data-label="address">${newOrders[i].Address}</td>
            <td data-label="Status">${newOrders[i].status}</td>
        </tr>
    `;
}
}
)();

//---------------search-bar-----------------------------------------------------
let searchInput = document.getElementById("userSearch");
let myTable = document.getElementById("mainTable"); 

searchInput.addEventListener("input", function () {
    let searchChar = searchInput.value.toLowerCase();
    let rows = myTable.querySelectorAll("tbody tr");

    rows.forEach((row) => {
        let cellId = row.children[0]; 
        let cellName = row.children[1]; 
        if ((cellName && cellName.innerText.trim().toLowerCase().includes(searchChar)) || 
        (cellId && cellId.innerText.trim().toLowerCase().includes(searchChar))) {
                row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });
});


//---------------status-bar-----------------------------------------------------
let statusInput = document.getElementById("stockSelect");
let Table = document.getElementById("mainTable"); 

statusInput.addEventListener("input", function () {
    let statusChar = statusInput.value.toLowerCase();
    let rows = Table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
        let cellName = row.children[6]; 
        if ((cellName && cellName.innerText.trim().toLowerCase().includes(statusChar)) ) {
                row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });
});

    //-----------mobile display- stock-----------
    document.getElementById("stockDropdown").addEventListener("click", function (e) {
        if (e.target && e.target.matches("a.dropdown-item")) {
            e.preventDefault();
            const value = e.target.getAttribute("data-value");
            document.getElementById("stockSelect").value = value;
            filterProducts();

        }
    });