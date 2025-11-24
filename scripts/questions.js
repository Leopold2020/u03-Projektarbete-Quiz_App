import * as trivia from "./trivia_api.js";

const quizState = {
  currentQuestionIndex: 0,
  score: 0,
  questions: [],
  settings: {},
  questionTimer: {
    interval: null,
    timeout: null,
  },
};

// DOM-elements
const countdownElement = document.getElementById("countdown");
const countdownScreen = document.getElementById("countdown-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");

const questionElement = document.getElementById("question");
//const answersList = document.getElementById("answers");

const questionTimerElement = document.getElementById("question-timer");
const timerMeter = document.getElementById("timer-meter");

const resultMessage = document.getElementById("result-message");
const correctAnswerText = document.getElementById("correct-answer-text");
const nextQuestionBtn = document.getElementById("next-question-btn");

init();

async function init() {
  // this should show before first question is shown
  updateQuestionIndexDisplay();

  quizState.settings = await getQuizSettings();

  quizState.questions = await trivia
    .getQuestions(
      quizState.settings.amountOfQuestions,
      quizState.settings.category,
      quizState.settings.questionDifficulty,
      quizState.settings.answerType,
    )
    .then((questions) => {
      quizState.questions = questions;
      // start countdown before first question is shown
      setCountdown(
        updateCountdown,
        () => {
          showQuestionScreen();
          startQuestion();
        },
        0,
      );
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
    });

  // setup event listener for answer clicks
  document
    .getElementById("answers")
    .addEventListener("click", handleAnswerClick);

  startQuestion();
}

async function getQuizSettings() {
  // get selected category and difficulty from url bar
  const paramsString = window.location.search;
  const searchParams = new URLSearchParams(paramsString);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  // redirect to main page if they don't exist or are invalid
  if (!((await isValidCategory(category)) && isValidDifficulty(difficulty))) {
    window.location.replace("../index.html");
  }

  return {
    amountOfQuestions: 10,
    category: category,
    questionDifficulty: difficulty,
    answerType: "multiple",
  };
}

async function isValidCategory(category) {
  const allCategories = await trivia.getCategories();
  return (
    category === "" || // empty is any category
    allCategories.some((element) => element.id === Number(category))
  );
}

function isValidDifficulty(difficulty) {
  const validDifficulties = ["", "easy", "medium", "hard"]; // empty is any difficulty
  return validDifficulties.includes(difficulty);
}

function startQuestion() {
  // render next question
  renderCurrentQuestion();
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

  // start timer
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
  stopQuestionTimer();

  const question = quizState.questions[quizState.currentQuestionIndex];

  if (selectedAnswer.dataset.answer === question.correct_answer) {
    quizState.score++;
    showCorrectFeedback();
  } else {
    showIncorrectFeedback();
  }

  showQuestionFeedback();

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

function handleTimeUp() {
  console.log("Tiden är slut!");
  // Här kan du t.ex:
  // - disabla svarsknappar
  // - visa "Tiden är slut, klicka vidare"
  // Just nu: gå direkt till nästa fråga:
  nextQuestion();
}

// Fisher-Yates shuffle algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuestionTimer() {
  // stop previous timer if it exists
  if (quizState.questionTimer.interval !== null) {
    stopQuestionTimer();
  }
  const [interval, timeout] = setCountdown(
    (remaining, duration) => {
      const timeInSeconds = Math.floor(remaining / 1000);
      questionTimerElement.textContent = timeInSeconds;
      timerMeter.max = duration;
      timerMeter.value = remaining;
    },
    () => {
      // handleTimeUp();
    },
    QUESTION_DURATION * 1000,
    100, // 10 updates per second
  );

  quizState.questionTimer.interval = interval;
  quizState.questionTimer.timeout = timeout;
}

function stopQuestionTimer() {
  clearInterval(quizState.questionTimer.interval);
  clearTimeout(quizState.questionTimer.timeout);
  quizState.questionTimer.interval = null;
  quizState.questionTimer.timeout = null;
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

// set a countdown with a interval function and a timeout function
function setCountdown(
  updateCallback,
  doneCallback,
  durationMs = 1000,
  intervalMs = 1000,
) {
  const timerStart = Date.now();
  const timerDone = timerStart + durationMs;

  updateCallback(durationMs, durationMs, timerDone, timerStart);

  const interval = setInterval(() => {
    // keep the remaining time positive
    const remaining = Math.max(0, timerDone - Date.now());
    updateCallback(remaining, durationMs, timerDone, timerStart);
  }, intervalMs);

  const timeout = setTimeout(() => {
    clearInterval(interval);
    doneCallback(timerStart);
  }, durationMs);

  return [interval, timeout];
}

function updateCountdown(remaining) {
  countdownElement.textContent = Math.floor(remaining / 1000);
}
