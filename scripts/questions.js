import * as trivia from "./trivia_api.js";

const quizState = {
  currentQuestionIndex: 0,
  score: 0,
  questions: [],
};

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
  document
    .getElementById("answers")
    .addEventListener("click", handleAnswerClick);

  startQuestion();
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
