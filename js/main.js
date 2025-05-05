//تحميل البيانات
let all_data = {};

fetch("../data/data.json")
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("all_data", JSON.stringify(data));
        all_data = data;

        all_data = JSON.parse(localStorage.getItem("all_data")) || [];
    })
    .catch(err => console.error("error in loading data", err));
    

    //-------------------------------------------------------------------
