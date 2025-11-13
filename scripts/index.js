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
    document.getElementById("category").replaceChildren(fragment);
  })
  .catch((error) => {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Failed to load categories";
    document.getElementById("category").replaceChildren(option);
  });
