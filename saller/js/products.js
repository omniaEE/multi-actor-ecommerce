

document.addEventListener("DOMContentLoaded", function () {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || {};
    const container = document.getElementById("productsContainer");

    //  productes
    if (all_data.products && Array.isArray(all_data.products)) {
        all_data.products.forEach(product => {
            const avgRating = product.ratings.length
                ? (product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length).toPrecision(2)
                : "5.0";

            container.innerHTML += `
                    <div class="col-2 col-md-3 mb-4">
                        <div class="card h-100 shadow product-card">
                            <div id="products-all">
                            <img id="image" src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h6 class="card-title" style="font-size: 12px;">${product.name}</h6>
                                <div class="star">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <small>(${avgRating})</small>
                                </div>
                                <p class="card-text" style="font-size: 15px;">$${product.price}</p>
                            </div>
                                <div class="action-buttons">
                                    <button class="btn btn-primary" onclick="editProduct(${product.id})">Update</button><br>
                                    <button class="btn btn-danger " onclick="deleteProduct(${product.id})">Delete </button>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
        });
    }

    window.addProduct = function () {
        document.getElementById("addProduct").classList.remove("d-none");
        document.getElementById("productsContainer").classList.add("d-none");
    }

    // add color 
    const colorList = [];
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
function editProduct(productId) {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || { products: [] };
    const product = all_data.products.find(p => p.id === productId);

    if (product) {
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("description").value = product.description;
        document.getElementById("category").value = product.category;
        document.getElementById("quantity").value = product.stock;

        

        document.getElementById("saveButton").onclick = function() {
            saveProductEdits(productId);
        };
    }
}






function saveProductEdits(productId) {
    const all_data = JSON.parse(localStorage.getItem("all_data")) || { products: [] };
    const productIndex = all_data.products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const product = all_data.products[productIndex];

        const name = document.getElementById("name").value;
        const price = parseFloat(document.getElementById("price").value);
        const description = document.getElementById("description").value.trim();
        const category = document.getElementById("category").value;
        const quantity = parseInt(document.getElementById("quantity").value);

        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.stock = quantity;

        all_data.products[productIndex] = product;
        localStorage.setItem("all_data", JSON.stringify(all_data));

        alert(" تم تعديل المنتج بنجاح!");
        window.location.reload();  
    }
}
