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
let checkedColor = ""
let checkedSize = ""


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
        for (let i = 1; i < 5; i++) {
            const product = data.products[i]
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
            otherPro.innerHTML += `
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
        }
        otherPro.addEventListener("click", (e) => {
            if (e.target.tagName === "IMG") {
                window.location.href = `productDetails.html?id=${e.target.dataset.productid}`;
            }
        })

    })





//laod data from href's search productId
let imgsHolder = document.querySelector(".pro-imgs div")
let reviewsHolder = document.querySelector(".review-body")
let colorsHolder = document.querySelector(".product-details .color")
let sizesHolder = document.querySelector(".product-details .size")
let div = ""
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id == id);
            if (product) {


                //-------------rating------------
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
                document.getElementById('product-star').innerHTML = starsHtml;






                //----------images-----------
                document.getElementById('mainImg').src = product.images[0];
                for (let i = 0; i < product.images.length; i++) {
                    let proImg = document.createElement("img")
                    proImg.src = product.images[i]
                    if (i == 0) {
                        proImg.classList.add("active")
                    }
                    imgsHolder.appendChild(proImg)
                }
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





                //----------name & desc & price & rate-----------
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-price').innerHTML = `$${product.price} <s>${product.old_price ? "$" + product.old_price : ""}</s> ${product.old_price ? "<span>-" + Math.floor(((product.old_price - product.price) / product.old_price * 100)) + "%</span>" : ""}`;
                document.getElementById('product-desc').textContent = product.desc;
                document.getElementById('product-rate').textContent = (product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length).toPrecision(2)




                //----------colors----------
                for (let i = 0; i < product.colors.length; i++) {
                    let proColor = document.createElement("div")
                    proColor.style.backgroundColor = product.colors[i]
                    if (i == 0) {
                        proColor.innerHTML = `<i class="fa-solid fa-check"></i>`
                        checkedColor = proColor.style.backgroundColor
                    }
                    colorsHolder.appendChild(proColor)
                }
                //colors check
                let colors = document.querySelectorAll(".color div")
                for (let i = 0; i < colors.length; i++) {
                    colors[i].addEventListener('click', () => {
                        colors.forEach(color => {
                            if (colors[i].style.backgroundColor == "white" || colors[i].style.backgroundColor == "beige") {
                                color.innerHTML = ""
                                colors[i].innerHTML = `<i class="fa-solid fa-check" style="color:black;"></i>`
                                checkedColor = colors[i].style.backgroundColor
                            } else {
                                color.innerHTML = ""
                                colors[i].innerHTML = `<i class="fa-solid fa-check"></i>`
                                checkedColor = colors[i].style.backgroundColor
                            }
                        })
                    })
                }









                //----------sizes----------
                for (let i = 0; i < product.sizes.length; i++) {
                    let proSize = document.createElement("button")
                    proSize.innerText = product.sizes[i]
                    if (i == 0) {
                        proSize.classList.add("active")
                        checkedSize = proSize.innerText
                    }
                    sizesHolder.appendChild(proSize)
                }
                //sizes selected
                let sizes = document.querySelectorAll(".size button")
                for (let i = 0; i < sizes.length; i++) {
                    sizes[i].addEventListener('click', () => {
                        sizes.forEach(size => {
                            size.classList.remove("active")
                            sizes[i].classList.add("active")
                            checkedSize = sizes[i].innerText
                        })
                    })
                }





                // desc
                let extraDesc = document.getElementById("proDetails")
                extraDesc.innerHTML = `${product.details}<br/>`







                //---------------------reviews
                let reviewsLenght = document.getElementById("reviewsLength")
                reviewsLenght.innerText = "(" + product.reviews.length + ")"
                for (let i = 0; i < product.reviews.length; i++) {
                    div += `
                <div class="review">
                <div class="review-header">
                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        </div>
                    </div>
                    <h3>${product.reviews[i].username} <i class="fa-solid fa-circle-check"></i></h3>
                    <p>${product.reviews[i].review}</p>
                    <br />
                    <small>Posted on ${product.reviews[i].date}</small>
                </div>`
                }
                reviewsHolder.innerHTML = div





                //add to cart
                let addToCartBtn = document.getElementById("addToCart")
                loggedUser = localStorage.getItem("loggedInUser")
                addToCartBtn.addEventListener('click', () => {
                    // loggedUser.cart.push({
                    //     product: product,
                    //     amount: counter.innerText,
                    //     color: checkedColor,
                    //     size: checkedSize
                    // })
                })


            } else {
                // window.location.href = 'index.html';
            }
        })
})




























