// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // hide start screen
  var startScreen = document.getElementById("start-screen");
  console.log(startScreen)
  startScreen.setAttribute("class", "hide");
  // un-hide questions section
  questionsEl.removeAttribute("class", "hide");
  // start timer
  function clockTick() {
    time--;
    timerEl.textContent = time;
    if(time <= 0) {
      quizEnd();
    }
  }
  
  // show starting time
  timerId = setInterval(clockTick, 1000);
  timerEl.textContent = time;
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];
  // update title with current question
  var questionTitle = document.getElementById("question-title");
  questionTitle.textContent = currentQuestion.title;
  // clear out any old question choices
  choicesEl.textContent = ""
  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    var newButton = document.createElement("button");
    newButton.value = choice
    newButton.textContent = i + 1 + ") " + choice
    // attach click event listener to each choice
    newButton.addEventListener("click", questionClick)
    // display on the page
    choicesEl.appendChild(newButton);
  });
}

function questionClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;
    if (time < 0) {
      time = 0;
    }
    
    // display new time on page
    // play "wrong" sound effect
    sfxWrong.play();
    feedbackEl.textContent = "Wrong!";
  } else {
    // play "right" sound effect
    sfxRight.play()
    feedbackEl.textContent = "Correct!";
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++
  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId)
  // show end screen
  var endScreen = document.getElementById("end-screen")
  endScreen.removeAttribute("class", "hide")
  // show final score
  var finalScore = document.getElementById("final-score")
  finalScore.textContent = time
  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value
  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || []
    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    // save to localstorage
    highscores.push(newScore)
    localStorage.setItem("highscores", JSON.stringify(highscores))
    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.addEventListener("click", saveHighscore);

// user clicks button to start quiz
startBtn.addEventListener("click", startQuiz);

initialsEl.addEventListener("onkeyup", checkForEnter);