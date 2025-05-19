document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("productsContainer");


    // // get categories from all-data
    const all_data = JSON.parse(localStorage.getItem("all_data")) || {};
    const categories = all_data.categories || [];
    const categorySelect = document.getElementById("categorySelect");
    const categoryDropdown = document.getElementById("categoryDropdown");

    categories.forEach(category => {
        const val = category.name.toLowerCase();
        const name = category.name;

        categorySelect.innerHTML += `<option value="${val}">${name}</option>`;
        //mobile display
        categoryDropdown.innerHTML += `<li><a class="dropdown-item" href="#" data-value="${val}">${name}</a></li>`;

    });


    // number of items
    // Get all products
    let allProducts = all_data.products;

    // Get the element to display the number of products
    let proLength = document.getElementById("proLength");

    // Update the text content with the number of items
    if (proLength) {
        proLength.innerText = `${allProducts.length} Items`;
    } else {
        console.warn("Element with ID 'proLength' not found.");
    }




    //---------mobile display- category-----------
    categoryDropdown.addEventListener("click", function (e) {
        if (e.target && e.target.matches("a.dropdown-item")) {
            e.preventDefault();
            const selected = e.target.getAttribute("data-value");
            categorySelect.value = selected;
            filterProducts();
        }
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



    function filterProducts() {
        const products = all_data.products || [];

        // get values from search-category-stock
        const searchBar = document.getElementById("userSearch").value.toLowerCase().trim();
        const categoryValue = document.getElementById("categorySelect").value.toLowerCase().trim();
        const stockValue = document.getElementById("stockSelect").value.toLowerCase().trim();


        // filter
        const filtered = products.filter(product =>
            (searchBar === "" || product.name.toLowerCase().includes(searchBar)) &&
            (categoryValue === "" || product.category.toLowerCase() === categoryValue) &&
            (stockValue === "" || (stockValue === "in" && product.stock > 0) || (stockValue === "out" && product.stock === 0))
        );


        container.innerHTML = "";
        filtered.forEach(product => {
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

    document.getElementById("userSearch").addEventListener("input", filterProducts);
    document.getElementById("categorySelect").addEventListener("change", filterProducts);
    document.getElementById("stockSelect").addEventListener("change", filterProducts);


    filterProducts();
});

//add product button
window.addProduct = function () {
    document.getElementById("addProduct").classList.remove("d-none");
    document.getElementById("productsContainer").classList.add("d-none");
    document.getElementById("update").classList.add("d-none");
    document.getElementById("proCount").classList.add("d-none");
    document.querySelectorAll(".disapper").forEach(el => {
        el.classList.add("hide_department");
    });
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
let selectedImages = [];

document.getElementById("imageUpload").addEventListener("change", function (e) {
    const files = Array.from(e.target.files);
    const previewContainer = document.getElementById("previewContainer");

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function () {
            const imageData = reader.result;
            selectedImages.push(imageData);

            const wrapper = document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.style.display = "inline-block";
            wrapper.style.marginRight = "5px";


            const img = document.createElement("img");
            img.src = imageData;
            img.classList.add("img-thumbnail");
            img.style.Width = "100px";
            img.style.height = "100px";


            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "x";
            deleteBtn.className = "btn btn-sm btn-danger position-absolute top-0 end-0";
            deleteBtn.style.transform = "translate(30%, -10%)";
            deleteBtn.style.borderRadius = "50%";
            deleteBtn.style.width = "25px";
            deleteBtn.style.height = "25px";
            deleteBtn.style.padding = "0";
            deleteBtn.title = "Remove Image";

            deleteBtn.onclick = function () {
                selectedImages = selectedImages.filter(img => img !== imageData);
                wrapper.remove();
            };

            wrapper.appendChild(img);
            wrapper.appendChild(deleteBtn);
            previewContainer.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
    });

    // Clear file input so re-adding same image works
    e.target.value = "";
});



//send form
document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name5")?.value?.trim() || "";
    const price = parseFloat(document.getElementById("price")?.value || 0);
    const description = document.getElementById("description")?.value?.trim() || "";
    const category = document.getElementById("category")?.value || "";
    const quantity = parseInt(document.getElementById("quantity")?.value || 0);


    const selectedSizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked')).map(checkbox => checkbox.value);

    if (selectedImages.length === 0) {
        alert("Please upload at least one image.");
        return;
    }

    let all_data = JSON.parse(localStorage.getItem("all_data")) || {};
    let loinUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    const sellerId = loinUser.id;
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
        sellerId: sellerId,
        reviews: [],
        ratings: [5],
        images: selectedImages
    };

    all_data.products.push(newProduct);
    localStorage.setItem("all_data", JSON.stringify(all_data));

    // alert("✅ Product added successfully!");
    Swal.fire({
        title: 'Done',
        text: 'product added successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'

    }).then((result) => {
        if (result.isConfirmed) {
            location.reload();
        }
    });

    // Reset form
    e.target.reset();
    document.getElementById("colorList").innerHTML = "";
    colorList.length = 0;
    selectedImages = [];
    document.getElementById("previewContainer").innerHTML = "";

});




