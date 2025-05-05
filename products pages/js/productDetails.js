// imgs slider
let imgs = document.querySelectorAll(".pro-imgs div img")
let mainImg = document.getElementById("mainImg")
for (let i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener('click', () => {
        mainImg.src = imgs[i].src
        imgs.forEach(img => {
            img.classList.remove("active")
            imgs[i].classList.add("active")
        })
    })
}

//colors check
let colors = document.querySelectorAll(".color div")
for (let i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', () => {
        colors.forEach(color => {
            color.innerHTML = ""
            colors[i].innerHTML = `<i class="fa-solid fa-check"></i>`
        })
    })
}


//sizes selected
let sizes = document.querySelectorAll(".size button")
for (let i = 0; i < sizes.length; i++) {
    sizes[i].addEventListener('click', () => {
        sizes.forEach(size => {
            size.classList.remove("active")
            sizes[i].classList.add("active")
        })
    })
}


//counter
let incBtn = document.getElementById("inc")
let decBtn = document.getElementById("dec")
let counter = document.querySelector(".amount p")
inc.addEventListener('click', () => {
    counter.innerText = +counter.innerText + 1
})
dec.addEventListener('click', () => {
    if (+counter.innerText == 1) {

    } else {
        counter.innerText = +counter.innerText - 1
    }
})



//heart
let fav = document.querySelector(".add-to-wishlist")
let favClicked = false
fav.addEventListener('click', () => {
    if (!favClicked) {
        fav.innerHTML = `<i class="fa-solid fa-heart" style="color:#d90b0b;"></i>`
        favClicked = true
    } else {
        fav.innerHTML = `<i class="fa-regular fa-heart"></i>`
        favClicked = false
    }
})




//review tabs
let reviewTabs = document.querySelectorAll(".tabs button")
let reviewContents = document.querySelectorAll(".tab-content")
for (let i = 0; i < reviewTabs.length; i++) {
    reviewTabs[i].addEventListener('click', () => {
        reviewTabs.forEach(tab => {
            tab.classList.remove("active")
            reviewTabs[i].classList.add("active")
        })
        reviewContents.forEach(content => {
            content.classList.remove("show")
            reviewContents[i].classList.add("show")
        })
    })
}








//render cards of others from json file's data
let otherPro = document.querySelector(".other-pro")
fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        // data.products.forEach(product => {
        for (let i = 0; i < 4; i++) {
            const product = data.products[i]
            otherPro.innerHTML += `
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
            // });
        }
        otherPro.addEventListener("click", (e) => {
            console.log(e.target.dataset.productid)
            window.location.href = `productDetails.html?id=${e.target.dataset.productid}`;
        })

    });





//laod data from href's search productId
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id == id);
            if (product) {
                // const product = JSON.parse(productJSON);
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-price').textContent = `$${product.price}`;
                document.getElementById('product-desc').textContent = product.desc;
                document.getElementById('mainImg').src = product.images[0];
            } else {
                // window.location.href = 'index.html';
            }
        })
})