
//render cards of all products from json file's data
let allPros = document.querySelector(".all-pros")
fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        data.products.forEach(product => {
            allPros.innerHTML += `
            <div class="pro-card">
                <img src="${product.images[0]}" data-productid="${product.id}" alt="">
                <p>${product.name}</p>
                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <small>${(product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length).toPrecision(2)}</small>
                </div>
                <h2>$${product.price} <s>${product.old_price ? "$" + product.old_price : ""}</s> ${product.old_price ? "<span>-" + Math.floor(((product.old_price - product.price) / product.old_price * 100)) + "%</span>" : ""}</h2>
            </div>
            `
            });
        allPros.addEventListener("click", (e) => {
            window.location.href = `productDetails.html?id=${e.target.dataset.productid}`;
        })
    })
