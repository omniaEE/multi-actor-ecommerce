let orders = JSON.parse(localStorage.getItem('orders')) || []
let tbody = document.querySelector("tbody")
let totalqty = 0

if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No orders yet</td></tr>`
} else {
    orders.forEach(order => {
        let tr = document.createElement("tr")
        tr.innerHTML = `  <td>${order.customer}</td>
                        <td>${order.product}</td>
                        <td>${order.quantity}</td>
                        <td> <span onclick="delivered()" style="color: green; font-size: 1.2rem; cursor: pointer;">&#10004;</span>
                        </td>
                        <td>
                            <span onclick="remove(this)" style="color: red; font-size: 1.2rem; cursor: pointer;">&#10006;</span>
                        </td>`
        tbody.appendChild(tr)
        totalqty += parseInt(order.quantity)
    })
    document.querySelector("tfoot td:last-child").textContent = totalqty;


}

function remove(el) {
    const isConfirmed = confirm("Are you sure you want to remove this product?");
    if (isConfirmed) {
        let row = el.closest("tr");
        if (row) row.remove();
    }
}

function delivered() {
    alert("succsessfully Delivered")
}