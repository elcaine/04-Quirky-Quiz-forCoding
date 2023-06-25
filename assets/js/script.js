var theQuestion = document.querySelector(".question");
var win = document.querySelector(".win");
var startButton = document.querySelector(".start-button");
var secsLeft = document.getElementById("seconds-left");// This is the text: "seconds left"
var answerButtons = document.getElementById("answer-buttons");
var answerContainer = document.querySelector(".justify-center");
var theForm = document.getElementById("name-form");
//localStorage.clear(); // Uncomment this to refresh via code
var score;
var isWin = false;
var timer;
var timerCount;
var scoreBoard = [];
var scoreBoardstr;
const SET_TIME = 50;
// JSON object of questions
var QandAs;
const QUESTION_BANK = [
  { "Q": "Which of these is not a Javascript primitive ?",
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
  },
  { "Q": "What does JSON stand for?",
    "A": ["Junior Scripted Object Notes", "Javascript On Node", "Really wrong answer"],
    "Y": "Javascript Object Notation"
  },
  { "Q": "Simple difference between == and ===?",
    "A": ["== asigns, === interprets", "=== assigns, == interprets", "No difference"],
    "Y": "== values evaluated, === values AND type evaluated"
  },
  { "Q": "Which characters are used specifically to define a scope block?",
    "A": ["''", "[]", ";"],
    "Y": "{}"
  },
  { "Q": "What storage function have we learned about that persistently store a web session's data?",
    "A": ["save", "remember", "push"],
    "Y": "localStorage"
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
  // Resets (or sets initally) display properties
  answerContainer.style.display = "";
  theForm.style.display = "none";
  theQuestion.style.display = "";
  getNextQuestion()
  startTimer()
}

// The winGame function is called when the win condition is met
function endGame() {
  // Resets display properties
  theQuestion.style.display = "none";
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
  if(!isWin){ 
    score = score - 2;
    timerCount = timerCount - 10;
  } else{ score = score + 10;}
  win.textContent = score;
  if(QandAs.length > 0 && timerCount > 0){ getNextQuestion();}
  else{ endGame();}
}

// The setTimer function starts and stops the timer and triggers winGame() and loseGame()
function startTimer() {
  // Sets timer
  timer = setInterval(function() {
    timerCount--;
    startButton.textContent = timerCount;
    secsLeft.textContent = "seconds remaining";
    //hideReset.style.display = "none";
    if (timerCount < 1) { endGame();}
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
  // Resets display properties
  theQuestion.textContent = "";
  theForm.style.display = "none";
  // Capture name/score logic
  let name = document.getElementById("hiName").value;
  if(name === ""){ name = "[no entry]";}
  scoreBoard.push({name, score});
  // Sorts score board, then reverses for higher score on top
  scoreBoard.sort(function(a, b) {
    console.log("sort: ", a["score"], "  type: ", typeof(a["score"]));
    return a["score"] - b["score"];
  });
  scoreBoard.reverse();
  // Store persisted score board
  localStorage.setItem("scoreBoardstr", JSON.stringify(scoreBoard));
  // Create/append/display score board logic
  let ul = document.createElement("ul");
  let str = "";
  scoreBoard.forEach(function(e){
    let li = document.createElement("li");
    str = str + e.name + ": " + e.score;
    li.innerHTML = str;
    ul.appendChild(li);
    str = "";
  })
  theQuestion.appendChild(ul);
  theQuestion.style.display = "";
}

// The init function is called when the page loads 
function init() {
  answerContainer.style.display = "none";
  theForm.style.display = "none";
  scoreBoardstr = localStorage.getItem("scoreBoardstr");
  if(scoreBoardstr != null){ scoreBoard = JSON.parse(scoreBoardstr);}
  else { console.log("init: NULL");}
}

// Attach event listener to start button to call startGame function on click
startButton.addEventListener("click", startGame);

// Calls init() so that it fires when page opened
init();

/*
*
* Array shuffling algorithms taken from previous work done by the auther of this code.
* (includes 'randomat()' helper function further below).
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
