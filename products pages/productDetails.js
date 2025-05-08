//counter
let incBtn = document.getElementById("inc")
let decBtn = document.getElementById("dec")
let counter = document.querySelector(".amount p")
incBtn.addEventListener('click', () => {
    counter.innerText = +counter.innerText + 1
})
decBtn.addEventListener('click', () => {
    if (+counter.innerText == 1) {

    } else {
        counter.innerText = +counter.innerText - 1
    }
})
let checkedColor = ""
let checkedSize = ""





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


//get user data
let loggedUser = JSON.parse(localStorage.getItem("loggedInUser"))





//render cards of others from json file's data
let otherPro = document.querySelector(".other-pro")
// fetch('../data/data.json')
//     .then(response => response.json())
//     .then(data => {
let data = JSON.parse(localStorage.getItem("all_data"))

let currentProductId = window.location.href.split("=")[1]
let productsToShow = data.products.filter(p => p.id != currentProductId).slice(0, 4); // limit to 4 others

productsToShow.forEach(product => {
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
                <p data-productid="${product.id}">${product.name}</p>
                <div class="rating">
                    ${starsHtml}
                    &nbsp;
                    <small>${avgRating.toPrecision(2)}</small>
                </div>
                <h2>$${product.price} <s>${product.old_price ? "$" + product.old_price : ""}</s> ${product.old_price ? "<span>-" + Math.floor(((product.old_price - product.price) / product.old_price * 100)) + "%</span>" : ""}</h2>
                <div class="review-header" >
                ${product.stock > 0 ? '<button class="add-to-cart" >Add To Cart</button>' : '<h3 id="product-stock"><span>Out of Stock</span></h3>'}
                ${loggedUser && loggedUser.fav.find(p => p.id == product.id) ?
            '<i class="fa-solid fa-heart" style="color:#d90b0b;"></i>'
            :
            '<i class="fa-regular fa-heart"></i>'
        }
                </div>
            </div>
            `
})





//add-to-cart & fav Btns in cards
let allCards = document.querySelectorAll(".pro-card")
allCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (loggedUser) {
            //add in cart
            if (e.target.classList.contains("add-to-cart")) {
                //get product obj
                let product = data.products.find(p => p.id == e.target.parentNode.parentNode.children[0].dataset.productid);

                let existingCartItem = loggedUser.cart.find(p => p.product.id == product.id);
                if (existingCartItem) {
                    existingCartItem.amount = Number(existingCartItem.amount) + 1;
                } else {
                    loggedUser.cart.push({
                        product: product,
                        amount: 1,
                        color: product.colors[0],
                        size: product.sizes[0]
                    })
                }
                localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));


                //add in fav
            } else if (e.target.classList.contains("fa-heart")) {
                //get product obj
                let product = data.products.find(p => p.id == e.target.parentNode.parentNode.children[0].dataset.productid);

                loggedUser = JSON.parse(localStorage.getItem("loggedInUser"))
                let existingFavItem = loggedUser.fav.find(p => p.id == product.id);
                if (existingFavItem) {
                    loggedUser.fav = loggedUser.fav.filter((element) => element.id != product.id);
                } else {
                    loggedUser.fav.push(product)
                }
                localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
                location.reload();/////////////
            }
        } else {
            window.location.href = `../login/login.html`
        }
    })
})



otherPro.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "P") {
        window.location.href = `productDetails.html?id=${e.target.dataset.productid}`;
    }
})

// })





//add review
let sendReview = document.getElementById("sendReview")
let usernameInput = document.querySelector(".your-review input")
let reviewTextarea = document.querySelector(".your-review textarea")
let selectedRating = 0;
let starEls = document.querySelectorAll(".your-rating i");

starEls.forEach((star, idx) => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.rating);
        starEls.forEach((s, i) => {
            if (i < selectedRating) {
                s.classList.remove("fa-regular");
                s.classList.add("fa-solid");
            } else {
                s.classList.remove("fa-solid");
                s.classList.add("fa-regular");
            }
        });
    });
});











//laod data from href's search productId
let imgsHolder = document.querySelector(".pro-imgs div")
let reviewsHolder = document.querySelector(".review-body")
let colorsHolder = document.querySelector(".product-details .color")
let sizesHolder = document.querySelector(".product-details .size")
let div = ""
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    // fetch('../data/data.json')
    //     .then(response => response.json())
    //     .then(data => {
    let data = JSON.parse(localStorage.getItem("all_data"))

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




        //heart
        let fav = document.querySelector(".add-to-wishlist")
        let existingFavItem = loggedUser?.fav.find(p => p.id == product.id);
        if (existingFavItem) {
            fav.innerHTML = `<i class="fa-solid fa-heart" style="color:#d90b0b;"></i>`
        } else {
            fav.innerHTML = `<i class="fa-regular fa-heart"></i>`
        }
        fav.addEventListener('click', () => {
            if (loggedUser) {
                loggedUser = JSON.parse(localStorage.getItem("loggedInUser"))
                let existingFavItem = loggedUser.fav.find(p => p.id == product.id);
                if (existingFavItem) {
                    loggedUser.fav = loggedUser.fav.filter((element) => element.id != product.id);
                    fav.innerHTML = `<i class="fa-regular fa-heart"></i>`
                } else {
                    loggedUser.fav.push(product)
                    fav.innerHTML = `<i class="fa-solid fa-heart" style="color:#d90b0b;"></i>`
                }
                localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
            } else {
                window.location.href = `../login/login.html`
            }
        })






        //----------name & desc & price & rate & stock-----------
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').innerHTML = `$${product.price} <s>${product.old_price ? "$" + product.old_price : ""}</s> ${product.old_price ? "<span>-" + Math.floor(((product.old_price - product.price) / product.old_price * 100)) + "%</span>" : ""}`;
        document.getElementById('product-desc').textContent = product.description;
        document.getElementById('product-rate').textContent = (product.ratings.reduce((acc, val) => acc + val, 0) / product.ratings.length).toPrecision(2)
        document.getElementById('product-stock').innerHTML = `${product.stock > 0 ? "Stock : Available" : "<span>Out of Stock</span>"}`



        //----------colors----------
        for (let i = 0; i < product.colors.length; i++) {
            let proColor = document.createElement("div")
            proColor.style.backgroundColor = product.colors[i]
            if (i == 0) {
                if (proColor.style.backgroundColor == "white" || proColor.style.backgroundColor == "beige") {
                    proColor.innerHTML = `<i class="fa-solid fa-check" style="color:black;"></i>`
                    checkedColor = proColor.style.backgroundColor
                } else {
                    proColor.innerHTML = `<i class="fa-solid fa-check"></i>`
                    checkedColor = proColor.style.backgroundColor
                }
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
        let viewMore = document.getElementById("showMoreReview")
        reviewsLenght.innerText = "(" + product.reviews.length + ")"


        const showInitialReviews = () => {
            if (product.reviews.length > 2) {
                reviewsHolder.innerHTML = "";
                product.reviews.slice(0, 2).forEach((review) => {
                    const reviewElement = createReviewCard(review);
                    reviewsHolder.appendChild(reviewElement);
                    viewMore.style.display = "block";
                });
            } else {
                reviewsHolder.innerHTML = "";
                product.reviews.slice(0, 2).forEach((review) => {
                    const reviewElement = createReviewCard(review);
                    reviewsHolder.appendChild(reviewElement);
                });
            }

        };

        const showAllReviews = () => {
            reviewsHolder.innerHTML = "";
            product.reviews.forEach((review) => {
                const reviewElement = createReviewCard(review);
                reviewsHolder.appendChild(reviewElement);
            });
            viewMore.innerText = "View Less"
        }
        viewMore.addEventListener("click", () => {
            if (viewMore.innerText == "View Less") {
                showInitialReviews()
                viewMore.innerText = "View More"
            } else {
                showAllReviews()
            }
        });
        showInitialReviews();

        function createReviewCard(review) {
            const reviewElement = document.createElement("div");

            // Generate stars based on rating
            let starsHTML = "";
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rate) {
                    starsHTML += `<i class="fa-solid fa-star"></i>`;
                } else {
                    starsHTML += `<i class="fa-regular fa-star"></i>`;
                }
            }
            reviewElement.innerHTML = `
                    <div class="review">
                    <div class="review-header">
                        <div class="rating">
                            ${starsHTML}
                        </div>
                    </div>
                        <h3>${review.username} <i class="fa-solid fa-circle-check" ${review.rate < 3 ? `style="color:#d90b0b;"` : ""} ></i></h3>
                        <p>${review.review}</p>
                        <br />
                        <small>Posted on ${review.date}</small>
                    </div>`
            return reviewElement;
        }






        //add to cart
        let addToCartBtn = document.getElementById("addToCart")
        // let addedToCart = document.getElementById("addedToCart")
        // let amountDiv = document.querySelector(".amount")
        addToCartBtn.addEventListener('click', () => {
            if (loggedUser) {
                let existingCartItem = loggedUser.cart.find(p => 
                    p.product.id == product.id &&
                        p.color == checkedColor &&
                        p.size == checkedSize
                );

                if (existingCartItem) {
                    existingCartItem.amount = Number(existingCartItem.amount) + Number(counter.innerText);
                } else {
                    loggedUser.cart.push({
                        product: product,
                        amount: counter.innerText,
                        color: checkedColor,
                        size: checkedSize
                    })
                }
                localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
                // addToCartBtn.style.display = "none"
                // addedToCart.style.display = "block"
                // amountDiv.style.display = "none"
            } else {
                window.location.href = `../login/login.html`
            }
        })




        if (product.stock == 0) {
            addToCartBtn.style.display = "none"
        }






        //add review
        sendReview.addEventListener("click", () => {
            const username = usernameInput.value.trim();
            const reviewText = reviewTextarea.value.trim();

            if (!username || !reviewText || selectedRating === 0) {
                alert("Please fill in all fields and select a rating.");
                return;
            }

            //create new review
            const newReview = {
                username: username,
                review: reviewText,
                rate: selectedRating,
                date: new Date().toLocaleDateString()
            }

            product.reviews.push(newReview)
            localStorage.setItem("all_data", JSON.stringify(data));

            //reset
            usernameInput.value = "";
            reviewTextarea.value = "";
            selectedRating = 0;
            starEls.forEach(s => {
                s.classList.remove("fa-solid");
                s.classList.add("fa-regular");
            })

            reviewTabs.forEach(tab => {
                tab.classList.remove("active")
                reviewTabs[1].classList.add("active")
            })
            reviewContents.forEach(content => {
                content.classList.remove("show")
                reviewContents[1].classList.add("show")
            })

            location.reload();/////////////
        })




    } else {
        // window.location.href = 'index.html';
    }
})
// })




























