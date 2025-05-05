//render cards of all products from json file's data
//applying filter & checked
//dropdowns
//clear filter btn
let allPros = document.querySelector(".all-pros")
let categories = document.querySelector(".categories")
let filterColor = document.querySelector(".filter-color")
let filterSizes = document.querySelector(".filter-sizes")
let sizes = ["X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "XXX-Large"]




let selectedCategory = null
let selectedMaxPrice = 5000;
let selectedSizes = []
let selectedColors = []


function renderProducts(products) {
    allPros.innerHTML = '' //reset
    products.forEach(product => {
        // apply filters
        if (
            (selectedCategory && product.category !== selectedCategory) ||
            (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) ||
            (selectedColors.length > 0 && !selectedColors.some(color => product.colors.includes(color))) ||
            (product.price > selectedMaxPrice)
        ) {
            return;
        }

        //rating
        const avgRating = product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length
        const fullStars = Math.floor(avgRating)
        const halfStar = avgRating % 1 >= 0.5
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
        let starsHtml = ''
        for (let i = 0; i < fullStars; i++) starsHtml += `<i class="fa-solid fa-star"></i>`
        if (halfStar) starsHtml += `<i class="fa-solid fa-star-half-stroke"></i>`
        for (let i = 0; i < emptyStars; i++) starsHtml += `<i class="fa-regular fa-star"></i>`

        //render
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
    })
    allPros.addEventListener("click", (e) => {
        window.location.href = `productDetails.html?id=${e.target.dataset.productid}`
    })
}




let allProducts = []   //init 
fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data.products

        //category
        data.categories.forEach(category => {
            let categoryDiv = document.createElement("div")
            categoryDiv.classList.add("category-item")
            categoryDiv.innerHTML = `<p>${category.name}</p><i class="fa-solid fa-plus"></i>`

            categoryDiv.addEventListener("click", () => {
                selectedCategory = category.name
                document.querySelectorAll(".categories .category-item").forEach(item => {
                    item.classList.remove("active")
                })
                categoryDiv.classList.add("active")
                renderProducts(allProducts)
            })
            categories.appendChild(categoryDiv)
        })


        //price
        const priceInput = document.getElementById("priceRange");
        const priceValue = document.getElementById("priceValue");
        priceInput.addEventListener("input", () => {
            selectedMaxPrice = parseInt(priceInput.value);
            priceValue.textContent = selectedMaxPrice;
            renderProducts(allProducts);
        });

        //size
        sizes.forEach(size => {
            const sizeBtn = document.createElement("button");
            sizeBtn.textContent = size;
            sizeBtn.classList.add("size-btn")
            sizeBtn.addEventListener("click", () => {
                sizeBtn.classList.toggle("active");
                if (selectedSizes.includes(size)) {
                    selectedSizes = selectedSizes.filter(s => s !== size);
                } else {
                    selectedSizes.push(size);
                }
                renderProducts(data.products);
            })
            filterSizes.appendChild(sizeBtn);
        });


        //color
        const allColors = new Set();
        allProducts.forEach(p => p.colors.forEach(c => allColors.add(c)));
        allColors.forEach(color => {
            const colorDiv = document.createElement("div");
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener("click", () => {
                if (selectedColors.includes(color)) {
                    selectedColors = selectedColors.filter(c => c !== color);
                    colorDiv.innerHTML = ""
                } else {
                    selectedColors.push(color);
                    if (colorDiv.style.backgroundColor == "white" || colorDiv.style.backgroundColor == "beige") {
                        colorDiv.innerHTML = `<i class="fa-solid fa-check" style="color:black;"></i>`
                    } else {
                        colorDiv.innerHTML = `<i class="fa-solid fa-check"></i>`
                    }
                }
                renderProducts(allProducts);
            });
            filterColor.appendChild(colorDiv);
        });


        renderProducts(allProducts) // Initial render
    })





//clear filter btn
document.getElementById("clear-filters").addEventListener("click", () => {
    selectedCategory = null;
    selectedSizes = [];
    selectedColors = [];
    selectedMaxPrice = 5000;
    priceInput.value = 5000;
    priceValue.textContent = 5000;
    document.querySelectorAll(".categories .category-item").forEach(div => div.classList.remove("active"));
    document.querySelectorAll(".filter-sizes button").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".filter-color div").forEach(div => div.classList.remove("active"));
    renderProducts(allProducts)
})



//dropdowns
document.querySelectorAll(".filter-header").forEach(header => {
    header.addEventListener("click", () => {
        const content = header.nextElementSibling
        const icon = header.querySelector("i")

        if (content && content.classList.contains("filter-content")) {
            content.classList.toggle("open")
            icon.classList.toggle("rotate")
        }
    })
})
