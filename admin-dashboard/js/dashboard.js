let totalUsers = 0;
let totalProducts = 0;
let totalOrders = 0;

fetch("./data/data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load dashboard data");
    return response.json();
  })
  .then((data) => {
    totalOrders = data.totalOrders;
    totalProducts = data.totalProducts;
    totalUsers = data.totalUsers;

    document.getElementById("totalUsers").textContent = totalUsers;
    document.getElementById("totalProducts").textContent = totalProducts;
    document.getElementById("totalOrders").textContent = totalOrders;

    updateChangeBadge("totalUsersChange", data.changes.users);
    updateChangeBadge("productsChange", data.changes.products);
    updateChangeBadge("ordersChange", data.changes.orders);
  })
  .catch((err) => {
    console.error("Error loading dashboard data:", err);
  });
// Fetch sales data from data.json
fetch("data/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Get sales data from the JSON
    const salesData = data.sales;

    const months = salesData.map((item) => item.month);
    const sales = salesData.map((item) => item.salesAmount);

    // Get the canvas element
    const ctx = document.getElementById("salesTrendChart").getContext("2d");

    // Create the chart
    new Chart(ctx, {
      type: "line", // Line chart for trends
      data: {
        labels: months, // Array of months
        datasets: [
          {
            label: "Sales Trend", // Label for the line
            data: sales, // Array of sales values
            borderColor: "rgba(75, 192, 192, 1)", // Line color
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Area under the line color
            fill: true, // Fill the area under the line
            tension: 0.4, // Smoothness of the line
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Month",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Sales Amount ($)",
            },
          },
        },
      },
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
// changing badges
const updateChangeBadge = (id, changeValue) => {
  const el = document.getElementById(id);
  const isPositive = changeValue >= 0;

  el.textContent = `${isPositive ? "↑" : "↓"} ${Math.abs(changeValue).toFixed(
    1
  )}%`;
  el.className = `badge ${isPositive ? "bg-success" : "bg-danger"}`;
};
