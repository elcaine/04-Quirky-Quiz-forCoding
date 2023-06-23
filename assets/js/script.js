var theQuestion = document.querySelector(".question");
var win = document.querySelector(".win");
var startButton = document.querySelector(".start-button");
var secsLeft = document.getElementById("seconds-left");// This is the text: "seconds left"
var answerButtons = document.getElementById("answer-buttons");
var answerContainer = document.querySelector(".justify-center");
var theForm = document.getElementById("name-form");

var score;
var isWin = false;
var timer;
var timerCount;
var scoreBoard = [];
var scoreBoardstr;// = localStorage.getItem("scoreBoardstr");
const SET_TIME = 3;
// JSON object of questions
var QandAs;
const QUESTION_BANK = [
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

// The startGame function is called when the start button is clicked
function startGame() {
  score = 0;
  win.textContent = score;
  QandAs = JSON.parse(JSON.stringify(QUESTION_BANK));
  isWin = false;
  timerCount = SET_TIME;
  // Prevents start button from being clicked when round is in progress
  startButton.disabled = true;
  answerContainer.style.display = "";
  theForm.style.display = "none";
  getNextQuestion()
  startTimer()
}

// The winGame function is called when the win condition is met
function endGame() {
  answerButtons.replaceChildren();
  startButton.textContent = "Another game?"
  startButton.disabled = false;
  secsLeft.textContent = "";
  theForm.style.display = "";
  answerContainer.style.display = "none";
  // Clears interval and stops timer
  clearInterval(timer);
}

function endQuestion(isWin) {
  if(isWin){ score = score + 10;}
  else{ score = score - 2;}
  win.textContent = score;
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
    startButton.textContent = timerCount;
    secsLeft.textContent = "seconds remaining";
    //hideReset.style.display = "none";
    if (timerCount === 0) { endGame();}
  }, 1000);
}

// Creates blanks on screen
function getNextQuestion() {
  // Get randomized JSON question object
  if(QandAs.length == 0){
    endGame();
    return;
  }
  let index = Math.floor(Math.random() * QandAs.length);
  let currentQ = QandAs[index];
  QandAs.splice(index, 1);
  // Get the question, format it, set HTML element
  let str = JSON.stringify(currentQ.Q);
  theQuestion.textContent = str.substring(1, str.length-1);//Removes ""
  
  // Send answer options and correct answer.  Append correct answer and shuffle.
  let ansRay = shuffleAnswerArray(currentQ.A, currentQ.Y);

  //Clear previous answers children added to ul element
  answerButtons.replaceChildren();
  for(let i = 0; i < ansRay.length; i++){
    //Create elements structures for answers
    let li = document.createElement("li");
    let but = document.createElement("button");

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

function submitName() {
  let name = document.getElementById("hiName").value;
  scoreBoard.push({name, score});
  //scoreBoard.sort(compare???)
  localStorage.removeItem("scoreboardstr");
  localStorage.setItem("scoreBoardstr", JSON.stringify(scoreBoard));
  let ul = document.createElement("ul");
  let str = "";
  scoreBoard.forEach(function(e){
    let li = document.createElement("li");
    str = str + e.name + ": " + e.score;
    li.innerHTML = str;
    ul.appendChild(li);
    str = "";
  })
  theQuestion.textContent = "";
  theQuestion.appendChild(ul);
  alert(localStorage.getItem("scoreBoardstr"));
}

// The init function is called when the page loads 
function init() {
  answerContainer.style.display = "none";
  theForm.style.display = "none";
  scoreBoardstr = localStorage.getItem("scoreBoardstr");
}

// Attach event listener to start button to call startGame function on click
startButton.addEventListener("click", startGame);

// Calls init() so that it fires when page opened
init();

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
