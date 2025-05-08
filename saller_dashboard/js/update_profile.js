const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
        let all_data = JSON.parse(localStorage.getItem("all_data")) || { users: [] };
    
        // Fill the form with current user data
        window.onload = () => {
            document.getElementById("firstName").value = user.firstName || "";
            document.getElementById("lastName").value = user.lastName || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("phone").value = user.phone || "";
            document.getElementById("address").value = user.address || "";
        };
    
        document.getElementById("profileForm").addEventListener("submit", function (e) {
            e.preventDefault();
    
            // Update loggedInUser object
            user.firstName = document.getElementById("firstName").value;
            user.lastName = document.getElementById("lastName").value;
            user.email = document.getElementById("email").value;
            user.phone = document.getElementById("phone").value;
            user.address = document.getElementById("address").value;
    
            // Save back to localStorage (loggedInUser)
            localStorage.setItem("loggedInUser", JSON.stringify(user));
    
            // Update all_data.users
            const userIndex = all_data.users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                all_data.users[userIndex] = { ...all_data.users[userIndex], ...user };
                localStorage.setItem("all_data", JSON.stringify(all_data));
            }
    
            // Show success message
            document.getElementById("successMessage").classList.remove("d-none");
        });