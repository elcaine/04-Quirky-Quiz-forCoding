var wordBlank = document.querySelector(".question");
var win = document.querySelector(".win");
var startButton = document.querySelector(".start-button");
var secsLeft = document.getElementById("seconds-left");// This is the text: "seconds left"
var hideReset = document.getElementById("reset-button");
var answerButtons = document.getElementById("answer-buttons");

var chosenWord = "";
var numBlanks = 0;
var score = 0;
var isWin = false;
var timer;
var timerCount;

// Arrays used to create blanks and letters on screen
var lettersInChosenWord = [];
var blanksLetters = [];

// Array of words the user will guess
var words = ["variable","array", "modulus", "object", "function", "string", "boolean"];
var QandAs = [
  { "Q": "Which of these is not a Javascript primitive <and lots and lots and lots and lots and lots and lost of extra words>?",
    "A": ["String", "Undefined", "Boolean", "Null", "BigInt", "Symbol"],
    "Y": "Cow"
  },
  { "Q": "Which of these is considered the 'frame work' of website construction?",
    "A": ["CSS", "Javascript", "C++"],
    "Y": "HTML"
  },
  { "Q": "Which of these is considered the 'decoration' of website construction?",
    "A": ["HTML", "Javascript", "C++"],
    "Y": "CSS"
  },
  { "Q": "Which of these is considered the 'operations' of website construction?",
    "A": ["HTML", "CSS", "C++"],
    "Y": "Javascript"
  }
]

// The init function is called when the page loads 
function init() {
  //console.log(JSON.stringify(QandAs, null, 3));
  getWins();
}

// The startGame function is called when the start button is clicked
function startGame() {
  isWin = false;
  timerCount = 13;
  // Prevents start button from being clicked when round is in progress
  startButton.disabled = true;
  getNextQuestion()
  startTimer()
}

// The winGame function is called when the win condition is met
function endGame() {
  startButton.disabled = false;
  startButton.textContent = "Start";
  secsLeft.textContent = "";
  hideReset.style.display = "inline";
  // Clears interval and stops timer
  clearInterval(timer);
}

function endQuestion(isWin) {
  if(isWin){ score = score + 10;}
  else{ score = score - 2;}
  win.textContent = parseInt(score);
  localStorage.setItem("winCount", score);
  if(QandAs.length > 0){
    getNextQuestion();
  } else{
    endGame();
  }
}

// The setTimer function starts and stops the timer and triggers winGame() and loseGame()
function startTimer() {
  // Sets timer
  timer = setInterval(function() {
    timerCount--;
    //timerElement.textContent = timerCount;
    startButton.textContent = timerCount;
    secsLeft.textContent = "seconds remaining";
    hideReset.style.display = "none";
    if (timerCount === 0) { endGame();}
  }, 1000);
}

// Creates blanks on screen
function getNextQuestion() {
  // Get randomized JSON question object
  if(QandAs.length == 0){
    timerCount = 0;
    startButton.textContent = "Another game?"
    return;
  }
  let index = Math.floor(Math.random() * QandAs.length);
  let currentQ = QandAs[index];
  QandAs.splice(index, 1);
  // Get the question, format it, set HTML element
  let str = JSON.stringify(currentQ.Q);
  str = str.substring(1, str.length-1);//Removes ""
  wordBlank.textContent = str;

  // Send answer options and correct answer.  Append correct answer and shuffle.
  let ansRay = shuffleAnswerArray(currentQ.A, currentQ.Y);

  //Clear previous answers children added to ul element
  answerButtons.replaceChildren();
  for(let i = 0; i < ansRay.length; i++){
    //Create elements structures for answers
    let div = document.createElement("div");
    let fig = document.createElement("figure");
    let div2 = document.createElement("div");
    let li = document.createElement("li");
    let but = document.createElement("button");

    div.setAttribute("class", "card-column");
    fig.setAttribute("class", "card code-card");
    div2.setAttribute("class", "card-body");

    // Answer text set for button
    but.innerHTML = ansRay[i];

    li.appendChild(but);
    li.setAttribute("id", "question-" + i);
    if(ansRay[i] == currentQ.Y){
      but.addEventListener("click", () =>{
        endQuestion(true);
      });
    } else {
      but.addEventListener("click", () =>{
        endQuestion(false);
      });
    }
    answerButtons.appendChild(li);
  }
}

// These functions are used by init
function getWins() {
  // Get stored value from client storage, if it exists
  var storedWins = localStorage.getItem("winCount");
  // If stored value doesn't exist, set counter to 0
  if (storedWins === null) {
    score = 0;
  } else {
    // If a value is retrieved from client storage set the winCounter to that value
    score = storedWins;
  }
  //Render win count to page
  win.textContent = score;
}

// Attach event listener to start button to call startGame function on click
startButton.addEventListener("click", startGame);

// Calls init() so that it fires when page opened
init();

// Bonus: Add reset button
var resetButton = document.querySelector(".reset-button");

function resetGame() {
  // Resets win and loss counts
  score = 0;
  // Renders win and loss counts and sets them into client storage
  win.textContent = score;
}
// Attaches event listener to button
resetButton.addEventListener("click", resetGame);

/*
*
* Array shuffling algorithms taken from previous work done by the auther of this code.
* Repo link:  https://github.com/discodamone/Input_Golf
*
*/
// Shuffles the json question bank's answers and creates/assigns correct answer field
function shuffleAnswerArray(jsonQuestions, correctAnswer){
  let ray = new Array(jsonQuestions.length + 1);
  for(let i = 0; i < jsonQuestions.length; i++){
    ray[i] = jsonQuestions[i];
  }
  ray[jsonQuestions.length] = correctAnswer;
  let rayOut = randomate(ray);
  return rayOut;
}

function randomate(ray) {
  iC = ray.length
  iR = 0
  tmp = ''
      
  while (iC != 0) {
    mRando = Math.random()
    mRando = mRando * iC
    iR = Math.floor(mRando)
    iC--

    // Swap
    tmp = ray[iC]
    ray[iC] = ray[iR]
    ray[iR] = tmp
  }
  return ray;
}