// update product button
let editColorList = [];
function editProduct(productId) {
    document.getElementById("update").classList.remove("d-none");
    document.getElementById("productsContainer").classList.add("d-none");
    document.getElementById("addProduct").classList.add("d-none");
    document.getElementById("proCount").classList.add("d-none");

    document.querySelectorAll(".disapper").forEach(el => {
        el.classList.add("hide_department");
    });
    const all_data = JSON.parse(localStorage.getItem("all_data")) || { products: [] };
    const product = all_data.products.find(p => p.id === productId);



    // Set sizes
    const sizeCheckboxes = document.querySelectorAll('input[name="editSizes"]');
    sizeCheckboxes.forEach(cb => {
        cb.checked = product.sizes?.includes(cb.value);
    });


    if (product) {
        document.getElementById("editName").value = product.name;
        document.getElementById("editOldPrice").value = product.old_price;
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

        // show photo in update products
        const previewContainer = document.getElementById("previewContainerUpdate");
        previewContainer.innerHTML = "";

        if (Array.isArray(product.images)) {
            product.images.forEach((imgSrc, index) => {
                const wrapper = document.createElement("div");
                wrapper.style.position = "relative";
                wrapper.style.display = "inline-block";
                wrapper.style.marginRight = "5px";

                const img = document.createElement("img");
                img.src = imgSrc;
                img.classList.add("img-thumbnail");
                img.style.Width = "100px";
                img.style.height = "100px";
                img.style.objectFit = "cover";


                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "x";
                deleteBtn.className = "btn btn-sm btn-danger position-absolute top-0 end-0";
                deleteBtn.style.transform = "translate(30%, -10%)";
                deleteBtn.style.borderRadius = "50%";
                deleteBtn.style.width = "25px";
                deleteBtn.style.height = "25px";
                deleteBtn.style.padding = "0";
                deleteBtn.title = "Remove Image";

                deleteBtn.onclick = function () {
                    product.images.splice(index, 1);
                    wrapper.remove();
                };

                wrapper.appendChild(img);
                wrapper.appendChild(deleteBtn);
                previewContainer.appendChild(wrapper);
            });
        }
        // add new photo in update products
        document.getElementById("editImageUpload").addEventListener("change", function (e) {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function () {
                    const imgBase64 = reader.result;

                    product.images.push(imgBase64);

                    // view new photo which added in update products
                    const wrapper = document.createElement("div");
                    wrapper.style.position = "relative";
                    wrapper.style.display = "inline-block";
                    wrapper.style.marginRight = "5px";

                    const img = document.createElement("img");
                    img.src = imgBase64;
                    img.classList.add("img-thumbnail");
                    img.style.maxWidth = "100px";
                    img.style.height = "100px";

                    const deleteBtn = document.createElement("button");
                    deleteBtn.innerHTML = "×";
                    deleteBtn.style.position = "absolute";
                    deleteBtn.style.top = "0";
                    deleteBtn.style.right = "0";
                    deleteBtn.style.background = "red";
                    deleteBtn.style.color = "white";
                    deleteBtn.style.border = "none";
                    deleteBtn.style.borderRadius = "50%";
                    deleteBtn.style.width = "20px";
                    deleteBtn.style.height = "20px";
                    deleteBtn.style.cursor = "pointer";

                    deleteBtn.onclick = function () {
                        const index = product.images.indexOf(imgBase64);
                        if (index !== -1) {
                            product.images.splice(index, 1);
                            wrapper.remove();
                        }
                    };

                    wrapper.appendChild(img);
                    wrapper.appendChild(deleteBtn);
                    document.getElementById("previewContainerUpdate").appendChild(wrapper);
                };
                reader.readAsDataURL(file);
            });
        });




        // document.getElementById("saveButton").onclick = function () {
        //     saveProductEdits(productId);
        // };
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
        const oldPrice = parseFloat(document.getElementById("editOldPrice").value);
        const price = parseFloat(document.getElementById("editPrice").value);
        const description = document.getElementById("editDescription").value.trim();
        const category = document.getElementById("editCategory").value;
        const quantity = parseInt(document.getElementById("editQuantity").value);
        const images = Array.from(document.querySelectorAll('#previewContainerUpdate img')).map(img => img.src);

        product.name = name;
        product.price = price;
        product.old_price = oldPrice;
        product.description = description;
        product.category = category;
        product.stock = quantity;
        product.colors = editColorList;
        product.images = images;

        const selectedSizes = Array.from(document.querySelectorAll('input[name="editSizes"]:checked')).map(cb => cb.value);
        product.sizes = selectedSizes;




        all_data.products[productIndex] = product;
        localStorage.setItem("all_data", JSON.stringify(all_data));

        // alert("product updated successfully!");

        Swal.fire({
            title: 'Done',
            text: 'product updated successfully!',
            icon: 'success',
            confirmButtonText: 'Ok'

        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
    }
}

//close update
function closeUpdate() {
    document.getElementById("update").classList.add("d-none");
    document.getElementById("productsContainer").classList.remove("d-none");
    document.getElementById("proCount").classList.remove("d-none");
    document.getElementById("addProduct").classList.add("d-none");

    document.querySelectorAll(".disapper").forEach(el => {
        el.classList.remove("hide_department");
    });
}





//delete product
function deleteProduct(productId) {
    this.productId = productId;
    const logoutModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    logoutModal.show();
}
function deleteShore() {
    if (productId !== null) {
        let all_data = JSON.parse(localStorage.getItem("all_data")) || {};
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
