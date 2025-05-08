// let orders = JSON.parse(localStorage.getItem('orders')) || []
// let tbody = document.querySelector("tbody")
// let totalqty = 0

// if (orders.length === 0) {
//     tbody.innerHTML = `<tr><td colspan="4">No orders yet</td></tr>`
// } else {
//     orders.forEach(order => {
//         let tr = document.createElement("tr")
//         tr.innerHTML = `  <td>${order.customer}</td>
//                         <td>${order.product}</td>
//                         <td>${order.quantity}</td>
//                         <td> <span onclick="delivered()" style="color: green; font-size: 1.2rem; cursor: pointer;">&#10004;</span>
//                         </td>
//                         <td>
//                             <span onclick="remove(this)" style="color: red; font-size: 1.2rem; cursor: pointer;">&#10006;</span>
//                         </td>`
//         tbody.appendChild(tr)
//         totalqty += parseInt(order.quantity)
//     })
//     document.querySelector("tfoot td:last-child").textContent = totalqty;


// }

// function remove(el) {
//     const isConfirmed = confirm("Are you sure you want to remove this product?");
//     if (isConfirmed) {
//         let row = el.closest("tr");
//         if (row) row.remove();
//     }
// }

// function delivered() {
//     alert("succsessfully Delivered")
// }


// // active navbar
// const observer = new MutationObserver(() => {
//     const overView = document.getElementById("orders_page");
//     if (overView) {
//         overView.classList.add("nav-active");
//         observer.disconnect();
//     }
// });

// observer.observe(document.body, { childList: true, subtree: true });


// active navbar
const observer = new MutationObserver(() => {
    const overView = document.getElementById("overView_page");
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

for (let i = newOrders.length - 1; i >=0; i--) {
    const user = users.find(u => u.id === newOrders[i].customerId) || { firstName: "", lastName: "" };

    let productNames = "";

    newOrders[i].items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const productName = product ? product.name : "no product"; 
        productNames += `${productName} <br>`;
    });

    document.getElementsByTagName("tbody")[0].innerHTML += `
        <tr">
            <td data-label="Customer"> ${user.firstName} ${user.lastName}</td>
            <td data-label="product">${productNames}</td>
            <td data-label="Order Date">${newOrders[i].orderDate}</td>
            <td data-label="Price">${newOrders[i].total}</td>
            <td></td>
        </tr>
    `;
}
}
)();
