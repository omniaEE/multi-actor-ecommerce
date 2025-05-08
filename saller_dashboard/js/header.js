


// تحميل الهيدر
fetch("header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        const user = JSON.parse(localStorage.getItem("loggedInUser")) || [];
        

        if (user) {
            document.getElementById("name").innerText = user.firstName + " " + user.lastName;
            document.getElementById("email").innerText = user.email;
        }
    });

// تحميل السايدبار
fetch("nav bar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("sidebar").innerHTML = data;

        const toggleBtn = document.querySelector(".toggle-btn");
        const sidebar = document.getElementById("sidebar");
        const toggleIcon = document.getElementById("toggleIcon");

        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");

            if (sidebar.classList.contains("collapsed")) {
                toggleIcon.classList.remove("fa-angle-double-left");
                toggleIcon.classList.add("fa-angle-double-right");
            } else {
                toggleIcon.classList.remove("fa-angle-double-right");
                toggleIcon.classList.add("fa-angle-double-left");
            }
        });
    });



