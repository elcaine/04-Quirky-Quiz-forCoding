var wordBlank = document.querySelector(".question");
var win = document.querySelector(".win");
var lose = document.querySelector(".lose");
var startButton = document.querySelector(".start-button");
var secsLeft = document.getElementById("seconds-left");
var hideReset = document.getElementById("reset-button");
var answerButtons = document.getElementById("answer-buttons");

var chosenWord = "";
var numBlanks = 0;
var winCounter = 0;
var loseCounter = 0;
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
  getlosses();
}

// The startGame function is called when the start button is clicked
function startGame() {
  isWin = false;
  timerCount = 10;
  // Prevents start button from being clicked when round is in progress
  startButton.disabled = true;
  getNextQuestion()
  startTimer()
}

// The winGame function is called when the win condition is met
function endGame(win) {
  if(win){
    wordBlank.textContent = "YOU WON!!!🏆 ";
    winCounter++
    win.textContent = winCounter;
    localStorage.setItem("winCount", winCounter);
  }
  else{
    wordBlank.textContent = "GAME OVER";
    loseCounter++
    lose.textContent = loseCounter;
    localStorage.setItem("loseCount", loseCounter);
  }
  startButton.disabled = false;
  startButton.textContent = "Start";
  secsLeft.textContent = "";
  hideReset.style.display = "inline";
  // Clears interval and stops timer
  clearInterval(timer);
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
    if (timerCount === 0) { endGame(isWin);}
  }, 1000);
}

// Creates blanks on screen
function getNextQuestion() {
  // Get randomized JSON question object
  let currentQ = QandAs[Math.floor(Math.random() * QandAs.length)];
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
        //TODO:  if correct
        alert("YO didIot!")
      });
    } else {
      but.addEventListener("click", () =>{
        //TODO:  if wrong
        alert("nope rope!")
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
    winCounter = 0;
  } else {
    // If a value is retrieved from client storage set the winCounter to that value
    winCounter = storedWins;
  }
  //Render win count to page
  win.textContent = winCounter;
}

function getlosses() {
  var storedLosses = localStorage.getItem("loseCount");
  if (storedLosses === null) {
    loseCounter = 0;
  } else {
    loseCounter = storedLosses;
  }
  lose.textContent = loseCounter;
}

//TODO:  will need to code some scoring schtuph here
function checkWin() {
  // If the word equals the blankLetters array when converted to string, set isWin to true
  if (chosenWord === blanksLetters.join("")) {
    // This value is used in the timer function to test if win condition is met
    isWin = true;
  }
}

// Tests if guessed letter is in word and renders it to the screen.
function checkLetters(letter) {
  var letterInWord = false;
  for (var i = 0; i < numBlanks; i++) {
    if (chosenWord[i] === letter) {
      letterInWord = true;
    }
  }
  if (letterInWord) {
    for (var j = 0; j < numBlanks; j++) {
      if (chosenWord[j] === letter) {
        blanksLetters[j] = letter;
      }
    }
    wordBlank.textContent = blanksLetters.join(" ");
  }
}

// Attach event listener to document to listen for key event
document.addEventListener("keydown", function(event) {
  // If the count is zero, exit function
  if (timerCount === 0) {
    return;
  }
  // Convert all keys to lower case
  var key = event.key.toLowerCase();
  var alphabetNumericCharacters = "abcdefghijklmnopqrstuvwxyz0123456789 ".split("");
  // Test if key pushed is letter
  if (alphabetNumericCharacters.includes(key)) {
    var letterGuessed = event.key;
    checkLetters(letterGuessed)
    checkWin();
  }
});

// Attach event listener to start button to call startGame function on click
startButton.addEventListener("click", startGame);

// Calls init() so that it fires when page opened
init();

// Bonus: Add reset button
var resetButton = document.querySelector(".reset-button");

function resetGame() {
  // Resets win and loss counts
  winCounter = 0;
  loseCounter = 0;
  // Renders win and loss counts and sets them into client storage
  win.textContent = winCounter;
  lose.textContent = loseCounter;
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
  console.log("inside shuffles: ", rayOut);
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
