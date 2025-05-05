// load data
let all_data = {};

const existingData = localStorage.getItem("all_data");

if (existingData) {
    all_data = JSON.parse(existingData);
} else {
    fetch("../data/data.json")
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("all_data", JSON.stringify(data));
        
    })
    .catch(err => console.error("error in loading data", err));
    
}
//-------------------------------------------------------------------