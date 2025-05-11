window.addEventListener('DOMContentLoaded', function () {
    fetch('../header and footer/main_header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            // Set user name from loggedInUser
            const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
            if (user) {
                document.getElementById("name").innerText = user.firstName + " " + user.lastName;
            }
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
