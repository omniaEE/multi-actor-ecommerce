const cartItems = [
    {
        id: 1,
        name: "Gradient Graphic T-shirt",
        size: "Large",
        color: "White",
        price: 145,
        quantity: 1,
        img: "Annotation 2025-04-29 002927.png"
    },
    {
        id: 2,
        name: "Checkered Shirt",
        size: "Medium",
        color: "Red",
        price: 180,
        quantity: 1,
        img: "Annotation 2025-04-29 002927.png"
    },
    {
        id: 3,
        name: "Skinny Fit Jeans",
        size: "Large",
        color: "Blue",
        price: 240,
        quantity: 1,
        img: "Annotation 2025-04-29 002927.png"
    }
];

// حفظ البيانات في localStorage لو فاضية
if (!localStorage.getItem("localcarts")) {
    localStorage.setItem("localcarts", JSON.stringify(cartItems));
}

// عناصر الصفحة
const itemsContainer = document.querySelector('.items_in_cart');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount');
const deliveryEl = document.getElementById('delivery');
const totalEl = document.getElementById('total_price');

// عرض العناصر
function show_cart_items() {
    let localcarts = JSON.parse(localStorage.getItem("localcarts")) || [];
    itemsContainer.innerHTML = "";

    if (localcarts.length === 0) {
        itemsContainer.innerHTML = `
          
             <div class="empty-cart text-center py-5"> <span class="icon-wrapper"> <i class="fas fa-shopping-cart cart-icon"></i> <i class="fas fa-xmark x-icon"></i> </span> <p class="empty-message mt-3">Your Cart is Empty </p><br/> <a href="products.html">Click Here to go to Products</a> </div>
        `;
        subtotalEl.style.display = 'none';
        discountEl.style.display = 'none';
        deliveryEl.style.display = 'none';
        totalEl.style.display = 'none';
        return;
    } else {
        subtotalEl.style.display = 'block';
        discountEl.style.display = 'block';
        deliveryEl.style.display = 'block';
        totalEl.style.display = 'block';
    }

    localcarts.forEach(item => {
        itemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.img}" alt="${item.name}">
                <div class="content w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5>${item.name}</h5>
                            <p>Size: ${item.size}<br>Color: ${item.color}</p>
                        </div>
                        <i class="fa fa-trash-can" onclick="removeItem(${item.id})"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="fw-bold">$${item.price}</span>
                        <div class="quantity_btn d-flex align-items-center">
                            <button onclick="decreaseQuantity(${item.id})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="increaseQuantity(${item.id})">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    updateSummary();
}

// حذف عنصر
function removeItem(id) {
    let localcarts = JSON.parse(localStorage.getItem("localcarts")) || [];
    localcarts = localcarts.filter(item => item.id !== id);
    localStorage.setItem("localcarts", JSON.stringify(localcarts));
    show_cart_items();
}

// زيادة الكمية
function increaseQuantity(id) {
    let localcarts = JSON.parse(localStorage.getItem("localcarts")) || [];
    let item = localcarts.find(item => item.id === id);
    if (item) {
        item.quantity++;
        localStorage.setItem("localcarts", JSON.stringify(localcarts));
        show_cart_items();
    }
}

// تقليل الكمية
function decreaseQuantity(id) {
    let localcarts = JSON.parse(localStorage.getItem("localcarts")) || [];
    let item = localcarts.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity--;
        localStorage.setItem("localcarts", JSON.stringify(localcarts));
        show_cart_items();
    }
}

// تحديث الفاتورة
function updateSummary() {
    let localcarts = JSON.parse(localStorage.getItem("localcarts")) || [];
    const subtotal = localcarts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal * 0.2;
    const delivery = 15;
    const total = subtotal - discount + delivery;

    subtotalEl.textContent = `$${subtotal}`;
    discountEl.textContent = `- $${discount.toFixed(0)}`;
    deliveryEl.textContent = `$${delivery}`;
    totalEl.textContent = `$${total.toFixed(0)}`;
}

// زر الذهاب للـ Checkout
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
        let localcarts = JSON.parse(localStorage.getItem("localcarts")) || [];
        localStorage.setItem('checkoutItems', JSON.stringify(localcarts));
        window.location.href = 'checkout.html';
    });
}




// تشغيل أول ما الصفحة تفتح
show_cart_items();
