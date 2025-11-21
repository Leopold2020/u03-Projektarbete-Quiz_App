import { getCategories } from "./trivia_api.js";

getCategories()
  .then((categories) => {
    const fragment = document.createDocumentFragment();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      fragment.appendChild(option);
    });
    document.getElementById("category").appendChild(fragment);
  })
  .catch((error) => {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Failed to load other categories";
    document.getElementById("category").appendChild(option);
  });


    document.getElementById("allow-cookies").addEventListener("click", () => {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
      document.getElementById("consent-bar").style.display = "none";
    });

    document.getElementById("deny-cookies").addEventListener("click", () => {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
      document.getElementById("consent-bar").style.display = "none";
    });

