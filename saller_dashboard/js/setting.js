// تغيير صورة البروفايل
//  document.getElementById("profileInput").addEventListener("change", function (e) {
//     const file = e.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function () {
//             document.getElementById("profileImage").src = reader.result;
//         };
//         reader.readAsDataURL(file);
//     }
// });


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

// تحميل صورة البروفايل من localStorage
window.addEventListener("DOMContentLoaded", () => {
    const storedImg = localStorage.getItem("sellerImage");
    if (storedImg) {
        document.getElementById("profileImage").src = storedImg;
    }
});




function logout() {
    localStorage.removeItem("loggedInUser");
    let confirmed = confirm("do you sure you want to logout?");
    if(confirmed){
        window.location.href = "../../login/login.html";
    }
}