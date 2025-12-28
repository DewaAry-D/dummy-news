// Search Bar Toggle Start
let navbar = document.querySelector(".navbar");
let searchBar = document.querySelector(".search-bar .fa-magnifying-glass");

if (searchBar) {
  searchBar.addEventListener("click", () => {
    navbar.classList.toggle("showInput");

    if (navbar.classList.contains("showInput")) {
      searchBar.classList.replace("fa-magnifying-glass", "fa-x");
    } else {
      searchBar.classList.replace("fa-x", "fa-magnifying-glass");
    }
  });
}
// Search Bar Toggle End

// Menu Toggle Start
let menuIcon = document.querySelector("#menu-icon");
let menu = document.querySelector(".menu");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    menu.classList.toggle("active");

    // Toggle icon between bars and x
    if (menu.classList.contains("active")) {
      menuIcon.classList.replace("fa-bars", "fa-x");
    } else {
      menuIcon.classList.replace("fa-x", "fa-bars");
    }
  });
}
// Menu Toggle End

// Dropdown Toggle Start
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.classList.remove("active");
            other.querySelector(".dropdown-menu")?.classList.remove("show");
          }
        });

        // Toggle current
        dropdown.classList.toggle("active");
        menu.classList.toggle("show");
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
        dropdown.querySelector(".dropdown-menu")?.classList.remove("show");
      }
    });
  });
});
// Dropdown Toggle End

// Authentication Check Start
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".btn-login");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (loginBtn && isLoggedIn === "true") {
    loginBtn.textContent = "Logout";
    loginBtn.href = "#"; // Prevent immediate redirect

    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      window.location.href = "./login.html";
    });
  }
});
// Authentication Check End
