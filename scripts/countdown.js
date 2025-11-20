const countdownElement = document.getElementById("countdown");

let counter = 50;
const interval = setInterval(() => {
  countdownElement.textContent = counter;
  counter--;
    if (counter < 0) {

    clearInterval(interval);
    window.location.href = "index.html";
    }
}, 1000);