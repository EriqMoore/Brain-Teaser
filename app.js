// Variables
const quizTitle = document.getElementById("quiz-title");
const quizTT = document.getElementById("title-text");
const quoteElement = document.getElementById("quote");
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const scoreElement = document.getElementById("score");
const counterElement = document.getElementById("counter");
const nameContainer = document.getElementById("name-container");
const nameInput = document.getElementById("name");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const leaderboardContainer = document.getElementById("leaderboard-section");
const leaderboardElement = document.getElementById("leaderboard");
const leaderboardDataText = document.getElementById("leaderboard-title");

let currentQuestion = 0;
let score = 0;
let playerName = "";
let leaderboardData = JSON.parse(localStorage.getItem("leaderboardData")) || [];
let quizData = [];

// Fetch quiz data from API
async function fetchQuizData() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return [];
  }
}

// Decode HTML entities
function decodeHTMLEntities(text) {
  return he.decode(text);
}

// Format quiz data
function formatQuizData(data) {
  return data.map((question) => {
    const choices = question.incorrect_answers.map(decodeHTMLEntities);
    const correctAnswer = decodeHTMLEntities(question.correct_answer);
    choices.push(correctAnswer); // Add correct answer to choices

    return {
      question: decodeHTMLEntities(question.question),
      choices,
      correctAnswer: choices.length - 1, // Index of correct answer
    };
  });
}

// Start quiz
startButton.addEventListener("click", async () => {
  playerName = nameInput.value.trim();

  if (!playerName) {
    alert("Enter your name");
    return;
  }

  nameContainer.style.display = "none";
  quizContainer.style.display = "flex";

  const fetchedQuizData = await fetchQuizData();
  quizData = formatQuizData(fetchedQuizData);

  currentQuestion = 0;
  score = 0;
  displayQuestion();
});

// Display question
function displayQuestion() {
  const { question, choices } = quizData[currentQuestion];

  questionElement.style.display = "block";
  questionElement.textContent = question;

  choicesElement.innerHTML = choices
    .map((choice, index) => `<li onclick="checkAnswer(${index})">${choice}</li>`)
    .join("");

  scoreElement.style.display = "block";
  scoreElement.textContent = `Score: ${score}/${quizData.length}`;

  counterElement.style.display = "block";
  counterElement.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
}

// Check answer
function checkAnswer(choice) {
  if (choice === quizData[currentQuestion].correctAnswer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    displayQuestion();
  } else {
    showLeaderboard();
  }
}

// Display leaderboard
function showLeaderboard() {
  quizContainer.style.display = "none";
  leaderboardContainer.style.display = "block";

  leaderboardData.push({ name: playerName, score });
  leaderboardData.sort((a, b) => b.score - a.score);

  leaderboardElement.innerHTML = leaderboardData
    .map((item) => `<li>${item.name}: ${item.score}/${quizData.length}</li>`)
    .join("");

  localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));

  restartButton.style.display = "block";
  leaderboardDataText.style.display = "block";
}

// Restart quiz
restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;

  // Hide leaderboard, reset score, and clear quiz display
  leaderboardElement.innerHTML = "";
  restartButton.style.display = "none";
  leaderboardContainer.style.display = "none";
  leaderboardDataText.style.display = "none";
  
  // Show the name input screen
  nameContainer.style.display = "flex";
  nameInput.value = "";

  // Reset display styles for title
  quizTitle.style.justifyContent = "center"; 
  quizTT.style.textAlign = "center";
});