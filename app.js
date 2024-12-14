// Variables
const quizTitle = document.getElementById("title")
const quizTT = document.getElementById("title-text")
const quoteElement = document.getElementById("quote")
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const scoreElement = document.getElementById("score");
const counterElement = document.getElementById("counter");
const nameContainer = document.getElementById("name-container");
const nameInput = document.getElementById("name");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const leaderboardElement = document.getElementById("leaderboard");


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
    console.log("Error fetching quiz data:", error);
    return [];
  }
}

// Manually decode HTML entities
function decodeHTMLEntities(text) {
    return he.decode(text);
  }
// Format quiz data
function formatQuizData(data) {
  const formattedData = data.map(function (question) {
    const choices = question.incorrect_answers.map(function (choice) {
      return decodeHTMLEntities(choice);
    });
    const correctAnswer = decodeHTMLEntities(question.correct_answer);
    const correctAnswerIndex = choices.length; // Index of the correct answer

    choices.push(correctAnswer); // Include the correct answer in the choices array

    const formattedQuestion = {
      question: decodeHTMLEntities(question.question),
      choices: choices,
      correctAnswer: correctAnswerIndex,
    };

    return formattedQuestion;
  });

  return formattedData;
}

  // Start quiz
startButton.addEventListener("click", async () => {
  playerName = nameInput.value.trim();
  if (playerName !== "") {
    nameContainer.style.display = "none";
    quizContainer.style.display = "flex";
    // Fetch quiz data
    const fetchedQuizData = await fetchQuizData();

    // Format quiz data
    quizData = formatQuizData(fetchedQuizData);

    // Start quiz
    currentQuestion = 0;
    score = 0;
    displayQuestion();
  }
});

  
// Display question
function displayQuestion() {
  const { question, choices } = quizData[currentQuestion];
  questionElement.style.display = 'block'
  questionElement.textContent = question;
  choicesElement.innerHTML = choices.map((choice, index) => `<li onclick="checkAnswer(${index})">${choice}</li>`).join("");
  scoreElement.style.display = 'block';
  scoreElement.textContent = `Score: ${score}/${quizData.length}`;
  counterElement.style.display = 'block'
  counterElement.textContent = `Question ${currentQuestion + 1}/${quizData.length}`;
  
}


// Check answer and proceed
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

// Display leaderboard and save data
function showLeaderboard() {
  quizContainer.style.display = "none";
  leaderboardElement.style.display = "block";
  document.getElementById("ld").style.display = "block";

  leaderboardData.push({ name: playerName, score: score });
  leaderboardData.sort((a, b) => b.score - a.score);

  leaderboardElement.innerHTML = leaderboardData
    .map((item) => `<li>${item.name}: ${item.score}/${quizData.length}</li>`)
    .join("");

  restartButton.style.display = "block";
  localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));


}


// Restart quiz
restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  leaderboardElement.innerHTML = "";
  restartButton.style.display = "none";
  nameContainer.style.display = "flex";
  nameInput.value = "";
  leaderboardElement.style.display = "none";
  document.getElementById("ld").style.display = "none";
  localStorage.removeItem("leaderboardData");
  quizTitle.style.justifyContent = "center";// make function
  quizTT.style.textAlign = "center"// make function
});