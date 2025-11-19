// Function to load content dynamically
function loadContent(page) {
  const contentArea = document.getElementById("content-area");

  // Use fetch to get the content from other pages
  fetch(page)
    .then((response) => response.text())
    .then((html) => {
      // Create a temporary element to parse the HTML
      const temp = document.createElement("div");
      temp.innerHTML = html;

      // Extract just the main content from the fetched page
      const mainContent = temp.querySelector("main");

      if (mainContent) {
        // Update our content area with just the main content
        contentArea.innerHTML = mainContent.innerHTML;
      } else {
        // If main tag not found, try to find the content another way
        const section = temp.querySelector("section");
        if (section) {
          contentArea.innerHTML = section.outerHTML;
        } else {
          contentArea.innerHTML =
            "<p>Contenido no encontrado en la pagina.</p>";
        }
      }

      // Update URL without refreshing page
      history.pushState({ page: page }, "", page);

      // Run typing animation if needed
      setupTypingAnimation();
    })
    .catch((error) => {
      console.error("Error cargando pagina:", error);
      contentArea.innerHTML =
        "<p>Error cargando contenido. Por favor intentalo otra vez.</p>";
    });

  // Prevent the default link behavior
  return false;
}

// Handle browser back/forward buttons
window.addEventListener("popstate", function (event) {
  if (event.state && event.state.page) {
    loadContent(event.state.page);
  }
});

// Function to setup typing animation if needed
function setupTypingAnimation() {
  // This function can be expanded if you need to reinitialize any
  // JavaScript animations or interactions after loading new content
}

// Initialize the page when it loads
document.addEventListener("DOMContentLoaded", function () {
  // Intercept all navigation clicks
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      loadContent(this.getAttribute("href"));
    });
  });

  // Logo click should also use the dynamic content loading
  document.querySelector(".logo a").addEventListener("click", function (e) {
    e.preventDefault();
    loadContent("index.html");
  });

  // Store initial state
  history.replaceState(
    { page: window.location.pathname || "index.html" },
    "",
    window.location.href
  );

  // Setup initial animations
  setupTypingAnimation();
});
