// Function to handle active state for the sidebar links
function handleActiveLink(containerSelector) {
  const container = document.querySelector(containerSelector);
  const links = container.querySelectorAll(".list-group-item");

  links.forEach((link) => {
    link.addEventListener("click", function () {
      links.forEach((l) => l.classList.remove("active")); // remove from all
      this.classList.add("active"); // add to clicked one
    });
  });
}

// Apply to both large sidebar and offcanvas sidebar
handleActiveLink(".col-lg-3 .list-group");
handleActiveLink("#sidebar .list-group");

function loadPage(pageUrl) {
  const content = document.getElementById("content");

  fetch(pageUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Page not found");
      }
      return response.text();
    })
    .then((html) => {
      content.innerHTML = html;
    })
    .catch((error) => {
      content.innerHTML = "<h2>Error loading page.</h2>";
      console.error(error);
    });
}

loadPage("./dashboard.html"); // Load the default page on initial load
