import * as trivia from "./trivia_api.js";

const quizState = {
  currentQuestionIndex: 0,
  score: 0,
  questions: [],
  settings: {},
};

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
      return questions;
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

  // start timer
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

// Fisher-Yates shuffle algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
