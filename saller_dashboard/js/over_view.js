(() => {

    const updateChangeBadge = (id, changeValue) => {
        const el = document.getElementById(id);
        const isPositive = changeValue >= 0;

        el.textContent = `${isPositive ? "↑" : "↓"} ${Math.abs(changeValue).toFixed(1)}%`;
        el.className = `badge ${isPositive ? "bg-success" : "bg-danger"}`;
    };





    let totalUsers = 0;
    let totalProducts = 0;
    let totalOrders = 0;

    const all_data = JSON.parse(localStorage.getItem("all_data")) || {};

    if (!all_data) {
        console.error("No data found in localStorage under 'all-data'");
        return;
    }

    try {
        totalUsers = all_data.users.length;
        totalProducts = all_data.products.length;
        totalOrders = all_data.orders.length;


        document.getElementById("totalUsers").textContent = totalUsers;
        document.getElementById("totalProducts").textContent = totalProducts;
        document.getElementById("totalOrders").textContent = totalOrders;


        if (all_data) {
            orders = all_data.orders;
            products = all_data.products;
            users = all_data.users;

            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(now.getDate() - 30);

            const newUsers = users.filter(users => {
                const createdAt = new Date(users.createdAt);
                return createdAt >= oneMonthAgo;
            });

            const newProducts = products.filter(products => {
                const createdAt = new Date(products.createdAt);
                return createdAt >= oneMonthAgo;
            });

            const newOrders = orders.filter(order => {
                const createdAt = new Date(order.orderDate);
                return createdAt >= oneMonthAgo;
            });




            totalUsers = users.length;
            const newUsersCount = newUsers.length;
            const changePercent = totalUsers === 0 ? 0 : (newUsersCount / totalUsers) * 100;


            totalProducts = products.length;
            const newProductsCount = newProducts.length;
            const productsChange = totalProducts === 0 ? 0 : (newProductsCount / totalProducts) * 100;

            totalOrders = orders.length;
            const newOrdersCount = newOrders.length;
            const ordersChange = totalOrders === 0 ? 0 : (newOrdersCount / totalOrders) * 100;

            // document.getElementById

            console.log(`إجمالي عدد المستخدمين: ${totalUsers}`);
            console.log(`عدد المستخدمين الجدد خلال آخر 30 يوم: ${newUsersCount}`);
            console.log(`النسبة: ${changePercent.toFixed(1)}%`);

            updateChangeBadge("totalUsersChange", changePercent);
            updateChangeBadge("productsChange", productsChange);
            updateChangeBadge("ordersChange", ordersChange);
            
        } else {
            console.warn("لا توجد بيانات مستخدمين في localStorage");
        }

    } catch (error) {
        console.error("Failed to parse data from localStorage:", error);
    }

})();
