


// تحميل الهيدر
fetch("header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        const user = JSON.parse(localStorage.getItem("loggedInUser")) || [];
        console.log(user);

        if (user.length > 0) {
            document.getElementById("name").innerText = user[0].firstName + " " + user[0].lastName;
            document.getElementById("email").innerText = user[0].email;
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



