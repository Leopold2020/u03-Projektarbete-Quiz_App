import * as trivia from "./trivia_api.js";

const quizState = {
  currentQuestionIndex: 0,
  score: 0,
  questions: [],
};

// DOM-elements
const countdownElement = document.getElementById("countdown");
const countdownScreen = document.getElementById("countdown-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");

const questionElement = document.getElementById("question");
//const answersList = document.getElementById("answers");
const questionTimerElement = document.getElementById("question-timer");
const progressBar = document.getElementById("progress-bar");

const resultMessage = document.getElementById("result-message");
const correctAnswerText = document.getElementById("correct-answer-text");
const nextQuestionBtn = document.getElementById("next-question-btn");

init();

async function init() {
  // this should show before first question is shown
  updateQuestionIndexDisplay();

  quizState.questions = await trivia
    .getQuestions()
    .then((questions) => {
      return questions;
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
    });

  // setup event listener for answer clicks
  const answersList = document
    .getElementById("answers")
    .addEventListener("click", handleAnswerClick);

  startQuestion();
}

function startQuestion() {
  // render next question
  renderCurrentQuestion();

  // start timer
    startQuestionTimer(); 

}

function renderCurrentQuestion() {
  updateQuestionIndexDisplay();

  const question = quizState.questions[quizState.currentQuestionIndex];
  document.getElementById("question").textContent = question.question;

  const fragment = document.createDocumentFragment();

  const answers = [question.correct_answer, ...question.incorrect_answers];
  shuffle(answers);

  answers.forEach((answer) => {
    const answerElement = createAnswerElement(answer);
    fragment.appendChild(answerElement);
  });

  document.getElementById("answers").replaceChildren(fragment);

      startQuestionTimer(); 

}

function createAnswerElement(answer) {
  const answerElement = document.createElement("li");
  const button = document.createElement("button");
  button.textContent = answer;
  answerElement.appendChild(button);
  button.classList.add("answer");
  // used for getting answer from element
  button.dataset.answer = answer;
  return answerElement;
}

function handleAnswerClick(event) {
  // TODO: don't do stuff during waiting period
  const selectedAnswer = event.target.closest(".answer");
  if (selectedAnswer != null) {
    handleAnswer(selectedAnswer);

  }
}

function handleAnswer(selectedAnswer) {
  // reset timer before doing anything else

  const question = quizState.questions[quizState.currentQuestionIndex];

  if (selectedAnswer.dataset.answer === question.correct_answer) {
    quizState.score++;
    showCorrectFeedback();
  } else {
    showIncorrectFeedback();
  }

  showQuestionFeedback();
  stopQuestionTimer();
  nextQuestion();
}

function nextQuestion() {
  quizState.currentQuestionIndex++;
  if (quizState.currentQuestionIndex >= quizState.questions.length) {
    showFinalScore();
  } else {
    renderCurrentQuestion();
  }
}

function showQuestionFeedback() {
  // show correct answer
}

function showCorrectFeedback() {
  //TODO: implement
  console.log("Correct!");
}

function showIncorrectFeedback() {
  //TODO: implement
  console.log("Incorrect!");
}

function showFinalScore() {
  //TODO: implement
  console.log("Final Score:", quizState.score);
}

function updateQuestionIndexDisplay() {
  // document.getElementById("question-index").textContent =
  //   quizState.currentQuestionIndex + 1;
  console.log("Question Index:", quizState.currentQuestionIndex + 1);
}

handleTimeUp(); // Vad ska hända när tiden tar slut. 

// Fisher-Yates shuffle algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}




function startQuestionTimer() {
  // reset
  questionTimeLeft = QUESTION_DURATION;
  questionTimerElement.textContent = questionTimeLeft;
  progressBar.style.width = "100%";

  // rensa gammal
  if (questionTimerId) {
    clearInterval(questionTimerId);
  }

  questionTimerId = setInterval(() => {
    questionTimeLeft--;

    if (questionTimeLeft < 0) {
      questionTimeLeft = 0;
    }

    questionTimerElement.textContent = questionTimeLeft;

    const progress = (questionTimeLeft / QUESTION_DURATION) * 100;
    progressBar.style.width = progress + "%"; 

    if (questionTimeLeft <= 0) {
      clearInterval(questionTimerId);
      questionTimerId = null;
      handleTimeUp(); 
    }
  }, 1000);
}

function stopQuestionTimer() {
  if (questionTimerId) {
    clearInterval(questionTimerId);
    questionTimerId = null;
  }
}

// Countdown

const QUESTION_DURATION = 20;
let questionTimeLeft = QUESTION_DURATION;
let questionTimerId = null;

function showCountdownScreen() {
  countdownScreen.classList.remove("hidden");
  questionScreen.classList.add("hidden");
}

function showQuestionScreen() {
  countdownScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");
}


function startCountdown(seconds, callback) {
  let counter = seconds;

  // visa första värdet direkt
  countdownElement.textContent = counter;

  const interval = setInterval(() => {
    counter--; // minska först

    countdownElement.textContent = counter;

    if (counter <= 0) {
      clearInterval(interval);

      if (typeof callback === "function") {
        callback(); 
      }
    }
  }, 1000);
}


startCountdown(5, showQuestionScreen);

