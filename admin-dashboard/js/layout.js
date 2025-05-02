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
function loadPage(page) {
  fetch(page)
    .then((res) => res.text())
    .then((html) => {
      const content = document.getElementById("content");
      content.innerHTML = html;

      // Remove old dynamically loaded script if it exists
      const oldScript = document.getElementById("dynamic-page-script");
      if (oldScript) {
        oldScript.remove();
      }

      // Create new script tag with a unique query to bust cache
      const script = document.createElement("script");
      script.id = "dynamic-page-script";
      script.src =
        "./js/" +
        page.split("/").pop().replace(".html", ".js") +
        "?v=" +
        new Date().getTime();
      document.body.appendChild(script);
    });
}

loadPage("./dashboard.html");
