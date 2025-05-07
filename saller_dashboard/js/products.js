

document.addEventListener("DOMContentLoaded", function () {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || {};
    const container = document.getElementById("productsContainer");

    //  productes
    if (all_data.products && Array.isArray(all_data.products)) {
        all_data.products.forEach(product => {
            // const avgRating = product.ratings.length
            //     ? (product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length).toPrecision(2)
            //     : "5.0";

            const avgRating = product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length.toPrecision(2);
            const fullStars = Math.floor(avgRating);
            const halfStar = avgRating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            let starsHtml = '';
            for (let i = 0; i < fullStars; i++) starsHtml += `<i class="fa-solid fa-star star"></i>`;
            if (halfStar) starsHtml += `<i class="fa-solid fa-star-half-stroke star"></i>`;
            for (let i = 0; i < emptyStars; i++) starsHtml += `<i class="fa-regular fa-star star"></i>`;

            const stockBadge = product.stock > 0
            ? `<div class="badge rounded-pill px-3 py-2 custom-success">(${product.stock}) in stock</div>`
            : `<div class="badge rounded-pill px-3 py-2 custom-danger">Out of stock</div>`;


            container.innerHTML += `
            <div class="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 mb-4">
                    <div class="card h-100 shadow product-card products-all d-flex flex-column justify-content-between">
                        <img id="image" src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title" style="font-size: 12px;">${product.name}</h6>
                            <div class="rating">
                                ${starsHtml}
                                &nbsp;
                                <small>(${avgRating.toPrecision(2)})</small>
                            </div>
                            <b class="card-text" style="font-size: 15px;">$${product.price}</b>
                            <div class="mt-auto text-center">
                                ${stockBadge}
                            </div>
                        </div>
                        <div class="action-buttons text-center pb-2 ">
                            <button class="btn btn-primary badge rounded-pill" onclick="editProduct(${product.id})">Update</button><br>
                            <button class="btn btn-danger mt-2 badge rounded-pill" onclick="deleteProduct(${product.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    window.addProduct = function () {
        document.getElementById("addProduct").classList.remove("d-none");
        document.getElementById("productsContainer").classList.add("d-none");
        document.getElementById("update").classList.add("d-none");

    }

    // add color 
    let colorList = [];
    window.addColor = function () {
        const colorInput = document.getElementById("colorInput");
        const color = colorInput.value;
        if (!colorList.includes(color)) {
            colorList.push(color);

            const li = document.createElement("li");
            li.style.display = "inline-block";
            li.style.backgroundColor = color;
            li.style.width = "20px";
            li.style.height = "20px";
            li.style.margin = "2px";
            document.getElementById("colorList").appendChild(li);
        }
    }

    // image view 
    document.getElementById("imageUpload").addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                document.getElementById("preview").src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    //send form
    document.getElementById("productForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name5")?.value?.trim() || "";
        const price = parseFloat(document.getElementById("price")?.value || 0);
        const description = document.getElementById("description")?.value?.trim() || "";
        const category = document.getElementById("category")?.value || "";
        const quantity = parseInt(document.getElementById("quantity")?.value || 0);


        const selectedSizes = Array.from(document.querySelectorAll('input[name5="sizes"]:checked'))
            .map(checkbox => checkbox.value);

        const imageInput = document.getElementById("imageUpload");
        const imageFile = imageInput.files[0];

        if (!imageFile) {
            alert("Please upload an image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function () {
            const imageBase64 = reader.result;

            let all_data = JSON.parse(localStorage.getItem("all_data")) || {};
            if (!Array.isArray(all_data.products)) {
                all_data.products = [];
            }

            const newId = Math.max(0, ...all_data.products.map(p => p.id || 0)) + 1;

            const newProduct = {
                id: newId,
                name: name,
                description: description,
                price: price,
                old_price: "",
                colors: colorList,
                sizes: selectedSizes,
                stock: quantity,
                category: category,
                sellerId: 4,
                ratings: [],
                images: [imageBase64]
            };

            all_data.products.push(newProduct);
            localStorage.setItem("all_data", JSON.stringify(all_data));

            alert("✅ Product added successfully!");

            // Reset form
            e.target.reset();
            document.getElementById("colorList").innerHTML = "";
            colorList.length = 0;
            document.getElementById("preview").src = "";
        };

        reader.readAsDataURL(imageFile);
    });
});



// update product
let editColorList = [];
function editProduct(productId) {
    document.getElementById("update").classList.remove("d-none");
    document.getElementById("productsContainer").classList.add("d-none");
    const all_data = JSON.parse(localStorage.getItem("all_data")) || { products: [] };
    const product = all_data.products.find(p => p.id === productId);

    if (product) {
        document.getElementById("editName").value = product.name;
        document.getElementById("editPrice").value = product.price;
        document.getElementById("editDescription").value = product.description;
        document.getElementById("editCategory").value = product.category;
        document.getElementById("editQuantity").value = product.stock;

        editColorList = product.colors || [];
        document.getElementById("editColorList").innerHTML = "";
        editColorList.forEach(color => {
            const li = document.createElement("div");
            li.style.display = "inline-block";
            li.style.backgroundColor = color;
            li.style.width = "20px";
            li.style.height = "20px";
            li.style.margin = "2px";
            li.style.cursor = "pointer";
            li.title = "click to remove";

            li.onclick = function () {
                editColorList = editColorList.filter(c => c !== color);
                li.remove();
            };

            document.getElementById("editColorList").appendChild(li);
        });


        document.getElementById("saveButton").onclick = function () {
            saveProductEdits(productId);
        };
        document.getElementById("closeUpdate").onclick = function () {
            closeUpdate();
        };
    }
}



//  edit color
function addEditColor() {
    const colorInput = document.getElementById("editColorInput");
    const color = colorInput.value;

    if (!editColorList.includes(color)) {
        editColorList.push(color);

        const li = document.createElement("li");
        li.style.display = "inline-block";
        li.style.backgroundColor = color;
        li.style.width = "20px";
        li.style.height = "20px";
        li.style.margin = "2px";
        li.style.cursor = "pointer";
        li.title = "click to remove";

        li.onclick = function () {
            editColorList = editColorList.filter(c => c !== color);
            li.remove();
        };

        document.getElementById("editColorList").appendChild(li);
    }
}





// save edits
function saveProductEdits(productId) {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || { products: [] };
    const productIndex = all_data.products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const product = all_data.products[productIndex];

        const name = document.getElementById("editName").value;
        const price = parseFloat(document.getElementById("editPrice").value);
        const description = document.getElementById("editDescription").value.trim();
        const category = document.getElementById("editCategory").value;
        const quantity = parseInt(document.getElementById("editQuantity").value);

        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.stock = quantity;
        product.colors = editColorList;


        all_data.products[productIndex] = product;
        localStorage.setItem("all_data", JSON.stringify(all_data));

        alert("product updated successfully!");
        window.location.reload();
    }
}

//close update
function closeUpdate() {
    document.getElementById("update").classList.add("d-none");
    document.getElementById("productsContainer").classList.remove("d-none");
}





//delete product
function deleteProduct(productId) {
    const confirmDelete = confirm("do you sure you want to delete this product?");

    if (confirmDelete) {
        const all_data = JSON.parse(localStorage.getItem("all_data")) || { products: [] };

        all_data.products = all_data.products.filter(p => p.id !== productId);

        localStorage.setItem("all_data", JSON.stringify(all_data));

        window.location.reload();
    }
}

// active navbar
const observer = new MutationObserver(() => {
    const overView = document.getElementById("products_page");
    if (overView) {
        overView.classList.add("nav-active");
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
