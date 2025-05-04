
//render cards of all products from json file's data
let allPros = document.querySelector(".all-pros")
let categories = document.querySelector(".categories")
let filterColor = document.querySelector(".filter-color")
let allColors = new Set();




fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        data.products.forEach(product => {
            //rating
            const avgRating = product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length;
            const fullStars = Math.floor(avgRating);
            const halfStar = avgRating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

            let starsHtml = '';
            for (let i = 0; i < fullStars; i++) {
                starsHtml += `<i class="fa-solid fa-star"></i>`;
            }
            if (halfStar) {
                starsHtml += `<i class="fa-solid fa-star-half-stroke"></i>`;
            }
            for (let i = 0; i < emptyStars; i++) {
                starsHtml += `<i class="fa-regular fa-star"></i>`;
            }


            allPros.innerHTML += `
            <div class="pro-card">
                <img src="${product.images[0]}" data-productid="${product.id}" alt="">
                <p>${product.name}</p>
                <div class="rating">
                    ${starsHtml}
                    &nbsp;
                    <small>${avgRating.toPrecision(2)}</small>
                </div>
                <h2>$${product.price} <s>${product.old_price ? "$" + product.old_price : ""}</s> ${product.old_price ? "<span>-" + Math.floor(((product.old_price - product.price) / product.old_price * 100)) + "%</span>" : ""}</h2>
            </div>
            `
            //collect colors from data
            product.colors.forEach(color => allColors.add(color));
           
        });
        allPros.addEventListener("click", (e) => {
            window.location.href = `productDetails.html?id=${e.target.dataset.productid}`;
        })
        data.categories.forEach(category => {
            categories.innerHTML += `<div><p>${category.name}</p><i class="fa-solid fa-plus"></i></div>`
        })
        for (const color of allColors) {
            if(color=="white"){
                continue;
            }else{   
            let colorDiv = document.createElement("div");
            colorDiv.style.backgroundColor = color;
            filterColor.appendChild(colorDiv);
            }
        }

    })

let filterSizes = document.querySelector(".filter-sizes")
let sizes = ["X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "XXX-Large"]
sizes.forEach(size => {
    filterSizes.innerHTML += `<button>${size}</button>`
})

