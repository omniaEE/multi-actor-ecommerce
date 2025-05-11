window.addEventListener('DOMContentLoaded', function () {
    fetch('../header and footer/main_header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').insertAdjacentHTML('beforeend', data);

            const user = JSON.parse(localStorage.getItem("loggedInUser"));
            const profileIcon = document.getElementById("profileIcon");
            const signUpSuggistion = document.getElementById("signUpSuggistion");

            if (user) {
                document.getElementById("name").innerText = user.firstName;
                profileIcon.setAttribute("data-bs-toggle", "dropdown");
                signUpSuggistion?.classList.add("d-none");
            } else {
                profileIcon?.addEventListener("click", function (e) {
                    e.preventDefault();
                    window.location.href = "../login/login.html";
                });
            }

            // -------------------- Search functionality --------------------
            const searchInput = document.getElementById("searchInput");
            const resultsContainer = document.getElementById("searchResults");

            function searchProducts(query) {
                if (!query || typeof query !== "string") return [];
                query = query.trim().toLowerCase();
                if (query.length === 0) return [];
                const data = JSON.parse(localStorage.getItem("all_data") || "{}");
                return data.products?.filter(product =>
                    product.name.toLowerCase().includes(query)
                ) || [];
            }

            function displayResults(results) {
                resultsContainer.innerHTML = "";
                if (results.length === 0) {
                    resultsContainer.classList.remove("show");
                    return;
                }

                results.forEach(product => {
                    const item = document.createElement("a");
                    item.className = "dropdown-item";
                    item.textContent = product.name;
                    item.addEventListener("click", () => {
                        window.location.href = `../products pages/productDetails.html?id=${product.id}`;
                    });
                    resultsContainer.appendChild(item);
                });

                resultsContainer.classList.add("show");
            }

            function debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func(...args), wait);
                };
            }

            const debouncedSearch = debounce((value) => {
                const results = searchProducts(value);
                displayResults(results);
            }, 300);

            if (searchInput) {
                searchInput.addEventListener("input", (e) => {
                    const value = e.target.value;
                    debouncedSearch(value);
                });
            }

            document.addEventListener("click", (e) => {
                if (
                    !searchInput.contains(e.target) &&
                    !resultsContainer.contains(e.target)
                ) {
                    resultsContainer.classList.remove("show");
                }
            });
        });

    fetch('../header and footer/main_footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
});



// <div id="header-container"></div>
//  <div id="footer-container"></div> 
// <script src="../header and footer/header_and_footer.js"></script>



//--------------------header----------------------
//-----------------logout----------------------------------

// Display the modal to confirm logout
function showLogoutModal() {
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
}

// Perform the logout action
function performLogout() {
            let userIndex = all_data.users.findIndex(u => u.id == user.id);    
    if (userIndex !== -1) {        
        all_data.users[userIndex] = user;
        localStorage.setItem("all_data", JSON.stringify(all_data));
    }
    // Remove the logged-in user from localStorage
    localStorage.removeItem("loggedInUser");
    // Redirect the user to the login page
    window.location.href = "../../login/login.html";
}






