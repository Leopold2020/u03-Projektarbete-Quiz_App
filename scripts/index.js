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

// add three floating circles at random positions
for (let i = 0; i < 3; i++) {
  const circle = generateCircle();
  const newCircle = document.createElement("div");
  newCircle.classList.add("floating-ball");
  newCircle.style.width = circle.diameter + "px";
  newCircle.style.top = `min(calc(${circle.top}% - ${circle.diameter / 2}px), calc(100% - ${circle.diameter / 2}px))`;
  newCircle.style.left = `${circle.left}%`;
  document.body.append(newCircle);
}

function generateCircle() {
  const diameter = getRandomNumber(100, 500);

  return {
    diameter: diameter,
    top: getRandomNumber(0, 100),
    left: getRandomNumber(0, 100),
  };
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
