import * as trivia from "./trivia_api.js";

const QUESTION_DURATION = 20 * 1000;
const QUIZ_COUNTDOWN_DURATION = 5 * 1000;
const quizState = {
  currentQuestionIndex: 0,
  correctQuestions: [],
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

  trivia
    .getQuestions(
      quizState.settings.amountOfQuestions,
      quizState.settings.category,
      quizState.settings.questionDifficulty,
      quizState.settings.answerType
    )
    .then((questions) => {
      quizState.questions = questions;
      // start countdown before first question is shown
      setCountdown(
        updateCountdown,
        () => {
          showQuestionScreen();
          startQuiz();
        },
        QUIZ_COUNTDOWN_DURATION
      );
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
    });

  // setup event listener for answer clicks
  document
    .getElementById("answers")
    .addEventListener("click", handleAnswerClick);

  nextQuestionBtn.addEventListener("click", () => {
    nextQuestion();
  });
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

function startQuiz() {
  // first question
  startCurrentQuestion();
  
   gtag('event', 'quiz_started', {
    event_category: 'quiz',
    event_label: 'start_button',
    value: 1,
   });

  // maybe add a global timer
}

function startCurrentQuestion() {
  nextQuestionBtn.disabled = true;

  if (quizState.currentQuestionIndex >= quizState.questions.length - 1) {
    nextQuestionBtn.textContent = "Finish Quiz";
    nextQuestionBtn.addEventListener("click", showFinalScore);
  }
  updateQuestionIndexDisplay();
  renderCurrentQuestion();
  startQuestionTimer();
}

function renderCurrentQuestion() {
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
  stopQuestionTimer();

  const question = quizState.questions[quizState.currentQuestionIndex];

  if (selectedAnswer.dataset.answer === question.correct_answer) {
    quizState.correctQuestions.push(question);
    showCorrectFeedback(selectedAnswer);
  } else {
    showIncorrectFeedback(selectedAnswer, question);
  }

  showQuestionFeedback();
}

function handleTimerExpired() {
  showTimerExpiredFeedback();
  showQuestionFeedback();
}

function nextQuestion() {
  quizState.currentQuestionIndex++;
  if (quizState.currentQuestionIndex >= quizState.questions.length) {
    showFinalScore();
  } else {
    startCurrentQuestion();
  }
}

function showQuestionFeedback() {
  // disable answer buttons
  document.querySelectorAll(".answer").forEach((button) => {
    button.disabled = true;
  });
  // enable next question button
  nextQuestionBtn.disabled = false;
  // show correct answer
}

function showCorrectFeedback(selectedAnswer) {
  // Markera valt svar som rätt
  selectedAnswer.classList.add("answer-correct");
}

function showIncorrectFeedback(selectedAnswer, question) {
  // Markera valt svar som fel
  selectedAnswer.classList.add("answer-incorrect");

  // Markera också vilket svar som var rätt
  const correctButton = document.querySelector(
    `.answer[data-answer="${CSS.escape(question.correct_answer)}"]`
  );

  if (correctButton) {
    correctButton.classList.add("answer-correct");
  }
}

function showTimerExpiredFeedback() {
  //TODO: implement
  console.log("Time's up!");
}

function showFinalScore() {
  //TODO: implement
  const finalScore = calculateFinalScore();
  console.log("Final Score:", finalScore);
}

function calculateFinalScore() {
  const difficultyPoints = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  return quizState.correctQuestions.reduce(
    (acc, question) => acc + difficultyPoints[question.difficulty] ?? 1,
    0
  );
}

function updateQuestionIndexDisplay() {
  // document.getElementById("question-index").textContent =
  //   quizState.currentQuestionIndex + 1;
  console.log("Question Index:", quizState.currentQuestionIndex + 1);
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
    handleTimerExpired,
    QUESTION_DURATION,
    100 // 10 updates per second
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

function showQuestionScreen() {
  countdownScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");
}

// set a countdown with a interval function and a timeout function
function setCountdown(
  updateCallback,
  doneCallback,
  durationMs = 1000,
  intervalMs = 1000
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
    // final update
    updateCallback(0, durationMs, timerDone, timerStart);
    doneCallback(timerStart);
  }, durationMs);

  return [interval, timeout];
}

function updateCountdown(remaining) {
  countdownElement.textContent = Math.floor(remaining / 1000);
}
